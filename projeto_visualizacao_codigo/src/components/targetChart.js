let svg, width = 800, height = 600;

export function init(selector) {
    d3.select(selector).select("svg").remove();
    svg = d3.select(selector).append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`);
}

export function update({ data, title }) {
    svg.selectAll("*").remove();

    svg.append("text").attr("x", width/2).attr("y", 40).attr("text-anchor", "middle")
        .attr("fill", "#fff").style("font-size", "22px").style("font-family", "Courier New").text(title);

    const center = { x: width/2, y: height/2 + 20 };
    const radiusCore = 80;
    const radiusPeriphery = 250;

    const g = svg.append("g");

    // Desenha o Alvo (Círculos Guia)
    // Círculo Periferia
    g.append("circle").attr("cx", center.x).attr("cy", center.y).attr("r", radiusPeriphery)
        .attr("fill", "none").attr("stroke", "#333").attr("stroke-dasharray", "4,4");
    g.append("text").attr("x", center.x).attr("y", center.y - radiusPeriphery - 10)
        .attr("text-anchor", "middle").attr("fill", "#555").text("PERIFERIA");

    // Círculo Núcleo
    g.append("circle").attr("cx", center.x).attr("cy", center.y).attr("r", radiusCore)
        .attr("fill", "rgba(255, 42, 109, 0.1)").attr("stroke", "#ff2a6d");
    g.append("text").attr("x", center.x).attr("y", center.y).attr("dy", 5)
        .attr("text-anchor", "middle").attr("fill", "#ff2a6d").style("font-weight", "bold").text("CORE");

    // Simulação para posicionar os pontos
    const simulation = d3.forceSimulation(data)
        .force("charge", d3.forceManyBody().strength(-5)) // Evita sobreposição
        .force("collide", d3.forceCollide(6))
        .force("r", d3.forceRadial(d => d.role === "Core" ? 0 : radiusPeriphery, center.x, center.y).strength(0.8));

    const nodes = g.selectAll("circle.node")
        .data(data).enter().append("circle")
        .attr("r", d => d.role === "Core" ? 6 : 3)
        .attr("fill", d => d.role === "Core" ? "#ff2a6d" : "#444")
        .attr("opacity", 0.8);

    simulation.on("tick", () => {
        nodes.attr("cx", d => d.x).attr("cy", d => d.y);
    });
}