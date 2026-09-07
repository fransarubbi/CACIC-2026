# PIMAD — Presentación web

Presentación interactiva para CACIC 2026, construida con HTML, CSS y JavaScript
puro sobre [Reveal.js](https://revealjs.com/). Reemplaza la versión estática en
LaTeX/Beamer por una landing page navegable, con modo claro/oscuro y una
estética de "esquema técnico" acorde a un proyecto de sistemas distribuidos.

## Estructura del proyecto

```
pimad-presentation/
├── index.html        → las 13 diapositivas (contenido y estructura)
├── css/
│   └── style.css      → todo el diseño visual: tema claro/oscuro, tipografía,
│                         diagramas de arquitectura, responsive
├── js/
│   └── main.js         → inicialización de Reveal.js + selector de tema
└── README.md
```

## No hace falta instalar nada

No necesitás `pnpm`, `npm` ni ningún paso de build. Reveal.js se carga desde
un CDN (`cdn.jsdelivr.net`) directamente en `index.html`, igual que las
tipografías (Google Fonts). Esto es intencional: como el proyecto se aloja en
GitHub Pages como una landing page estática, mantenerlo sin build simplifica
el despliegue y el mantenimiento.

### Previsualizar en tu máquina

Alcanza con abrir `index.html` en el navegador, pero para que la navegación
por hash y las rutas relativas funcionen exactamente igual que en producción,
es mejor levantar un servidor estático simple. Con Python (viene instalado en
Fedora):

```bash
cd pimad-presentation
python3 -m http.server 8080
```

Y abrís `http://localhost:8080` en el navegador.

Si preferís usar tu entorno de Node/pnpm ya instalado, cualquier servidor
estático sirve, por ejemplo:

```bash
pnpm dlx serve .
```

(Esto descarga el paquete `serve` de forma temporal con `pnpm dlx`, sin
agregarlo como dependencia del proyecto.)

## Publicar en GitHub Pages

1. Subí esta carpeta a la raíz de tu repositorio (o a una rama `gh-pages`).
2. En GitHub: **Settings → Pages → Source**, elegí la rama y la carpeta
   (`/` si `index.html` está en la raíz del repo).
3. GitHub te da una URL del tipo `https://tu-usuario.github.io/tu-repo/`.

## Cómo está pensada la navegación

- **Flechas del teclado / swipe táctil**: avanzan entre diapositivas.
- **Barra de progreso y número de página** (abajo): iguales a los de la
  versión en LaTeX (`página actual / 13`).
- **Botón de tema** (arriba a la izquierda): un ícono propio de tres nodos
  conectados —en referencia a la red distribuida de PIMAD— que cambia de
  color según el modo. Guarda tu preferencia en el navegador
  (`localStorage`), así que la próxima vez que abras la presentación
  recuerda el modo elegido.
- **`?print-pdf`**: si agregás ese parámetro a la URL
  (`index.html?print-pdf`) y abrís el diálogo de impresión del navegador,
  Reveal.js genera una versión en PDF de toda la presentación, por si la
  necesitás como respaldo.

## Personalización rápida

- **Colores**: todo está centralizado en las variables CSS al principio de
  `css/style.css` (sección 1). Cambiando esos valores hexadecimales se
  actualiza toda la presentación, en ambos modos.
- **Tipografías**: variables `--font-display`, `--font-body` y `--font-mono`
  en el mismo archivo.
- **Agregar/quitar diapositivas**: cada diapositiva es un bloque
  `<section>...</section>` dentro de `index.html`. Podés duplicar un bloque
  existente como punto de partida.

## Próximos pasos sugeridos (para vos)

Los tres diagramas de arquitectura (slides 5, 6, 7 y 8) están resueltos hoy
con HTML/CSS puro (grillas de "chips" y nodos) para que tengas una base
prolija y liviana. Si querés hacerlos interactivos, dos caminos simples:

1. **SVG con JS**: reemplazar los `<div class="radial-node">` por un único
   `<svg>` con círculos/rectángulos y líneas dibujadas a mano, agregando
   `onclick`/`onmouseenter` para resaltar rutas de datos o mostrar tooltips.
2. **CSS solamente**: usar `:hover` sobre `.node-chip` y `.radial-node` para
   resaltar (ya hay una transición de color/borde preparada en las
   variables de tema) sin escribir JavaScript.

La diapositiva 10 (*Validación experimental en campo*) quedó con marcos
punteados de referencia (`.field-frame`) para que reemplaces por tus
capturas reales o por gráficos generados dinámicamente (por ejemplo, un
`<canvas>` o un iframe embebido de tu panel de Grafana).
