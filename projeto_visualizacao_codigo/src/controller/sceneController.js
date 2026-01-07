import { charts } from "../components/index.js";

let currentChart = null;
let currentChartType = null;

export function renderScene(scene, selector) {
    // troca de gráfico
    if (scene.chartType !== currentChartType) {
        if (currentChart?.destroy) {
            currentChart.destroy();
        }

        currentChart = charts[scene.chartType];
        currentChart.init(selector);
        currentChartType = scene.chartType;
    }

    // atualiza dados
    currentChart.update(scene);
}
