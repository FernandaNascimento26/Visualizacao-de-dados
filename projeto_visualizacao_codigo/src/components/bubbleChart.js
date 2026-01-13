let svg, width = 800, height = 600;
// Seleciona ou cria o tooltip
let tooltip = d3.select("body").append("div").attr("class", "tooltip");

export function init(selector) {
    d3.select(selector).select("svg").remove();
    svg = d3.select(selector).append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`);
}

export function update({ data, title }) {
    svg.selectAll("*").remove();

    // Título
    svg.append("text").attr("x", width/2).attr("y", 40).attr("text-anchor", "middle")
        .attr("fill", "#fff").style("font-size", "22px").style("font-family", "Courier New").text(title);

    const g = svg.append("g").attr("transform", `translate(0, 20)`);

    const pack = d3.pack()
        .size([width, height - 50])
        .padding(5);

    const root = d3.hierarchy({ children: data })
        .sum(d => d.volume)
        .sort((a, b) => b.value - a.value);

    pack(root);

    const nodes = g.selectAll("g")
        .data(root.leaves())
        .enter().append("g")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    nodes.append("circle")
        .attr("r", 0)
        .attr("fill", d => {
            const intensity = d.data.score / 100; 
            return d3.interpolateRgb("#97a39c", "#00ff00")(intensity);
        })
        .attr("stroke", "#000")
        .attr("fill-opacity", 0.7)
        // --- INÍCIO DA LÓGICA DO TOOLTIP ---
        .on("mouseover", function(event, d) {
            d3.select(this).attr("stroke", "#fff").attr("fill-opacity", 1); // Highlight
            tooltip.transition().duration(200).style("opacity", 1);
            tooltip.html(`
                <strong>ID:</strong> ${d.data.id}<br/>
                <strong>Volume:</strong> ${d.data.volume}<br/>
                <strong>Score Desinformação:</strong> ${d.data.score}%
            `);
        })
        .on("mousemove", function(event) {
            tooltip
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseleave", function() {
            d3.select(this).attr("stroke", "#000").attr("fill-opacity", 0.7); // Reset
            tooltip.transition().duration(500).style("opacity", 0);
        })
        // --- FIM DA LÓGICA DO TOOLTIP ---
        .transition().duration(1000)
        .attr("r", d => d.r);

    nodes.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 4)
        .text(d => d.data.id)
        .style("pointer-events", "none") // Impede que o texto bloqueie o hover do círculo
        .style("font-family", "Roboto Mono")
        .style("font-size", d => Math.min(d.r / 2, 12) + "px")
        .attr("fill", "#000")
        .style("font-weight", "bold")
        .style("opacity", d => d.r > 15 ? 1 : 0);
}