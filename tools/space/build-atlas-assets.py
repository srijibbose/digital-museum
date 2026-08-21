"""Build browser-ready Atlas of Worlds assets from authoritative source files.

The source directory is intentionally outside the repository because several NASA
masters are tens of megabytes. This script emits deterministic WebP derivatives
and copies the official NASA GLB models into public/ for the interactive renderer.
"""

from __future__ import annotations

import shutil
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps


Image.MAX_IMAGE_PIXELS = None

REPO_ROOT = Path(__file__).resolve().parents[2]
SOURCE_ROOT = Path.home() / "AppData/Local/Temp/atlas-world-sources"
DOWNLOAD_ROOT = SOURCE_ROOT / "downloads"
TEXTURE_ROOT = REPO_ROOT / "public/media/space/atlas"
MODEL_ROOT = REPO_ROOT / "public/models/space/atlas"

TEXTURE_SIZE = (4096, 2048)


def open_image(path: Path, mode: str = "RGB") -> Image.Image:
    with Image.open(path) as source:
        source.load()
        return source.convert(mode)


def fit_equirectangular(image: Image.Image) -> Image.Image:
    """Center-crop to 2:1 without stretching, then resize for browser delivery."""

    width, height = image.size
    target_ratio = 2.0
    ratio = width / height
    if ratio > target_ratio:
        crop_width = round(height * target_ratio)
        left = (width - crop_width) // 2
        image = image.crop((left, 0, left + crop_width, height))
    elif ratio < target_ratio:
        crop_height = round(width / target_ratio)
        top = (height - crop_height) // 2
        image = image.crop((0, top, width, top + crop_height))
    return image.resize(TEXTURE_SIZE, Image.Resampling.LANCZOS)


def save_webp(
    image: Image.Image,
    key: str,
    *,
    quality: int = 90,
    lossless: bool = False,
) -> None:
    TEXTURE_ROOT.mkdir(parents=True, exist_ok=True)
    image.save(
        TEXTURE_ROOT / f"{key}.webp",
        "WEBP",
        quality=quality,
        method=6,
        lossless=lossless,
        exact=True,
    )


def disk_to_equirectangular(image: Image.Image, *, colorize_hmi: bool = False) -> Image.Image:
    """Project one observed full disk over a sphere and mirror the unseen side.

    SDO provides a true orthographic full-disk observation rather than a surface
    map. Mirroring retains the observed morphology while producing a seamless
    browser texture; the provenance ledger explicitly records this transformation.
    """

    rgb = np.asarray(image.convert("RGB"), dtype=np.float32)
    luminance = rgb.max(axis=2)
    mask = luminance > max(8.0, float(np.percentile(luminance, 40)))
    rows, columns = np.where(mask)
    left, right = int(columns.min()), int(columns.max())
    top, bottom = int(rows.min()), int(rows.max())
    center_x = (left + right) / 2.0
    center_y = (top + bottom) / 2.0
    radius = min(right - left, bottom - top) / 2.0

    width, height = TEXTURE_SIZE
    longitude = np.linspace(-np.pi, np.pi, width, endpoint=False, dtype=np.float32)
    latitude = np.linspace(np.pi / 2, -np.pi / 2, height, dtype=np.float32)
    longitude_grid, latitude_grid = np.meshgrid(longitude, latitude)
    sample_x = np.sin(longitude_grid) * np.cos(latitude_grid)
    sample_y = np.sin(latitude_grid)
    source_x = np.clip(np.rint(center_x + sample_x * radius), 0, image.width - 1).astype(np.int32)
    source_y = np.clip(np.rint(center_y - sample_y * radius), 0, image.height - 1).astype(np.int32)
    output = rgb[source_y, source_x]

    if colorize_hmi:
        gray = output.mean(axis=2) / 255.0
        output = np.stack(
            (
                np.clip(gray * 1.35, 0, 1),
                np.clip(gray**1.15 * 0.72, 0, 1),
                np.clip(gray**1.35 * 0.28, 0, 1),
            ),
            axis=2,
        ) * 255.0

    return Image.fromarray(np.clip(output, 0, 255).astype(np.uint8), "RGB")


