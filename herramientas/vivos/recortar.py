"""Quita el fondo azul de los íconos animados y los deja como WebP animado con transparencia,
con el mismo encuadre que el ícono fijo de la página. Lo que no se mueve queda idéntico al original."""
import sys, os, glob
import numpy as np
from PIL import Image, ImageFilter
SITIO = "/Users/bperezm/Documents/Aplicaciones/FeriaMakerV2/sitio-2027"
V = os.path.dirname(os.path.abspath(__file__))
AZUL = (16, 52, 230)
MARGEN = 0.08  # por lado: lo que se mueve hacia la orilla no se corta
MAGENTA = (224, 20, 200)
# clip: (ícono original, fracción del cuadro, color de fondo, imágenes de la página que usan ese clip)
ICONOS = {
    "impresora": ("ICONO_16", 0.62, AZUL, ["area-talleres"]),
    "avion": ("ICONO_7", 0.66, AZUL, ["paso-07"]),
    "cerebro": ("ICONO_24", 0.62, AZUL, ["cat-conexiones"]),
}
if os.path.exists(f"{V}/clips.json"):
    import json
    for n, (ic, frac, fondo) in json.load(open(f"{V}/clips.json")).items():
        ICONOS[n] = (ic, frac, tuple(fondo), [n])
    ICONOS["area-conferencias"][3].append("paso-09")
    ICONOS["area-exposicion"][3].append("paso-10")
