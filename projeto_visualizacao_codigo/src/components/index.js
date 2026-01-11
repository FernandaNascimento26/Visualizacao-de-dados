import * as introChart from "./introChart.js";
import * as butterflyChart from "./butterflyChart.js";
import * as slopeChart from "./slopeChart.js";
import * as mapChart from "./mapChart.js";
import * as networkChart from "./networkChart.js";
// NOVOS:
import * as bubbleChart from "./bubbleChart.js";
import * as leaderChart from "./leaderChart.js";
import * as targetChart from "./targetChart.js";

export const charts = {
    intro: introChart,
    butterfly: butterflyChart,
    slope: slopeChart,
    map: mapChart,
    network: networkChart,
    bubble: bubbleChart,  // <--- Novo
    leader: leaderChart,  // <--- Novo
    target: targetChart   // <--- Novo
};