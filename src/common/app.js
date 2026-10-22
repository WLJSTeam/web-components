function getBaseHref() {
  const configured = globalThis.WLJS_BASE_HREF;
  if (!configured) return 'https://cdn.jsdelivr.net/gh/WLJSTeam/web-components@latest/src/';

  const directory = configured.endsWith("/") ? configured : `${configured}/`;
  return new URL(directory, document.baseURI).href;
}

const WLJS_BOOTSTRAP = (() => {
  let promise = null;
  let CSS_URLS = [
	"common\/web-components.css",
	"wljs-editor\/src\/styles.css",
	"wljs-graphics3d-threejs\/src\/styles.css",
	"wljs-html-support\/src\/style.css",
	"wljs-js-support\/src\/style.css",
	"wljs-markdown-support\/src\/styles.css",
	"wljs-graphics-d3\/src\/styles.css",
	"wljs-wlx-support\/src\/styles.css",
	"wljs-inputs\/src\/styles.css",
	"wljs-revealjs\/dist\/reveal.css",
	"wljs-revealjs\/src\/style.css",
	"wljs-revealjs\/src\/pointer\/pointer.css"
];
  const ESM_URLS_IN_ORDER = [
	"common\/interpreter.js",
	"common\/core.js",
	"common\/api.js",
	"common\/extension.js",
	"Views\/Common\/Assets\/wrappers.js",
	"wljs-sharedlib-mk\/dist\/kernel.js",
	"wljs-editor\/dist\/kernel.min.js",
	"wljs-editor\/src\/boxes.js",
	"wljs-editor\/src\/objects.js",
	"wljs-editor\/src\/autocomplete.js",
	"wljs-editor\/src\/frontsubmit.js",
	"wljs-editor\/src\/dir.js",
	"wljs-editor\/src\/misc.js",
	"wljs-sharedlib-d3\/dist\/kernel.js",
	"wljs-sharedlib-three\/dist\/kernel.js",
	"wljs-graphics3d-threejs\/dist\/kernel.js",
	"wljs-html-support\/src\/kernel.js",
	"wljs-js-support\/src\/kernel.js",
	"wljs-markdown-support\/src\/kernel.js",
	"wljs-mermaid-support\/dist\/kernel.js",
	"wljs-plotly\/dist\/kernel.js",
	"wljs-graphics-d3\/dist\/kernel.js",
	"wljs-wlx-support\/src\/kernel.js",
	"wljs-inputs\/dist\/kernel.js",
	"wljs-sound\/dist\/kernel.js",
	"wljs-revealjs\/dist\/kernel.js",
	"wljs-manipulate\/kernel.js",
	"wljs-export-html\/DynamicsTools\/Runners.js",
	"common\/web-components.js"
];
  const loadedCSS = new Set();
  const importedModules = new Set();

  if (globalThis.WLJS_BASE_TW) CSS_URLS = CSS_URLS.map(x => x.replace('web-components.css', 'web-components.tw.css'));

  const resolve = (path) => new URL(path, getBaseHref()).href;

  function getModuleLag() {
    const configured = Number(globalThis.WLJS_MODULE_LAG ?? 0);
    return Number.isFinite(configured) ? Math.max(0, configured) : 0;
  }

  const pause = (milliseconds) => new Promise((resolvePromise) => {
    setTimeout(resolvePromise, milliseconds);
  });

  function loadCSS(path) {
    const href = resolve(path);
    if (loadedCSS.has(href)) return Promise.resolve(href);

    const existing = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .find((link) => link.href === href);
    if (existing) {
      loadedCSS.add(href);
      return Promise.resolve(href);
    }

    return new Promise((resolvePromise, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.dataset.wljsCss = "1";
      link.onload = () => {
        loadedCSS.add(href);
        resolvePromise(href);
      };
      link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`));
      document.head.appendChild(link);
    });
  }

  async function ensureLoaded() {
    // Preserve CSS cascade and module side-effect order.
    for (const path of CSS_URLS) await loadCSS(path);

    const moduleLag = getModuleLag();
    const pendingModules = ESM_URLS_IN_ORDER.filter((path) => !importedModules.has(resolve(path)));
    for (const [index, path] of pendingModules.entries()) {
      const href = resolve(path);
      await import(href);
      importedModules.add(href);
      // Yield to rendering and input between modules when pacing is requested.
      if (moduleLag > 0 && index < pendingModules.length - 1) await pause(moduleLag);
    }

    if (!window.server) console.warn("[WLJS] window.server not present after bootstrap");
    if (!window.SupportedCells) console.warn("[WLJS] window.SupportedCells not present after bootstrap");
  }

  return {
    ready() {
      return promise ||= ensureLoaded();
    },
    CSS_URLS,
    ESM_URLS_IN_ORDER,
  };
})();

globalThis.WLJS_BOOTSTRAP = WLJS_BOOTSTRAP;
const ready = WLJS_BOOTSTRAP.ready();
await ready;

export { WLJS_BOOTSTRAP, getBaseHref, ready };