def cubemap_cross_to_equirectangular(image: Image.Image) -> Image.Image:
    """Convert the 4x3 cube-cross atlases embedded in NASA's public GLBs."""

    rgb = np.asarray(image.convert("RGB"))
    face = image.width // 4
    if image.height != face * 3:
        raise ValueError(f"Expected 4x3 cube cross, received {image.size}")

    output_width, output_height = TEXTURE_SIZE
    longitude = np.linspace(-np.pi, np.pi, output_width, endpoint=False, dtype=np.float32)
    latitude = np.linspace(np.pi / 2, -np.pi / 2, output_height, dtype=np.float32)
    longitude_grid, latitude_grid = np.meshgrid(longitude, latitude)
    x = np.cos(latitude_grid) * np.cos(longitude_grid)
    y = np.sin(latitude_grid)
    z = np.cos(latitude_grid) * np.sin(longitude_grid)
    absolute = np.stack((np.abs(x), np.abs(y), np.abs(z)), axis=2)
    dominant = np.argmax(absolute, axis=2)

    source_x = np.zeros((output_height, output_width), dtype=np.float32)
    source_y = np.zeros((output_height, output_width), dtype=np.float32)

    def place(mask: np.ndarray, column: int, row: int, u: np.ndarray, v: np.ndarray) -> None:
        source_x[mask] = (column + (u[mask] + 1.0) * 0.5) * face
        source_y[mask] = (row + (v[mask] + 1.0) * 0.5) * face

    axis = np.maximum(absolute.max(axis=2), 1e-6)
    place((dominant == 0) & (x > 0), 2, 1, -z / axis, -y / axis)
    place((dominant == 0) & (x <= 0), 0, 1, z / axis, -y / axis)
    place((dominant == 1) & (y > 0), 1, 0, x / axis, z / axis)
    place((dominant == 1) & (y <= 0), 1, 2, x / axis, -z / axis)
    place((dominant == 2) & (z > 0), 1, 1, x / axis, -y / axis)
    place((dominant == 2) & (z <= 0), 3, 1, -x / axis, -y / axis)

    source_x = np.clip(np.rint(source_x), 0, image.width - 1).astype(np.int32)
    source_y = np.clip(np.rint(source_y), 0, image.height - 1).astype(np.int32)
    return Image.fromarray(rgb[source_y, source_x], "RGB")


def normalize_height(path: Path) -> Image.Image:
    with Image.open(path) as source:
        source.load()
        values = np.asarray(source, dtype=np.float32)
    if values.ndim == 3:
        values = values[..., :3].mean(axis=2)
    low, high = np.percentile(values, (1.0, 99.0))
    normalized = np.clip((values - low) / max(high - low, 1e-6), 0, 1)
    image = Image.fromarray((normalized * 255).astype(np.uint8), "L")
    return fit_equirectangular(image)


def earth_cloud_layer() -> Image.Image:
    image = fit_equirectangular(open_image(DOWNLOAD_ROOT / "earth-clouds.tif"))
    rgb = np.asarray(image, dtype=np.float32) / 255.0
    maximum = rgb.max(axis=2)
    minimum = rgb.min(axis=2)
    saturation = (maximum - minimum) / np.maximum(maximum, 1e-6)
    brightness = rgb.mean(axis=2)
    whiteness = np.clip((0.58 - saturation) / 0.42, 0, 1)
    alpha = np.clip((brightness - 0.42) / 0.46, 0, 1) * whiteness
    alpha = np.asarray(
        Image.fromarray((alpha * 255).astype(np.uint8), "L").filter(
            ImageFilter.GaussianBlur(radius=0.8),
        ),
    )
    cloud_rgb = np.clip(rgb * 0.35 + 0.72, 0, 1) * 255
    rgba = np.dstack((cloud_rgb.astype(np.uint8), alpha.astype(np.uint8)))
    return Image.fromarray(rgba, "RGBA")


