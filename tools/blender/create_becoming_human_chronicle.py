"""Build Loupe's original Becoming Human chronicle sculpture.

This asset is an abstract narrative device, not a fossil, archaeological scan,
or anatomical reconstruction. The script is intentionally deterministic so the
source .blend, runtime .glb, and review render can be regenerated.
"""

from __future__ import annotations

import math
import os
import random

import bpy
from mathutils import Vector


ROOT = r"C:\Users\Srijib\Downloads\projects\digital-museum-becoming-human"
COLLECTION_NAME = "BH_CHRONICLE"
SCENE_NAME = "BH_CHRONICLE_SOURCE"
EXPORT_PATH = os.path.join(ROOT, "public", "models", "becoming-human", "chronicle-core.glb")
BLEND_PATH = os.path.join(ROOT, "assets", "blender", "becoming-human-chronicle.blend")
PREVIEW_PATH = os.path.join(ROOT, "artifacts", "becoming-human-chronicle-preview.png")


def remove_previous_collection() -> None:
    collection = bpy.data.collections.get(COLLECTION_NAME)
    if not collection:
        return
    for obj in list(collection.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    bpy.data.collections.remove(collection)


def remove_previous_scene() -> None:
    scene = bpy.data.scenes.get(SCENE_NAME)
    if scene:
        bpy.data.scenes.remove(scene)


def material(name: str, color: tuple[float, float, float, float], *, metallic=0.0, roughness=0.6, emission=None):
    existing = bpy.data.materials.get(name)
    if existing:
        bpy.data.materials.remove(existing)
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = color
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = color
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if emission:
        bsdf.inputs["Emission Color"].default_value = emission[0]
        bsdf.inputs["Emission Strength"].default_value = emission[1]
    return mat


def move_to_collection(obj, collection):
    for owner in list(obj.users_collection):
        owner.objects.unlink(obj)
    collection.objects.link(obj)


def shade_smooth(obj):
    if obj.type == "MESH":
        for polygon in obj.data.polygons:
            polygon.use_smooth = True


def add_ico(name, location, scale, mat, subdivisions=2):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=subdivisions, radius=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(mat)
    return obj


def add_cylinder_between(name, start, end, radius, mat, vertices=16):
    start_v = Vector(start)
    end_v = Vector(end)
    delta = end_v - start_v
    midpoint = (start_v + end_v) * 0.5
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=delta.length, location=midpoint)
    obj = bpy.context.object
    obj.name = name
    obj.rotation_mode = "QUATERNION"
    obj.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(delta.normalized())
    obj.rotation_mode = "XYZ"
    obj.data.materials.append(mat)
    shade_smooth(obj)
    return obj