def suaviza(m, r):
    return np.asarray(Image.fromarray((np.clip(m, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r)), float) / 255

def procesa(nombre, fps=15, calidad=74):
    icono, frac, fondo_clave, destinos = ICONOS[nombre]
    K = np.array(fondo_clave, float)
    es_azul = fondo_clave == AZUL
    ico = Image.open(f"{SITIO}/insumos/cliente/{icono}@4x-8.png").convert("RGBA")
    bb = ico.getchannel("A").getbbox()
    L = 720; k = frac * 1080 / max(bb[2] - bb[0], bb[3] - bb[1]); s = L / 1080
    w, h = round((bb[2] - bb[0]) * k), round((bb[3] - bb[1]) * k)
    ox, oy = (1080 - w) // 2, (1080 - h) // 2
    # caja del ícono completo (con su margen transparente) en coordenadas del cuadro de 720
    caja = ((ox - bb[0] * k) * s, (oy - bb[1] * k) * s, (ox - bb[0] * k + ico.width * k) * s, (oy - bb[1] * k + ico.height * k) * s)
    cw, ch = caja[2] - caja[0], caja[3] - caja[1]
    caja = (caja[0] - MARGEN * cw, caja[1] - MARGEN * ch, caja[2] + MARGEN * cw, caja[3] + MARGEN * ch)
    # referencia exacta: el ícono original sobre el azul, al tamaño del cuadro, y su alfa
    rec = ico.crop(bb).resize((w, h), Image.LANCZOS)
    lienzo = Image.new("RGBA", (1080, 1080), (0, 0, 0, 0)); lienzo.alpha_composite(rec, (ox, oy))
    lienzo = lienzo.resize((L, L), Image.LANCZOS)
    ref_a = np.asarray(lienzo.getchannel("A"), float) / 255
    ref_rgba = np.asarray(lienzo.convert("RGBa").resize((L, L)), float)  # premultiplicado
    ref_c = np.where(ref_a[..., None] > 0.001, ref_rgba[..., :3] / np.maximum(ref_a[..., None], 1e-3), 0)
    ref_sobre_azul = ref_c * ref_a[..., None] + K * (1 - ref_a[..., None])
    cerca = (Image.fromarray(((ref_a > 0.3) * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(25)).filter(ImageFilter.GaussianBlur(5)))
    cerca = np.asarray(cerca, float) / 255
    rutas = sorted(glob.glob(f"{V}/cuadros/{nombre}/c_*.png"))
    cuadros = [np.asarray(Image.open(r).convert("RGB"), float) for r in rutas]
    # el último cuadro repite al primero (inicio = final): fuera
    print(nombre, "primero vs último", round(np.abs(cuadros[0] - cuadros[-1]).mean(), 2))
    cuadros = cuadros[:-1]
    # de 24 a fps cuadros por segundo (el movimiento es suave: no se nota y pesa mucho menos)
    cuadros = [cuadros[int(i)] for i in np.round(np.arange(0, len(cuadros) - 0.5, 24 / fps))]
    # corrección de color: el cuadro 0 debe verse igual que la referencia
    X = np.c_[cuadros[0].reshape(-1, 3), np.ones(L * L)]
    M, *_ = np.linalg.lstsq(X, ref_sobre_azul.reshape(-1, 3), rcond=None)
    print(" error tras corregir", round(np.abs(X @ M - ref_sobre_azul.reshape(-1, 3)).mean(), 2))
    salida = []
    for f in cuadros:
        f = np.clip((np.c_[f.reshape(-1, 3), np.ones(L * L)] @ M).reshape(L, L, 3), 0, 255)
        # lo que casi no cambió respecto al original se queda exactamente como el original
        dif = np.abs(f - ref_sobre_azul).max(-1)
        quieto = 1 - np.clip((suaviza(dif / 255, 1.5) * 255 - 9) / 9, 0, 1)
        # recorte del azul (lo que se mueve)
        if es_azul:
            d = f[..., 2] - np.maximum(f[..., 0], f[..., 1])
        else:  # magenta: para íconos con azul propio (las ventanas del hotel)
            d = np.minimum(f[..., 0], f[..., 2]) - f[..., 1]
        a = np.clip((150 - d) / 95, 0, 1)
        a = np.where(a < 0.04, 0, a)
        c = (f - (1 - a[..., None]) * K) / np.maximum(a[..., None], 0.05)
        c = np.clip(c, 0, 255)
        # restos del fondo (chispas sobre el color de fondo): en estos íconos no hay morados
        morado = np.minimum(c[..., 0], c[..., 2]) - c[..., 1]
        a = a * np.clip(1 - (morado - 6) / 26, 0, 1)
        if es_azul:
            azulado = c[..., 2] - np.maximum(c[..., 0], c[..., 1])
            a = a * np.clip(1 - (azulado - 14) / 30, 0, 1)
            c[..., 2] = np.minimum(c[..., 2], np.maximum(c[..., 0], c[..., 1]) + 12)  # sin reflejo azul
        else:
            exceso = np.clip(np.minimum(c[..., 0], c[..., 2]) - (c[..., 1] + 12), 0, None)
            c[..., 0] -= exceso; c[..., 2] -= exceso  # sin reflejo magenta
        a = a * (cerca + (1 - cerca) * np.clip((a - 0.45) / 0.25, 0, 1))
        A = quieto * ref_a + (1 - quieto) * a
        C = np.where(A[..., None] > 0.001, (quieto[..., None] * ref_a[..., None] * ref_c + (1 - quieto[..., None]) * a[..., None] * c) / np.maximum(A[..., None], 1e-3), 0)
        im = Image.fromarray(np.dstack([C, A * 255]).round().clip(0, 255).astype(np.uint8))
        salida.append(im.convert("RGBa").crop(tuple(round(v) for v in caja)))
    os.makedirs(f"{SITIO}/img/vivo", exist_ok=True)
    for destino in destinos:
        t0 = Image.open(f"{SITIO}/img/{destino}.webp").size
        tam = (round(t0[0] * (1 + 2 * MARGEN)), round(t0[1] * (1 + 2 * MARGEN)))
        cuadros_d = [c.resize(tam, Image.LANCZOS).convert("RGBA") for c in salida]
        ruta = f"{SITIO}/img/vivo/{destino}.webp"
        cuadros_d[0].save(ruta, "WEBP", save_all=True, append_images=cuadros_d[1:], duration=round(1000 / fps), loop=0,
                          quality=calidad, alpha_quality=90, method=6, minimize_size=True, allow_mixed=True)
        print(" ->", destino, tam, len(cuadros_d), "cuadros", round(os.path.getsize(ruta) / 1e6, 2), "MB")
        fondo = {"area": (235, 251, 217), "paso": (255, 255, 255), "cat": (209, 210, 211)}[destino.split("-")[0]]
        hoja = Image.new("RGB", (tam[0] * 6, tam[1]), fondo)
        for i, j in enumerate(np.linspace(0, len(cuadros_d) - 1, 6).astype(int)):
            t = Image.new("RGBA", tam, fondo + (255,)); t.alpha_composite(cuadros_d[j]); hoja.paste(t.convert("RGB"), (i * tam[0], 0))
        hoja.save(f"{V}/vista-{destino}.jpg", quality=88)
for n in sys.argv[1:]:
    procesa(n)
