import * as introChart from "./introChart.js";
import * as butterflyChart from "./butterflyChart.js";
import * as slopeChart from "./slopeChart.js";
import * as mapChart from "./mapChart.js";
import * as networkChart from "./networkChart.js";
// import * as barChart from "./barChart.js"; // (Opcional, se não for usar)

export const charts = {
    intro: introChart,         // Conecta o tipo "intro" ao arquivo introChart
    butterfly: butterflyChart, // Conecta "butterfly"
    slope: slopeChart,         // Conecta "slope"
    map: mapChart,             // Conecta "map"
    network: networkChart   // Conecta "network"
};