def earth_relief() -> Image.Image:
    """Create a material bump pass from NASA's topographically shaded mosaic."""

    image = fit_equirectangular(open_image(DOWNLOAD_ROOT / "earth-color.jpg"))
    gray = ImageOps.grayscale(image)
    broad = gray.filter(ImageFilter.GaussianBlur(radius=8))
    detail = Image.fromarray(
        np.clip(
            np.asarray(gray, dtype=np.int16) - np.asarray(broad, dtype=np.int16) + 128,
            0,
            255,
        ).astype(np.uint8),
        "L",
    )
    return ImageOps.autocontrast(detail, cutoff=1)


def venus_atmosphere() -> Image.Image:
    """Build a seamless material from Hubble's observed UV cloud morphology."""

    source = open_image(DOWNLOAD_ROOT / "venus-clouds.tif")
    # The Hubble frame is a partial phase view. This crop stays entirely inside
    # the illuminated disk, preserving measured cloud morphology without the
    # black limb or terminator, then mirrors it for a seamless display material.
    observed_crop = source.crop((650, 620, 1150, 2400))
    gray_tile = ImageOps.autocontrast(
        ImageOps.grayscale(observed_crop),
        cutoff=1,
    ).resize((2048, 2048), Image.Resampling.LANCZOS)
    gray = np.asarray(gray_tile, dtype=np.float32) / 255.0
    complete = np.concatenate((gray, np.fliplr(gray)), axis=1)
    complete = np.asarray(
        Image.fromarray((complete * 255).astype(np.uint8), "L").filter(
            ImageFilter.GaussianBlur(radius=1.0),
        ),
        dtype=np.float32,
    ) / 255.0
    gold = np.stack(
        (
            0.42 + complete * 0.53,
            0.23 + complete * 0.50,
            0.08 + complete * 0.26,
        ),
        axis=2,
    )
    return Image.fromarray(np.clip(gold * 255, 0, 255).astype(np.uint8), "RGB")


def repair_dark_dropouts(image: Image.Image) -> Image.Image:
    """Median-fill isolated no-data pixels without erasing real crater contrast."""

    rgb = np.asarray(image.convert("RGB"))
    dark = rgb.max(axis=2) < 9
    median = np.asarray(image.convert("RGB").filter(ImageFilter.MedianFilter(size=7)))
    repaired = rgb.copy()
    repaired[dark] = median[dark]
    return Image.fromarray(repaired, "RGB")


def uranus_ring_profile() -> Image.Image:
    """Turn Voyager's oblique ring observation into a radial material profile."""

    source = np.asarray(
        ImageOps.grayscale(open_image(DOWNLOAD_ROOT / "uranus-rings-valid.jpg")),
        dtype=np.float32,
    )
    # At the right edge, the ring arcs are close to horizontal. Averaging this
    # slice suppresses detector noise while retaining the observed ring peaks.
    profile = source[:, 610:735].mean(axis=1)
    baseline = np.asarray(
        Image.fromarray(profile.astype(np.uint8)[None, :], "L").filter(
            ImageFilter.GaussianBlur(radius=8),
        ),
        dtype=np.float32,
    )[0]
    signal = np.clip(profile - baseline, 0, None)
    signal /= max(float(np.percentile(signal, 99.4)), 1.0)
    signal = np.clip(signal, 0, 1)
    radial = Image.fromarray((signal[::-1] * 255).astype(np.uint8)[None, :], "L").resize(
        (4096, 64),
        Image.Resampling.BICUBIC,
    )
    alpha = np.asarray(radial, dtype=np.uint8)
    color = np.zeros((64, 4096, 4), dtype=np.uint8)
    color[..., 0] = 150
    color[..., 1] = 184
    color[..., 2] = 190
    color[..., 3] = alpha
    return Image.fromarray(color, "RGBA")


