"""Build Loupe's Dinosaur exhibit evidence-study asset in Blender.

The asset is a deliberately stylised explanatory composition. Its four named
groups separate direct evidence classes from the model's interpretive additions:

* OBSERVED_BONE_RECORD — a partial articulated theropod-like fossil study;
* OBSERVED_TRACE_RECORD — stylised three-toed footprint impressions;
* INTERPRETIVE_RECONSTRUCTION — translucent, non-specimen soft-tissue volumes;
* LIVING_LINEAGE_REFERENCE — a small contemporary bird comparison.

It is not a scan, a particular published mount, or a claim about an individual
animal's colour, posture, or feather pattern.
"""

from __future__ import annotations

import argparse
import math
import os
import sys

import bpy
from mathutils import Vector


def parse_arguments():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True)
    parser.add_argument("--glb", required=True)
    parser.add_argument("--plate", required=True)
    parser.add_argument("--render-plate", default="True")
    return parser.parse_args(argv)


def rgba(hex_value, alpha=1.0):
    value = hex_value.lstrip("#")
    return tuple(int(value[index : index + 2], 16) / 255 for index in (0, 2, 4)) + (alpha,)


def material(name, color, alpha=1.0, metallic=0.0, roughness=0.7):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = rgba(color, alpha)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = rgba(color, alpha)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Alpha"].default_value = alpha
    if alpha < 1:
        try:
            mat.surface_render_method = "DITHERED"
        except AttributeError:
            mat.blend_method = "BLEND"
    return mat


def parent(obj, group):
    obj.parent = group
    return obj


def smooth(obj):
    if obj.type == "MESH":
        for polygon in obj.data.polygons:
            polygon.use_smooth = True
    return obj


def add_ico(group, name, location, scale, mat, subdivisions=2):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=subdivisions, radius=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(mat)
    return parent(smooth(obj), group)


def add_uv(group, name, location, scale, mat):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=20, ring_count=12, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(mat)
    return parent(smooth(obj), group)


def add_cone(group, name, location, radius1, radius2, depth, mat, rotation=(0, 0, 0), vertices=10):
    bpy.ops.mesh.primitive_cone_add(
        vertices=vertices,
        radius1=radius1,
        radius2=radius2,
        depth=depth,
        location=location,
        rotation=rotation,
    )
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(mat)
    return parent(smooth(obj), group)


def add_cylinder_between(group, name, start, end, radius, mat, vertices=9):
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
    obj.data.materials.append(mat)
    obj.rotation_mode = "QUATERNION"
    obj.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(delta.normalized())
    obj.rotation_mode = "XYZ"
    return parent(smooth(obj), group)


def add_curve_between(group, name, points, radius, mat):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.bevel_depth = radius
    curve.bevel_resolution = 2
    spline = curve.splines.new("BEZIER")
    spline.bezier_points.add(len(points) - 1)
    for point, coordinate in zip(spline.bezier_points, points):
        point.co = coordinate
        point.handle_left_type = "AUTO"
        point.handle_right_type = "AUTO"
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    return parent(obj, group)


def add_empty(name, label, description):
    obj = bpy.data.objects.new(name, None)
    obj.empty_display_type = "SINGLE_ARROW"
    obj["evidence_status"] = label
    obj["interpretation"] = description
    bpy.context.scene.collection.objects.link(obj)
    return obj


