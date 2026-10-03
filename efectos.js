// Feria Maker UNOi 2027 · efectos: intro del logo, portada que se enciende, aparecer al bajar, línea del calendario,
// tarjetas 3D al pasar el mouse, íconos y logo vivos, profundidad del plano, linterna, menú de vidrio y barra de avance.
// Nada cambia de lugar: solo cómo entra y reacciona. Con «reducir movimiento» no corre nada.
(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const conMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const portada = document.querySelector('.portada');
  const logo = document.querySelector('.portada-logo');
  const nav = document.getElementById('nav');
  const oscuras = [...document.querySelectorAll('.plano')];
  const espera = (ms) => new Promise((r) => setTimeout(r, ms));

  // ---------- 0. Intro: el globo del logo se dibuja y se abre la página (solo si el <head> puso html.intro) ----------
  const html = document.documentElement;
  const introLista = new Promise((terminada) => {
    if (!html.classList.contains('intro')) { terminada(); return; }
    try { localStorage.setItem('fm-intro', '1'); } catch (e) { /* sin almacenamiento: se vuelve a ver la próxima vez */ }
    const capa = document.querySelector('.capa-intro');
    // El trazo va exacto sobre el logo (se mide sin la animación de entrada, que lo encoge un poco).
    const caja = logo.offsetParent.getBoundingClientRect();
    capa.style.setProperty('--ix', `${caja.left + logo.offsetLeft}px`);
    capa.style.setProperty('--iy', `${caja.top + logo.offsetTop}px`);
    capa.style.setProperty('--iw', `${logo.offsetWidth}px`);
    let cerrada = false;
    const abrir = () => {
      if (cerrada) return;
      cerrada = true;
      html.classList.add('intro-fin');
      terminada();
      setTimeout(() => html.classList.remove('intro'), 900);
    };
    const trazo = new Image();
    trazo.src = 'img/intro-trazo.webp?v=1';
    const cargado = trazo.decode ? trazo.decode() : new Promise((r) => { trazo.onload = r; });
    Promise.race([cargado.catch(() => {}), espera(700)]).then(() => {
      capa.classList.add('lista');
      setTimeout(abrir, 1250);
    });
    // Quien no quiera esperar: clic, tecla, rueda o toque la quitan.
    ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((t) => window.addEventListener(t, abrir, { once: true, passive: true }));
  });

  // ---------- 1. Portada: halo detrás del logo y barrido de luz ----------
  const ponerHalo = () => {
    const p = portada.getBoundingClientRect();
    const l = logo.getBoundingClientRect();
    portada.style.setProperty('--halo-x', `${l.left - p.left - l.width * 0.06}px`);
    portada.style.setProperty('--halo-y', `${l.top - p.top - l.height * 0.06}px`);
    portada.style.setProperty('--halo-w', `${l.width * 1.12}px`);
    portada.style.setProperty('--halo-h', `${l.height * 1.12}px`);
  };

  const barrido = document.createElement('div');
  barrido.className = 'barrido';
  barrido.setAttribute('aria-hidden', 'true');
  barrido.appendChild(document.createElement('i'));
  portada.insertBefore(barrido, portada.firstChild);
  const medirBarrido = () => {
    const w = portada.clientWidth;
    barrido.style.setProperty('--sw', `${w}px`);
    barrido.style.setProperty('--bw', `${w * 0.34}px`);
  };
  let portadaVisible = true;
  const pasarLuz = (dur) => {
    if (!portadaVisible || document.hidden) return;
    barrido.style.setProperty('--dur', `${dur}s`);
    barrido.classList.remove('pasa');
    void barrido.offsetWidth; // reinicia la animación
    barrido.classList.add('pasa');
  };
  // La luz del plano pesa: se pide cuando la página ya cargó y el primer barrido sale en cuanto llega.
  const luzPortada = new Image();
  luzPortada.src = window.matchMedia('(max-width: 760px)').matches ? 'img/portada-luz-movil.webp?v=1' : 'img/portada-luz.webp?v=1';
  const primeraLuz = luzPortada.decode ? luzPortada.decode() : new Promise((r) => { luzPortada.onload = r; });
  Promise.all([primeraLuz.catch(() => {}), introLista]).then(() => espera(450)).then(() => {
    pasarLuz(3.4);
    setInterval(() => pasarLuz(4.2), 13000);
  });
  // Logo vivo: anillos de luz que pulsan alrededor del globo. Es un video de solo luz (negro = nada) que se mezcla
  // «en pantalla» encima del logo real: el logo y sus letras nunca cambian. Corre solo mientras se ve la portada.
  const luzLogo = document.createElement('video');
  luzLogo.className = 'logo-luz';
  luzLogo.muted = true;
  luzLogo.loop = true;
  luzLogo.playsInline = true;
  luzLogo.preload = 'auto';
  ['muted', 'playsinline', 'disablepictureinpicture'].forEach((a) => luzLogo.setAttribute(a, ''));
  luzLogo.setAttribute('aria-hidden', 'true');
  luzLogo.src = window.matchMedia('(max-width: 760px)').matches ? 'video/logo-luz-540.mp4?v=1' : 'video/logo-luz-960.mp4?v=1';
  portada.appendChild(luzLogo);
  const ponerLuzLogo = () => {
    // El cuadro del video es el logo con un margen alrededor (para que los anillos quepan).
    const c = logo.offsetParent;
    const x = c.offsetLeft + logo.offsetLeft - logo.offsetWidth * 0.06604;
    const y = c.offsetTop + logo.offsetTop - logo.offsetHeight * 0.05556;
    luzLogo.style.cssText = `left:${x.toFixed(1)}px;top:${y.toFixed(1)}px;width:${(logo.offsetWidth * 1.1321).toFixed(1)}px`;
  };
  let luzLista = false;
  const luzSegun = () => {
    if (!luzLista) return;
    if (portadaVisible && !document.hidden) { const r = luzLogo.play(); if (r) r.catch(() => {}); } else luzLogo.pause();
  };
  introLista.then(() => espera(1700)).then(() => {
    luzLista = true;
    luzLogo.classList.add('encendida');
    luzSegun();
  });
  document.addEventListener('visibilitychange', luzSegun);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { portadaVisible = e.isIntersecting; luzSegun(); }).observe(portada);
  }
  // Un destello cruza el botón cuando termina de entrar.
  const destello = (b, ms) => setTimeout(() => {
    b.classList.add('destello');
    setTimeout(() => b.classList.remove('destello'), 1100);
  }, ms);
  introLista.then(() => destello(portada.querySelector('.boton'), 2400));

  // ---------- 2. Aparecer al bajar ----------
  const SELECTORES = [
    '.asiste h2', '.asiste-texto > p', '.asiste-foto',
    '.mecanica h2', '.mecanica .bajada', '.mecanica-rejilla > *',
    '.calendario h2', '.paso',
    '.areas h2', '.area',
    '.categorias h2', '.cat',
    '.bases h2', '.bases-texto > p', '.etapa',
    '.sede-texto > *', '.sede-foto',
    '.pie > *',
  ];
  const INCLINAN = '.forma, .nota, .paso, .area, .etapa';
  const inclinar = (el) => { if (conMouse && el.matches(INCLINAN)) el.classList.add('inclina'); };
  const alto = window.innerHeight;
  const porRevelar = [];
  document.querySelectorAll(SELECTORES.join(',')).forEach((el) => {
    // Lo que ya se ve al cargar se queda como está (sin parpadeo).
    if (el.getBoundingClientRect().top < alto * 0.92) { inclinar(el); return; }
    const hermanos = [...el.parentElement.children].filter((h) => h.matches(SELECTORES.join(',')));
    const i = Math.max(0, hermanos.indexOf(el));
    // Escalonado: uno tras otro, pero los de filas más abajo no esperan de más.
    el.style.setProperty('--retraso', `${Math.min(i, 6) * 0.09}s`);
    el.classList.add('revelar');
    porRevelar.push(el);
  });
  const mostrar = (el) => {
    if (el.classList.contains('visible')) return;
    el.classList.add('visible');
    const retraso = parseFloat(el.style.getPropertyValue('--retraso')) * 1000 || 0;
    el.querySelectorAll('.boton').forEach((b) => destello(b, retraso + 900));
    // Ya que apareció, queda libre para el efecto del mouse.
    setTimeout(() => { el.classList.remove('revelar'); inclinar(el); }, retraso + 1300);
  };
  const revelado = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting && e.target.tagName !== 'H2') return;
      revelado.unobserve(e.target);
      mostrar(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  // Al llegar al final de la página aparece lo que falte (lo de hasta abajo nunca sube lo suficiente).
  const alFinal = () => {
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
      document.querySelectorAll('.revelar:not(.visible)').forEach(mostrar);
    }
  };
  // Un título escondido con clip-path mide cero para el observador: por él se vigila su contenedor.
  const vigilado = new Map();
  const vigia = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      vigia.unobserve(e.target);
      (vigilado.get(e.target) || []).forEach((el) => revelado.observe(el));
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  porRevelar.forEach((el) => {
    if (el.tagName !== 'H2') { revelado.observe(el); return; }
    const caja = el.parentElement;
    if (!vigilado.has(caja)) { vigilado.set(caja, []); vigia.observe(caja); }
    vigilado.get(caja).push(el);
  });

  // ---------- Calendario: la línea que une los pasos ----------
  const pasos = document.querySelector('.pasos');
  const tarjetasPaso = [...pasos.querySelectorAll('.paso')];
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.classList.add('ruta-pasos');
  svg.setAttribute('aria-hidden', 'true');
  const trazo = (clase) => { const p = document.createElementNS(NS, 'path'); p.setAttribute('class', clase); svg.appendChild(p); return p; };
  const base = trazo('ruta-base');
  const brillo = trazo('ruta-brillo');
  const lima = trazo('ruta-lima');
  pasos.insertBefore(svg, pasos.firstChild);
  let largo = 0;
  let marcas = []; // en qué fracción de la línea queda cada paso
  // Una línea con esquinas redondeadas entre los puntos.
  const conEsquinas = (pts, r) => {
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i - 1]; const [x1, y1] = pts[i]; const [x2, y2] = pts[i + 1];
      const a = Math.min(r, Math.hypot(x1 - x0, y1 - y0) / 2);
      const b = Math.min(r, Math.hypot(x2 - x1, y2 - y1) / 2);
      const ux = Math.sign(x1 - x0) * a; const uy = Math.sign(y1 - y0) * a;
      const vx = Math.sign(x2 - x1) * b; const vy = Math.sign(y2 - y1) * b;
      d += ` L${x1 - ux} ${y1 - uy} Q${x1} ${y1} ${x1 + vx} ${y1 + vy}`;
    }
    const [xn, yn] = pts[pts.length - 1];
    return `${d} L${xn} ${yn}`;
  };
  const trazarRuta = () => {
    const w = pasos.offsetWidth; const h = pasos.offsetHeight;
    svg.setAttribute('width', w); svg.setAttribute('height', h);
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    const c = tarjetasPaso.map((t) => [t.offsetLeft + t.offsetWidth / 2, t.offsetTop + t.offsetHeight / 2, t.offsetTop, t.offsetTop + t.offsetHeight]);
    const pts = [[c[0][0], c[0][1]]];
    const indices = [0];
    for (let i = 1; i < c.length; i++) {
      const a = c[i - 1]; const b = c[i];
      if (Math.abs(a[1] - b[1]) < 8) pts.push([b[0], b[1]]);
      else {
        const medio = (a[3] + b[2]) / 2; // en el hueco entre filas
        pts.push([a[0], medio], [b[0], medio], [b[0], b[1]]);
      }
      indices.push(pts.length - 1);
    }
    const d = conEsquinas(pts, 26);
    [base, brillo, lima].forEach((p) => p.setAttribute('d', d));
    largo = lima.getTotalLength();
    // Distancia hasta cada paso (por los puntos, sin contar el redondeo de las esquinas: casi igual).
    const acumulado = [0];
    for (let i = 1; i < pts.length; i++) acumulado.push(acumulado[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const total = acumulado[acumulado.length - 1] || 1;
    marcas = indices.map((k) => acumulado[k] / total);
    [brillo, lima].forEach((p) => { p.style.strokeDasharray = `${largo} ${largo}`; });
    avanceRuta();
  };
  const avanceRuta = () => {
    if (!largo) return;
    const r = pasos.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = Math.min(1, Math.max(0, (vh * 0.68 - r.top) / r.height));
    const corrido = largo * (1 - p);
    brillo.style.strokeDashoffset = corrido;
    lima.style.strokeDashoffset = corrido;
    tarjetasPaso.forEach((t, i) => t.classList.toggle('encendido', p > 0 && p >= marcas[i] - 0.001));
  };

  // ---------- 3. Tarjetas que se inclinan hacia el mouse ----------
  if (conMouse) {
    document.addEventListener('pointermove', (e) => {
      const t = e.target.closest && e.target.closest('.inclina');
      if (!t) return;
      const r = t.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      t.style.setProperty('--ry', `${((x - 0.5) * 7).toFixed(2)}deg`);
      t.style.setProperty('--rx', `${((0.5 - y) * 5).toFixed(2)}deg`);
      t.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
      t.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
      t.classList.add('sobre');
    }, { passive: true });
    document.addEventListener('pointerout', (e) => {
      const t = e.target.closest && e.target.closest('.inclina');
      if (!t || (e.relatedTarget && t.contains(e.relatedTarget))) return;
      t.classList.remove('sobre');
      ['--rx', '--ry'].forEach((v) => t.style.setProperty(v, '0deg'));
    }, { passive: true });
  }
  // Los íconos flotan cada uno a su ritmo.
  document.querySelectorAll('.paso img, .area img, .cat-circulo img').forEach((img, i) => {
    img.style.setProperty('--flota-retraso', `${(-i * 0.83) % 6}s`);
  });

  // Íconos vivos (Higgsfield): se mueven todo el tiempo mientras están en pantalla (y un poco antes de llegar).
  // Fuera de pantalla vuelven al ícono fijo para no gastar. La animación tiene el mismo encuadre que el ícono fijo
  // y su primer cuadro es igual a él: el cambio no se nota.
  document.querySelectorAll('.paso img, .area img, .cat-circulo img').forEach((img) => {
    const nombre = (img.getAttribute('src').match(/img\/([\w-]+)\.webp/) || [])[1];
    if (!nombre || !('IntersectionObserver' in window)) return;
    const fijo = img.getAttribute('src');
    const vivo = `img/vivo/${nombre}.webp?v=3`;
    let cargado = null;
    let cerca = false;
    const cargar = () => {
      if (!cargado) {
        const pre = new Image();
        pre.src = vivo;
        cargado = (pre.decode ? pre.decode() : new Promise((r, x) => { pre.onload = r; pre.onerror = x; })).then(() => true, () => false);
      }
      return cargado;
    };
    // La animación trae un margen transparente (para que nada se corte al moverse); .vivo lo compensa en CSS.
    new IntersectionObserver(([e]) => {
      cerca = e.isIntersecting;
      if (!cerca) { img.src = fijo; img.classList.remove('vivo'); return; }
      cargar().then((ok) => { if (ok && cerca) { img.src = vivo; img.classList.add('vivo'); } });
    }, { rootMargin: '200px 0px' }).observe(img);
  });

  // ---------- 4. Profundidad del plano y linterna ----------
  const linternas = [];
  if (conMouse) {
    oscuras.forEach((s) => {
      const l = document.createElement('div');
      l.className = 'linterna';
      l.setAttribute('aria-hidden', 'true');
      l.appendChild(document.createElement('i'));
      s.insertBefore(l, s.firstChild);
      linternas.push(l);
      let pendiente = null;
      let enCamino = false;
      s.addEventListener('pointermove', (e) => {
        pendiente = e;
        if (enCamino) return;
        enCamino = true;
        requestAnimationFrame(() => {
          enCamino = false;
          const r = s.getBoundingClientRect();
          const radio = parseFloat(l.style.getPropertyValue('--lr2')) / 2 || 320;
          l.style.setProperty('--lx', `${(pendiente.clientX - r.left - radio).toFixed(1)}px`);
          l.style.setProperty('--ly', `${(pendiente.clientY - r.top - radio).toFixed(1)}px`);
          l.classList.add('encendida');
        });
      }, { passive: true });
      s.addEventListener('pointerleave', () => l.classList.remove('encendida'), { passive: true });
    });
  }
  const medirSecciones = () => {
    const radio = Math.round(Math.min(340, Math.max(200, window.innerWidth * 0.17)));
    oscuras.forEach((s) => {
      const esPortada = s === portada;
      s.style.setProperty('--sw', `${s.clientWidth}px`);
      s.style.setProperty('--sh', `${s.clientHeight + (esPortada ? 0 : 80)}px`);
      s.style.setProperty('--lt', esPortada ? '0px' : '-40px');
    });
    linternas.forEach((l) => l.style.setProperty('--lr2', `${radio * 2}px`));
  };

  // ---------- Al desplazarse: profundidad, menú de vidrio, barra de avance y línea del calendario ----------
  const barra = document.createElement('div');
  barra.className = 'avance-lectura';
  barra.setAttribute('aria-hidden', 'true');
  document.body.appendChild(barra);
  let agendado = false;
  const alDesplazar = () => {
    agendado = false;
    const y = window.scrollY;
    const vh = window.innerHeight;
    oscuras.forEach((s) => {
      const r = s.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const py = s === portada ? Math.max(0, y) * 0.3 : Math.max(-40, Math.min(40, -(r.top + r.height / 2 - vh / 2) * 0.08));
      s.style.setProperty('--py', `${py.toFixed(1)}px`);
    });
    nav.classList.toggle('vidrio', y > 60);
    const total = document.documentElement.scrollHeight - vh;
    barra.style.setProperty('--leido', total > 0 ? (y / total).toFixed(4) : 0);
    avanceRuta();
    alFinal();
  };
  const agendar = () => { if (!agendado) { agendado = true; requestAnimationFrame(alDesplazar); } };
  window.addEventListener('scroll', agendar, { passive: true });

  const medirTodo = () => { ponerHalo(); ponerLuzLogo(); medirBarrido(); medirSecciones(); trazarRuta(); alDesplazar(); };
  let espera2;
  window.addEventListener('resize', () => { clearTimeout(espera2); espera2 = setTimeout(medirTodo, 120); });
  if ('ResizeObserver' in window) new ResizeObserver(() => { trazarRuta(); }).observe(pasos);
  const ponerLogo = () => { ponerHalo(); ponerLuzLogo(); };
  if (logo.complete) ponerLogo(); else logo.addEventListener('load', ponerLogo, { once: true });
  window.addEventListener('load', medirTodo, { once: true });
  if (document.fonts) document.fonts.ready.then(medirTodo);
  medirTodo();
})();
