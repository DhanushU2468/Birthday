# Blender Python scene generator for Dreamy 3D Birthday Island
# Run with: blender --background --python scripts/blender_scene.py
import bpy
import math
from mathutils import Vector

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE_NEXT' if hasattr(bpy.types, 'RenderSettings') else 'BLENDER_EEVEE'
scene.world.color = (0.72, 0.75, 0.92)

def material(name, color, roughness=0.7, metallic=0.0, emission=0.0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    if emission:
        bsdf.inputs["Emission"].default_value = (*color, 1)
        bsdf.inputs["Emission Strength"].default_value = emission
    return mat

grass = material("Pastel Grass", (0.43, 0.68, 0.48))
rock = material("Lavender Rock", (0.46, 0.42, 0.58))
pink = material("Cherry Blossom", (0.95, 0.62, 0.72))
cream = material("Castle Cream", (0.96, 0.88, 0.76))
gold = material("Warm Gold", (0.95, 0.69, 0.32), 0.35, 0.25)
blue = material("Water", (0.54, 0.78, 0.89), 0.15, 0.1)

bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=32, radius=4.6, location=(0, 0, 0))
island_top = bpy.context.object
island_top.name = "Floating_Island"
island_top.scale = (1.65, 1.25, 0.38)
island_top.data.materials.append(grass)
bpy.ops.object.modifier_add(type='DISPLACE')

bpy.ops.mesh.primitive_cone_add(vertices=64, radius1=4.2, radius2=0.25, depth=4.5, location=(0, 0, -2.2))
underside = bpy.context.object
underside.name = "Rocky_Underside"
underside.scale = (1.55, 1.2, 1)
underside.data.materials.append(rock)

def cylinder(name, radius, depth, loc, mat, vertices=32):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(mat)
    return obj

def castle_tower(x, y, z, height=2.2):
    cylinder("Castle_Tower", 0.52, height, (x, y, z + height / 2), cream)
    bpy.ops.mesh.primitive_cone_add(vertices=32, radius1=0.72, radius2=0, depth=0.75, location=(x, y, z + height + 0.37))
    bpy.context.object.name = "Castle_Rooftop"
    bpy.context.object.data.materials.append(pink)

castle_tower(-1.2, 0.2, 0.55, 2.4)
castle_tower(1.2, 0.2, 0.55, 2.4)
cylinder("Castle_Wing", 1.1, 1.6, (0, 0.2, 1.35), cream, 64).scale = (1.5, 0.65, 1)

def cherry_tree(x, y, scale=1):
    cylinder("Cherry_Trunk", 0.12 * scale, 1.3 * scale, (x, y, 0.65 * scale), rock, 16)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=0.75 * scale, location=(x, y, 1.55 * scale))
    bpy.context.object.name = "Cherry_Blossoms"
    bpy.context.object.data.materials.append(pink)

for x, y in [(-3, 1.4), (3, 1.1), (-2.7, -1.1), (2.5, -1.5)]:
    cherry_tree(x, y)

# Waterfall ribbons
for x in (-3.2, 3.0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, -1.1, -1.4))
    ribbon = bpy.context.object
    ribbon.name = "Waterfall"
    ribbon.scale = (0.16, 0.45, 2.8)
    ribbon.data.materials.append(blue)

# Lighting
bpy.ops.object.light_add(type='SUN', location=(4, -6, 8))
sun = bpy.context.object
sun.name = "Pastel_Sun"
sun.data.energy = 3

bpy.ops.object.camera_add(location=(9, -11, 7))
camera = bpy.context.object
camera.name = "Cinematic_Camera"
camera.rotation_euler = ((camera.location - Vector((0, 0, 0))).rotation_difference(Vector((0, 0, -1))).to_euler())
scene.camera = camera

output = bpy.path.abspath("//floating-island.blend")
bpy.ops.wm.save_as_mainfile(filepath=output)
try:
    bpy.ops.export_scene.gltf(filepath=bpy.path.abspath("//floating-island.glb"), export_format='GLB')
except Exception as exc:
    print("GLB export unavailable:", exc)
