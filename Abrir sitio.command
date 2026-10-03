#!/bin/bash
# Doble clic en Finder: enciende el servidor del sitio y lo abre en Safari.
# Mientras esta ventana de Terminal siga abierta, el sitio funciona en http://127.0.0.1:8770/
cd "$(dirname "$0")"
if ! curl -s -o /dev/null --max-time 2 http://127.0.0.1:8770/index.html; then
  python3 herramientas/servidor.py 8770 &
  sleep 1
fi
open -a Safari "http://127.0.0.1:8770/index.html"
echo ""
echo "Sitio abierto en Safari: http://127.0.0.1:8770/index.html"
echo "Deja esta ventana abierta mientras revisas el sitio. Para apagarlo, ciérrala."
wait
