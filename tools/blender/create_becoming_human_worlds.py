"""Create Loupe's stylised Becoming Human environmental world kit.

The environments are intentionally authored low-poly dioramas. They are not
scientific reconstructions, fossil scans, or attempts at photorealistic faces.
Each world exports a lightweight GLB and a matching 16:9 fallback plate.
"""

from __future__ import annotations

import math
import os
import random

import bpy
from mathutils import Vector


ROOT = r"C:\Users\Srijib\Downloads\projects\digital-museum-becoming-human"
MODEL_DIR = os.path.join(ROOT, "public", "models", "becoming-human", "worlds")
PLATE_DIR = os.path.join(ROOT, "public", "media", "becoming-human", "worlds")
BLEND_PATH = os.path.join(ROOT, "assets", "blender", "becoming-human-worlds.blend")
WORLD_INDEX = globals().get("WORLD_INDEX", -1)
RENDER_PLATES = globals().get("RENDER_PLATES", True)

WORLD_NAMES = (
    "boundary",
    "canopy",
    "ground",
    "horizon",
    "many-camps",
    "symbols",
    "settlement",
    "knowledge",
    "energy",
    "network",
)


def rgba(hex_value: str, alpha: float = 1.0):
    value = hex_value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) / 255 for i in (0, 2, 4)) + (alpha,)


def mat(scene_tag: str, name: str, color: str, roughness=0.82, metallic=0.0, emission=None):
    material = bpy.data.materials.new(f"{scene_tag}_{name}")
    material.diffuse_color = rgba(color)
    material.use_nodes = True
    bsdf = material.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = rgba(color)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    if emission:
        bsdf.inputs["Emission Color"].default_value = rgba(emission[0])
        bsdf.inputs["Emission Strength"].default_value = emission[1]
    return material


def move(obj, collection):
    for owner in list(obj.users_collection):
        owner.objects.unlink(obj)
    collection.objects.link(obj)
    return obj


def smooth(obj):
    if obj.type == "MESH":
        for polygon in obj.data.polygons:
            polygon.use_smooth = True
    return obj


