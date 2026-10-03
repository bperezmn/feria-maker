"""Del video del logo se queda solo la luz que se mueve (lo que se ilumina respecto al primer cuadro),
como WebP animado transparente que va encima del logo real: las letras y el logo nunca cambian."""
import glob, os
import numpy as np
from PIL import Image, ImageFilter
SITIO = "/Users/bperezm/Documents/Aplicaciones/FeriaMakerV2/sitio-2027"
V = os.path.dirname(os.path.abspath(__file__))
logo = Image.open(f"{SITIO}/insumos/cliente/LOGO_MAKER@4x-8.png").convert("RGBA")
print("bbox alfa del logo", logo.getchannel("A").getbbox(), logo.size)
rutas = sorted(glob.glob(f"{V}/cuadros/logo/c_*.png"))
cuadros = [np.asarray(Image.open(r).convert("RGB"), float) for r in rutas]
print("primero vs último", round(np.abs(cuadros[0] - cuadros[-1]).mean(), 2), len(cuadros))
cuadros = cuadros[:-1]
base = np.asarray(Image.fromarray(cuadros[0].astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2)), float)
N = cuadros[0].shape[0]
yy, xx = np.mgrid[0:N, 0:N]
r = np.hypot(xx - N / 2, yy - N / 2) / (N / 2)
borde = np.clip((1.0 - r) / 0.1, 0, 1)  # se desvanece antes de la orilla del cuadro
def capa(f, lado):
    f = np.asarray(Image.fromarray(f.astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2)), float)
    luz = np.clip(f - base - 6, 0, 255) * 1.15
    a = np.clip(luz.max(-1) / 255, 0, 1) * borde
    c = np.where(a[..., None] > 0.002, np.clip(luz / np.maximum(luz.max(-1, keepdims=True), 1) * 255, 0, 255), 0)
    im = Image.fromarray(np.dstack([c, a * 255]).round().astype(np.uint8), "RGBA")
    return im.convert("RGBa").resize((lado, lado), Image.LANCZOS).convert("RGBA")
def luz_rgb(f):
    f = np.asarray(Image.fromarray(f.astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2)), float)
    luz = np.clip(f - base - 7, 0, 255) * 1.1 * borde[..., None]
    return Image.fromarray(np.clip(luz, 0, 255).round().astype(np.uint8))
os.makedirs(f"{V}/luz", exist_ok=True)
for k, f in enumerate(cuadros):
    luz_rgb(f).save(f"{V}/luz/l_{k:04d}.png", compress_level=1)
print("cuadros de luz", len(cuadros))
