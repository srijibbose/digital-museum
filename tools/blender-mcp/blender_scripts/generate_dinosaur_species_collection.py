"""Create a three-species, evidence-qualified Dinosaur collection for Loupe.

The resulting models are authored scientific illustrations, not scans or claims
about a complete specimen. Each GLB has the same four named evidence layers:
OBSERVED_BONE_RECORD, OBSERVED_TRACE_RECORD, INTERPRETIVE_RECONSTRUCTION,
and LIVING_LINEAGE_REFERENCE. Motion anchors are named MOTION_* for the web
renderer's deliberately-labelled continuous movement studies.
"""

from __future__ import annotations

import argparse
import math
import os
import sys

import bpy
from mathutils import Vector


def arguments():
    values = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True)
    parser.add_argument("--model-dir", required=True)
    parser.add_argument("--plate-dir", required=True)
    return parser.parse_args(values)


def color(value, alpha=1.0):
    value = value.lstrip("#")
    return tuple(int(value[index : index + 2], 16) / 255 for index in (0, 2, 4)) + (alpha,)


def make_material(name, hex_value, roughness=0.72, alpha=1.0, organic=False):
    material = bpy.data.materials.new(name)
    material.diffuse_color = color(hex_value, alpha)
    material.use_nodes = True
    bsdf = material.node_tree.nodes.get("Principled BSDF")
    base = color(hex_value, alpha)
    bsdf.inputs["Base Color"].default_value = base
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Alpha"].default_value = alpha
    if organic:
        # A restrained procedural mottling pass gives the rendered review plate
        # a skin-like material without baking a photographic texture or making
        # an unsupported claim about real colour patterns.
        nodes = material.node_tree.nodes
        links = material.node_tree.links
        noise = nodes.new("ShaderNodeTexNoise")
        noise.inputs["Scale"].default_value = 3.8
        noise.inputs["Detail"].default_value = 3.0
        noise.inputs["Roughness"].default_value = 0.68
        ramp = nodes.new("ShaderNodeValToRGB")
        ramp.color_ramp.elements[0].position = 0.28
        ramp.color_ramp.elements[0].color = tuple(channel * 0.52 for channel in base[:3]) + (alpha,)
        ramp.color_ramp.elements[1].position = 0.74
        ramp.color_ramp.elements[1].color = base
        links.new(noise.outputs["Fac"], ramp.inputs["Fac"])
        links.new(ramp.outputs["Color"], bsdf.inputs["Base Color"])
    if alpha < 1:
        try:
            material.surface_render_method = "DITHERED"
        except AttributeError:
            material.blend_method = "BLEND"
    return material


def empty(name, parent=None, location=(0, 0, 0), status=None, note=None):
    obj = bpy.data.objects.new(name, None)
    obj.empty_display_type = "SINGLE_ARROW"
    obj.location = location
    bpy.context.scene.collection.objects.link(obj)
    if parent:
        obj.parent = parent
        obj.matrix_parent_inverse = parent.matrix_world.inverted()
    if status:
        obj["evidence_status"] = status
    if note:
        obj["representation_note"] = note
    return obj


def parent(obj, group):
    obj.parent = group
    return obj


def smooth(obj):
    if obj.type == "MESH":
        for polygon in obj.data.polygons:
            polygon.use_smooth = True
    return obj


def uv(group, name, location, scale, material, segments=32, rings=20):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=rings, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(material)
    return parent(smooth(obj), group)


def loft(group, name, profiles, material, segments=24):
    """Create one continuous, tapered anatomical volume along the X axis.

    The earlier study used a string of separate primitives. A loft keeps the
    silhouette continuous while retaining intentionally modest geometry for a
    responsive browser GLB.
    """
    vertices = []
    faces = []
    for x, y, z, radius_y, radius_z in profiles:
        for index in range(segments):
            angle = math.tau * index / segments
            vertices.append((x, y + math.cos(angle) * radius_y, z + math.sin(angle) * radius_z))
    for ring in range(len(profiles) - 1):
        for index in range(segments):
            next_index = (index + 1) % segments
            a = ring * segments + index
            b = ring * segments + next_index
            c = (ring + 1) * segments + next_index
            d = (ring + 1) * segments + index
            faces.append((a, b, c, d))
    faces.append(tuple(range(segments - 1, -1, -1)))
    final = (len(profiles) - 1) * segments
    faces.append(tuple(final + index for index in range(segments)))
    mesh = bpy.data.meshes.new(f"{name}_mesh")
    mesh.from_pydata(vertices, [], faces)
    mesh.materials.append(material)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    return parent(smooth(obj), group)


