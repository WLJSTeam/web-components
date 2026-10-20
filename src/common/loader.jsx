import React from "react";

const CSS_URLS = [
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
	"wljs-editor\/dist\/kernel.js",
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
const WEB_COMPONENTS_STYLES = {
  "web-components.css": "common/web-components.css",
  "web-components.tw.css": "common/web-components.tw.css",
};

function resolveAsset(BASE, asset) {
  if (/^(?:https?:)?\/\//.test(asset)) return asset;
  return `${String(BASE).replace(/\/+$/, "")}/${asset.replace(/^\/+/, "")}`;
}

// Render during SSR, for example from a Next.js layout or document component.
export default function WLJSBootstrap({
  BASE = "/bootstrap/src",
  preload = true,
  webComponentsCSS = "web-components.css",
}) {
  const selectedStyles = WEB_COMPONENTS_STYLES[webComponentsCSS];
  if (!selectedStyles) {
    throw new Error(`Unknown WLJS web-components stylesheet: ${webComponentsCSS}`);
  }

  const cssURLs = CSS_URLS
    .map((asset) => asset === "common/web-components.css" ? selectedStyles : asset)
    .map((asset) => resolveAsset(BASE, asset));
  const moduleURLs = ESM_URLS_IN_ORDER.map((asset) => resolveAsset(BASE, asset));

  return (
    <>
      {cssURLs.map((href) => (
        <link key={`css:${href}`} rel="stylesheet" href={href} />
      ))}
      {preload && moduleURLs.map((href) => (
        <link key={`preload:${href}`} rel="modulepreload" href={href} />
      ))}
      {moduleURLs.map((src) => (
        <script key={`module:${src}`} type="module" src={src}></script>
      ))}
    </>
  );
}

export { CSS_URLS, ESM_URLS_IN_ORDER, WEB_COMPONENTS_STYLES };