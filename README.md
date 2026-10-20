# WLJS Web Components

Web components for embedding [WLJS Notebook](https://wljs.io/) exports in static pages and web applications. They render Wolfram Language code, graphics, interactive widgets, and serialized notebook output without requiring a frontend build step.

Raw code and content remain readable while the runtime loads, and usually remain useful when JavaScript is unavailable.

## Examples

- [Static HTML demo](https://wljsteam.github.io/web-components/)
- [Next.js integration](https://wljsteam.github.io/web-components-mdx/)
- [Ready-to-use Next.js blog](https://github.com/WLJSTeam/web-components-mdx)

## Quick start

Add the bootstrap near the end of the page:

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/gh/WLJSTeam/web-components@latest/src/common/app.js"
></script>
```

Then add exported components. WLJS Notebook generates these tags automatically through its sharing and export commands.

```html
<wljs-store json="attachments/data.txt"></wljs-store>

<wljs-editor display="codemirror" type="Input">
  <xmp>Plot[Sin[x], {x, 0, 2 Pi}]</xmp>
</wljs-editor>

<wljs-editor display="codemirror" type="Output">
  <xmp>(*VB[*)(Graphics[...])(*]VB*)</xmp>
</wljs-editor>
```

For a local distribution, point the script to its copied `src/common/app.js`.

## Bootstrap configuration

Set options before importing `app.js`:

```html
<script>
  globalThis.WLJS_BASE_HREF = "/bootstrap/src/";
  globalThis.WLJS_BASE_TW = true;
  globalThis.WLJS_MODULE_LAG = 16;
</script>
<script type="module" src="/bootstrap/src/common/app.js"></script>
```

| Option | Default | Purpose |
| --- | --- | --- |
| `WLJS_BASE_HREF` | jsDelivr `src/` | Directory containing `common/` and the WLJS package folders. Relative paths are resolved against the page URL. |
| `WLJS_BASE_TW` | `false` | Select the smaller `common/web-components.tw.css` for sites that already provide the required Tailwind utilities. |
| `WLJS_MODULE_LAG` | `0` | Pause this many milliseconds between module imports, allowing weaker devices to paint and process input during bootstrap. Values around `8`–`25` are a reasonable starting point. |

`app.js` loads styles first, followed by JavaScript modules in dependency order. Module pacing is optional and never delays the first or final import.

The bootstrap exposes an idempotent readiness promise:

```js
await globalThis.WLJS_BOOTSTRAP.ready();
```

It is also exported from the module:

```js
const { ready } = await import("/bootstrap/src/common/app.js");
await ready;
```

## React and Next.js

Generated bootstrap folders include `common/loader.jsx`. It renders stylesheet links, optional module preloads, and ordered module scripts directly:

```jsx
import WLJSBootstrap from "./bootstrap/src/common/loader.jsx";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <WLJSBootstrap
          BASE="/bootstrap/src"
          preload
          webComponentsCSS="web-components.tw.css"
        />
      </body>
    </html>
  );
}
```

The loader accepts:

- `BASE`: URL of the bootstrap `src/` directory.
- `preload`: whether to emit `modulepreload` links; defaults to `true`.
- `webComponentsCSS`: either `"web-components.css"` or `"web-components.tw.css"`.

This component bypasses `app.js`, so `WLJS_MODULE_LAG` does not apply to it.

## Component API

### `<wljs-store>`

Loads serialized notebook objects and optional machine state.

| Attribute | Purpose |
| --- | --- |
| `json` | URL of serialized notebook objects. |
| `kernel` | URL of serialized machine data. |
| `notebook` | Optional notebook identifier. |

```html
<wljs-store
  json="attachments/data.txt"
  kernel="attachments/kernel.txt"
></wljs-store>
```

### `<wljs-editor>`

Renders input and output cells.

| Attribute | Purpose |
| --- | --- |
| `display` | Renderer name, such as `codemirror` or `print`. |
| `type` | `Input` or `Output`. |
| `fade` | Fade the editor outside focus. |
| `encoded` | Treat the element text as URI-encoded content. |
| `editable` | Enable editing and focus. |
| `lazy` | Mount only when the element approaches the viewport. |

For CodeMirror cells, prefer the stateful readiness API over relying on the one-shot `codemirrorReady` event:

```js
await customElements.whenDefined("wljs-editor");

const element = document.querySelector("wljs-editor");
const editorView = await element.whenEditorReady();
```

`element.editor` returns the current editor instance, or `null` before mounting.

Cell source can be represented in three ways:

```html
<!-- Readable before JavaScript loads. The xmp element is deprecated but widely supported. -->
<wljs-editor display="codemirror" type="Input">
  <xmp>Plot[x, {x, 0, 1}]</xmp>
</wljs-editor>

<!-- Standards-based inert text. -->
<wljs-editor display="codemirror" type="Input">
  <script type="text/plain">Plot[x, {x, 0, 1}]</script>
</wljs-editor>

<!-- Safe for arbitrary characters, but unreadable until JavaScript mounts it. -->
<wljs-editor display="codemirror" type="Input" encoded>
  Plot%5Bx%2C%20%7Bx%2C%200%2C%201%7D%5D
</wljs-editor>
```

### `<wljs-html>`

Renders HTML output. Add `encoded` when its text is URI encoded.

```html
<wljs-html>
  <div class="result">Output content</div>
</wljs-html>
```

## Styling and progressive enhancement

Before mounting, `<wljs-editor>` contains its original source. A small fallback style can reserve space and reduce layout shifts:

```css
wljs-editor {
  display: block;
  min-height: 4rem;
  padding: 1rem;
  overflow: auto;
  font-family: monospace;
  white-space: pre-wrap;
}

wljs-editor.wljs-mounted {
  min-height: unset;
}
```

To hide unmounted content instead, use `wljs-editor:not(:defined) { display: none; }`. This removes graceful degradation and may introduce layout shifts.

### Sites that already use Tailwind

Select the smaller stylesheet before loading `app.js`:

```html
<script>
  globalThis.WLJS_BASE_TW = true;
</script>
<script
  type="module"
  src="https://cdn.jsdelivr.net/gh/WLJSTeam/web-components@latest/src/common/app.js"
></script>
```

The host Tailwind build must safelist the utility classes used by the exported WLJS modules. If maintaining that list is undesirable, use the default `web-components.css` bundle.

## Distribution layout

The portable bootstrap preserves package directories so lazy imports resolve normally. It contains browser assets from packages marked as exportable, including JavaScript, CSS, and fonts.

Runtime modules load in dependency order. Dynamic runners are registered before web components mount, and `WLJS_BOOTSTRAP.ready()` resolves after the complete sequence finishes.

```text
src/
├── common/
│   ├── app.js
│   ├── loader.jsx
│   ├── web-components.js
│   ├── web-components.css
│   └── web-components.tw.css
├── Views/
└── wljs-*/
```

## Development

```bash
npm install
node server.js
```

Open `http://localhost:3000`. See [index.html](index.html) for the static integration example.

## Browser support

A modern browser with ES modules, custom elements, dynamic imports, and top-level `await` is required.

## License

MIT. Individual packages under `src/` may carry their own licenses.

## Related projects

- [WLJS Notebook](https://wljs.io/)
- [Wolfram Language](https://www.wolfram.com/language/)
