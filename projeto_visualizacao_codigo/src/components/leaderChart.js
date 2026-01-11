let svg, width = 800, height = 500;
let margin = { top: 60, right: 50, bottom: 30, left: 150 };

export function init(selector) {
    d3.select(selector).select("svg").remove();
    svg = d3.select(selector).append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`);
}

export function update({ data, title, color }) {
    svg.selectAll("*").remove();

    svg.append("text").attr("x", width/2).attr("y", 40).attr("text-anchor", "middle")
        .attr("fill", "#fff").style("font-size", "22px").style("font-family", "Courier New").text(title);

    const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Escalas
    const yScale = d3.scaleBand()
        .domain(data.map(d => d.label))
        .range([0, innerHeight])
        .padding(0.4);

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([0, innerWidth]);

    // Barras (Fundo Cinza Escuro)
    g.selectAll(".bg-bar")
        .data(data).enter().append("rect")
        .attr("y", d => yScale(d.label))
        .attr("width", innerWidth)
        .attr("height", yScale.bandwidth())
        .attr("fill", "#222")
        .attr("rx", 4);

    // Barras de Valor (Animadas)
    g.selectAll(".bar")
        .data(data).enter().append("rect")
        .attr("y", d => yScale(d.label))
        .attr("height", yScale.bandwidth())
        .attr("x", 0)
        .attr("width", 0) // Começa em 0
        .attr("fill", color)
        .attr("rx", 4)
        .transition().duration(1500)
        .attr("width", d => xScale(d.value));

    // Nomes (Eixo Y)
    g.selectAll(".label")
        .data(data).enter().append("text")
        .attr("x", -10)
        .attr("y", d => yScale(d.label) + yScale.bandwidth()/2 + 5)
        .attr("text-anchor", "end")
        .text(d => d.label)
        .attr("fill", "#fff")
        .style("font-family", "Courier New");

    // Valores (Na ponta da barra)
    g.selectAll(".value")
        .data(data).enter().append("text")
        .attr("x", d => xScale(d.value) + 10)
        .attr("y", d => yScale(d.label) + yScale.bandwidth()/2 + 5)
        .text(d => d.value)
        .attr("fill", color)
        .style("font-weight", "bold")
        .style("font-family", "Roboto Mono")
        .style("opacity", 0)
        .transition().delay(1000).duration(500)
        .style("opacity", 1);
}