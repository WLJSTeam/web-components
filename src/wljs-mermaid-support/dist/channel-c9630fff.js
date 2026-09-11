import { aj as _, ak as Color } from './mermaid.core-08d91a7a.js';

/* IMPORT */
/* MAIN */
const channel = (color, channel) => {
    return _.lang.round(Color.parse(color)[channel]);
};
/* EXPORT */
var channel$1 = channel;

export { channel$1 as c };
