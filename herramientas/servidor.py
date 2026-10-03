"""Servidor local para ver el sitio, con soporte de rangos (Range) para que Safari reproduzca los videos.

python3 herramientas/servidor.py [puerto]   (desde sitio-2027/; por defecto 8770, solo en 127.0.0.1)
"""
import os
import re
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class ConRangos(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=RAIZ, **k)

    def end_headers(self):
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def send_head(self):
        rango = self.headers.get('Range')
        ruta = self.translate_path(self.path)
        if not rango or not os.path.isfile(ruta):
            return super().send_head()
        m = re.match(r'bytes=(\d*)-(\d*)', rango)
        tam = os.path.getsize(ruta)
        if not m:
            return super().send_head()
        ini = int(m.group(1)) if m.group(1) else max(0, tam - int(m.group(2) or 0))
        fin = int(m.group(2)) if m.group(1) and m.group(2) else tam - 1
        if ini >= tam:
            self.send_error(416, 'Rango fuera del archivo')
            return None
        fin = min(fin, tam - 1)
        f = open(ruta, 'rb')
        f.seek(ini)
        self.send_response(206)
        self.send_header('Content-Type', self.guess_type(ruta))
        self.send_header('Content-Range', f'bytes {ini}-{fin}/{tam}')
        self.send_header('Content-Length', str(fin - ini + 1))
        self.end_headers()
        self._restante = fin - ini + 1
        return f

    def copyfile(self, source, outputfile):
        restante = getattr(self, '_restante', None)
        if restante is None:
            return super().copyfile(source, outputfile)
        while restante > 0:
            trozo = source.read(min(65536, restante))
            if not trozo:
                break
            outputfile.write(trozo)
            restante -= len(trozo)
        self._restante = None

    def log_message(self, *a):
        pass


if __name__ == '__main__':
    puerto = int(sys.argv[1]) if len(sys.argv) > 1 else 8770
    print(f'Sirviendo {RAIZ} en http://127.0.0.1:{puerto}/index.html')
    ThreadingHTTPServer(('127.0.0.1', puerto), ConRangos).serve_forever()
