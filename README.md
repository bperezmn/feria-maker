# Feria Maker UNOi 2027 · sitio informativo

Sitio estático (HTML + CSS + un poco de JS), fiel al diseño `landing_maker 1.pdf` (1920 px) y adaptado a celular.

- `index.html` · contenido completo, en el orden del diseño.
- `estilos.css` · diseño; las medidas del PDF escalan con `clamp()`.
- `sitio.js` · menú plegable, sección activa, aviso de enlaces pendientes y ventana del video.
- `img/` · imágenes sacadas del PDF (fondo de plano, logo de portada con transparencia, íconos 3D) en WebP. La foto de la sede (`img/sede-tec*.webp`) sale de `insumos/cliente/FOTO_TEC_CCM.jpg`.
- `insumos/` · originales extraídos del PDF (`insumos/pdf/`, con `posiciones.json`) y los insumos del cliente (`insumos/cliente/`: logo, fondo, 24 íconos y 4 botones, en PNG 4x).
- `video/memoria-2026.mp4` · video memoria 2026 comprimido para la web (720p, H.264 + AAC) con `herramientas/comprimir_video.py` (Blender). El original pesa 388 MB. Se abre en una ventana (`<dialog>`) desde el botón de la portada; su portada es `img/video-portada.webp`.
- Las imágenes de `img/` salen de los insumos del cliente: logo (LOGO_MAKER), fondo (FONDO_MAKER), íconos 1-13 calendario, 14-16 áreas, 17-24 categorías.
- Los botones del cliente (BOTON_1-4) se hicieron en HTML con el mismo texto y forma (no como imagen): así se leen nítidos, se adaptan al celular y los lectores de pantalla los entienden.

Formularios de Google (se abren en otra pestaña): registro de visitantes (Mecánica, tarjeta 1) https://forms.gle/6UDmHjvu25Tv6WfJ6;
registro de proyectos (Bases, paso 3) https://forms.gle/rQUYWWpw6s9PaGNcA.

Ver en local: abrir `index.html` en el navegador (las letras vienen de Google Fonts, necesita internet).
`.nojekyll` evita que GitHub Pages procese el sitio con Jekyll: se publica tal cual.

## Pendientes (insumos)
Si algún enlace se queda sin liga, ponle `data-pendiente="…"` y, al hacer clic, avisa en lugar de saltar (`sitio.js`). Hoy ninguno lo usa.
- Letra Objectivity: poner los `.woff2` en `fuentes/` y activar los `@font-face` al inicio de `estilos.css` (mientras, Lexend).

## Correcciones respecto al PDF
«del año», «Prototipo», texto repetido en Interdisciplinariedad, «Maker UNOi.» suelto en los pasos 7 y 8, «toda la comunidad» en el paso 9,
«Conexiones» agregada a la franja de categorías, menú en el orden de la página (con Áreas), botón «Inscribe tu proyecto» dentro del paso 3,
la franja lima vacía entre Calendario y Áreas quedó como raya delgada, y el botón «Cómo llegar» abre Google Maps con la dirección de la sede.
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
  «por ejemplo:» en lugar de «p. ej.:» en los tres bloques; bloque iii «…el problema, y explica cómo funciona».

Tercera tabla (filas 26-33):
- Bases, bloque iii: «(por ejemplo: Desarrollaremos…)» (ya estaba).
- Sede: «Tecnológico de Monterrey, campus Ciudad de México» (también en la descripción de la página y en el texto alternativo del mapa); etiqueta del mapa «Aquí será la Feria».
- Pie: «Feria Maker UNOi · 24 de abril de 2027» y enlace «Aviso de privacidad» (también el título de esa página).
- Mecánica: todos los textos de las tarjetas con el mismo tamaño (`.forma, .nota` en `estilos.css`); los botones conservan el tamaño de los demás botones del sitio.
- Sede (fila 32): la foto del Tec (`insumos/cliente/FOTO_TEC_CCM.jpg`) va en lugar del mapa, así que ya no hay pin ni etiqueta «Aquí será la Feria». «Cómo llegar» abre Google Maps con el nombre y la dirección del recinto.
- Asiste (fila 33): la foto que envió Vero (`insumos/cliente/FOTO_VERO_FERIA.jpg` → `img/asiste-feria*.webp`) va en lugar del video.
  El video ahora se abre en una ventana desde el botón «Revive los mejores momentos de la edición pasada.»: empieza a reproducirse solo,
  se cierra con la ×, con Esc o con un clic fuera, y al cerrar se pausa. Sin JS, el botón abre el archivo de video.

