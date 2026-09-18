/**
 * PIMAD — Presentación web
 * ----------------------------------------------------------------------
 * Este archivo hace dos cosas, cada una en su propia sección:
 *   1. Inicializa Reveal.js con la configuración de la presentación.
 *   2. Maneja el selector de tema (claro / oscuro), incluyendo la
 *      persistencia de la preferencia del usuario en localStorage y el
 *      respeto por la preferencia del sistema operativo cuando el
 *      usuario todavía no eligió nada manualmente.
 * ---------------------------------------------------------------------- */

/* ========================================================================
   1. TEMA CLARO / OSCURO
   ======================================================================== */

const CLAVE_TEMA = "pimad-theme";
const raizDocumento = document.documentElement;
const botonTema = document.getElementById("theme-toggle");

/**
 * Determina qué tema usar al cargar la página:
 *   - Si el usuario ya eligió un tema antes (guardado en localStorage),
 *     se respeta esa elección.
 *   - Si no, se usa la preferencia de color del sistema operativo
 *     (prefers-color-scheme).
 */
function obtenerTemaInicial() {
  const temaGuardado = localStorage.getItem(CLAVE_TEMA);
  if (temaGuardado === "light" || temaGuardado === "dark") {
    return temaGuardado;
  }

  const prefiereOscuro = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  return prefiereOscuro ? "dark" : "light";
}

/**
 * Aplica el tema al documento seteando el atributo data-theme en <html>.
 * Todo el resto (colores, ícono del botón, etc.) se resuelve solo con
 * CSS a través de las variables definidas en css/style.css.
 */
function aplicarTema(tema) {
  if (tema === "dark") {
    raizDocumento.setAttribute("data-theme", "dark");
  } else {
    raizDocumento.removeAttribute("data-theme"); // el modo claro es el valor por defecto
  }
  botonTema.setAttribute(
    "aria-pressed",
    tema === "dark" ? "true" : "false"
  );
}

/** Alterna entre modo claro y oscuro, y guarda la elección del usuario. */
function alternarTema() {
  const temaActual = raizDocumento.getAttribute("data-theme") === "dark" ? "dark" : "light";
  const nuevoTema = temaActual === "dark" ? "light" : "dark";
  aplicarTema(nuevoTema);
  localStorage.setItem(CLAVE_TEMA, nuevoTema);
}

// Aplicamos el tema inicial antes de que Reveal.js termine de renderizar
aplicarTema(obtenerTemaInicial());
botonTema.addEventListener("click", alternarTema);


/* ========================================================================
   2. INICIALIZACIÓN DE REVEAL.JS
   ======================================================================== */

Reveal.initialize({
  // Dimensiones de referencia del "lienzo" de cada diapositiva. Reveal.js
  // escala este lienzo como una unidad para que se vea bien tanto en un
  // proyector como en una notebook o en el celular.
  width: 1280,
  height: 720,
  margin: 0.06,
  minScale: 0.2,
  maxScale: 2.0,

  // Navegación
  hash: true,              // permite compartir/recordar el link a una slide puntual
  history: true,
  controls: true,
  progress: true,
  slideNumber: false,      // el número de página lo dibuja nuestro propio contador (ver más abajo)
  transition: "fade",      // transición sobria; el contenido es el protagonista
  transitionSpeed: "fast",

  // Buen soporte táctil para cuando se navega desde el celular
  touch: true,

  // No centramos verticalmente: nuestras diapositivas están pensadas con
  // alineación superior/izquierda, más cercana a una lámina técnica.
  center: false,
  
  // Plugins (para Speaker View con la letra 's')
  plugins: [ RevealNotes ]
});


/* ========================================================================
   3. CONTADOR DE DIAPOSITIVAS PERSONALIZADO (arriba a la derecha)
   ------------------------------------------------------------------------
   Reemplaza el "slide-number" nativo de Reveal.js por un contador propio
   que muestra el número anterior y el siguiente más chicos/difuminados,
   y el número actual grande y en color de acento (los estilos están en
   css/style.css, sección 5.1).

   Reglas de negocio pedidas:
     - La diapositiva de Bibliografía NO cuenta (se marca en el HTML con
       el atributo data-count="exclude" y no aparece en la numeración).
     - En la primera diapositiva contable no se muestra "anterior".
     - En la última diapositiva contable no se muestra "siguiente".
     - Si el usuario está mirando una diapositiva excluida (Bibliografía),
       el contador se oculta por completo.
   ======================================================================== */

const contenedorContador = document.getElementById("slide-counter");

/**
 * Devuelve, en el orden en que aparecen en el HTML, los índices
 * horizontales (0-based, tal como los usa Reveal.js) de las diapositivas
 * que sí deben contarse. Para excluir una diapositiva del conteo alcanza
 * con agregarle data-count="exclude" en index.html.
 */
function obtenerIndicesContables() {
  const todasLasSlides = document.querySelectorAll(".reveal .slides > section");
  const indices = [];

  todasLasSlides.forEach((seccion, indice) => {
    if (seccion.getAttribute("data-count") !== "exclude") {
      indices.push(indice);
    }
  });

  return indices;
}