def build_bone_record(group, bone):
    """A partial, non-diagnostic articulated theropod-style study."""
    spine = [
        (-2.55, 1.28, 0.0),
        (-2.05, 1.12, 0.0),
        (-1.48, 0.98, 0.0),
        (-0.88, 0.84, 0.0),
        (-0.26, 0.76, 0.0),
        (0.35, 0.78, 0.0),
        (0.95, 0.87, 0.0),
    ]
    for index, point in enumerate(spine):
        add_ico(group, f"Fossil_vertebra_{index + 1:02d}", point, (0.15, 0.11, 0.13), bone, 1)
        if index:
            add_cylinder_between(group, f"Fossil_spine_{index:02d}", spine[index - 1], point, 0.055, bone)

    # Head and jaw are schematic: their separate names make uncertainty legible in the renderer.
    add_ico(group, "Fossil_cranium_partial", (1.36, 1.1, 0.02), (0.49, 0.31, 0.29), bone, 2)
    add_cone(group, "Fossil_snout_partial", (1.71, 1.02, 0.02), 0.25, 0.12, 0.54, bone, rotation=(0, math.pi / 2, 0), vertices=7)
    add_cylinder_between(group, "Fossil_lower_jaw_partial", (1.12, 0.81, -0.04), (1.7, 0.83, -0.04), 0.047, bone)

    pelvis = (-0.28, 0.56, 0.0)
    add_ico(group, "Fossil_pelvis", pelvis, (0.34, 0.27, 0.26), bone, 1)

    # Four open ribs make the thorax readable without inventing a complete cage.
    for index, root in enumerate(spine[3:7]):
        x, y, _ = root
        add_curve_between(
            group,
            f"Fossil_rib_{index + 1}",
            [(x, y, 0), (x + 0.04, y - 0.31, 0.23), (x - 0.08, y - 0.47, 0.08)],
            0.038,
            bone,
        )
        add_curve_between(
            group,
            f"Fossil_rib_mirror_{index + 1}",
            [(x, y, 0), (x + 0.04, y - 0.31, -0.23), (x - 0.08, y - 0.47, -0.08)],
            0.038,
            bone,
        )

    # Hind limbs are articulated from a single pelvis; forelimbs are deliberately incomplete.
    for side, offset in (("L", 0.22), ("R", -0.22)):
        hip = (-0.2, 0.49, offset)
        knee = (0.3, -0.32, offset * 1.2)
        ankle = (0.74, -1.02, offset * 1.35)
        toes = (1.18, -1.1, offset * 1.45)
        add_cylinder_between(group, f"Fossil_femur_{side}", hip, knee, 0.092, bone)
        add_cylinder_between(group, f"Fossil_tibia_{side}", knee, ankle, 0.072, bone)
        add_cylinder_between(group, f"Fossil_metatarsal_{side}", ankle, toes, 0.046, bone)
        for toe_index, spread in enumerate((-0.18, 0, 0.18), start=1):
            add_cylinder_between(
                group,
                f"Fossil_toe_{side}_{toe_index}",
                toes,
                (1.48, -1.15 + spread * 0.4, offset * 1.45 + spread),
                0.026,
                bone,
                vertices=7,
            )

    shoulder = (0.55, 0.63, 0.0)
    add_cylinder_between(group, "Fossil_forelimb_humerus_partial", shoulder, (0.84, 0.16, 0.17), 0.045, bone)
    add_cylinder_between(group, "Fossil_forelimb_radius_partial", (0.84, 0.16, 0.17), (1.03, -0.11, 0.2), 0.03, bone)


def build_trace_record(group, trace):
    # Five impressions are mapped as a path, not a speed or behaviour claim.
    for step in range(5):
        x = -2.35 + step * 1.05
        y = -1.62 + (0.18 if step % 2 else -0.1)
        for toe, spread in enumerate((-0.22, 0.0, 0.22), start=1):
            obj = add_cone(
                group,
                f"Observed_track_{step + 1}_toe_{toe}",
                (x + 0.14, y + spread * 0.18, 0.028),
                0.18,
                0.028,
                0.052,
                trace,
                rotation=(0, 0, math.radians(-12 + spread * 32)),
                vertices=3,
            )
            obj.scale = (0.55, 1.5, 1)
        add_ico(group, f"Observed_track_{step + 1}_pad", (x - 0.04, y, 0.025), (0.19, 0.15, 0.022), trace, 1)


def build_reconstruction(group, skin):
    # This is a translucently material-coded teaching volume, never fossil bone.
    add_uv(group, "Interpretive_body_volume", (-0.25, 0.72, 0), (1.4, 0.5, 0.43), skin)
    add_uv(group, "Interpretive_neck_volume", (0.75, 0.9, 0), (0.75, 0.3, 0.27), skin)
    add_uv(group, "Interpretive_head_volume", (1.38, 1.1, 0), (0.5, 0.31, 0.28), skin)
    add_cone(group, "Interpretive_tail_volume", (-2.1, 1.15, 0), 0.36, 0.06, 1.85, skin, rotation=(0, -math.pi / 2 + 0.13, 0), vertices=12)
    add_uv(group, "Interpretive_thigh_left", (-0.05, 0.04, 0.25), (0.29, 0.59, 0.25), skin)
    add_uv(group, "Interpretive_thigh_right", (-0.05, 0.04, -0.25), (0.29, 0.59, 0.25), skin)


def build_bird_reference(group, feather, beak):
    add_uv(group, "Living_bird_body", (2.42, 1.72, -0.42), (0.28, 0.2, 0.18), feather)
    add_uv(group, "Living_bird_head", (2.68, 1.78, -0.42), (0.14, 0.13, 0.12), feather)
    add_cone(group, "Living_bird_beak", (2.85, 1.78, -0.42), 0.075, 0.01, 0.23, beak, rotation=(0, math.pi / 2, 0), vertices=4)
    for side, direction in (("left", 1), ("right", -1)):
        wing = add_cone(
            group,
            f"Living_bird_wing_{side}",
            (2.34, 1.72, -0.42 + direction * 0.16),
            0.18,
            0.03,
            0.69,
            feather,
            rotation=(math.radians(16) * direction, 0, math.radians(-62)),
            vertices=5,
        )
        wing.scale = (0.9, 1.42, 1)


