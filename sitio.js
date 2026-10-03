// Feria Maker UNOi 2027 · menú plegable, sección activa en el menú y aviso de enlaces pendientes.
(() => {
  const nav = document.getElementById('nav');
  const boton = nav.querySelector('.nav-boton');
  const enlaces = [...nav.querySelectorAll('a[href^="#"]')];

  // Menú plegable (pantallas angostas): abre y cierra; se cierra al elegir una sección, con Esc o al tocar fuera.
  const cerrar = () => { nav.classList.remove('abierto'); boton.setAttribute('aria-expanded', 'false'); };
  boton.addEventListener('click', () => {
    const abierto = nav.classList.toggle('abierto');
    boton.setAttribute('aria-expanded', String(abierto));
  });
  enlaces.forEach((a) => a.addEventListener('click', cerrar));
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !nav.classList.contains('abierto')) return;
    if (nav.contains(document.activeElement)) boton.focus(); // el foco no se pierde al ocultar la lista
    cerrar();
  });
  document.addEventListener('click', (e) => { if (!nav.contains(e.target)) cerrar(); });
  nav.addEventListener('focusout', (e) => { if (!nav.contains(e.relatedTarget)) cerrar(); }); // salir con Tab lo cierra

  // Marca en el menú la sección que se está leyendo.
  if ('IntersectionObserver' in window) {
    // «Inicio» no se marca: así el menú arriba se ve igual que en el diseño.
    const porId = new Map(enlaces.map((a) => [a.getAttribute('href').slice(1), a]).filter(([id]) => id !== 'inicio'));
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        enlaces.forEach((a) => a.removeAttribute('aria-current'));
        const a = porId.get(e.target.id);
        if (a) a.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    porId.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  // Enlaces y botones que todavía no tienen su liga (formularios, video, avisos de privacidad): avisan en lugar de saltar.
  // El aviso vive siempre en la página (vacío no se ve), así los lectores de pantalla lo anuncian.
  const aviso = document.querySelector('.aviso-pendiente');
  let temporizador;
  document.querySelectorAll('[data-pendiente]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      aviso.textContent = `Aquí irá ${el.dataset.pendiente}. Lo agregamos en cuanto lo tengamos.`;
      clearTimeout(temporizador);
      temporizador = setTimeout(() => { aviso.textContent = ''; }, 4500);
    });
  });

  // «Revive los mejores momentos de la edición pasada»: abre el video en una ventana y lo empieza a reproducir.
  // Se cierra con la ×, con Esc o con un clic fuera del video; al cerrar se pausa y el foco regresa al botón.
  const modal = document.getElementById('modal-video');
  const abreVideo = document.querySelector('[aria-controls="modal-video"]');
  if (modal && abreVideo && typeof modal.showModal === 'function') {
    const video = modal.querySelector('video');
    abreVideo.addEventListener('click', (e) => {
      e.preventDefault();
      modal.showModal();
      const p = video.play(); if (p) p.catch(() => {});
    });
    modal.querySelector('.modal-cerrar').addEventListener('click', () => modal.close());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });
    modal.addEventListener('close', () => { video.pause(); abreVideo.focus(); });
  }

  // Franja de categorías: se puede pausar (y reanudar) con su botón.
  const franja = document.querySelector('.franja');
  const pausa = franja && franja.querySelector('.franja-pausa');
  if (pausa) {
    const etiqueta = pausa.querySelector('.sr');
    pausa.addEventListener('click', () => {
      const pausada = franja.classList.toggle('pausada');
      pausa.setAttribute('aria-pressed', String(pausada));
      etiqueta.textContent = pausada ? 'Reanudar el movimiento de las categorías' : 'Pausar el movimiento de las categorías';
    });
  }

  // Cuenta regresiva de la portada: primero al Kick Off y, cuando pasa, a la Feria.
  // Horas del centro de México (UTC−6 todo el año, sin horario de verano).
  const cuenta = document.querySelector('.cuenta');
  if (cuenta) {
    const METAS = [
      { cuando: Date.parse('2026-10-15T17:00:00-06:00'), titulo: 'Faltan para el <strong>Kick Off</strong>', fecha: '15 de octubre · 17:00 h (Tiempo del Centro)' },
      { cuando: Date.parse('2027-04-24T10:00:00-06:00'), titulo: 'Faltan para la <strong>Feria Maker</strong>', fecha: '24 de abril de 2027 · 10:00 h (Tiempo del Centro)' },
    ];
    const CIERRE = Date.parse('2027-04-24T18:00:00-06:00');
    const titulo = cuenta.querySelector('.cuenta-titulo');
    const fecha = cuenta.querySelector('.cuenta-fecha');
    const cifras = [...cuenta.querySelectorAll('.cuenta-num')];
    const lector = document.createElement('p');
    lector.className = 'sr';
    cuenta.insertBefore(lector, fecha);
    let meta = null;
    const dos = (n) => String(n).padStart(2, '0');
    const latir = () => {
      const ahora = Date.now();
      if (ahora >= CIERRE) { cuenta.hidden = true; return; }
      const siguiente = METAS.find((m) => ahora < m.cuando);
      if (!siguiente) {
        // El mismo día de la Feria, de 10 a 18 h.
        if (meta !== 'hoy') {
          meta = 'hoy';
          cuenta.classList.add('hoy');
          titulo.innerHTML = '¡Hoy es la <strong>Feria Maker UNOi 2027</strong>!';
          fecha.textContent = 'De 10:00 a 18:00 h · Tecnológico de Monterrey, Ciudad de México';
        }
      } else {
        if (meta !== siguiente) {
          meta = siguiente;
          titulo.innerHTML = siguiente.titulo;
          fecha.textContent = siguiente.fecha;
        }
        const s = Math.max(0, Math.floor((siguiente.cuando - ahora) / 1000));
        const valores = [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
        valores.forEach((v, i) => {
          const texto = i === 0 ? String(v) : dos(v);
          const el = cifras[i];
          if (el.textContent === texto) return;
          el.textContent = texto;
          el.classList.remove('cambia');
          void el.offsetWidth; // reinicia el pequeño deslizamiento
          el.classList.add('cambia');
        });
        // Para lectores de pantalla, un resumen que cambia cada hora (los números de cada segundo no se anuncian).
        const resumen = `Faltan ${valores[0]} días y ${valores[1]} horas.`;
        if (lector.textContent !== resumen) lector.textContent = resumen;
      }
      cuenta.hidden = false;
      setTimeout(latir, 1000 - (Date.now() % 1000) + 20);
    };
    latir();
  }
})();