const indicesContables = obtenerIndicesContables();
const totalDiapositivasContables = indicesContables.length;

/**
 * Redibuja el contador para la diapositiva horizontal "indiceHorizontal"
 * (0-based, el mismo formato que entrega Reveal.js en sus eventos).
 */
function actualizarContadorDeDiapositivas(indiceHorizontal) {
  const posicion = indicesContables.indexOf(indiceHorizontal);

  // La diapositiva actual está excluida del conteo (Bibliografía): no
  // mostramos ningún número.
  if (posicion === -1) {
    contenedorContador.innerHTML = "";
    contenedorContador.style.display = "none";
    return;
  }

  contenedorContador.style.display = "flex";

  const numeroActual = posicion + 1; // mostramos números 1-based al usuario
  const hayAnterior = posicion > 0;
  const haySiguiente = posicion < totalDiapositivasContables - 1;

  let html = "";
  if (hayAnterior) {
    html += `<span class="num is-adjacent">${numeroActual - 1}</span>`;
  }
  // "is-entering" arranca el número activo invisible/desplazado; lo
  // sacamos en el siguiente frame para que la transición del CSS anime
  // la aparición (efecto tipo odómetro).
  html += `<span class="num is-current is-entering">${numeroActual}</span>`;
  if (haySiguiente) {
    html += `<span class="num is-adjacent">${numeroActual + 1}</span>`;
  }

  contenedorContador.innerHTML = html;

  requestAnimationFrame(() => {
    const numeroActivo = contenedorContador.querySelector(".is-current");
    if (numeroActivo) {
      numeroActivo.classList.remove("is-entering");
    }
  });
}

// Reveal.js dispara "slidechanged" cada vez que cambiamos de diapositiva...
Reveal.on("slidechanged", (evento) => actualizarContadorDeDiapositivas(evento.indexh));

// ...y "ready" una vez, cuando termina de inicializar, para pintar el
// contador correspondiente a la diapositiva con la que abre la presentación
// (por ejemplo, si alguien entra directamente a un link con #/5).
Reveal.on("ready", (evento) => actualizarContadorDeDiapositivas(evento.indexh));
/* ========================================================================
   4. RED INTERACTIVA D3.JS (PORTADA)
   ======================================================================== */

function initInteractiveNetwork() {
  const container = document.getElementById('interactive-network');
  if (!container || typeof d3 === 'undefined') return;

  // Limpiar contenedor por si se reinicializa
  container.innerHTML = '';

  const width = container.clientWidth || 400;
  const height = container.clientHeight || 500;

  // Datos de los 10 nodos (árbol)
  const nodes = [
    { id: 'root', radius: 10, group: 'core' },
    { id: 'child1', radius: 8, group: 'edge' },
    { id: 'child2', radius: 8, group: 'edge' },
    { id: 'leaf1_1', radius: 6, group: 'sensor' },
    { id: 'leaf1_2', radius: 6, group: 'sensor' },
    { id: 'leaf1_3', radius: 6, group: 'sensor' },
    { id: 'leaf1_4', radius: 6, group: 'sensor' },
    { id: 'leaf2_1', radius: 6, group: 'sensor' },
    { id: 'leaf2_2', radius: 6, group: 'sensor' },
    { id: 'leaf2_3', radius: 6, group: 'sensor' }
  ];

  const links = [
    { source: 'root', target: 'child1' },
    { source: 'root', target: 'child2' },
    { source: 'child1', target: 'leaf1_1' },
    { source: 'child1', target: 'leaf1_2' },
    { source: 'child1', target: 'leaf1_3' },
    { source: 'child1', target: 'leaf1_4' },
    { source: 'child2', target: 'leaf2_1' },
    { source: 'child2', target: 'leaf2_2' },
    { source: 'child2', target: 'leaf2_3' }
  ];

  const svg = d3.select('#interactive-network')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('overflow', 'visible');

  // Grupos para enlaces y nodos
  const linkGroup = svg.append('g').attr('class', 'links');
  const nodeGroup = svg.append('g').attr('class', 'nodes');

  // Enlaces
  const link = linkGroup.selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke', 'var(--color-graph-edge)')
    .attr('stroke-width', 2);

  // Nodos
  const node = nodeGroup.selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('r', d => d.radius)
    .attr('fill', d => d.group === 'core' ? 'var(--color-primary)' : 'var(--color-accent)')
    .attr('stroke', 'var(--color-canvas)')
    .attr('stroke-width', 1.5)
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
    );

  // Efecto "pulso" CSS sobre los nodos para darles vida, similar al original
  node.classed('pulse-node-d3', true)
      .style('animation-delay', (d, i) => `${i * 0.2}s`);

  const centerX = width / 2;
  const centerY = height / 2;
  const centerForce = d3.forceCenter(centerX, centerY);

  // Simulación
  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(120))
    .force('charge', d3.forceManyBody().strength(-200))
    .force('center', centerForce)
    .force('collide', d3.forceCollide().radius(d => d.radius + 15))
    .force('x', d3.forceX(centerX).strength(0.01))
    .force('y', d3.forceY(centerY).strength(0.01));

  // Actualizar posiciones en cada tick y animar
  simulation.on('tick', () => {
    const time = Date.now() * 0.0005; // Velocidad de la órbita
    
    // Desplazar lentamente todo el bloque en una órbita circular
    centerForce.x(centerX + Math.cos(time) * 30);
    centerForce.y(centerY + Math.sin(time) * 30);

    // Pequeño movimiento flotante individual para cada nodo
    nodes.forEach(d => {
      d.vx += Math.sin(time * 2 + d.index) * 0.03;
      d.vy += Math.cos(time * 2 + d.index) * 0.03;
    });

    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
  });

  // Calor constante garantizado para que nunca se quede quieto
  simulation.alphaTarget(0.1);

  // Funciones de arrastre
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
    // Opcional: ampliar un poco al agarrarlo
    d3.select(this).attr('r', d.radius * 1.5).attr('stroke', 'var(--color-primary)');
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0.1);
    d.fx = null;
    d.fy = null;
    d3.select(this).attr('r', d.radius).attr('stroke', 'var(--color-canvas)');
  }
}