Calendario, paso 4: «a más tardar el 15 de enero de 2027 a las 23:59 h» (coincide con el cierre de registro del contador).
Calendario, paso 10: el montaje de los stands el 23 de abril empieza a las **16:00 h** (antes 18:15 h).
Cuarta ronda (6 oct): paso 4 con «(Tiempo del Centro)» tras las 23:59 h; Mecánica, forma 2: «…por un proyecto de primaria alta, secundaria o híbrido (primaria alta y secundaria). El equipo deberá estar integrado por un máximo de 4 estudiantes participantes, 1 docente y 1 Maker Xpert.»; paso 8: hotel Fiesta Inn Periférico Sur con su dirección (ya no «por confirmar»); Bases, inciso b: «…que impacte a tu comunidad y que quieras solucionar».
Sede: la foto del Tec ahora es un carrusel de dos fotos; la segunda es el jardín del campus con la carpa de la Feria (`insumos/cliente/FOTO_SEDE_JARDIN.webp` → `img/sede-jardin*.webp`). Se desliza con el dedo, con las flechas, con los puntos y con las flechas del teclado, y da la vuelta al llegar al final. No cambia sola. Para agregar otra foto: un `.carrusel-slide` más en `index.html` y un punto más en `.carrusel-puntos`.

## Efectos agregados (2 oct 2026)
- **Intro**: el globo del logo (`img/intro-trazo.webp`, sacado de LOGO_MAKER) se dibuja y se abre la página. Solo la primera visita; para verla otra vez: `index.html?intro`.
- **Cuenta regresiva** bajo el botón de la portada (`sitio.js`): al cierre de registro (15 ene 2027, 23:59 h) y después a la Feria (24 abr 2027, 10 h), hora del centro (UTC−6). No cuenta al Kick Off porque la página se publica ese día (15 oct 2026). Las metas están en `METAS`, en `sitio.js`. Ese día dice «¡Hoy es la Feria Maker!» y a las 18 h desaparece.
- ~~Pin en el mapa~~: se quitó con el mapa (3 oct 2026), ahora hay una foto del Tec.
- **Logo vivo**: `video/logo-luz-960.mp4` / `-540.mp4` es solo la luz (negro = nada) de un clip de Higgsfield (Kling 3.0); se mezcla «en pantalla» sobre el logo real, así el logo nunca cambia.
- **Íconos vivos** (`img/vivo/*.webp`): clips de Higgsfield con el ícono sobre azul (inicio = final), recortados a WebP animado con transparencia y el mismo encuadre que el ícono fijo. Se mueven todo el tiempo mientras están en pantalla (fuera de pantalla vuelven al ícono fijo). Son los 24 íconos de pasos, áreas y categorías (los pasos 9 y 10 usan el mismo clip que las áreas de conferencias y exposición). Cada animación trae 8 % de margen transparente por lado para que nada se corte al moverse; `img.vivo { transform: scale(1.16) }` en `efectos.css` la deja del tamaño del ícono fijo. El hotel (paso 8) se generó sobre magenta porque tiene ventanas azules.
- Herramientas en `herramientas/vivos/`: `a_cuadros.py` (video → cuadros, con Blender), `recortar.py` (quita el azul y arma el WebP), `luz_logo.py` + `a_video.py` (luz del logo → MP4).
