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

    // Título
    svg.append("text").attr("x", width/2).attr("y", 40).attr("text-anchor", "middle")
        .attr("fill", "#fff").style("font-size", "22px").style("font-family", "Courier New").text(title);

    const g = svg.append("g").attr("transform", `translate(0, 20)`);

    // Configura o Layout de "Empacotamento" (Circle Packing)
    const pack = d3.pack()
        .size([width, height - 50])
        .padding(5);

    // Hierarquia dos dados para o D3
    const root = d3.hierarchy({ children: data })
        .sum(d => d.volume) // Tamanho da bola = Volume de mensagens
        .sort((a, b) => b.value - a.value);

    pack(root);

    // Desenha as Bolhas
    const nodes = g.selectAll("g")
        .data(root.leaves())
        .enter().append("g")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    nodes.append("circle")
        .attr("r", 0) // Começa invisível para animar
        .attr("fill", d => {
            // Escala de cor baseada no Score de Desinformação (0 a 100)
            // Verde Tóxico (#00ff00) para alto risco, Cinza para baixo
            const intensity = d.data.score / 100; 
            return d3.interpolateRgb("#333333", "#00ff00")(intensity);
        })
        .attr("stroke", "#000")
        .attr("fill-opacity", 0.7)
        .transition().duration(1000)
        .attr("r", d => d.r);

    // Texto dentro da bolha (Só se couber)
    nodes.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 4)
        .text(d => d.data.id)
        .style("font-family", "Roboto Mono")
        .style("font-size", d => Math.min(d.r / 2, 12) + "px") // Tamanho dinâmico
        .attr("fill", "#000")
        .style("font-weight", "bold")
        .style("opacity", d => d.r > 15 ? 1 : 0); // Só mostra se a bola for grande
}