// Inicializar red cuando Reveal esté listo
Reveal.on("ready", () => {
  initInteractiveNetwork();
});

// Re-inicializar si cambia el tamaño de la ventana (opcional)
window.addEventListener('resize', () => {
  // Solo re-inicializar si estamos en la primera slide para no gastar recursos
  if (Reveal.getIndices().h === 0) {
    initInteractiveNetwork();
  }
});

/* ========================================================================
   5. EFECTO TYPING PARA "PIMAD"
   ======================================================================== */
function initTypingEffect() {
  const el = document.getElementById('typing-pimad');
  if (!el) return;
  
  const text = 'PIMAD';
  let i = 0;
  let isDeleting = false;
  
  function type() {
    el.textContent = text.substring(0, i);
    
    let speed = 300; // Velocidad de tipeo
    
    if (!isDeleting) {
      if (i < text.length) {
        i++;
      } else {
        isDeleting = true;
        speed = 2500; // Pausa larga cuando la palabra está completa
      }
    } else {
      if (i > 0) {
        i--;
        speed = 100; // Velocidad de borrado más rápida
      } else {
        isDeleting = false;
        speed = 500; // Pausa antes de volver a empezar a tipear
      }
    }
    
    setTimeout(type, speed);
  }
  
  // Empezar el efecto con un leve retraso
  setTimeout(type, 500);
}

// Inicializar cuando Reveal esté listo
Reveal.on("ready", () => {
  initTypingEffect();
});

/* ========================================================================
   6. LOTTIE ANIMATIONS
   ======================================================================== */
function initLottieAnimations() {
  const containers = document.querySelectorAll('.lottie-anim, .lottie-protocol');
  containers.forEach(container => {
    const animPath = container.getAttribute('data-anim');
    if (animPath && typeof lottie !== 'undefined') {
      lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: animPath
      });
    }
  });
}

Reveal.on("ready", () => {
  initLottieAnimations();
});

/* ========================================================================
   7. TABS (RESULTADOS)
   ======================================================================== */
(function initTabs() {
  const tabsContainer = document.getElementById('results-tabs');
  if (!tabsContainer) return;

  const botones = tabsContainer.querySelectorAll('.tab-btn');
  const paneles = document.querySelectorAll('.tab-panels .tab-content');

  function redimensionarGraficoDe(panel) {
    // Los gráficos son htmlwidgets de Plotly exportados desde R. Si el iframe
    // terminó de cargar mientras su pestaña estaba oculta (display:none),
    // Plotly calculó su tamaño con un contenedor de 0px y queda diminuto.
    // Al activar la pestaña, forzamos un "resize" dentro del iframe para que
    // Plotly recalcule su tamaño real.
    const iframe = panel.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      try {
        iframe.contentWindow.dispatchEvent(new Event('resize'));
      } catch (e) {
        // Si el iframe fuera de otro origen esto fallaría; en este caso
        // son archivos locales del mismo sitio, así que no debería ocurrir.
      }
    }
  }

  function activarTab(targetId, btn) {
    paneles.forEach((panel) => {
      const esElActivo = panel.id === targetId;
      panel.classList.toggle('active', esElActivo);
      if (esElActivo) redimensionarGraficoDe(panel);
    });

    botones.forEach((b) => {
      b.classList.toggle('active', b === btn);
    });
  }

  tabsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    const targetId = btn.getAttribute('data-target');
    if (targetId) activarTab(targetId, btn);
  });

  // Si se entra directo a la slide de Resultados (o se vuelve a ella),
  // reforzamos el resize del gráfico actualmente activo, por si cargó
  // antes de que la slide estuviera realmente visible en pantalla.
  Reveal.on('slidechanged', () => {
    const panelActivo = document.querySelector('.tab-panels .tab-content.active');
    if (panelActivo) redimensionarGraficoDe(panelActivo);
  });
})();