def build():
    random.seed(19082026)
    previous_scene = bpy.context.window.scene
    if previous_scene.name == SCENE_NAME:
        previous_scene = next((item for item in bpy.data.scenes if item.name != SCENE_NAME), previous_scene)
    remove_previous_scene()
    remove_previous_collection()
    source_scene = bpy.data.scenes.new(SCENE_NAME)
    bpy.context.window.scene = source_scene
    collection = bpy.data.collections.new(COLLECTION_NAME)
    source_scene.collection.children.link(collection)

    carbon = material("BH_Carbon", (0.018, 0.02, 0.022, 1), metallic=0.12, roughness=0.78)
    bone = material("BH_Bone", (0.71, 0.66, 0.56, 1), roughness=0.92)
    iron = material("BH_Iron", (0.11, 0.12, 0.13, 1), metallic=0.78, roughness=0.34)
    copper = material("BH_Copper", (0.42, 0.17, 0.075, 1), metallic=0.62, roughness=0.3)
    ember = material("BH_Ember", (0.62, 0.075, 0.018, 1), roughness=0.22, emission=((1.0, 0.055, 0.008, 1), 7.5))
    signal = material("BH_Signal", (0.12, 0.34, 0.42, 1), metallic=0.18, roughness=0.26, emission=((0.04, 0.42, 0.62, 1), 2.4))

    # Geological plinth: stacked, slightly irregular strata.
    for index in range(7):
        bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=2.2 - index * 0.08, depth=0.11, location=(0, 0, -1.72 + index * 0.13))
        layer = bpy.context.object
        layer.name = f"Stratum_{index:02d}"
        layer.scale.y = 0.72 + index * 0.015
        layer.rotation_euler.z = (index - 3) * 0.018
        layer.data.materials.append(bone if index == 3 else carbon)
        move_to_collection(layer, collection)

    # A deliberately non-fossil stone core with deterministic faceting.
    core = add_ico("Stone_Core", (0, 0, -0.48), (0.88, 0.72, 1.05), iron, subdivisions=3)
    for vertex in core.data.vertices:
        direction = vertex.co.normalized()
        jitter = 1 + 0.08 * math.sin(vertex.index * 2.173) + 0.045 * math.cos(vertex.index * 0.717)
        vertex.co = direction * jitter
    core.rotation_euler = (0.12, -0.26, 0.18)
    move_to_collection(core, collection)

    # Bone-like evidence fragments orbit the core without pretending to be anatomy.
    fragment_points = [
        ((-1.55, -0.2, -0.1), (-0.75, 0.05, 0.28)),
        ((1.36, 0.12, 0.02), (0.78, -0.06, 0.48)),
        ((-1.15, 0.24, 0.94), (-0.52, 0.08, 1.22)),
        ((1.2, -0.18, 1.28), (0.56, -0.03, 1.46)),
    ]
    for index, (start, end) in enumerate(fragment_points):
        obj = add_cylinder_between(f"Evidence_Fragment_{index:02d}", start, end, 0.065, bone, vertices=12)
        move_to_collection(obj, collection)

    # Ember: the physical/thermal motif that bridges several chapters.
    ember_obj = add_ico("Ember", (0.08, -0.68, 0.14), (0.18, 0.18, 0.18), ember, subdivisions=3)
    move_to_collection(ember_obj, collection)

    # External memory: three incised/cuneiform-like marks as copper strokes.
    glyph_strokes = [
        ((-0.7, 0.37, 1.9), (-0.13, 0.37, 2.34)),
        ((-0.05, 0.37, 1.88), (0.46, 0.37, 2.42)),
        ((0.55, 0.37, 1.96), (0.86, 0.37, 2.28)),
    ]
    for index, (start, end) in enumerate(glyph_strokes):
        stroke = add_cylinder_between(f"Memory_Mark_{index:02d}", start, end, 0.035, copper, vertices=12)
        move_to_collection(stroke, collection)

    # Nested rings mark different clocks rather than one progress ladder.
    for index, radius in enumerate((1.15, 1.52, 1.9)):
        bpy.ops.mesh.primitive_torus_add(major_radius=radius, minor_radius=0.018 if index < 2 else 0.025, major_segments=72, minor_segments=8, location=(0, 0, 0.55))
        ring = bpy.context.object
        ring.name = f"Time_Ring_{index:02d}"
        ring.rotation_euler = (math.radians(66 - index * 19), math.radians(index * 24 - 18), math.radians(index * 13))
        ring.data.materials.append(bone if index < 2 else copper)
        move_to_collection(ring, collection)

    # A small branching network at the top: asymmetric by design, never a ladder.
    nodes = [
        (0.0, 0.0, 2.72),
        (-0.72, 0.05, 3.18),
        (0.58, -0.08, 3.22),
        (-1.18, 0.1, 3.7),
        (-0.34, -0.02, 3.82),
        (0.34, 0.02, 3.78),
        (1.14, -0.1, 3.68),
    ]
    edges = [(0, 1), (0, 2), (1, 3), (1, 4), (2, 5), (2, 6), (4, 5)]
    for index, node in enumerate(nodes):
        sphere = add_ico(f"Network_Node_{index:02d}", node, (0.075, 0.075, 0.075), signal if index in (4, 5) else bone, subdivisions=2)
        move_to_collection(sphere, collection)
    for index, (a, b) in enumerate(edges):
        link = add_cylinder_between(f"Network_Link_{index:02d}", nodes[a], nodes[b], 0.018, signal if index == 6 else iron, vertices=10)
        move_to_collection(link, collection)

    # Selection/export is deliberately scoped to the authored collection.
    bpy.ops.object.select_all(action="DESELECT")
    for obj in collection.objects:
        obj.select_set(True)

    os.makedirs(os.path.dirname(EXPORT_PATH), exist_ok=True)
    os.makedirs(os.path.dirname(BLEND_PATH), exist_ok=True)
    os.makedirs(os.path.dirname(PREVIEW_PATH), exist_ok=True)

    bpy.ops.export_scene.gltf(
        filepath=EXPORT_PATH,
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_yup=True,
        export_materials="EXPORT",
    )

    # Create a review-only camera/light rig outside the exported collection.
    for name in ("BH_Preview_Camera", "BH_Preview_Key", "BH_Preview_Rim", "BH_Preview_Fill"):
        old = bpy.data.objects.get(name)
        if old:
            bpy.data.objects.remove(old, do_unlink=True)

    bpy.ops.object.camera_add(location=(6.7, -8.4, 4.8))
    camera = bpy.context.object
    camera.name = "BH_Preview_Camera"
    source_scene.camera = camera
    target = Vector((0, 0, 0.9))
    camera.rotation_euler = (target - camera.location).to_track_quat("-Z", "Y").to_euler()
    camera.data.lens = 58

    def light(name, light_type, location, energy, color, size=4.0):
        data = bpy.data.lights.new(name, light_type)
        data.energy = energy
        data.color = color
        if hasattr(data, "shape"):
            data.shape = "DISK"
        if hasattr(data, "size"):
            data.size = size
        obj = bpy.data.objects.new(name, data)
        source_scene.collection.objects.link(obj)
        obj.location = location
        obj.rotation_euler = (target - obj.location).to_track_quat("-Z", "Y").to_euler()
        return obj

    light("BH_Preview_Key", "AREA", (-4.5, -3.8, 6.8), 1100, (1.0, 0.61, 0.38), 5.0)
    light("BH_Preview_Rim", "AREA", (4.8, 1.6, 5.4), 1250, (0.16, 0.48, 0.8), 3.0)
    light("BH_Preview_Fill", "AREA", (0.5, -4.0, 0.5), 500, (0.72, 0.75, 0.78), 4.0)

    scene = source_scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 960
    scene.render.resolution_y = 1200
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = PREVIEW_PATH
    old_world = bpy.data.worlds.get("BH_Chronicle_World")
    if old_world:
        bpy.data.worlds.remove(old_world)
    scene.world = bpy.data.worlds.new("BH_Chronicle_World")
    scene.world.color = (0.002, 0.002, 0.003)
    scene.render.film_transparent = False
    bpy.data.libraries.write(BLEND_PATH, {source_scene}, path_remap="ABSOLUTE", fake_user=True, compress=True)
    bpy.ops.render.render(write_still=True)

    tris = 0
    for obj in collection.objects:
        if obj.type == "MESH":
            tris += sum(len(poly.vertices) - 2 for poly in obj.data.polygons)
    bpy.context.window.scene = previous_scene
    return {
        "collection": COLLECTION_NAME,
        "objects": len(collection.objects),
        "triangles": tris,
        "glb": EXPORT_PATH,
        "blend": BLEND_PATH,
        "preview": PREVIEW_PATH,
    }


result = build()
