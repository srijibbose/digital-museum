"""Inspect HuBMAP/HRA GLBs without modifying their source geometry."""

from __future__ import annotations

import json
import sys
from pathlib import Path

import bpy
from mathutils import Vector


def get_args() -> tuple[Path, Path, list[str]]:
    separator = sys.argv.index("--")
    source_dir = Path(sys.argv[separator + 1]).resolve()
    output_path = Path(sys.argv[separator + 2]).resolve()
    filenames = sys.argv[separator + 3 :]
    return source_dir, output_path, filenames


def reset_scene() -> None:
    bpy.ops.wm.read_factory_settings(use_empty=True)


def world_bounds(objects: list[bpy.types.Object]) -> dict[str, list[float]]:
    corners: list[Vector] = []
    for obj in objects:
        corners.extend(obj.matrix_world @ Vector(corner) for corner in obj.bound_box)

    minimum = Vector((min(point[index] for point in corners) for index in range(3)))
    maximum = Vector((max(point[index] for point in corners) for index in range(3)))
    size = maximum - minimum
    center = (maximum + minimum) / 2
    return {
        "min": [round(value, 5) for value in minimum],
        "max": [round(value, 5) for value in maximum],
        "size": [round(value, 5) for value in size],
        "center": [round(value, 5) for value in center],
    }


def inspect(path: Path) -> dict[str, object]:
    reset_scene()
    bpy.ops.import_scene.gltf(filepath=str(path))
    meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    return {
        "file": path.name,
        "meshCount": len(meshes),
        "vertexCount": sum(len(obj.data.vertices) for obj in meshes),
        "triangleCount": sum(len(obj.data.loop_triangles) for obj in meshes),
        "bounds": world_bounds(meshes),
        "meshes": [obj.name for obj in meshes],
        "materials": sorted(
            {
                material.name
                for obj in meshes
                for material in obj.data.materials
                if material is not None
            }
        ),
    }


def main() -> None:
    source_dir, output_path, filenames = get_args()
    paths = [source_dir / filename for filename in filenames] if filenames else sorted(source_dir.glob("*.glb"))
    report = [inspect(path) for path in paths]
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(f"Wrote {output_path} ({len(report)} models)")


if __name__ == "__main__":
    main()
