let svg;
let width = 400;
let height = 300;
let margin = { top: 20, right: 20, bottom: 40, left: 50 };

let xScale, yScale;
let g;

/**
 * Inicializa o gráfico de barras
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

    xScale = d3.scaleBand()
        .range([0, innerWidth])
        .padding(0.2);

    yScale = d3.scaleLinear()
        .range([innerHeight, 0]);

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
    xScale.domain(data.map((_, i) => i));
    yScale.domain([0, d3.max(data)]).nice();

    // Atualiza eixos
    g.select(".x-axis")
        .transition()
        .duration(600)
        .call(d3.axisBottom(xScale));

    g.select(".y-axis")
        .transition()
        .duration(600)
        .call(d3.axisLeft(yScale));

    // Barras
    const bars = g.selectAll(".bar")
        .data(data, (d, i) => i);

    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => xScale(i))
        .attr("y", innerHeight)
        .attr("width", xScale.bandwidth())
        .attr("height", 0)
        .attr("fill", color)
        .merge(bars)
        .transition()
        .duration(800)
        .attr("x", (d, i) => xScale(i))
        .attr("y", d => yScale(d))
        .attr("width", xScale.bandwidth())
        .attr("height", d => innerHeight - yScale(d))
        .attr("fill", color);

    bars.exit()
        .transition()
        .duration(400)
        .attr("y", innerHeight)
        .attr("height", 0)
        .remove();
}

/**
 * Remove o gráfico (quando trocar de tipo)
 */
export function destroy() {
    svg.remove();
}
