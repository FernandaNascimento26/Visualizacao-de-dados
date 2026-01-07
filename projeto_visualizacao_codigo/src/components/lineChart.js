let svg;
let width = 400;
let height = 300;
let margin = { top: 20, right: 20, bottom: 40, left: 50 };

let xScale, yScale;
let line;
let g;

/**
 * Inicializa o gráfico de linha
 */
export function init(selector) {
    svg = d3.select(selector)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    xScale = d3.scaleLinear()
        .range([0, innerWidth]);

    yScale = d3.scaleLinear()
        .range([innerHeight, 0]);

    line = d3.line()
        .x((d, i) => xScale(i))
        .y(d => yScale(d));

    // Eixos
    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${innerHeight})`);

    g.append("g")
        .attr("class", "y-axis");
}

/**
 * Atualiza o gráfico conforme a cena
 * scene = { data: [], color: "" }
 */
export function update({ data, color }) {
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Domínios
    xScale.domain([0, data.length - 1]);
    yScale.domain([0, d3.max(data)]).nice();

    // Atualiza eixos
    g.select(".x-axis")
        .transition()
        .duration(600)
        .call(d3.axisBottom(xScale).ticks(data.length));

    g.select(".y-axis")
        .transition()
        .duration(600)
        .call(d3.axisLeft(yScale));

    // Linha
    const path = g.selectAll(".line-path")
        .data([data]);

    path.enter()
        .append("path")
        .attr("class", "line-path")
        .merge(path)
        .transition()
        .duration(800)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 3)
        .attr("d", line);

    path.exit().remove();

    // Pontos
    const points = g.selectAll(".point")
        .data(data);

    points.enter()
        .append("circle")
        .attr("class", "point")
        .merge(points)
        .transition()
        .duration(600)
        .attr("cx", (d, i) => xScale(i))
        .attr("cy", d => yScale(d))
        .attr("r", 4)
        .attr("fill", color);

    points.exit().remove();
}

/**
 * Remove o gráfico (quando trocar de tipo)
 */
export function destroy() {
    svg.remove();
}