def ico(group, name, location, scale, material, subdivisions=2):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=subdivisions, radius=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(material)
    return parent(smooth(obj), group)


def between(group, name, start, end, radius, material, vertices=12):
    start_v, end_v = Vector(start), Vector(end)
    delta = end_v - start_v
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices,
        radius=radius,
        depth=delta.length,
        location=(start_v + end_v) * 0.5,
    )
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(material)
    obj.rotation_mode = "QUATERNION"
    obj.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(delta.normalized())
    obj.rotation_mode = "XYZ"
    return parent(smooth(obj), group)


def cone_between(group, name, start, end, radius_start, radius_end, material, vertices=16):
    start_v, end_v = Vector(start), Vector(end)
    delta = end_v - start_v
    bpy.ops.mesh.primitive_cone_add(
        vertices=vertices,
        radius1=radius_start,
        radius2=radius_end,
        depth=delta.length,
        location=(start_v + end_v) * 0.5,
    )
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(material)
    obj.rotation_mode = "QUATERNION"
    obj.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(delta.normalized())
    obj.rotation_mode = "XYZ"
    return parent(smooth(obj), group)


def cone(group, name, location, r1, r2, depth, material, rotation=(0, 0, 0), vertices=12):
    bpy.ops.mesh.primitive_cone_add(
        vertices=vertices,
        radius1=r1,
        radius2=r2,
        depth=depth,
        location=location,
        rotation=rotation,
    )
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(material)
    return parent(smooth(obj), group)


def cube(group, name, location, scale, material, bevel=0.08):
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(material)
    if bevel:
        modifier = obj.modifiers.new("Soft anatomical edge", "BEVEL")
        modifier.width = bevel
        modifier.segments = 3
    return parent(smooth(obj), group)


def motion_group(layer, name, location):
    # Keep all geometry in one shared coordinate system. The named empty is a
    # semantic motion anchor for the web renderer; its authored rest anchor is
    # stored as metadata rather than as a parent transform that could pull a
    # hand-authored mesh apart during glTF export.
    anchor = empty(name, layer)
    anchor["motion_anchor"] = location
    return anchor


def leg(layer, name, hip, knee, ankle, foot, material, radius=0.17):
    pivot = motion_group(layer, f"MOTION_{name}", hip)
    between(pivot, f"{name}_upper", hip, knee, radius, material)
    between(pivot, f"{name}_lower", knee, ankle, radius * 0.77, material)
    between(pivot, f"{name}_foot", ankle, foot, radius * 0.43, material)
    return pivot


def eyes(layer, prefix, head_center, forward, material_eye, material_pupil, spacing=0.24, size=0.08):
    for side in (-1, 1):
        eye = uv(
            layer,
            f"{prefix}_eye_{side}",
            (head_center[0] + forward * 0.45, head_center[1] - 0.02, head_center[2] + side * spacing),
            (size, size, size),
            material_eye,
            20,
            12,
        )
        uv(
            layer,
            f"{prefix}_pupil_{side}",
            (head_center[0] + forward * 0.51, head_center[1] - 0.02, head_center[2] + side * spacing),
            (size * 0.43, size * 0.43, size * 0.43),
            material_pupil,
            16,
            10,
        )
        eye["representation_note"] = "Eye colour is illustrative."


def dorsal_scales(layer, prefix, points, material, size=0.1):
    for index, point in enumerate(points):
        ico(layer, f"{prefix}_dorsal_scale_{index:02d}", point, (size * 1.25, size * 0.6, size), material, 1)


def simple_fossil(layer, prefix, points, bone):
    for index, point in enumerate(points):
        ico(layer, f"{prefix}_vertebra_{index:02d}", point, (0.11, 0.085, 0.1), bone, 1)
        if index:
            between(layer, f"{prefix}_spine_{index:02d}", points[index - 1], point, 0.044, bone, 8)
    # Enough articulated limb material to read as a fossil record without pretending completeness.
    between(layer, f"{prefix}_fossil_femur", (-0.1, 0.35, -0.12), (0.38, -0.45, -0.12), 0.075, bone, 8)
    between(layer, f"{prefix}_fossil_tibia", (0.38, -0.45, -0.12), (0.7, -1.02, -0.12), 0.06, bone, 8)


