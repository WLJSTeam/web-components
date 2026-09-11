import { s as stateDiagram_default, S as StateDB, b as stateRenderer_v3_unified_default, a as styles_default } from './chunk-EX3LRPZG-66a16a3f.js';
import { _ as __name } from './mermaid.core-08d91a7a.js';
import './chunk-XXDRQBXY-2d77ab95.js';
import './chunk-VR4S4FIN-5edd6be5.js';
import './chunk-32BRIVSS-c6dcc971.js';

// src/diagrams/state/stateDiagram-v2.ts
var diagram = {
  parser: stateDiagram_default,
  get db() {
    return new StateDB(2);
  },
  renderer: stateRenderer_v3_unified_default,
  styles: styles_default,
  init: /* @__PURE__ */ __name((cnf) => {
    if (!cnf.state) {
      cnf.state = {};
    }
    cnf.state.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
  }, "init")
};

export { diagram };
