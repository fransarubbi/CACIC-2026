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
  slideNumber: "c/t",      // "página actual / total", como en la versión original
  transition: "fade",      // transición sobria; el contenido es el protagonista
  transitionSpeed: "fast",

  // Buen soporte táctil para cuando se navega desde el celular
  touch: true,

  // No centramos verticalmente: nuestras diapositivas están pensadas con
  // alineación superior/izquierda, más cercana a una lámina técnica.
  center: false,
});