def trackway(layer, prefix, origin, trace):
    for step in range(4):
        x = origin[0] + step * 0.76
        z = origin[2] + (0.16 if step % 2 else -0.14)
        for toe, offset in enumerate((-0.16, 0, 0.16), start=1):
            toe_obj = cone(layer, f"{prefix}_track_{step}_{toe}", (x + 0.11, -1.42, z + offset), 0.13, 0.025, 0.042, trace, rotation=(0, 0, math.radians(-10 + offset * 85)), vertices=3)
            toe_obj.scale = (0.55, 1.32, 1)
        ico(layer, f"{prefix}_track_pad_{step}", (x - 0.05, -1.42, z), (0.14, 0.018, 0.13), trace, 1)


def bird(layer, prefix, location, body, beak):
    uv(layer, f"{prefix}_bird_body", location, (0.18, 0.13, 0.12), body, 20, 12)
    uv(layer, f"{prefix}_bird_head", (location[0] + 0.15, location[1] + 0.04, location[2]), (0.08, 0.075, 0.07), body, 18, 10)
    cone_between(layer, f"{prefix}_bird_beak", (location[0] + 0.2, location[1] + 0.04, location[2]), (location[0] + 0.34, location[1] + 0.03, location[2]), 0.06, 0.01, beak, 4)
    cone_between(layer, f"{prefix}_bird_wing_left", (location[0] - 0.02, location[1], location[2] + 0.08), (location[0] - 0.34, location[1] + 0.13, location[2] + 0.38), 0.1, 0.02, body, 5)
    cone_between(layer, f"{prefix}_bird_wing_right", (location[0] - 0.02, location[1], location[2] - 0.08), (location[0] - 0.34, location[1] + 0.13, location[2] - 0.38), 0.1, 0.02, body, 5)


def evidence_layers(root, prefix, bone, trace, bird_body, bird_beak):
    suffix = prefix.upper()
    bone_layer = empty(f"OBSERVED_BONE_RECORD_{suffix}", root, status="observed fossil material", note="Simplified fossil layer; gaps remain visible.")
    trace_layer = empty(f"OBSERVED_TRACE_RECORD_{suffix}", root, status="observed trace evidence", note="Stylised tracks show contact, not a measured speed or behaviour.")
    reconstruction = empty(f"INTERPRETIVE_RECONSTRUCTION_{suffix}", root, status="interpretive reconstruction", note="Skin, colour, and movement are explanatory illustrations.")
    lineage = empty(f"LIVING_LINEAGE_REFERENCE_{suffix}", root, status="living comparative reference", note="A simple bird reference makes the continuing dinosaur lineage visible.")
    bird(lineage, prefix, (2.5, 1.55, -0.85), bird_body, bird_beak)
    return bone_layer, trace_layer, reconstruction, lineage


