let svg, g, path;
let width = 800, height = 700;
// URL estável para o GeoJSON do Brasil
const GEO_URL = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";
let mapData = null;

async function loadMapData() {
    if (!mapData) {
        try {
            mapData = await d3.json(GEO_URL);
        } catch (e) {
            console.error("Erro ao carregar mapa:", e);
        }
    }
    return mapData;
}

export async function init(selector) {
    await loadMapData();

    d3.select(selector).select("svg").remove();
    svg = d3.select(selector)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`);
    g = svg.append("g");

    const projection = d3.geoMercator().center([-52, -15]).scale(900).translate([width / 2, height / 2]);
    path = d3.geoPath().projection(projection);

    // Desenha (ou atualiza) o mapa base usando join para evitar duplicação
    if (mapData) {
        g.selectAll("path")
            .data(mapData.features, d => d.properties.sigla)
            .join("path")
            .attr("d", path)
            .attr("fill", "#1a1a1a")
            .attr("stroke", "#333")
            .attr("id", d => `state-${d.properties.sigla}`);
    }
}

export async function update({ activeStates, title }) {
    await loadMapData();
    if (!mapData || !g || !svg) return;

    // Reseta cores
    g.selectAll("path").interrupt().transition().attr("fill", "#1a1a1a").attr("stroke", "#333").attr("fill-opacity", 1);

    // Título
    svg.selectAll(".map-title").remove();
    svg.append("text").attr("class", "map-title").attr("x", width / 2).attr("y", 50)
        .attr("text-anchor", "middle").attr("fill", "#fff")
        .style("font-size", "24px").style("font-family", "Courier New")
        .text(title);

    // Acende estados ativos
    activeStates.forEach(st => {
        const color = st.type === "new" ? "#ff2a6d" : "#0055ff"; // Vermelho ou Azul
        const state = g.select(`#state-${st.sigla}`);
        if (!state.empty()) {
            state.transition().duration(1000)
                .attr("fill", color)
                .attr("stroke", "#fff")
                .attr("fill-opacity", st.type === "new" ? 1 : 0.4);
        }
    });
}