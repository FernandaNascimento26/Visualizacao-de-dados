let svg;
let width = 900, height = 720;

// URL externa conforme seu pedido (Nota: requer internet)
const GEO_URL = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";

let mapData = null;
let mapLeft, mapRight;
let path;
let tooltip;

async function loadMapData() {
    if (!mapData) {
        mapData = await d3.json(GEO_URL);
    }
    return mapData;
}

function colorByType(type) {
    // Mantendo suas cores originais
    return type === "new" ? "#ff2a6d" : "#0055ff";
}

function opacityByValue(value) {
    return Math.min(0.3 + value / 20, 1);
}

export async function init(selector) {
    await loadMapData();

    d3.select(selector).select("svg").remove();
    d3.select("body").select(".map-tooltip").remove();

    // ===== SVG =====
    svg = d3.select(selector)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`);

    // ===== TOOLTIP =====
    tooltip = d3.select("body") // Append no body para garantir posição absoluta correta
        .append("div")
        .attr("class", "map-tooltip")
        .style("position", "absolute")
        .style("background", "rgba(10, 10, 10, 0.95)") // Leve transparência para ficar moderno
        .style("border", "1px solid #444")
        .style("border-radius", "6px")
        .style("padding", "10px")
        .style("color", "#fff")
        .style("font-family", "Courier New")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("opacity", 0)
        .style("z-index", 9999);

    mapLeft = svg.append("g").attr("transform", "translate(0,110)");
    mapRight = svg.append("g").attr("transform", `translate(${width / 2},110)`);

    const projection = d3.geoMercator()
        .center([-52, -15])
        .scale(520)
        .translate([width / 4, height / 2.3]);

    path = d3.geoPath().projection(projection);

    [mapLeft, mapRight].forEach((map, i) => {
        map.selectAll("path")
            .data(mapData.features, d => d.properties.sigla)
            .join("path")
            .attr("d", path)
            .attr("fill", "#1a1a1a")
            .attr("stroke", "#333")
            .attr("id", d => `${i === 0 ? "left" : "right"}-${d.properties.sigla}`);
    });
}

export async function update({
    title,
    dataLeft,
    dataRight
}) {
    await loadMapData();
    if (!svg) return;

    // Lookup rápido
    const leftMap = new Map(dataLeft.map(d => [d.sigla, d]));
    const rightMap = new Map(dataRight.map(d => [d.sigla, d]));

    // ===== TÍTULO =====
    svg.selectAll(".map-title").remove();
    svg.append("text")
        .attr("class", "map-title")
        .attr("x", width / 2)
        .attr("y", 40)
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .style("font-size", "24px")
        .style("font-family", "Courier New")
        .text(title);

    // ===== RESET =====
    [mapLeft, mapRight].forEach(map => {
        map.selectAll("path")
            .attr("fill", "#1a1a1a")
            .attr("fill-opacity", 1)
            .attr("stroke", "#333");
    });

    // ===== PINTURA DOS ESTADOS =====
    function paintStates(map, data) {
        data.forEach(st => {
            const prefix = map === mapLeft ? "left" : "right";
            map.select(`#${prefix}-${st.sigla}`)
                .attr("fill", colorByType(st.type))
                .attr("fill-opacity", opacityByValue(st.value))
                .attr("stroke", "#555");
        });
    }

    paintStates(mapLeft, dataLeft);
    paintStates(mapRight, dataRight);

    // ===== TOOLTIP EVENTS (AQUI ESTÁ A ADIÇÃO DOS NÚMEROS) =====
    function attachTooltip(map, lookup, periodLabel) {
        map.selectAll("path")
            .on("mouseover", function (event, d) {
                const sigla = d.properties.sigla;
                const nome = d.properties.name;
                
                // Só mostra tooltip se tiver dados para aquele estado
                if (!lookup.has(sigla)) return;

                const info = lookup.get(sigla);
                const cor = colorByType(info.type);

                // Highlight no estado
                d3.select(this)
                    .attr("stroke", "#fff")
                    .attr("stroke-width", 2)
                    .attr("fill-opacity", 1);

                // HTML com os Números
                tooltip
                    .style("opacity", 1)
                    .style("border-color", cor)
                    .html(`
                        <div style="font-weight:bold; font-size:14px; color:${cor}; margin-bottom:5px;">
                            ${nome} (${sigla})
                        </div>
                        <div style="font-size:11px; color:#ccc; margin-bottom:5px;">
                            ${periodLabel}
                        </div>
                        <div style="border-top:1px solid #555; padding-top:4px;">
                            Usuários Ativos: <strong>${info.value}</strong>
                        </div>
                        <div style="font-size:10px; color:#aaa; margin-top:2px;">
                            ${info.type === 'new' ? 'Novo Foco' : 'Pólo Tradicional'}
                        </div>
                    `);
            })
            .on("mousemove", function (event) {
                tooltip
                    .style("left", (event.pageX + 15) + "px")
                    .style("top", (event.pageY + 15) + "px");
            })
            .on("mouseout", function (event, d) {
                const sigla = d.properties.sigla;
                const info = lookup.get(sigla);

                // Remove highlight
                d3.select(this)
                    .attr("stroke", info ? "#555" : "#333") // Volta para cinza ou borda leve se tiver dados
                    .attr("stroke-width", 1)
                    .attr("fill-opacity", info ? opacityByValue(info.value) : 1);

                tooltip.style("opacity", 0);
            });
    }

    attachTooltip(mapLeft, leftMap, "Pré-eleição");
    attachTooltip(mapRight, rightMap, "Pós-eleição");

    // ===== LEGENDAS INFERIORES =====
    svg.selectAll(".map-label").remove();
    const labelY = height - 30;

    svg.append("text").attr("class", "map-label").attr("x", width / 4).attr("y", labelY)
        .attr("text-anchor", "middle").attr("fill", "#fff").style("font-family", "Courier New")
        .text("Pré-eleição");

    svg.append("text").attr("class", "map-label").attr("x", (width / 4) * 3).attr("y", labelY)
        .attr("text-anchor", "middle").attr("fill", "#fff").style("font-family", "Courier New")
        .text("Pós-eleição");
}