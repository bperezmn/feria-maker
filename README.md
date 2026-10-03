# Feria Maker UNOi 2027 · sitio informativo

Sitio estático (HTML + CSS + un poco de JS), fiel al diseño `landing_maker 1.pdf` (1920 px) y adaptado a celular.

- `index.html` · contenido completo, en el orden del diseño.
- `estilos.css` · diseño; las medidas del PDF escalan con `clamp()`.
- `sitio.js` · menú plegable, sección activa y aviso de enlaces pendientes.
- `img/` · imágenes sacadas del PDF (fondo de plano, logo de portada con transparencia, íconos 3D, mapa) en WebP.
- `insumos/` · originales extraídos del PDF (`insumos/pdf/`, con `posiciones.json`) y los insumos del cliente (`insumos/cliente/`: logo, fondo, 24 íconos y 4 botones, en PNG 4x).
- `video/memoria-2026.mp4` · video memoria 2026 comprimido para la web (720p, H.264 + AAC) con `herramientas/comprimir_video.py` (Blender). El original pesa 388 MB.
- Las imágenes de `img/` salen de los insumos del cliente: logo (LOGO_MAKER), fondo (FONDO_MAKER), íconos 1-13 calendario, 14-16 áreas, 17-24 categorías.
- Los botones del cliente (BOTON_1-4) se hicieron en HTML con el mismo texto y forma (no como imagen): así se leen nítidos, se adaptan al celular y los lectores de pantalla los entienden.

Ver en local: abrir `index.html` en el navegador (las letras vienen de Google Fonts, necesita internet).

## Pendientes (insumos)
Los enlaces sin liga llevan `data-pendiente` y, al hacer clic, avisan en lugar de saltar.
- Liga del registro de visitantes (Mecánica, tarjeta 1).
- Liga del formulario de registro de proyectos (Bases, paso 3).
- Nombre del hotel con tarifa preferencial (Calendario, paso 8: dice «Hotel (por confirmar)»).
- Letra Objectivity: poner los `.woff2` en `fuentes/` y activar los `@font-face` al inicio de `estilos.css` (mientras, Lexend).

## Correcciones respecto al PDF
«del año», «Prototipo», texto repetido en Interdisciplinariedad, «Maker UNOi.» suelto en los pasos 7 y 8, «toda la comunidad» en el paso 9,
«Conexiones» agregada a la franja de categorías, menú en el orden de la página (con Áreas), botón «Inscribe tu proyecto» dentro del paso 3,
la franja lima vacía entre Calendario y Áreas quedó como raya delgada, y el mapa abre Google Maps (más un botón «Cómo llegar»).
También: «Make Something Better» con mayúscula en el título de la categoría, igual que en la franja; «p. ej.:» con punto en los tres ejemplos del paso 2.

