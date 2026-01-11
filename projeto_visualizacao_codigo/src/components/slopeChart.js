let svg;
let width = 600;
let height = 400;
let margin = { top: 40, right: 100, bottom: 40, left: 100 }; // Margens largas para os nomes

let yScale;
let g;

export function init(selector) {
    d3.select(selector).select("svg").remove();

    svg = d3.select(selector)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Eixos verticais (apenas linhas guias)
    g.append("line").attr("x1", 0).attr("x2", 0).attr("y1", 0).attr("y2", height - margin.top - margin.bottom).attr("stroke", "#ccc");
    g.append("line").attr("x1", width - margin.left - margin.right).attr("x2", width - margin.left - margin.right).attr("y1", 0).attr("y2", height - margin.top - margin.bottom).attr("stroke", "#ccc");
    
    // Texto dos eixos
    g.append("text").attr("x", 0).attr("y", -10).attr("text-anchor", "middle").style("font-weight", "bold").text("PRÉ (Campanha)");
    g.append("text").attr("x", width - margin.left - margin.right).attr("y", -10).attr("text-anchor", "middle").style("font-weight", "bold").text("PÓS (Golpe)");
}

export function update({ data, color }) {
    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;

    // Escala Y baseada no valor máximo
    const maxVal = d3.max(data, d => Math.max(d.start, d.end));
    yScale = d3.scaleLinear().domain([0, maxVal]).range([innerHeight, 0]);

    // Linhas (Slopes)
    const lines = g.selectAll(".slope-line").data(data);

    lines.enter()
        .append("line")
        .attr("class", "slope-line")
        .attr("x1", 0)
        .attr("x2", innerWidth)
        .attr("y1", d => yScale(d.start))
        .attr("y2", d => yScale(d.end))
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("opacity", 0)
        .transition().duration(1000)
        .attr("opacity", 1);

    // Bolinhas (Start)
    g.selectAll(".circle-start").data(data).enter()
        .append("circle").attr("cx", 0).attr("cy", d => yScale(d.start)).attr("r", 5).attr("fill", color);

    // Bolinhas (End)
    g.selectAll(".circle-end").data(data).enter()
        .append("circle").attr("cx", innerWidth).attr("cy", d => yScale(d.end)).attr("r", 5).attr("fill", color);

    // Rótulos (Nomes e Valores)
    // Esquerda
    g.selectAll(".label-start").data(data).enter()
        .append("text")
        .attr("x", -10)
        .attr("y", d => yScale(d.start) + 4)
        .attr("text-anchor", "end")
        .style("font-size", "12px")
        .text(d => `${d.label} (${d.start})`);

    // Direita
    g.selectAll(".label-end").data(data).enter()
        .append("text")
        .attr("x", innerWidth + 10)
        .attr("y", d => yScale(d.end) + 4)
        .attr("text-anchor", "start")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text(d => `${d.end}`);
}