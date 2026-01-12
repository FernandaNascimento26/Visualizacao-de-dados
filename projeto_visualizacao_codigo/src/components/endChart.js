let svg;
let width = 800;
let height = 500;

export function init(selector) {
    d3.select(selector).select("svg").remove();
    
    // Cria o container SVG
    svg = d3.select(selector)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("background", "radial-gradient(circle, #1a1a1a 0%, #000 100%)");
}

export function update() {
    svg.selectAll("*").remove(); // Limpa a tela

    const g = svg.append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // --- CORREÇÃO DA ANIMAÇÃO (LOOP) ---
    // Função que faz o elemento piscar recursivamente
    function pulse() {
        const t = d3.select(this).transition()
            .duration(800)
            .style("opacity", 0.4)
            .transition()
            .duration(800)
            .style("opacity", 1)
            .on("end", pulse); // Chama a si mesma quando termina
    }

    // 1. Título "SISTEMA ONLINE"
    const titleText = g.append("text")
        .attr("y", -80)
        .attr("text-anchor", "middle")
        .attr("fill", "#dd360cff") // Ciano Neon
        .style("font-family", "'Courier New', monospace")
        .style("font-size", "28px")
        .style("letter-spacing", "5px")
        .style("font-weight", "bold")
        .text("STATUS: OFFLINE")
        .style("opacity", 1);

    // Inicia a animação de piscar
    titleText.each(pulse);

    // 2. Desenha os 3 Grandes Números
    const spacing = 250;
    
    data.forEach((d, i) => {
        const xPos = (i - 1) * spacing; 

        const group = g.append("g")
            .attr("transform", `translate(${xPos}, 20)`);

        // Rótulo (Label)
        group.append("text")
            .attr("y", 60)
            .attr("text-anchor", "middle")
            .attr("fill", "#888") // Cinza
            .style("font-family", "'Roboto Mono', monospace")
            .style("font-size", "14px")
            .style("text-transform", "uppercase")
            .text(d.label);

        // O Valor (Número com animação de contagem)
        group.append("text")
            .attr("class", "counter")
            .attr("y", 10)
            .attr("text-anchor", "middle")
            .attr("fill", "#fff")
            .style("font-family", "'Roboto Mono', monospace")
            .style("font-size", "42px")
            .style("font-weight", "bold")
            .text(0) // Começa no zero
            .transition()
            .duration(2500) // 2.5 segundos de contagem
            .tween("text", function() {
                const that = d3.select(this);
                const i = d3.interpolateNumber(0, d.value);
                return function(t) {
                    // Formata com pontos (ex: 272.891)
                    that.text(Math.round(i(t)).toLocaleString("pt-BR"));
                };
            });
            
        // Linha decorativa abaixo do número
        group.append("line")
            .attr("x1", -50)
            .attr("x2", 50)
            .attr("y1", 80)
            .attr("y2", 80)
            .attr("stroke", "#333")
            .attr("stroke-width", 2);
    });
}