def build_tyrannosaurus(materials):
    root = empty("DINOSAUR_TYRANNOSAURUS", status="scientific illustration", note="Anatomical silhouette is an original Loupe reconstruction, not a scan.")
    bone_layer, trace_layer, layer, _ = evidence_layers(root, "tyrannosaurus", materials["bone"], materials["trace"], materials["bird"], materials["beak"])
    skin, belly, dark, eye, pupil = (materials[key] for key in ("trex", "trex_belly", "trex_dark", "eye", "pupil"))
    body = motion_group(layer, "MOTION_TORSO", (0, 0, 0))
    loft(body, "Tyrannosaurus_torso", [
        (-1.88, 0.62, 0, 0.36, 0.34), (-1.25, 0.67, 0, 0.59, 0.53),
        (-0.35, 0.57, 0, 0.76, 0.61), (0.52, 0.68, 0, 0.66, 0.55),
        (1.10, 0.86, 0, 0.44, 0.42),
    ], skin)
    loft(body, "Tyrannosaurus_belly", [
        (-1.22, 0.23, -0.03, 0.16, 0.42), (-0.35, 0.10, -0.03, 0.24, 0.52),
        (0.48, 0.22, -0.03, 0.18, 0.43),
    ], belly, 20)
    neck = motion_group(layer, "MOTION_NECK", (0.88, 0.74, 0))
    loft(neck, "Tyrannosaurus_neck_and_head", [
        (0.88, 0.86, 0, 0.38, 0.38), (1.30, 1.10, 0, 0.48, 0.42),
        (1.78, 1.12, 0, 0.44, 0.39), (2.20, 1.04, 0, 0.28, 0.31),
        (2.54, 0.97, 0, 0.14, 0.21),
    ], skin)
    cube(neck, "Tyrannosaurus_lower_jaw", (1.92, 0.77, 0), (0.48, 0.065, 0.22), dark, 0.05)
    eyes(neck, "Tyrannosaurus", (1.62, 1.08, 0), 1, eye, pupil, 0.22, 0.09)
    for index in range(7):
        cone_between(neck, f"Tyrannosaurus_tooth_{index}", (1.74 + index * 0.09, 0.84, -0.30), (1.77 + index * 0.09, 0.67, -0.30), 0.024, 0.004, materials["tooth"], 6)
    tail = motion_group(layer, "MOTION_TAIL", (-1.5, 0.55, 0))
    loft(tail, "Tyrannosaurus_tail", [
        (-1.46, 0.65, 0, 0.43, 0.43), (-2.32, 0.82, 0, 0.34, 0.32),
        (-3.22, 0.98, 0, 0.20, 0.19), (-4.20, 1.20, 0, 0.05, 0.05),
    ], skin)
    leg(layer, "Tyrannosaurus_left_hind_leg", (-0.25, 0.27, 0.4), (0.38, -0.5, 0.48), (0.74, -1.1, 0.47), (1.25, -1.19, 0.47), skin, 0.18)
    leg(layer, "Tyrannosaurus_right_hind_leg", (-0.33, 0.28, -0.4), (0.14, -0.48, -0.47), (0.58, -1.1, -0.47), (1.07, -1.2, -0.47), skin, 0.18)
    arm = motion_group(layer, "MOTION_ARMS", (0.82, 0.55, 0))
    between(arm, "Tyrannosaurus_left_arm", (0.92, 0.52, 0.33), (1.23, 0.08, 0.47), 0.06, skin)
    between(arm, "Tyrannosaurus_right_arm", (0.92, 0.52, -0.33), (1.23, 0.08, -0.47), 0.06, skin)
    dorsal_scales(layer, "Tyrannosaurus", [(-1.7 + i * 0.22, 1.04 + math.sin(i * 0.4) * 0.06, 0) for i in range(14)], dark, 0.085)
    simple_fossil(bone_layer, "Tyrannosaurus", [(-2.3 + i * 0.4, 0.85 + math.sin(i * 0.32) * 0.1, 0) for i in range(11)], materials["bone"])
    trackway(trace_layer, "Tyrannosaurus", (-2.1, 0, -0.25), materials["trace"])
    # The studies are modelled in a field-illustration coordinate system where
    # X is length and Y is height.  A near-orthogonal side view makes the
    # animal's proportions and gait legible instead of collapsing them into a
    # diagonal, near head-on silhouette.
    return root, (0.0, 0.15, 0), (0.0, 0.35, -17.8)


