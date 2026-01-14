let svg;
// Aumentei a largura base para 900 para dar mais respiro
let width = 900; 
let height = 500;

// [CORREÇÃO] Margens gigantes nas laterais (220px) para garantir que 
// nomes longos como "Agente TO (ef49)" nunca sejam cortados.
let margin = { top: 70, right: 220, bottom: 50, left: 220 };

export function init(selector) {
    d3.select(selector).select("svg").remove();
    
    svg = d3.select(selector)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        // O viewBox garante a proporção, mas o CSS controla o tamanho final
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("overflow", "visible"); // Garante que nada seja cortado se passar um pouco
        
    // Filtro de Glow (Neon)
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "glow");
    filter.append("feGaussianBlur").attr("stdDeviation", "2.5").attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");
}

export function update({ data, color, title }) {
    svg.selectAll("*").remove();

    // Título
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 40)
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .style("font-size", "24px")
        .style("font-weight", "bold")
        .style("font-family", "Courier New")
        .style("letter-spacing", "2px")
        .text(title);

    const g = svg.append("g");

    // Calculamos a largura da área "desenhável" (onde ficam as linhas)
    // Com margens de 220, sobra menos espaço no meio, o que é bom para evitar corte de texto
    const innerWidth = width - margin.left - margin.right;
    
    const maxVal = d3.max(data, d => Math.max(d.start, d.end));
    
    const yScale = d3.scaleLinear()
        .domain([0, maxVal * 1.1]) 
        .range([height - margin.bottom, margin.top]);

    // Posições X das linhas verticais
    const xStart = margin.left;
    const xEnd = width - margin.right;

    // --- EIXOS VERTICAIS (CONTEXTO) ---
    
    // Eixo Esquerdo
    g.append("line")
        .attr("x1", xStart).attr("x2", xStart)
        .attr("y1", margin.top).attr("y2", height - margin.bottom)
        .attr("stroke", "#444").attr("stroke-dasharray", "4,4");

    g.append("text")
        .attr("x", xStart)
        .attr("y", margin.top - 15)
        .attr("text-anchor", "middle")
        .attr("fill", "#888")
        .style("font-family", "Roboto Mono")
        .style("font-size", "14px")
        .text("CAMPANHA");

    // Eixo Direito
    g.append("line")
        .attr("x1", xEnd).attr("x2", xEnd)
        .attr("y1", margin.top).attr("y2", height - margin.bottom)
        .attr("stroke", "#444").attr("stroke-dasharray", "4,4");

    g.append("text")
        .attr("x", xEnd)
        .attr("y", margin.top - 15)
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .style("font-family", "Roboto Mono")
        .style("font-weight", "bold")
        .style("font-size", "14px")
        .text("GOLPE");

    // --- DADOS ---

    data.forEach((d, i) => {
        // Linha Conectora
        g.append("line")
            .attr("x1", xStart)
            .attr("y1", yScale(d.start))
            .attr("x2", xEnd)
            .attr("y2", yScale(d.end))
            .attr("stroke", color || "#00f3ff")
            .attr("stroke-width", 2)
            .style("filter", "url(#glow)")
            .attr("stroke-dasharray", width) 
            .attr("stroke-dashoffset", width)
            .transition().duration(1500).delay(i * 100)
            .attr("stroke-dashoffset", 0);

        // Bolinhas
        g.append("circle")
            .attr("cx", xStart).attr("cy", yScale(d.start))
            .attr("r", 4).attr("fill", "#666");

        g.append("circle")
            .attr("cx", xEnd).attr("cy", yScale(d.end))
            .attr("r", 6).attr("fill", color || "#00f3ff")
            .style("filter", "url(#glow)");

        // --- RÓTULOS (TEXTOS) ---

        // Texto Esquerda (Nome + Valor)
        g.append("text")
            .attr("x", xStart - 15) // Move 15px para esquerda do eixo
            .attr("y", yScale(d.start) + 4)
            .attr("text-anchor", "end") // Alinha o FIM do texto aqui
            .attr("fill", "#aaa")
            .style("font-family", "Roboto Mono")
            .style("font-size", "13px") // Fonte levemente menor
            .text(`${d.label} [${d.start}]`);

        // Texto Direita (Valor Gigante)
        g.append("text")
            .attr("x", xEnd + 15) // Move 15px para direita do eixo
            .attr("y", yScale(d.end) + 4)
            .attr("text-anchor", "start") // Alinha o INÍCIO do texto aqui
            .attr("fill", "#fff")
            .style("font-family", "Roboto Mono")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text(d.end);
    });
}