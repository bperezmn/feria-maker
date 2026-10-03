"""Comprime un video para la web con Blender (no hay ffmpeg en esta Mac): H.264 + AAC, MP4 con inicio rápido.

blender --background --factory-startup --python herramientas/comprimir_video.py -- \
    --entrada "VIDEO.mp4" --salida video/memoria-2026.mp4 --ancho 1280 --alto 720 --crf 27
"""
import faulthandler
import json
import sys

import bpy

faulthandler.dump_traceback_later(600, exit=True)
bpy.app.handlers.render_write.append(lambda *_: faulthandler.dump_traceback_later(600, exit=True))

argv = sys.argv[sys.argv.index('--') + 1:]
op = dict(zip(argv[::2], argv[1::2]))
sc = bpy.context.scene
sc.view_settings.view_transform, sc.view_settings.look = 'Standard', 'None'
sc.sequencer_colorspace_settings.name = 'sRGB'
se = sc.sequence_editor_create()

prueba = se.strips.new_movie(name='prueba', filepath=op['--entrada'], channel=1, frame_start=1)
fps = prueba.elements[0].orig_fps or prueba.fps
se.strips.remove(prueba)
sc.render.fps = max(1, round(fps))
sc.render.fps_base = round(fps) / fps
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = int(op['--ancho']), int(op['--alto']), 100

video = se.strips.new_movie(name='video', filepath=op['--entrada'], channel=1, frame_start=1, fit_method='FIT')
video.transform.filter = 'BILINEAR'
sonido = se.strips.new_sound(name='sonido', filepath=op['--entrada'], channel=2, frame_start=1)
n = video.right_handle - video.left_handle
sc.frame_start, sc.frame_end = 1, n

ims = sc.render.image_settings
ims.media_type, ims.file_format, ims.color_mode = 'VIDEO', 'FFMPEG', 'RGB'
ff = sc.render.ffmpeg
ff.format, ff.codec = 'MPEG4', 'H264'
ff.constant_rate_factor, ff.custom_constant_rate_factor = 'CUSTOM', int(op.get('--crf', 27))
ff.ffmpeg_preset = 'GOOD'
ff.gopsize = max(1, round(fps) * 2)
ff.use_max_b_frames = False
ff.audio_codec, ff.audio_bitrate, ff.audio_channels, ff.audio_mixrate = 'AAC', int(op.get('--audio', 128)), 'STEREO', 48000
sc.render.filepath = op['--salida']
bpy.ops.render.render(animation=True)
print('VIDEO_WEB ' + json.dumps({'fotogramas': n, 'fps': fps, 'salida': op['--salida']}))