def build_triceratops(materials):
    root = empty("DINOSAUR_TRICERATOPS", status="scientific illustration", note="Anatomical silhouette is an original Loupe reconstruction, not a scan.")
    bone_layer, trace_layer, layer, _ = evidence_layers(root, "triceratops", materials["bone"], materials["trace"], materials["bird"], materials["beak"])
    skin, belly, dark, eye, pupil = (materials[key] for key in ("triceratops", "triceratops_belly", "triceratops_dark", "eye", "pupil"))
    body = motion_group(layer, "MOTION_TORSO", (-0.15, 0, 0))
    loft(body, "Triceratops_barrel_body", [
        (-1.78, 0.44, 0, 0.44, 0.44), (-1.08, 0.46, 0, 0.65, 0.61),
        (-0.20, 0.48, 0, 0.78, 0.70), (0.63, 0.55, 0, 0.70, 0.64),
        (1.14, 0.66, 0, 0.49, 0.49),
    ], skin)
    loft(body, "Triceratops_belly", [
        (-1.13, 0.06, -0.03, 0.20, 0.49), (-0.2, -0.02, -0.03, 0.26, 0.58),
        (0.66, 0.10, -0.03, 0.20, 0.49),
    ], belly, 20)
    neck = motion_group(layer, "MOTION_NECK", (1.03, 0.7, 0))
    loft(neck, "Triceratops_head", [
        (1.00, 0.72, 0, 0.46, 0.45), (1.45, 0.88, 0, 0.58, 0.54),
        (1.93, 0.79, 0, 0.45, 0.47), (2.27, 0.64, 0, 0.25, 0.37),
    ], skin)
    # Frill plane and horns are deliberately more detailed because fossil skull anatomy anchors this species tab.
    uv(neck, "Triceratops_fossil_anchored_frill", (1.13, 1.01, -0.36), (0.72, 0.94, 0.11), dark, 32, 20)
    cone_between(neck, "Triceratops_left_brow_horn", (1.67, 1.06, -0.42), (2.35, 1.54, -0.50), 0.14, 0.012, materials["horn"], 14)
    cone_between(neck, "Triceratops_right_brow_horn", (1.67, 1.06, 0.42), (2.35, 1.54, 0.50), 0.14, 0.012, materials["horn"], 14)
    cone_between(neck, "Triceratops_nasal_horn", (2.10, 0.79, -0.35), (2.48, 1.02, -0.40), 0.12, 0.01, materials["horn"], 14)
    cone_between(neck, "Triceratops_beak", (2.14, 0.56, 0), (2.62, 0.48, 0), 0.23, 0.035, materials["beak"], 6)
    eyes(neck, "Triceratops", (1.76, 0.92, 0), 1, eye, pupil, 0.33, 0.09)
    tail = motion_group(layer, "MOTION_TAIL", (-1.65, 0.5, 0))
    loft(tail, "Triceratops_tail", [
        (-1.45, 0.54, 0, 0.38, 0.39), (-2.25, 0.44, 0, 0.25, 0.27),
        (-3.25, 0.28, 0, 0.07, 0.08),
    ], skin)
    for side, z in (("left", 0.48), ("right", -0.48)):
        leg(layer, f"Triceratops_front_{side}", (0.82, 0.3, z), (1.04, -0.46, z), (1.0, -1.14, z), (1.25, -1.21, z), skin, 0.22)
        leg(layer, f"Triceratops_rear_{side}", (-0.95, 0.24, z), (-1.14, -0.48, z), (-1.0, -1.14, z), (-0.73, -1.2, z), skin, 0.23)
    dorsal_scales(layer, "Triceratops", [(-1.4 + i * 0.23, 1.08 + math.sin(i * 0.38) * 0.05, 0) for i in range(12)], dark, 0.09)
    simple_fossil(bone_layer, "Triceratops", [(-2.1 + i * 0.4, 0.86 + math.sin(i * 0.3) * 0.08, 0) for i in range(11)], materials["bone"])
    trackway(trace_layer, "Triceratops", (-2.0, 0, 0.0), materials["trace"])
    return root, (-0.05, 0.0, 0), (0.0, 0.25, -18.2)