## Accesibilidad (cambios de diseño a propósito)
- Texto verde oscuro (no blanco) sobre el verde lima: botones, fichas 1 y 2, y la tarjeta del Kick off. El blanco sobre lima tiene contraste 2.1:1 y no se lee bien.
- Los enlaces del menú usan un lima un poco más claro (#94d14e) para llegar a 5:1 sobre el verde del menú.
- La franja de categorías se mueve despacio, se puede pausar con su botón y se queda quieta si el sistema pide menos movimiento.


## Textos (documento «TEXTOS LANDING PAGE FERIA MAKER UNOi 2027.docx», 1 oct 2026)
Se aplicó: 120 espacios en el Área de exposición; «Feria Maker UNOi 2027» en el paso 11; «se publicará próximamente»;
«(Tiempo del Centro)» en los pasos 1 y 6; dirección sin «, CDMX»; «Make something Better» (franja y categoría);
«reciclados, reutilizados, reimaginados» en 100 % Maker.
No se copió (errores del documento): «Pototipo» → Prototipo; «Conceptualizar» → Conceptualiza (como Escribe e Inscribe);
«concurso: no obstante» → «concurso; no obstante»; «sencillo, guíate» → «sencillo; guíate»; «p. ej:» → «p. ej.:»;
«Te esperamos!» → «¡Te esperamos!»; se conservaron los puntos finales que faltan en el documento (pasos 3 y 10, bases, Creatividad).

## Correcciones de textos (3 oct 2026)
Tabla de cambios del cliente, aplicada tal cual:
- Portada: «¡Participa en la quinta edición!» y botón «Revive los mejores momentos de la edición pasada.» (cortado en «momentos / de la edición pasada» para que quepa en el botón).
- Franja verde: «Identidad» → «Agenda de futuro»; se quitó «Interdisciplinariedad» (sigue en Categorías); «Make something Better» → «Make it Better» (también en el título de la categoría).
- Asiste: se quitó el saludo «Querida directora, querido director:».
- Mecánica, forma 2: «Cada colegio podrá estar representado por un proyecto, ya sea de primaria alta o de secundaria.» y botón «Participa en la Expo: conoce las bases.»
- Mecánica, nota: «Fiel al espíritu…» y «convocatorias especiales con los proyectos…» (el resto igual); «(colegios afiliados, …)» con minúscula.
- Calendario: paso 1 «17:00 h»; paso 3 «elegir el proyecto».

Segunda tabla (filas 13-25):
- Calendario: paso 6 «El 11 de marzo a las 16:00 h (Tiempo del Centro), se llevará…»; paso 8 «Hotel (por confirmar)» (se dejó «Reserva antes del 16 de abril.»); paso 9 «conferencias y talleres, y podrá…».
- Áreas: «La lista definitiva de conferencistas…».
- Categorías: Creatividad «El proyecto destaca…»; 100 % Maker «reciclados, reutilizados o reimaginados por encima de las piezas compradas».
- Bases: «(4.º, 5.º y 6.º grados)»; «por un máximo de cuatro alumnos»; inciso b «relacionado con el tema que elegiste»; «formulario de registro»;
  «por ejemplo:» en lugar de «p. ej.:» en los tres bloques (el iii no venía completo en la tabla; se cambió igual para que coincida); bloque iii «…el problema, y explica cómo funciona».

## Efectos agregados (2 oct 2026)
- **Intro**: el globo del logo (`img/intro-trazo.webp`, sacado de LOGO_MAKER) se dibuja y se abre la página. Solo la primera visita; para verla otra vez: `index.html?intro`.
- **Cuenta regresiva** bajo el botón de la portada (`sitio.js`): al Kick Off (15 oct 2026, 17 h) y luego a la Feria (24 abr 2027, 10 h), hora del centro (UTC−6). Ese día dice «¡Hoy es la Feria Maker!» y a las 18 h desaparece.
- **Pin en el mapa** sobre el marcador A (sede) con la etiqueta «Aquí es la Feria».
- **Logo vivo**: `video/logo-luz-960.mp4` / `-540.mp4` es solo la luz (negro = nada) de un clip de Higgsfield (Kling 3.0); se mezcla «en pantalla» sobre el logo real, así el logo nunca cambia.
- **Íconos vivos** (`img/vivo/*.webp`): clips de Higgsfield con el ícono sobre azul (inicio = final), recortados a WebP animado con transparencia y el mismo encuadre que el ícono fijo. Se mueven todo el tiempo mientras están en pantalla (fuera de pantalla vuelven al ícono fijo). Son los 24 íconos de pasos, áreas y categorías (los pasos 9 y 10 usan el mismo clip que las áreas de conferencias y exposición). Cada animación trae 8 % de margen transparente por lado para que nada se corte al moverse; `img.vivo { transform: scale(1.16) }` en `efectos.css` la deja del tamaño del ícono fijo. El hotel (paso 8) se generó sobre magenta porque tiene ventanas azules.
- Herramientas en `herramientas/vivos/`: `a_cuadros.py` (video → cuadros, con Blender), `recortar.py` (quita el azul y arma el WebP), `luz_logo.py` + `a_video.py` (luz del logo → MP4).
