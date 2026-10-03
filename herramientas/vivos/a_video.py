"""Cuadros PNG -> MP4 H.264 sin audio, con Blender.
blender --background --factory-startup --python a_video.py -- --entrada carpeta/ --salida x.mp4 --lado 960 --fps 24 --crf 24"""
import faulthandler, glob, json, os, sys
import bpy
faulthandler.dump_traceback_later(600, exit=True)
argv = sys.argv[sys.argv.index('--') + 1:]
op = dict(zip(argv[::2], argv[1::2]))
sc = bpy.context.scene
sc.view_settings.view_transform, sc.view_settings.look = 'Standard', 'None'
sc.sequencer_colorspace_settings.name = 'sRGB'
lado = int(op['--lado'])
sc.render.resolution_x = sc.render.resolution_y = lado
sc.render.resolution_percentage = 100
sc.render.fps, sc.render.fps_base = int(op['--fps']), 1
archivos = sorted(os.path.basename(p) for p in glob.glob(os.path.join(op['--entrada'], '*.png')))
se = sc.sequence_editor_create()
s = se.strips.new_image(name='c', filepath=os.path.join(op['--entrada'], archivos[0]), channel=1, frame_start=1, fit_method='FIT')
for a in archivos[1:]:
    s.elements.append(a)
s.frame_final_duration = len(archivos)
sc.frame_start, sc.frame_end = 1, len(archivos)
ims = sc.render.image_settings
ims.media_type, ims.file_format, ims.color_mode = 'VIDEO', 'FFMPEG', 'RGB'
ff = sc.render.ffmpeg
ff.format, ff.codec = 'MPEG4', 'H264'
ff.constant_rate_factor, ff.custom_constant_rate_factor = 'CUSTOM', int(op.get('--crf', 24))
ff.ffmpeg_preset = 'GOOD'
ff.gopsize = int(op['--fps']) * 2
ff.use_max_b_frames = False
ff.audio_codec = 'NONE'
sc.render.filepath = op['--salida']
bpy.ops.render.render(animation=True)
print('VIDEO ' + json.dumps({'cuadros': len(archivos), 'salida': op['--salida']}))
