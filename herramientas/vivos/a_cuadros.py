"""Pasa un video a cuadros PNG con Blender (sin ffmpeg en esta Mac).
blender --background --factory-startup --python a_cuadros.py -- --entrada X.mp4 --salida carpeta/ --lado 720"""
import faulthandler, json, sys, os
import bpy
faulthandler.dump_traceback_later(300, exit=True)
argv = sys.argv[sys.argv.index('--') + 1:]
op = dict(zip(argv[::2], argv[1::2]))
sc = bpy.context.scene
sc.view_settings.view_transform, sc.view_settings.look = 'Standard', 'None'
sc.sequencer_colorspace_settings.name = 'sRGB'
se = sc.sequence_editor_create()
# la resolución va ANTES de crear la tira: el ajuste (FIT) se calcula con la resolución de ese momento
lado = int(op['--lado'])
sc.render.resolution_x = sc.render.resolution_y = lado
sc.render.resolution_percentage = 100
v = se.strips.new_movie(name='v', filepath=op['--entrada'], channel=1, frame_start=1, fit_method='FIT')
fps = v.elements[0].orig_fps or v.fps
v.transform.filter = 'BILINEAR'
sc.render.fps = max(1, round(fps)); sc.render.fps_base = round(fps) / fps
n = v.right_handle - v.left_handle
sc.frame_start, sc.frame_end = 1, n
ims = sc.render.image_settings
ims.file_format, ims.color_mode, ims.color_depth, ims.compression = 'PNG', 'RGB', '8', 15
os.makedirs(op['--salida'], exist_ok=True)
sc.render.filepath = os.path.join(op['--salida'], 'c_####')
bpy.ops.render.render(animation=True)
print('CUADROS ' + json.dumps({'n': n, 'fps': fps}))
