let svg;
let width = 900, height = 720;

const GEO_URL =
  "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";

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
    return type === "new" ? "#ff2a6d" : "#0055ff";
}

function opacityByValue(value) {
    return Math.min(0.3 + value / 20, 1);
}

export async function init(selector) {
    await loadMapData();

    d3.select(selector).select("svg").remove();
    d3.select(selector).select(".map-tooltip").remove();

    // ===== SVG =====
    svg = d3.select(selector)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`);

    // ===== TOOLTIP =====
    tooltip = d3.select(selector)
        .append("div")
        .attr("class", "map-tooltip")
        .style("position", "absolute")
        .style("background", "#111")
        .style("border", "1px solid #444")
        .style("border-radius", "6px")
        .style("padding", "8px 10px")
        .style("color", "#fff")
        .style("font-family", "Courier New")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("opacity", 0);

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
    mapLeft.selectAll("path")
        .attr("fill", "#1a1a1a")
        .attr("fill-opacity", 1)
        .attr("stroke", "#333");

    mapRight.selectAll("path")
        .attr("fill", "#1a1a1a")
        .attr("fill-opacity", 1)
        .attr("stroke", "#333");

    // ===== PRÉ-ELEIÇÃO =====
    dataLeft.forEach(st => {
        mapLeft.select(`#left-${st.sigla}`)
            .attr("fill", colorByType(st.type))
            .attr("fill-opacity", opacityByValue(st.value))
            .attr("stroke", "#fff");
    });

    // ===== PÓS-ELEIÇÃO =====
    dataRight.forEach(st => {
        mapRight.select(`#right-${st.sigla}`)
            .attr("fill", colorByType(st.type))
            .attr("fill-opacity", opacityByValue(st.value))
            .attr("stroke", "#fff");
    });

    // ===== TOOLTIP EVENTS =====
    function attachTooltip(map, lookup, periodLabel) {
        map.selectAll("path")
            .on("mouseover", function (event, d) {
                const sigla = d.properties.sigla;
                if (!lookup.has(sigla)) return;

                const info = lookup.get(sigla);

                d3.select(this)
                    .attr("stroke", "#fff")
                    .attr("stroke-width", 2);

                tooltip
                    .style("opacity", 1)
                    .html(`
                        <strong>${sigla}</strong><br/>
                        Período: ${periodLabel}<br/>
                        Volume: ${info.value}<br/>
                        Tipo: ${info.type}
                    `);
            })
            .on("mousemove", function (event) {
                tooltip
                    .style("left", (event.pageX + 12) + "px")
                    .style("top", (event.pageY + 12) + "px");
            })
            .on("mouseout", function () {
                d3.select(this)
                    .attr("stroke-width", 1);

                tooltip.style("opacity", 0);
            });
    }

    attachTooltip(mapLeft, leftMap, "Pré-eleição");
    attachTooltip(mapRight, rightMap, "Pós-eleição");

    // ===== LEGENDAS =====
    svg.selectAll(".map-label").remove();

    svg.append("text")
        .attr("class", "map-label")
        .attr("x", width / 4)
        .attr("y", height - 30)
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .style("font-family", "Courier New")
        .text("Pré-eleição");

    svg.append("text")
        .attr("class", "map-label")
        .attr("x", (width / 4) * 3)
        .attr("y", height - 30)
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .style("font-family", "Courier New")
        .text("Pós-eleição");
}
