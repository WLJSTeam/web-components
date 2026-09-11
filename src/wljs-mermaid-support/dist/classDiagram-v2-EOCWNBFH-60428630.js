import { c as classDiagram_default, C as ClassDB, a as classRenderer_v3_unified_default, s as styles_default } from './chunk-V7JOEXUC-1c484699.js';
import { _ as __name } from './mermaid.core-08d91a7a.js';
import './chunk-5VM5RSS4-63a34661.js';
import './chunk-XXDRQBXY-2d77ab95.js';
import './chunk-VR4S4FIN-5edd6be5.js';
import './chunk-32BRIVSS-c6dcc971.js';

// src/diagrams/class/classDiagram-v2.ts
var diagram = {
  parser: classDiagram_default,
  get db() {
    return new ClassDB();
  },
  renderer: classRenderer_v3_unified_default,
  styles: styles_default,
  init: /* @__PURE__ */ __name((cnf) => {
    if (!cnf.class) {
      cnf.class = {};
    }
    cnf.class.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
  }, "init")
};

export { diagram };
