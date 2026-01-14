import { charts } from "../components/index.js";

let currentChart = null;
let currentChartType = null;

export function renderScene(scene, selector) {
    // 1. Verifica se o tipo de gráfico mudou (ex: de 'intro' para 'butterfly')
    if (scene.chartType !== currentChartType) {
        
        // Limpa o gráfico anterior se necessário
        if (currentChart && typeof currentChart.destroy === 'function') {
            currentChart.destroy();
        }

        // Pega o novo módulo de gráfico do index.js
        const chartModule = charts[scene.chartType];

        if (chartModule) {
            currentChart = chartModule;
            // Inicializa o SVG (cria o container)
            currentChart.init(selector);
            currentChartType = scene.chartType;
        } else {
            console.error(`Erro: Tipo de gráfico '${scene.chartType}' não encontrado no index.js`);
            return;
        }
    }

    // 2. Atualiza os dados do gráfico atual
    if (currentChart) {
        currentChart.update(scene);
    }
}