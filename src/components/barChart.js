let svg;
let width = 600; // Aumentei um pouco
let height = 400;
let margin = { top: 40, right: 30, bottom: 60, left: 60 }; // Margem maior embaixo para o texto

let xScale, yScale;
let g;
let xAxisGroup, yAxisGroup;

export function init(selector) {
    // Limpa svg anterior se houver (segurança)
    d3.select(selector).select("svg").remove();

    svg = d3.select(selector)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    xScale = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(0.3);
    yScale = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);

    xAxisGroup = g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height - margin.top - margin.bottom})`);
        
    yAxisGroup = g.append("g")
        .attr("class", "y-axis");
}

export function update({ data, color, yLabel }) {
    // Atualiza Domínios
    xScale.domain(data.map(d => d.label));
    yScale.domain([0, d3.max(data, d => d.value)]).nice();

    // Atualiza Eixos
    xAxisGroup.transition().duration(600).call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "middle")
        .style("font-size", "12px");

    yAxisGroup.transition().duration(600).call(d3.axisLeft(yScale));

    // Label do Eixo Y (Opcional)
    svg.select(".y-label").remove();
    svg.append("text")
        .attr("class", "y-label")
        .attr("transform", "rotate(-90)")
        .attr("y", 20)
        .attr("x", -height / 2)
        .style("text-anchor", "middle")
        .text(yLabel || "");

    // Barras
    const bars = g.selectAll(".bar").data(data, d => d.label);

    bars.exit().remove();

    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.label))
        .attr("y", height - margin.top - margin.bottom) // Começa de baixo
        .attr("width", xScale.bandwidth())
        .attr("height", 0)
        .attr("fill", color)
        .merge(bars)
        .transition()
        .duration(800)
        .attr("x", d => xScale(d.label))
        .attr("y", d => yScale(d.value))
        .attr("width", xScale.bandwidth())
        .attr("height", d => (height - margin.top - margin.bottom) - yScale(d.value))
        .attr("fill", color);
    
    // Rótulos de Valor (topo da barra)
    const labels = g.selectAll(".val-label").data(data, d => d.label);
    labels.exit().remove();
    labels.enter()
        .append("text")
        .attr("class", "val-label")
        .attr("x", d => xScale(d.label) + xScale.bandwidth()/2)
        .attr("y", d => yScale(d.value) - 5)
        .attr("text-anchor", "middle")
        .text(d => d.value)
        .merge(labels)
        .transition()
        .duration(800)
        .attr("x", d => xScale(d.label) + xScale.bandwidth()/2)
        .attr("y", d => yScale(d.value) - 5)
        .text(d => d.value);
}