def build_textures() -> None:
    save_webp(disk_to_equirectangular(open_image(DOWNLOAD_ROOT / "sun-304.png"), colorize_hmi=True), "sun-color")
    save_webp(disk_to_equirectangular(open_image(DOWNLOAD_ROOT / "sun-171.jpg")), "sun-171")
    save_webp(disk_to_equirectangular(open_image(DOWNLOAD_ROOT / "sun-193.jpg")), "sun-193")
    save_webp(disk_to_equirectangular(open_image(DOWNLOAD_ROOT / "sun-304.png")), "sun-304")

    save_webp(
        fit_equirectangular(repair_dark_dropouts(open_image(DOWNLOAD_ROOT / "mercury-color.jpg"))),
        "mercury-color",
    )
    save_webp(normalize_height(DOWNLOAD_ROOT / "mercury-dem.jpg"), "mercury-bump", quality=95)

    venus_radar = fit_equirectangular(open_image(SOURCE_ROOT / "venus/surface_2016_04_09-jpg.png"))
    save_webp(venus_atmosphere(), "venus-atmosphere")
    save_webp(venus_radar, "venus-radar")
    save_webp(ImageOps.autocontrast(ImageOps.grayscale(venus_radar), cutoff=1), "venus-bump", quality=95)

    save_webp(fit_equirectangular(open_image(DOWNLOAD_ROOT / "earth-color.jpg")), "earth-color")
    save_webp(earth_relief(), "earth-bump", quality=95)
    save_webp(earth_cloud_layer(), "earth-clouds", quality=95)
    save_webp(fit_equirectangular(open_image(DOWNLOAD_ROOT / "earth-night.jpg")), "earth-night")

    save_webp(fit_equirectangular(open_image(DOWNLOAD_ROOT / "moon-color.tif")), "moon-color")
    save_webp(normalize_height(DOWNLOAD_ROOT / "moon-dem.tif"), "moon-bump", quality=95)

    save_webp(fit_equirectangular(open_image(DOWNLOAD_ROOT / "mars-color.jpg")), "mars-color")
    save_webp(normalize_height(DOWNLOAD_ROOT / "mars-dem.jpg"), "mars-bump", quality=95)

    save_webp(fit_equirectangular(open_image(DOWNLOAD_ROOT / "jupiter.jpg")), "jupiter-color")
    save_webp(fit_equirectangular(open_image(DOWNLOAD_ROOT / "saturn-portrait.jpg")), "saturn-color")
    saturn_rings = open_image(
        SOURCE_ROOT / "saturn/saturn_rings_25sat_outterrings-png.png",
        "RGBA",
    ).resize((4096, 64), Image.Resampling.LANCZOS)
    save_webp(saturn_rings, "saturn-rings", quality=100, lossless=True)

    uranus = fit_equirectangular(open_image(SOURCE_ROOT / "uranus/image_0.png"))
    save_webp(ImageEnhance.Contrast(uranus).enhance(1.08), "uranus-color")
    save_webp(uranus_ring_profile(), "uranus-rings", quality=100, lossless=True)
    neptune = fit_equirectangular(open_image(SOURCE_ROOT / "neptune/image_0.png"))
    save_webp(ImageEnhance.Contrast(neptune).enhance(1.08), "neptune-color")


def copy_models() -> None:
    MODEL_ROOT.mkdir(parents=True, exist_ok=True)
    for world in (
        "mercury",
        "venus",
        "earth",
        "mars",
        "jupiter",
        "saturn",
        "uranus",
        "neptune",
    ):
        shutil.copy2(SOURCE_ROOT / f"{world}.glb", MODEL_ROOT / f"{world}.glb")


def rebuild_inspection_fixes() -> None:
    save_webp(
        disk_to_equirectangular(open_image(DOWNLOAD_ROOT / "sun-304.png"), colorize_hmi=True),
        "sun-color",
    )
    save_webp(
        fit_equirectangular(repair_dark_dropouts(open_image(DOWNLOAD_ROOT / "mercury-color.jpg"))),
        "mercury-color",
    )
    save_webp(venus_atmosphere(), "venus-atmosphere")
    save_webp(fit_equirectangular(open_image(DOWNLOAD_ROOT / "saturn-portrait.jpg")), "saturn-color")


def main() -> None:
    if "--inspection-fixes" in sys.argv:
        rebuild_inspection_fixes()
        print("Rebuilt texture inspection fixes")
        return
    build_textures()
    copy_models()
    print(f"Built Atlas textures in {TEXTURE_ROOT}")
    print(f"Copied NASA models to {MODEL_ROOT}")


if __name__ == "__main__":
    main()
