"""Create deterministic fallback renders from unmodified HRA reference geometry."""

from __future__ import annotations

import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector


TERRITORIES = {
    "digestive": {
        "files": [
            "liver-male.glb",
            "pancreas-male.glb",
            "small-intestine-male.glb",
            "large-intestine-male.glb",
        ],
        "colors": {
            "liver": "#6f2b26",
            "pancreas": "#bd8068",
            "small-intestine": "#a96859",
            "large-intestine": "#805148",
        },
        "target": (0.0, 0.0, 0.27),
        "distance": 1.35,
    },
    "urinary": {
        "files": [
            "kidney-left-male.glb",
            "kidney-right-male.glb",
            "ureter-left-male.glb",
            "ureter-right-male.glb",
            "urinary-bladder-male.glb",
            "urethra-male.glb",
        ],
        "colors": {
            "kidney-left": "#7d342e",
            "kidney-right": "#7d342e",
            "ureter-left": "#b88b68",
            "ureter-right": "#b88b68",
            "urinary-bladder": "#a8795e",
            "urethra": "#b88b68",
        },
        "target": (0.0, 0.0, 0.17),
        "distance": 1.12,
    },
    "nervous": {
        "files": ["brain-male.glb", "spinal-cord-male.glb"],
        "colors": {
            "brain": "#9a6b5f",
            "spinal-cord": "#c0a68c",
        },
        "target": (0.0, 0.0, 0.61),
        "distance": 1.55,
    },
    "sensory": {
        "files": ["eye-left-male.glb", "eye-right-male.glb"],
        "colors": {
            "eye-left": "#d0c9bc",
            "eye-right": "#d0c9bc",
        },
        "target": (0.0, -0.083, 0.81),
        "distance": 0.38,
    },
    "immune": {
        "files": ["spleen-male.glb", "thymus-male.glb", "lymph-node-male.glb"],
        "colors": {
            "spleen": "#71302f",
            "thymus": "#a77268",
            "lymph-node": "#b99a6f",
        },
        "target": (0.02, 0.0, 0.42),
        "distance": 1.0,
    },
    "musculoskeletal": {
        "files": ["pelvis-male.glb", "knee-left-male.glb", "knee-right-male.glb"],
        "colors": {
            "pelvis": "#c9c0ad",
            "knee-left": "#c9c0ad",
            "knee-right": "#c9c0ad",
        },
        "target": (0.0, 0.0, -0.34),
        "distance": 2.75,
    },
    "integumentary": {
        "files": ["skin-male.glb"],
        "colors": {"skin": "#9b6953"},
        "target": (0.0, 0.0, 0.0),
        "distance": 4.4,
    },
}


def hex_color(value: str) -> tuple[float, float, float, float]:
    value = value.lstrip("#")
    srgb = [int(value[index : index + 2], 16) / 255 for index in (0, 2, 4)]
    linear = [component / 12.92 if component <= 0.04045 else ((component + 0.055) / 1.055) ** 2.4 for component in srgb]
    return (*linear, 1.0)


def material(name: str, color: str) -> bpy.types.Material:
    result = bpy.data.materials.new(name)
    result.diffuse_color = hex_color(color)
    result.use_nodes = True
    principled = result.node_tree.nodes.get("Principled BSDF")
    principled.inputs["Base Color"].default_value = hex_color(color)
    principled.inputs["Roughness"].default_value = 0.61
    principled.inputs["Metallic"].default_value = 0.0
    principled.inputs["Coat Weight"].default_value = 0.08
    principled.inputs["Coat Roughness"].default_value = 0.68
    return result


def point_at(obj: bpy.types.Object, target: Vector) -> None:
    obj.rotation_euler = (target - obj.location).to_track_quat("-Z", "Y").to_euler()


def add_area_light(name: str, location: tuple[float, float, float], energy: float, color: tuple[float, float, float]) -> None:
    data = bpy.data.lights.new(name, "AREA")
    data.energy = energy
    data.shape = "DISK"
    data.size = 2.2
    data.color = color
    light = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(light)
    light.location = location
    point_at(light, Vector((0.0, 0.0, 0.24)))


def main() -> None:
    separator = sys.argv.index("--")
    territory_name = sys.argv[separator + 1]
    model_dir = Path(sys.argv[separator + 2]).resolve()
    output_path = Path(sys.argv[separator + 3]).resolve()
    territory = TERRITORIES[territory_name]

    bpy.ops.wm.read_factory_settings(use_empty=True)
    materials = {
        key: material(f"Loupe {key}", color)
        for key, color in territory["colors"].items()
    }

    for filename in territory["files"]:
        before = set(bpy.context.scene.objects)
        bpy.ops.import_scene.gltf(filepath=str(model_dir / filename))
        added = set(bpy.context.scene.objects) - before
        key = filename.removesuffix("-male.glb")
        for obj in added:
            if obj.type != "MESH":
                continue
            obj.data.materials.clear()
            obj.data.materials.append(materials[key])

    world = bpy.data.worlds.new("Loupe anatomy world")
    bpy.context.scene.world = world
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.006, 0.009, 0.012, 1)
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.11

    add_area_light("Key", (-0.7, -0.8, 1.1), 92.0, (1.0, 0.79, 0.68))
    add_area_light("Fill", (0.9, -0.25, 0.72), 48.0, (0.65, 0.78, 1.0))
    add_area_light("Rim", (0.1, 0.65, 0.82), 68.0, (0.93, 0.46, 0.39))

    camera_data = bpy.data.cameras.new("Camera")
    camera = bpy.data.objects.new("Camera", camera_data)
    bpy.context.collection.objects.link(camera)
    target = Vector(territory["target"])
    camera.location = (0.0, -territory["distance"], target.z + 0.015)
    camera.data.lens = 72
    point_at(camera, target)
    bpy.context.scene.camera = camera

    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 1400
    scene.render.resolution_y = 1400
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.film_transparent = True
    scene.render.filepath = str(output_path)
    scene.render.image_settings.color_depth = "8"
    scene.view_settings.look = "AgX - Medium High Contrast"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.render.render(write_still=True)
    print(f"Rendered {territory_name}: {output_path}")


if __name__ == "__main__":
    main()