def create_camera(location, target):
    bpy.ops.object.camera_add(location=location)
    camera = bpy.context.object
    camera.name = "Review_camera"
    camera.data.lens = 62
    camera.rotation_euler = (Vector(target) - camera.location).to_track_quat("-Z", "Y").to_euler()
    bpy.context.scene.camera = camera
    return camera


def create_lights():
    def area(name, location, energy, color, size):
        bpy.ops.object.light_add(type="AREA", location=location)
        light = bpy.context.object
        light.name = name
        light.data.energy = energy
        light.data.color = rgba(color)[:3]
        light.data.shape = "DISK"
        light.data.size = size
        light.rotation_euler = (Vector((0, 0.4, 0)) - light.location).to_track_quat("-Z", "Y").to_euler()
    area("Warm key", (2.2, -4.4, 7.1), 980, "#f2d6a3", 5.0)
    area("Green rim", (-5.0, 2.0, 4.5), 760, "#88a97d", 4.0)
    area("Amber fill", (3.7, 4.2, 2.2), 460, "#d78451", 3.0)


def create_ground(ground):
    bpy.ops.mesh.primitive_plane_add(size=30, location=(0, 0, -0.04))
    plane = bpy.context.object
    plane.name = "Context_ground_not_evidence"
    plane.data.materials.append(ground)
    return plane


def main():
    args = parse_arguments()
    for path in (args.source, args.glb, args.plate):
        os.makedirs(os.path.dirname(path), exist_ok=True)

    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for collection in list(bpy.data.collections):
        bpy.data.collections.remove(collection)

    bone = material("Fossil bone · observed evidence", "#e8dfc1", roughness=0.82)
    trace = material("Track cast · observed evidence", "#c87a43", roughness=0.9)
    skin = material("Soft tissue · interpretive reconstruction", "#b66d49", alpha=0.28, roughness=0.78)
    feather = material("Bird reference · living lineage", "#cdbf91", roughness=0.76)
    beak = material("Bird beak · living lineage", "#cf7742", roughness=0.68)
    ground = material("Context ground · non-evidence", "#20271f", roughness=1.0)

    bone_group = add_empty(
        "OBSERVED_BONE_RECORD",
        "observed fossil material",
        "Stylised partial bone study. It does not reproduce an individual specimen.",
    )
    trace_group = add_empty(
        "OBSERVED_TRACE_RECORD",
        "observed trace evidence",
        "Stylised impressions represent contact with substrate, not measured speed or behaviour.",
    )
    reconstruction_group = add_empty(
        "INTERPRETIVE_RECONSTRUCTION",
        "interpretive reconstruction",
        "Translucent soft-tissue volumes are a teaching scaffold, not recovered anatomy.",
    )
    bird_group = add_empty(
        "LIVING_LINEAGE_REFERENCE",
        "living comparative reference",
        "A simplified contemporary bird makes the continuing dinosaur lineage visible.",
    )

    build_bone_record(bone_group, bone)
    build_trace_record(trace_group, trace)
    build_reconstruction(reconstruction_group, skin)
    build_bird_reference(bird_group, feather, beak)
    create_ground(ground)

    scene = bpy.context.scene
    scene["title"] = "Loupe Dinosaur Evidence Study"
    scene["scientific_note"] = "An explanatory model with observed and interpretive components separated by named groups."
    # Workbench creates a fast local review/fallback plate. The runtime uses
    # the GLB material data, so this choice never reduces the model itself.
    scene.render.engine = "BLENDER_WORKBENCH"
    scene.display.shading.light = "STUDIO"
    scene.display.shading.color_type = "MATERIAL"
    scene.display.shading.show_shadows = True
    scene.display.shading.show_cavity = True
    scene.display.shading.background_type = "WORLD"
    scene.render.resolution_x = 960
    scene.render.resolution_y = 540
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "WEBP"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.image_settings.quality = 88
    scene.world.color = rgba("#11150f")[:3]
    create_camera((6.8, -10.8, 3.65), (0.05, 0.12, 0))
    create_lights()

    bpy.ops.wm.save_as_mainfile(filepath=args.source)
    bpy.ops.export_scene.gltf(
        filepath=args.glb,
        export_format="GLB",
        export_materials="EXPORT",
        export_yup=True,
        export_cameras=False,
        export_lights=False,
        export_animations=False,
    )
    if args.render_plate.lower() == "true":
        scene.render.filepath = args.plate
        bpy.ops.render.render(write_still=True)
    print(f"Generated GLB: {args.glb}")
    print(f"Generated source: {args.source}")
    if args.render_plate.lower() == "true":
        print(f"Rendered plate: {args.plate}")


if __name__ == "__main__":
    main()