def build_diplodocus(materials):
    root = empty("DINOSAUR_DIPLODOCUS", status="scientific illustration", note="Anatomical silhouette is an original Loupe reconstruction, not a scan.")
    bone_layer, trace_layer, layer, _ = evidence_layers(root, "diplodocus", materials["bone"], materials["trace"], materials["bird"], materials["beak"])
    skin, belly, dark, eye, pupil = (materials[key] for key in ("diplodocus", "diplodocus_belly", "diplodocus_dark", "eye", "pupil"))
    body = motion_group(layer, "MOTION_TORSO", (-0.8, 0.3, 0))
    loft(body, "Diplodocus_body", [
        (-2.45, 0.55, 0, 0.42, 0.42), (-1.65, 0.62, 0, 0.66, 0.60),
        (-0.75, 0.63, 0, 0.78, 0.70), (0.18, 0.70, 0, 0.67, 0.61),
        (0.72, 0.93, 0, 0.42, 0.41),
    ], skin)
    loft(body, "Diplodocus_belly", [
        (-1.72, 0.17, -0.03, 0.18, 0.49), (-0.75, 0.07, -0.03, 0.24, 0.58),
        (0.14, 0.20, -0.03, 0.17, 0.48),
    ], belly, 20)
    neck = motion_group(layer, "MOTION_NECK", (0.55, 0.84, 0))
    loft(neck, "Diplodocus_neck", [
        (0.54, 0.93, 0, 0.42, 0.37), (0.68, 1.50, 0, 0.38, 0.33),
        (0.88, 2.12, 0, 0.34, 0.30), (1.13, 2.70, 0, 0.29, 0.26),
        (1.45, 3.12, 0, 0.23, 0.22), (1.74, 3.20, 0, 0.20, 0.20),
    ], skin)
    loft(neck, "Diplodocus_head", [
        (1.62, 3.20, -0.02, 0.26, 0.22), (1.94, 3.19, -0.02, 0.25, 0.21),
        (2.24, 3.10, -0.02, 0.12, 0.16),
    ], skin, 20)
    cone_between(neck, "Diplodocus_muzzle", (1.95, 3.16, 0), (2.28, 3.1, 0), 0.2, 0.08, skin, 12)
    eyes(neck, "Diplodocus", (1.76, 3.22, 0), 1, eye, pupil, 0.18, 0.065)
    tail = motion_group(layer, "MOTION_TAIL", (-2.15, 0.62, 0))
    loft(tail, "Diplodocus_tail", [
        (-2.07, 0.67, 0, 0.43, 0.43), (-3.20, 0.83, 0, 0.29, 0.28),
        (-4.55, 1.00, 0, 0.16, 0.15), (-6.28, 1.30, 0, 0.02, 0.02),
    ], skin)
    for side, z in (("left", 0.5), ("right", -0.5)):
        leg(layer, f"Diplodocus_front_{side}", (0.52, 0.34, z), (0.68, -0.48, z), (0.68, -1.22, z), (0.98, -1.27, z), skin, 0.21)
        leg(layer, f"Diplodocus_rear_{side}", (-1.74, 0.34, z), (-1.92, -0.44, z), (-1.78, -1.22, z), (-1.46, -1.27, z), skin, 0.23)
    dorsal_scales(layer, "Diplodocus", [(-2.0 + i * 0.3, 1.17 + math.sin(i * 0.33) * 0.05, 0) for i in range(12)], dark, 0.075)
    simple_fossil(bone_layer, "Diplodocus", [(-3.1 + i * 0.55, 0.9 + math.sin(i * 0.25) * 0.1, 0) for i in range(13)], materials["bone"])
    trackway(trace_layer, "Diplodocus", (-2.2, 0, -0.05), materials["trace"])
    return root, (-1.0, 0.8, 0), (-1.0, 0.85, -21.5)


def descendants(root):
    objects = [root]
    for child in root.children_recursive:
        objects.append(child)
    return objects


def select_tree(root):
    bpy.ops.object.select_all(action="DESELECT")
    for obj in descendants(root):
        obj.select_set(True)
    bpy.context.view_layer.objects.active = root


def camera(location, target):
    bpy.ops.object.camera_add(location=location)
    obj = bpy.context.object
    obj.name = "Review_camera"
    obj.data.lens = 60
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()
    bpy.context.scene.camera = obj
    return obj


def world_and_ground():
    ground = make_material("Review ground", "#151a15", 1.0)
    # The models use Y as their illustrated vertical axis, so this flattened
    # cube is a true floor for the review camera (and is never exported).
    bpy.ops.mesh.primitive_cube_add(location=(0, -1.43, 0))
    plane = bpy.context.object
    plane.name = "Review_ground_not_exported"
    plane.scale = (14, 0.035, 7)
    plane.data.materials.append(ground)
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.world.use_nodes = True
    world_background = scene.world.node_tree.nodes.get("Background")
    world_background.inputs["Color"].default_value = color("#0b100d")
    world_background.inputs["Strength"].default_value = 0.22
    scene.render.film_transparent = False
    scene.render.resolution_x = 1280
    scene.render.resolution_y = 720
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "WEBP"
    scene.render.image_settings.color_mode = "RGB"
    scene.render.image_settings.quality = 92
    return plane


def only_render(layer):
    for obj in bpy.context.scene.objects:
        if obj.type in {"MESH", "EMPTY"}:
            obj.hide_render = True
    for obj in descendants(layer):
        obj.hide_render = False


