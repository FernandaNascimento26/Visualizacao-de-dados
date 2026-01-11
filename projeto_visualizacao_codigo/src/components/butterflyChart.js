let svg, width = 800, height = 500;
// Aumentei as margens laterais para segurança
let margin = { top: 70, right: 50, bottom: 30, left: 50 };

export function init(selector) {
    d3.select(selector).select("svg").remove();
    // SVG Responsivo
    svg = d3.select(selector).append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`);
}

export function update({ dataLeft, dataRight, colorLeft, colorRight, title }) {
    svg.selectAll("*").remove();
    
    // Título Principal
    svg.append("text")
        .attr("x", width/2)
        .attr("y", 40)
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .style("font-size", "24px")
        .style("font-weight", "bold")
        .style("font-family", "Courier New")
        .style("text-transform", "uppercase")
        .style("letter-spacing", "3px")
        .text(title);

    // Configurações de Layout
    const center = width / 2;
    const barHeight = 25; // Barra mais fina e elegante
    const rowHeight = 70; // Altura total de cada linha (Texto + Barra + Espaço)
    const gap = 40; // Espaço pequeno entre os dois blocos (apenas visual)
    
    // Calcula o valor máximo para a escala
    const maxVal = Math.max(d3.max(dataLeft, d=>d.value), d3.max(dataRight, d=>d.value));
    
    // Escala Horizontal (Ajustada para o novo layout)
    const xScale = d3.scaleLinear()
        .domain([0, maxVal])
        .range([0, (width/2) - margin.left - gap]);

    const g = svg.append("g").attr("transform", `translate(0, ${margin.top + 20})`);

    // --- LADO ESQUERDO (AZUL) ---
    dataLeft.forEach((d, i) => {
        const y = i * rowHeight;
        const barWidth = xScale(d.value);
        
        const row = g.append("g").attr("class", "row-left");

        // 1. O Rótulo (AGORA EM CIMA DA BARRA)
        // Alinhado à direita do seu bloco (perto do centro)
        row.append("text")
            .attr("x", center - gap) 
            .attr("y", y) 
            .attr("text-anchor", "end") 
            .attr("fill", "#aaa")
            .style("font-family", "Roboto Mono")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .text(d.label);

        // 2. A Barra
        row.append("rect")
            .attr("x", center - gap - barWidth)
            .attr("y", y + 10) // 10px abaixo do texto
            .attr("width", barWidth)
            .attr("height", barHeight)
            .attr("fill", colorLeft)
            .attr("opacity", 0.9)
            .attr("rx", 2);

        // 3. O Valor (Dentro da barra ou ao lado)
        row.append("text")
            .attr("x", center - gap - barWidth - 10)
            .attr("y", y + 10 + (barHeight/1.5))
            .attr("text-anchor", "end")
            .attr("fill", colorLeft)
            .style("font-size", "12px")
            .text(d.value);
    });

    // --- LADO DIREITO (VERMELHO) ---
    dataRight.forEach((d, i) => {
        const y = i * rowHeight;
        const barWidth = xScale(d.value);

        const row = g.append("g").attr("class", "row-right");

        // 1. O Rótulo (EM CIMA DA BARRA)
        // Alinhado à esquerda do seu bloco (perto do centro)
        row.append("text")
            .attr("x", center + gap)
            .attr("y", y)
            .attr("text-anchor", "start")
            .attr("fill", "#fff") // Branco para destaque
            .style("font-family", "Roboto Mono")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .style("text-transform", "uppercase") // Caixa alta para impacto
            .text(d.label);

        // 2. A Barra
        row.append("rect")
            .attr("x", center + gap)
            .attr("y", y + 10)
            .attr("width", barWidth)
            .attr("height", barHeight)
            .attr("fill", colorRight)
            .attr("opacity", 0.9)
            .attr("rx", 2);

        // 3. O Valor
        row.append("text")
            .attr("x", center + gap + barWidth + 10)
            .attr("y", y + 10 + (barHeight/1.5))
            .attr("text-anchor", "start")
            .attr("fill", colorRight)
            .style("font-size", "12px")
            .text(d.value);
    });

    // Linha Central Divisória (Estética)
    g.append("line")
        .attr("x1", center)
        .attr("x2", center)
        .attr("y1", -20)
        .attr("y2", height - margin.bottom)
        .attr("stroke", "#333")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "5,5");
}