def cube(collection, name, location, scale, material, bevel=0.0, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(location=location, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(material)
    if bevel:
        modifier = obj.modifiers.new("Soft handmade edges", "BEVEL")
        modifier.width = bevel
        modifier.segments = 2
    return move(obj, collection)


def ico(collection, name, location, scale, material, subdivisions=1):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=subdivisions, radius=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(material)
    return move(obj, collection)


def cylinder(collection, name, location, radius, depth, material, vertices=10, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=location, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(material)
    return move(obj, collection)


def cone(collection, name, location, radius1, radius2, depth, material, vertices=10, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cone_add(vertices=vertices, radius1=radius1, radius2=radius2, depth=depth, location=location, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(material)
    return move(obj, collection)


def between(collection, name, start, end, radius, material, vertices=8):
    start_v, end_v = Vector(start), Vector(end)
    delta = end_v - start_v
    midpoint = (start_v + end_v) * 0.5
    obj = cylinder(collection, name, midpoint, radius, delta.length, material, vertices)
    obj.rotation_mode = "QUATERNION"
    obj.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(delta.normalized())
    obj.rotation_mode = "XYZ"
    return obj


def ribbon(collection, name, points, width, material, z=0.08):
    vertices, faces = [], []
    for index, (x, y) in enumerate(points):
        if index == 0:
            tangent = Vector((points[1][0] - x, points[1][1] - y))
        elif index == len(points) - 1:
            tangent = Vector((x - points[index - 1][0], y - points[index - 1][1]))
        else:
            tangent = Vector((points[index + 1][0] - points[index - 1][0], points[index + 1][1] - points[index - 1][1]))
        tangent.normalize()
        normal = Vector((-tangent.y, tangent.x)) * width
        vertices.extend(((x + normal.x, y + normal.y, z), (x - normal.x, y - normal.y, z)))
        if index:
            base = index * 2
            faces.append((base - 2, base, base + 1, base - 1))
    mesh = bpy.data.meshes.new(f"{name}_Mesh")
    mesh.from_pydata(vertices, [], faces)
    obj = bpy.data.objects.new(name, mesh)
    obj.data.materials.append(material)
    collection.objects.link(obj)
    return obj


def terrain(collection, scene_tag, base_color, *, ridge=0.18):
    random.seed(19082026 + int(scene_tag[-2:]))
    cols, rows = 28, 18
    width, depth = 18.0, 12.0
    vertices, faces = [], []
    for row in range(rows + 1):
        y = -depth / 2 + depth * row / rows
        for col in range(cols + 1):
            x = -width / 2 + width * col / cols
            edge = min(col / cols, 1 - col / cols, row / rows, 1 - row / rows)
            height = ridge * (math.sin(x * 0.8) + math.cos(y * 0.72)) + random.uniform(-0.09, 0.09)
            height -= max(0, 0.09 - edge) * 6.5
            vertices.append((x, y, height))
    stride = cols + 1
    for row in range(rows):
        for col in range(cols):
            a = row * stride + col
            faces.append((a, a + 1, a + stride + 1, a + stride))
    mesh = bpy.data.meshes.new(f"{scene_tag}_TerrainMesh")
    mesh.from_pydata(vertices, [], faces)
    obj = bpy.data.objects.new(f"{scene_tag}_Terrain", mesh)
    obj.data.materials.append(base_color)
    collection.objects.link(obj)
    return obj


def grass(collection, name, area, count, material, height=(0.18, 0.58), seed=0):
    random.seed(seed)
    x0, x1, y0, y1 = area
    vertices, faces = [], []
    for index in range(count):
        x, y = random.uniform(x0, x1), random.uniform(y0, y1)
        h = random.uniform(*height)
        w = h * random.uniform(0.025, 0.055)
        angle = random.uniform(0, math.tau)
        dx, dy = math.cos(angle) * w, math.sin(angle) * w
        start = len(vertices)
        vertices.extend(((x - dx, y - dy, 0.08), (x + dx, y + dy, 0.08), (x + dx * 0.25, y + dy * 0.25, h)))
        faces.append((start, start + 1, start + 2))
    mesh = bpy.data.meshes.new(f"{name}_Mesh")
    mesh.from_pydata(vertices, [], faces)
    obj = bpy.data.objects.new(name, mesh)
    obj.data.materials.append(material)
    collection.objects.link(obj)
    return obj


def tree(collection, name, x, y, scale, trunk_mat, leaf_mat, canopy="acacia"):
    trunk = cylinder(collection, f"{name}_Trunk", (x, y, scale * 0.75), 0.09 * scale, 1.5 * scale, trunk_mat, 8)
    trunk.rotation_euler.y = random.uniform(-0.08, 0.08)
    if canopy == "fern":
        for index in range(7):
            angle = index / 7 * math.tau
            end = (x + math.cos(angle) * 0.85 * scale, y + math.sin(angle) * 0.85 * scale, 1.42 * scale)
            between(collection, f"{name}_Frond_{index}", (x, y, 1.35 * scale), end, 0.035 * scale, leaf_mat, 6)
            ico(collection, f"{name}_Leaf_{index}", end, (0.46 * scale, 0.15 * scale, 0.08 * scale), leaf_mat)
    elif canopy == "acacia":
        ico(collection, f"{name}_CrownA", (x, y, 1.62 * scale), (0.92 * scale, 0.62 * scale, 0.26 * scale), leaf_mat, 2)
        ico(collection, f"{name}_CrownB", (x + 0.52 * scale, y, 1.52 * scale), (0.58 * scale, 0.42 * scale, 0.22 * scale), leaf_mat, 1)
    else:
        for index, offset in enumerate(((-0.35, 0, 1.45), (0.28, 0.05, 1.65), (0, -0.18, 1.9))):
            ico(collection, f"{name}_Crown_{index}", (x + offset[0] * scale, y + offset[1] * scale, offset[2] * scale), (0.58 * scale,) * 3, leaf_mat, 2)


def person(collection, name, location, scale, body_mat, *, stride=0.0, carrying=False):
    x, y, z = location
    head = ico(collection, f"{name}_Head", (x, y, z + 1.72 * scale), (0.16 * scale,) * 3, body_mat, 2)
    torso = cone(collection, f"{name}_Torso", (x, y, z + 1.15 * scale), 0.25 * scale, 0.18 * scale, 0.84 * scale, body_mat, 8)
    hip = (x, y, z + 0.76 * scale)
    shoulder_l = (x - 0.21 * scale, y, z + 1.42 * scale)
    shoulder_r = (x + 0.21 * scale, y, z + 1.42 * scale)
    between(collection, f"{name}_LegL", hip, (x - 0.13 * scale + stride * scale, y, z + 0.05 * scale), 0.075 * scale, body_mat, 7)
    between(collection, f"{name}_LegR", hip, (x + 0.13 * scale - stride * scale, y, z + 0.05 * scale), 0.075 * scale, body_mat, 7)
    arm_l_end = (x - 0.34 * scale - stride * 0.3 * scale, y, z + 0.76 * scale)
    arm_r_end = (x + 0.34 * scale + stride * 0.3 * scale, y, z + (1.0 if carrying else 0.76) * scale)
    between(collection, f"{name}_ArmL", shoulder_l, arm_l_end, 0.055 * scale, body_mat, 7)
    between(collection, f"{name}_ArmR", shoulder_r, arm_r_end, 0.055 * scale, body_mat, 7)
    return (head, torso)


def hut(collection, name, location, scale, wall_mat, roof_mat):
    x, y, z = location
    cylinder(collection, f"{name}_Wall", (x, y, z + 0.38 * scale), 0.58 * scale, 0.76 * scale, wall_mat, 12)
    cone(collection, f"{name}_Roof", (x, y, z + 1.0 * scale), 0.82 * scale, 0.04, 0.72 * scale, roof_mat, 12)


def fire(collection, name, location, stone_mat, ember_mat):
    x, y, z = location
    for index in range(9):
        angle = index / 9 * math.tau
        ico(collection, f"{name}_Stone_{index}", (x + math.cos(angle) * 0.34, y + math.sin(angle) * 0.34, z + 0.1), (0.14, 0.1, 0.08), stone_mat)
    cone(collection, f"{name}_FlameA", (x, y, z + 0.43), 0.25, 0.02, 0.8, ember_mat, 8)
    cone(collection, f"{name}_FlameB", (x + 0.16, y - 0.05, z + 0.3), 0.14, 0.01, 0.56, ember_mat, 8, rotation=(0.08, -0.2, 0))


def world_materials(scene_tag, palette):
    return {name: mat(scene_tag, name, color, **kwargs) for name, (color, kwargs) in palette.items()}


def build_boundary(scene_tag, c):
    m = world_materials(scene_tag, {
        "ground": ("#463d31", {}), "ash": ("#777064", {}), "fern": ("#56663f", {}),
        "trunk": ("#3a3026", {}), "water": ("#486e73", {"roughness": 0.35}),
        "ember": ("#ff6a24", {"emission": ("#ff4318", 5.5)}), "rock": ("#292a28", {}),
    })
    terrain(c, scene_tag, m["ground"], ridge=0.28)
    ribbon(c, f"{scene_tag}_River", [(-9, -1), (-5, -0.6), (-1, -1.8), (3, -0.8), (9, -2.2)], 0.34, m["water"])
    for i in range(24):
        tree(c, f"Fern_{i:02d}", random.uniform(-8, 8), random.uniform(-5, 5), random.uniform(0.38, 0.8), m["trunk"], m["fern"], "fern")
    for i in range(13):
        angle = i / 13 * math.tau
        ico(c, f"Crater_{i:02d}", (-4 + math.cos(angle) * 1.5, 2 + math.sin(angle) * 1.05, 0.22), (0.7, 0.4, 0.22), m["ash"])
    ico(c, "Impact_Light", (5.8, 4.1, 5.7), (0.42,) * 3, m["ember"], 2)


def build_canopy(scene_tag, c):
    m = world_materials(scene_tag, {
        "ground": ("#35523d", {}), "leafA": ("#4f784c", {}), "leafB": ("#71925d", {}),
        "trunk": ("#493629", {}), "water": ("#4f8581", {"roughness": 0.3}), "primate": ("#352b24", {}),
    })
    terrain(c, scene_tag, m["ground"], ridge=0.38)
    ribbon(c, f"{scene_tag}_River", [(-8, -3), (-4, -1.4), (-1, -2), (2, -0.7), (7, -1.1), (9, 0)], 0.45, m["water"])
    for i in range(30):
        tree(c, f"Canopy_{i:02d}", random.uniform(-8.5, 8.5), random.uniform(-5, 5.5), random.uniform(0.65, 1.35), m["trunk"], m["leafA"] if i % 3 else m["leafB"], "broad")
    branch = between(c, "Hero_Branch", (-3.5, -3, 2.2), (2.8, -2.4, 2.8), 0.18, m["trunk"], 10)
    branch.scale.y = 1.1
    person(c, "Early_Primate", (-0.6, -2.6, 2.65), 0.52, m["primate"], stride=0.08)


def build_ground(scene_tag, c):
    m = world_materials(scene_tag, {
        "ground": ("#9b7542", {}), "grass": ("#b89c53", {}), "leaf": ("#66763e", {}),
        "trunk": ("#4e3726", {}), "water": ("#4f7e7d", {"roughness": 0.35}), "body": ("#493225", {}),
        "track": ("#62452f", {}), "stone": ("#59605d", {"roughness": 0.96}),
    })
    terrain(c, scene_tag, m["ground"], ridge=0.14)
    grass(c, "Savanna_Grass", (-9, 9, -6, 6), 1200, m["grass"], seed=403)
    ribbon(c, f"{scene_tag}_Water", [(-8, 4), (-3, 2.6), (1, 3.1), (5, 1.8), (9, 2.5)], 0.28, m["water"])
    for i, loc in enumerate(((-6, 2), (-1.5, 4), (5.8, 2.7), (7, -2.8), (-5, -3.5))):
        tree(c, f"Acacia_{i}", *loc, random.uniform(0.8, 1.35), m["trunk"], m["leaf"], "acacia")
    for i in range(6):
        ico(c, f"Footprint_{i}", (-3.2 + i * 0.72, -2.0 + i * 0.22, 0.15), (0.14, 0.28, 0.025), m["track"])
    for i, loc in enumerate(((1.4, -0.7, 0.05), (2.1, -0.2, 0.05), (2.7, 0.3, 0.05), (3.2, 0.1, 0.05))):
        person(c, f"Hominin_{i}", loc, 0.56 + i * 0.03, m["body"], stride=(-1) ** i * 0.12)
    ico(c, "Stone_Core", (-0.6, -2.5, 0.35), (0.52, 0.44, 0.46), m["stone"], 2)


def build_horizon(scene_tag, c):
    m = world_materials(scene_tag, {
        "ground": ("#6f563a", {}), "grass": ("#8b7446", {}), "leaf": ("#3f5538", {}),
        "trunk": ("#38291f", {}), "water": ("#355f68", {"roughness": 0.3}), "body": ("#2d211b", {}),
        "stone": ("#45423e", {}), "ember": ("#ff6b22", {"emission": ("#ff3c0a", 6.0)}),
    })
    terrain(c, scene_tag, m["ground"], ridge=0.22)
    grass(c, "Dusk_Grass", (-9, 9, -6, 6), 900, m["grass"], seed=504)
    ribbon(c, f"{scene_tag}_River", [(-9, 3), (-5, 2.1), (-1, 2.6), (3, 1), (9, 1.8)], 0.36, m["water"])
    for i, loc in enumerate(((-7, 3.3), (-3, 4.4), (4.5, 3.6), (7, -1.4))):
        tree(c, f"DuskTree_{i}", *loc, random.uniform(0.75, 1.1), m["trunk"], m["leaf"], "acacia")
    for i in range(10):
        angle = math.pi * (0.08 + i / 12)
        ico(c, f"CaveRock_{i}", (-5.7 + math.cos(angle) * 2.0, -1.1, 0.6 + math.sin(angle) * 1.55), (0.65, 0.52, 0.64), m["stone"], 1)
    fire(c, "Hearth", (-2.9, -2.2, 0.12), m["stone"], m["ember"])
    for i, loc in enumerate(((-3.8, -1.8, 0.08), (-2.2, -1.4, 0.08), (2.3, -0.3, 0.08), (3.1, 0.2, 0.08), (4.0, 0.65, 0.08))):
        person(c, f"Traveler_{i}", loc, 0.55, m["body"], stride=0.12 if i > 1 else 0.0, carrying=i in (3, 4))


def build_many_camps(scene_tag, c):
    m = world_materials(scene_tag, {
        "ground": ("#716551", {}), "snow": ("#b8c0b8", {}), "forest": ("#415044", {}),
        "tent": ("#8c6c4c", {}), "bodyA": ("#3a2d25", {}), "bodyB": ("#5a4031", {}),
        "stone": ("#4b4b48", {}), "ember": ("#ff7730", {"emission": ("#ff4a10", 5.0)}),
    })
    terrain(c, scene_tag, m["ground"], ridge=0.31)
    cube(c, "Cold_Steppe", (-4.8, 2.8, 0.14), (4.1, 2.1, 0.12), m["snow"], 0.18)
    cube(c, "Forest_Edge", (5.2, 2.8, 0.16), (3.5, 2.1, 0.14), m["forest"], 0.18)
    for camp, center in enumerate(((-4.2, -1.0), (0, 1.8), (4.7, -0.7))):
        x, y = center
        cone(c, f"Shelter_{camp}", (x, y, 0.72), 1.0, 0.04, 1.35, m["tent"], 5)
        fire(c, f"CampFire_{camp}", (x + 1.05, y - 0.5, 0.1), m["stone"], m["ember"])
        for i in range(3):
            person(c, f"Camp_{camp}_Person_{i}", (x - 0.7 + i * 0.55, y - 0.8, 0.06), 0.5, m["bodyA"] if camp != 1 else m["bodyB"], stride=0.04)


def build_symbols(scene_tag, c):
    m = world_materials(scene_tag, {
        "ground": ("#302722", {}), "rock": ("#57443a", {}), "ochre": ("#c45b2d", {"emission": ("#8c351c", 0.35)}),
        "body": ("#211b18", {}), "water": ("#3e6c74", {}), "snow": ("#aab7b6", {}), "leaf": ("#4d694d", {}),
    })
    terrain(c, scene_tag, m["ground"], ridge=0.08)
    for i in range(16):
        angle = math.pi * (0.03 + i / 17)
        ico(c, f"CaveWall_{i}", (-4.2 + math.cos(angle) * 3.2, 0.8, 0.5 + math.sin(angle) * 2.6), (0.92, 0.58, 0.86), m["rock"], 1)
    for i, (a, b) in enumerate((((-5.0, -0.2, 1.5), (-4.4, -0.18, 2.1)), ((-4.7, -0.2, 2.0), (-3.9, -0.18, 1.5)), ((-4.9, -0.2, 1.72), (-4.0, -0.18, 1.72)))):
        between(c, f"OchreMark_{i}", a, b, 0.045, m["ochre"], 7)
    person(c, "Mark_Maker", (-2.5, -1.1, 0.05), 0.62, m["body"], carrying=True)
    ribbon(c, f"{scene_tag}_Coast", [(0, -3.4), (2, -2.6), (5, -3.1), (9, -2.0)], 1.0, m["water"])
    cube(c, "Cold_Biome", (5.8, 3.2, 0.18), (3.1, 1.7, 0.16), m["snow"], 0.2)
    for i in range(6):
        ico(c, f"ForestPatch_{i}", (random.uniform(0, 4), random.uniform(1.8, 4.8), random.uniform(0.3, 0.8)), (0.45, 0.45, 0.7), m["leaf"], 1)


def build_settlement(scene_tag, c):
    m = world_materials(scene_tag, {
        "ground": ("#8d794d", {}), "fieldA": ("#b5a34f", {}), "fieldB": ("#6f8a4d", {}),
        "water": ("#477d7b", {"roughness": 0.32}), "wall": ("#b48b5c", {}), "roof": ("#775334", {}),
        "body": ("#4d3527", {}), "clay": ("#9c5b35", {}),
    })
    terrain(c, scene_tag, m["ground"], ridge=0.11)
    ribbon(c, f"{scene_tag}_River", [(-9, -0.8), (-4, 0), (0, -0.5), (4, 0.7), (9, 0.1)], 0.55, m["water"])
    for i in range(8):
        cube(c, f"Field_{i}", (-6 + (i % 4) * 2.15, 2.3 + (i // 4) * 1.6, 0.13), (0.88, 0.58, 0.08), m["fieldA"] if i % 2 else m["fieldB"], 0.08)
    for i, loc in enumerate(((1.5, 2.6), (3.1, 3.0), (4.7, 2.4), (2.6, 4.3), (5.2, 4.1), (6.7, 3.0))):
        hut(c, f"Hut_{i}", (*loc, 0.08), 0.72 + (i % 2) * 0.12, m["wall"], m["roof"])
    for i, loc in enumerate(((-4, 1.0, 0.08), (-2.6, 0.7, 0.08), (1.6, 1.0, 0.08), (3.4, 1.2, 0.08), (5.5, 0.8, 0.08))):
        person(c, f"Villager_{i}", loc, 0.48, m["body"], stride=(-1) ** i * 0.08, carrying=i in (0, 3))
    tablet = cube(c, "Clay_Tablet", (-5.7, -2.5, 0.55), (0.8, 0.12, 0.58), m["clay"], 0.16, rotation=(math.radians(72), 0, 0))
    tablet.rotation_euler.z = -0.16


def build_knowledge(scene_tag, c):
    m = world_materials(scene_tag, {
        "ground": ("#6b5948", {}), "wood": ("#5b3826", {}), "paper": ("#d3c5a7", {}),
        "ink": ("#252726", {}), "brass": ("#a77b35", {"metallic": 0.7, "roughness": 0.28}), "glass": ("#6f9c9c", {"metallic": 0.1, "roughness": 0.2}),
        "body": ("#433126", {}),
    })
    terrain(c, scene_tag, m["ground"], ridge=0.04)
    cube(c, "Workshop_Floor", (0, 0, 0.12), (8.5, 5.5, 0.14), m["wood"], 0.12)
    cube(c, "Press_Bed", (-3.2, 0, 0.75), (1.8, 1.5, 0.26), m["wood"], 0.08)
    for x in (-4.4, -2.0):
        cube(c, f"Press_Post_{x}", (x, 0.8, 2.1), (0.18, 0.22, 1.7), m["wood"], 0.05)
    cube(c, "Press_Top", (-3.2, 0.8, 3.5), (1.45, 0.28, 0.2), m["wood"], 0.05)
    between(c, "Press_Screw", (-3.2, 0.55, 3.4), (-3.2, 0.25, 1.2), 0.14, m["brass"], 12)
    for i in range(11):
        cube(c, f"Paper_{i}", (-0.5 + (i % 4) * 1.1, -2.3 + (i // 4) * 1.0, 0.34 + i * 0.005), (0.46, 0.66, 0.018), m["paper"], 0.02, rotation=(0, 0, (i % 3 - 1) * 0.08))
    for i in range(5):
        cylinder(c, f"Type_{i}", (-3.8 + i * 0.3, -0.3, 1.08), 0.11, 0.22, m["ink"], 6)
    cylinder(c, "Lens", (4.4, 0.2, 1.35), 1.0, 0.18, m["brass"], 32, rotation=(math.radians(90), 0, 0))
    cylinder(c, "Glass", (4.4, 0.1, 1.35), 0.78, 0.10, m["glass"], 32, rotation=(math.radians(90), 0, 0))
    person(c, "Printer", (-5.4, -1.4, 0.25), 0.62, m["body"], carrying=True)
    person(c, "Observer", (4.2, -1.6, 0.25), 0.62, m["body"], carrying=True)


def build_energy(scene_tag, c):
    m = world_materials(scene_tag, {
        "ground": ("#4a4d49", {}), "brick": ("#714638", {}), "steel": ("#4d5558", {"metallic": 0.55, "roughness": 0.4}),
        "rail": ("#252a2d", {"metallic": 0.75, "roughness": 0.28}), "smoke": ("#6d6f6b", {}),
        "window": ("#ffc451", {"emission": ("#ff9f2f", 4.0)}), "body": ("#302a27", {}),
    })
    terrain(c, scene_tag, m["ground"], ridge=0.05)
    for i, loc in enumerate(((-4.7, 1.5), (-1.5, 2.2), (2.0, 1.4), (5.5, 2.0))):
        x, y = loc
        cube(c, f"Factory_{i}", (x, y, 1.0), (1.45, 1.25, 0.95 + i * 0.12), m["brick"], 0.08)
        cylinder(c, f"Stack_{i}", (x + 0.7, y + 0.4, 3.2), 0.24, 4.2, m["steel"], 12)
        for puff in range(3):
            ico(c, f"Smoke_{i}_{puff}", (x + 0.7 + puff * 0.14, y + 0.4, 5.3 + puff * 0.48), (0.48 + puff * 0.18,) * 3, m["smoke"], 2)
    for offset in (-0.35, 0.35):
        cube(c, f"Rail_{offset}", (0, -2.9 + offset, 0.18), (8.8, 0.05, 0.05), m["rail"])
    for i in range(11):
        cube(c, f"Sleeper_{i}", (-8 + i * 1.55, -2.9, 0.14), (0.42, 0.62, 0.05), m["brick"])
    for i in range(18):
        cube(c, f"City_{i}", (-8 + (i % 9) * 1.85, 4.5, 0.65 + (i % 4) * 0.22), (0.68, 0.55, 0.6 + (i % 4) * 0.22), m["steel"], 0.05)
        cube(c, f"Window_{i}", (-8 + (i % 9) * 1.85, 3.92, 0.72 + (i % 4) * 0.22), (0.28, 0.02, 0.16), m["window"], 0.01)
    for i in range(6):
        person(c, f"Worker_{i}", (-4.5 + i * 1.6, -1.2, 0.15), 0.48, m["body"], stride=(-1) ** i * 0.08, carrying=i % 3 == 0)


def build_network(scene_tag, c):
    m = world_materials(scene_tag, {
        "ground": ("#24313a", {}), "server": ("#323d45", {"metallic": 0.48, "roughness": 0.38}),
        "concrete": ("#697176", {}), "signal": ("#55d7d0", {"emission": ("#18b9c6", 5.0)}),
        "warm": ("#ffb14a", {"emission": ("#ff8a28", 3.2)}), "body": ("#202326", {}),
    })
    terrain(c, scene_tag, m["ground"], ridge=0.06)
    for row in range(3):
        for col in range(9):
            x, y = -7.2 + col * 1.75, 0.5 + row * 1.75
            height = 0.9 + ((col * 3 + row) % 5) * 0.35
            cube(c, f"Server_{row}_{col}", (x, y, height), (0.62, 0.58, height), m["server"], 0.05)
            cube(c, f"Signal_{row}_{col}", (x, y - 0.60, height * 0.85), (0.32, 0.015, 0.05), m["signal"] if (row + col) % 3 else m["warm"], 0.01)
    routes = [((-8, -3.2, 0.25), (-2, -1.3, 0.3), (4, -2.3, 0.3), (8, -0.8, 0.3)), ((-7, 4.8, 0.4), (-1, 2.2, 0.4), (5, 4.4, 0.4))]
    for route_i, points in enumerate(routes):
        for i in range(len(points) - 1):
            between(c, f"Fiber_{route_i}_{i}", points[i], points[i + 1], 0.065, m["signal"], 8)
    for i, loc in enumerate(((-5.2, -2.0, 0.12), (-2.8, -1.8, 0.12), (1.2, -2.6, 0.12), (3.8, -1.6, 0.12), (6.4, -2.3, 0.12))):
        person(c, f"Operator_{i}", loc, 0.5, m["body"], stride=(-1) ** i * 0.05, carrying=i in (1, 4))


BUILDERS = (
    build_boundary,
    build_canopy,
    build_ground,
    build_horizon,
    build_many_camps,
    build_symbols,
    build_settlement,
    build_knowledge,
    build_energy,
    build_network,
)

WORLD_BACKGROUNDS = (
    "#9b8468", "#78927a", "#c1a166", "#3d5361", "#778083",
    "#45352f", "#b99a61", "#9b846d", "#596169", "#263a47",
)


def remove_old_worlds():
    for scene in list(bpy.data.scenes):
        if scene.name.startswith("BH_WORLD_"):
            bpy.data.scenes.remove(scene)
    for collection in list(bpy.data.collections):
        if collection.name.startswith("BH_WORLD_"):
            bpy.data.collections.remove(collection)


def remove_world(index):
    name = f"BH_WORLD_{index:02d}"
    scene = bpy.data.scenes.get(name)
    if scene:
        bpy.data.scenes.remove(scene)
    collection = bpy.data.collections.get(name)
    if collection:
        bpy.data.collections.remove(collection)


def add_light(scene, name, kind, location, energy, color, size=5.0):
    data = bpy.data.lights.new(name, kind)
    data.energy = energy
    data.color = color
    if hasattr(data, "size"):
        data.size = size
    obj = bpy.data.objects.new(name, data)
    scene.collection.objects.link(obj)
    obj.location = location
    target = Vector((0, 0.4, 0.8))
    obj.rotation_euler = (target - obj.location).to_track_quat("-Z", "Y").to_euler()


def merge_static_meshes(scene_tag, collection):
    """Collapse the diorama into a small number of material batches for WebGL.

    Every world is static, so preserving hundreds of primitive objects would
    only add draw calls. Joining by material keeps the deliberately faceted
    silhouette and exact render while reducing the browser scene to roughly
    one mesh per material.
    """
    material_groups = {}
    for obj in list(collection.objects):
        if obj.type != "MESH":
            continue
        materials = tuple(material.name if material else "NONE" for material in obj.data.materials)
        material_groups.setdefault(materials, []).append(obj)

    for batch_index, objects in enumerate(material_groups.values()):
        if len(objects) < 2:
            continue
        bpy.ops.object.select_all(action="DESELECT")
        for obj in objects:
            obj.select_set(True)
        bpy.context.view_layer.objects.active = objects[0]
        bpy.ops.object.join()
        merged = bpy.context.active_object
        merged.name = f"{scene_tag}_Batch_{batch_index:02d}"
        # Joining objects that share a material can still leave duplicate
        # slots. Remove only unused slots; the mesh's material assignment is
        # otherwise preserved exactly.
        bpy.ops.object.material_slot_remove_unused()


def build_world(index):
    random.seed(19082026 + index * 101)
    scene_tag = f"BH_WORLD_{index:02d}"
    scene = bpy.data.scenes.new(scene_tag)
    bpy.context.window.scene = scene
    collection = bpy.data.collections.new(scene_tag)
    scene.collection.children.link(collection)
    BUILDERS[index](scene_tag, collection)

    bpy.ops.object.camera_add(location=(14.8, -18.8, 12.4))
    camera = bpy.context.object
    camera.name = f"{scene_tag}_Camera"
    scene.camera = camera
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = 16.8
    camera.rotation_euler = (Vector((0, 0.6, 0.8)) - camera.location).to_track_quat("-Z", "Y").to_euler()
    add_light(scene, f"{scene_tag}_Sun", "SUN", (-8, -8, 15), 3.4, (1.0, 0.69, 0.43), 8.0)
    add_light(scene, f"{scene_tag}_Fill", "AREA", (10, -2, 8), 520, (0.42, 0.65, 0.9), 7.0)

    scene.world = bpy.data.worlds.new(f"{scene_tag}_World")
    scene.world.use_nodes = True
    background = scene.world.node_tree.nodes.get("Background")
    background.inputs["Color"].default_value = rgba(WORLD_BACKGROUNDS[index])
    background.inputs["Strength"].default_value = 0.28
    # Blender 5.x exposes Eevee through the BLENDER_EEVEE enum again.
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 1600
    scene.render.resolution_y = 900
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.film_transparent = False
    scene.render.filepath = os.path.join(PLATE_DIR, f"world-{index:02d}-{WORLD_NAMES[index]}.png")
    scene.view_settings.look = "AgX - Medium High Contrast"

    merge_static_meshes(scene_tag, collection)

    # Selection lives on view layers. Clear it scene-by-scene so a later world
    # never accidentally exports previously authored worlds into its GLB.
    for other_scene in bpy.data.scenes:
        bpy.context.window.scene = other_scene
        bpy.ops.object.select_all(action="DESELECT")
    bpy.context.window.scene = scene
    for obj in collection.objects:
        obj.select_set(True)
    bpy.ops.export_scene.gltf(
        filepath=os.path.join(MODEL_DIR, f"world-{index:02d}-{WORLD_NAMES[index]}.glb"),
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_yup=True,
        export_materials="EXPORT",
    )
    if RENDER_PLATES:
        bpy.ops.render.render(write_still=True)
    triangles = sum(sum(len(poly.vertices) - 2 for poly in obj.data.polygons) for obj in collection.objects if obj.type == "MESH")
    return {"world": WORLD_NAMES[index], "objects": len(collection.objects), "triangles": triangles}


def build():
    os.makedirs(MODEL_DIR, exist_ok=True)
    os.makedirs(PLATE_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(BLEND_PATH), exist_ok=True)
    previous_scene_name = bpy.context.window.scene.name
    if WORLD_INDEX < 0:
        remove_old_worlds()
    else:
        remove_world(WORLD_INDEX)
    indexes = range(len(WORLD_NAMES)) if WORLD_INDEX < 0 else (WORLD_INDEX,)
    results = [build_world(index) for index in indexes]
    authored_scenes = {scene for scene in bpy.data.scenes if scene.name.startswith("BH_WORLD_")}
    bpy.data.libraries.write(BLEND_PATH, authored_scenes, path_remap="ABSOLUTE", fake_user=True, compress=True)
    if previous_scene_name in bpy.data.scenes:
        bpy.context.window.scene = bpy.data.scenes[previous_scene_name]
    return {"worlds": results, "blend": BLEND_PATH}


result = build()