def area_light(name, location, target, energy, size, hex_value):
    bpy.ops.object.light_add(type="AREA", location=location)
    light = bpy.context.object
    light.name = name
    light.data.energy = energy
    light.data.shape = "DISK"
    light.data.size = size
    light.data.color = color(hex_value)[:3]
    light.rotation_euler = (Vector(target) - light.location).to_track_quat("-Z", "Y").to_euler()
    return light


def main():
    args = arguments()
    os.makedirs(os.path.dirname(args.source), exist_ok=True)
    os.makedirs(args.model_dir, exist_ok=True)
    os.makedirs(args.plate_dir, exist_ok=True)
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)

    materials = {
        "bone": make_material("Fossil bone", "#e7dcc1", 0.82),
        "trace": make_material("Trace cast", "#c77a47", 0.9),
        "bird": make_material("Living bird", "#c9bd8f", 0.74),
        "beak": make_material("Bird and herbivore beak", "#d28a49", 0.62),
        "horn": make_material("Ceratopsian horn sheath", "#d9d0b2", 0.58),
        "tooth": make_material("Theropod tooth", "#ece3d0", 0.5),
        "eye": make_material("Amber iris", "#c89036", 0.34),
        "pupil": make_material("Pupil", "#10110d", 0.3),
        "trex": make_material("Tyrannosaurus reconstruction", "#77513c", 0.64, organic=True),
        "trex_belly": make_material("Tyrannosaurus belly reconstruction", "#a47755", 0.77, organic=True),
        "trex_dark": make_material("Tyrannosaurus dorsal pattern", "#3c3028", 0.78),
        "triceratops": make_material("Triceratops reconstruction", "#68705a", 0.69, organic=True),
        "triceratops_belly": make_material("Triceratops belly reconstruction", "#929376", 0.8, organic=True),
        "triceratops_dark": make_material("Triceratops frill reconstruction", "#404a3d", 0.77),
        "diplodocus": make_material("Diplodocus reconstruction", "#47685a", 0.67, organic=True),
        "diplodocus_belly": make_material("Diplodocus belly reconstruction", "#779180", 0.8, organic=True),
        "diplodocus_dark": make_material("Diplodocus dorsal pattern", "#29433a", 0.78),
    }
    entries = [
        ("tyrannosaurus-motion-study", *build_tyrannosaurus(materials)),
        ("triceratops-motion-study", *build_triceratops(materials)),
        ("diplodocus-motion-study", *build_diplodocus(materials)),
    ]
    ground = world_and_ground()
    review_camera = camera((8.4, -14.5, 5.4), (0, 0.1, 0))
    area_light("Review_key", (-3.5, 4.8, -7.2), (0, 0.6, 0), 920, 5.0, "#ffe1b4")
    area_light("Review_fill", (4.0, 1.0, -4.5), (0, 0.6, 0), 400, 4.0, "#a5c4ab")
    area_light("Review_rim", (1.5, 4.0, 5.5), (0, 0.9, 0), 780, 3.5, "#d69057")
    bpy.context.scene["title"] = "Loupe Dinosaur Motion Collection"
    bpy.context.scene["representation_note"] = "All full-bodied forms, colour, and movement are interpretive scientific illustrations."
    bpy.ops.wm.save_as_mainfile(filepath=args.source)

    for asset_name, root, target, camera_position in entries:
        select_tree(root)
        bpy.ops.export_scene.gltf(
            filepath=os.path.join(args.model_dir, f"{asset_name}.glb"),
            export_format="GLB",
            use_selection=True,
            export_materials="EXPORT",
            export_yup=True,
            export_cameras=False,
            export_lights=False,
            export_animations=False,
        )
        reconstruction = next(child for child in root.children if child.name.startswith("INTERPRETIVE_RECONSTRUCTION_"))
        only_render(reconstruction)
        ground.hide_render = False
        review_camera.location = camera_position
        review_camera.rotation_euler = (Vector(target) - review_camera.location).to_track_quat("-Z", "Y").to_euler()
        bpy.context.scene.render.filepath = os.path.join(args.plate_dir, f"{asset_name}.webp")
        bpy.ops.render.render(write_still=True)
        print(f"Generated {asset_name}")


if __name__ == "__main__":
    main()
