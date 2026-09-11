import { c as createFlowDiagram, s as styles_default } from './chunk-PUDLZKDR-c37b3627.js';
import { _ as __name } from './mermaid.core-08d91a7a.js';
import './chunk-5VM5RSS4-63a34661.js';
import './chunk-XXDRQBXY-2d77ab95.js';
import './chunk-VR4S4FIN-5edd6be5.js';
import './chunk-32BRIVSS-c6dcc971.js';
import './channel-c9630fff.js';

// src/diagrams/swimlanes/styles.ts
var getStyles = /* @__PURE__ */ __name((options) => `${styles_default(options)}
  .swimlane.cluster rect {
    stroke: ${options.clusterBorder} !important;
  }
  [data-look="neo"].cluster rect {
    filter: none;
  }
`, "getStyles");
var styles_default2 = getStyles;

// src/diagrams/swimlanes/swimlanesDiagram.ts
var diagram = createFlowDiagram({ defaultLayout: "swimlane", styles: styles_default2 });

export { diagram };
