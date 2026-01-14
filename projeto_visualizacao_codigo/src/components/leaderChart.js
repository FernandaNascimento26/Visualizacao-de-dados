import { leaderData } from "../data/leaderData.js";

let svg, width = 800, height = 500;
let margin = { top: 50, right: 20, bottom: 20, left: 20 };

export function init(selector) {
    d3.select(selector).selectAll("*").remove();

    const container = d3.select(selector);
    const box = container.node().getBoundingClientRect();
    width = box.width || 800;
    height = box.height || 500;

    svg = container.append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("overflow", "visible");

    // Definições de Gradientes (AJUSTADO PARA MAIS VIBRANTE)
    const defs = svg.append("defs");
    
    // Gradiente Azul (Esquerda)
    const gradLeft = defs.append("linearGradient")
        .attr("id", "gradLeft")
        .attr("x1", "100%").attr("y1", "0%")
        .attr("x2", "0%").attr("y2", "0%");
    gradLeft.append("stop").attr("offset", "0%").style("stop-color", "#00f3ff").style("stop-opacity", 1);
    // Opacidade aumentada para 0.6 para ficar mais sólido
    gradLeft.append("stop").attr("offset", "100%").style("stop-color", "#00f3ff").style("stop-opacity", 0.6); 

    // Gradiente Rosa (Direita)
    const gradRight = defs.append("linearGradient")
        .attr("id", "gradRight")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "100%").attr("y2", "0%");
    gradRight.append("stop").attr("offset", "0%").style("stop-color", "#ff2a6d").style("stop-opacity", 1);
    // Opacidade aumentada para 0.6
    gradRight.append("stop").attr("offset", "100%").style("stop-color", "#ff2a6d").style("stop-opacity", 0.6);
}

export function update({ periodLeft, periodRight }) {
    svg.selectAll(".content-layer").remove();
    const g = svg.append("g").attr("class", "content-layer");

    const dataL = (leaderData[periodLeft] || []).slice(0, 5);
    const dataR = (leaderData[periodRight] || []).slice(0, 5);

    // Configuração do Layout
    const center = width / 2;
    const barHeight = 40;
    const gap = 12; 
    const centerGap = 80; // Espaço central para os textos não colarem
    const maxBarWidth = (width / 2) - margin.left - (centerGap / 2);

    // Escalas
    const maxVal = d3.max([...dataL, ...dataR], d => d.value) || 100;
    
    const scaleX = d3.scaleLinear().domain([0, maxVal]).range([0, maxBarWidth]);
    const scaleY = d3.scaleBand()
        .domain(d3.range(5))
        .range([margin.top + 50, margin.top + 50 + (5 * (barHeight + gap))])
        .padding(0.1);

    // --- CONECTORES ---
    const connectors = g.append("g").attr("class", "connectors");
    dataL.forEach((dL, iL) => {
        const iR = dataR.findIndex(dR => dR.id === dL.id);
        if (iR !== -1) {
            const yL = scaleY(iL) + barHeight / 2;
            const yR = scaleY(iR) + barHeight / 2;
            
            connectors.append("path")
                .attr("d", d3.linkHorizontal()({
                    source: [center - centerGap/2, yL],
                    target: [center + centerGap/2, yR]
                }))
                .attr("fill", "none")
                .attr("stroke", "rgba(255, 255, 255, 0.1)")
                .attr("stroke-width", 1)
                .attr("stroke-dasharray", "2 2")
                .attr("class", `connector-${dL.id}`);
        }
    });

    // --- FUNÇÃO DE DESENHO ---
    const drawSide = (data, isLeft) => {
        const sideG = g.append("g");
        const xStart = isLeft ? center - (centerGap / 2) : center + (centerGap / 2);
        // Cores principais para o Glow
        const color = isLeft ? "#00f3ff" : "#ff2a6d"; 
        const gradId = isLeft ? "url(#gradLeft)" : "url(#gradRight)";

        // Título
        sideG.append("text")
            .attr("x", xStart + (isLeft ? -maxBarWidth/2 : maxBarWidth/2))
            .attr("y", margin.top)
            .attr("text-anchor", "middle")
            .attr("fill", color)
            .style("font-family", "Courier New")
            .style("font-size", "18px")
            .style("font-weight", "bold")
            .style("text-shadow", `0 0 15px ${color}`) // Glow no título
            .text(isLeft ? "PRÉ-ELEIÇÃO" : "PÓS-ELEIÇÃO");

        const bars = sideG.selectAll(".bar-group")
            .data(data)
            .enter().append("g")
            .attr("transform", (d, i) => `translate(0, ${scaleY(i)})`);

        // 1. Fundo da Barra (Trilho)
        bars.append("rect")
            .attr("x", isLeft ? xStart - maxBarWidth : xStart)
            .attr("y", 0)
            .attr("width", maxBarWidth)
            .attr("height", barHeight)
            .attr("fill", "rgba(255,255,255,0.03)")
            .attr("rx", 4);

        // 2. Barra Colorida (Valor) + GLOW
        bars.append("rect")
            .attr("x", isLeft ? xStart : xStart)
            .attr("y", 0)
            .attr("height", barHeight)
            .attr("width", 0)
            .attr("fill", gradId)
            // --- AQUI ESTÁ O GLOW (Brilho Neon) ---
            .style("filter", `drop-shadow(0 0 8px ${color})`) 
            .attr("rx", 4)
            .transition().duration(1000).delay((d, i) => i * 100)
            .attr("width", d => scaleX(d.value))
            .attr("x", d => isLeft ? xStart - scaleX(d.value) : xStart);

        // 3. TEXTOS (Dentro da barra, alinhados ao centro)
        // ID
        bars.append("text")
            .attr("x", isLeft ? xStart - 15 : xStart + 15)
            .attr("y", barHeight / 2 - 3)
            .attr("text-anchor", isLeft ? "end" : "start")
            .attr("fill", "#fff")
            .style("font-family", "Courier New")
            .style("font-size", "13px")
            .style("font-weight", "bold")
            .style("text-shadow", "0px 1px 3px rgba(0,0,0,0.8)") // Sombra forte para ler
            .text((d, i) => `${i + 1}. ${d.id.substring(0,8)}...`);

        // Valor e UF
        bars.append("text")
            .attr("x", isLeft ? xStart - 15 : xStart + 15)
            .attr("y", barHeight / 2 + 11)
            .attr("text-anchor", isLeft ? "end" : "start")
            .attr("fill", "rgba(255,255,255,0.9)")
            .style("font-family", "Courier New")
            .style("font-size", "10px")
            .style("text-shadow", "0px 1px 3px rgba(0,0,0,0.8)")
            .text(d => `${d.value} interações | UF: ${d.uf || '--'}`);

        // 4. Hitbox para Hover
        bars.append("rect")
            .attr("x", isLeft ? xStart - maxBarWidth : xStart)
            .attr("y", 0)
            .attr("width", maxBarWidth)
            .attr("height", barHeight)
            .attr("fill", "transparent")
            .style("cursor", "pointer")
            .on("mouseover", function(event, d) {
                // Diminui o brilho dos outros
                svg.selectAll("rect").filter(function() { return this !== event.target && !this.classList.contains("bg"); })
                   .transition().style("opacity", 0.3).style("filter", "none");
                svg.selectAll("text").transition().style("opacity", 0.3);
                
                // Realça o atual
                const parent = d3.select(this.parentNode);
                parent.selectAll("rect").transition().style("opacity", 1).style("filter", `drop-shadow(0 0 15px ${color})`);
                parent.selectAll("text").transition().style("opacity", 1);
                
                // Realça conector
                d3.selectAll(`.connector-${d.id}`)
                    .transition()
                    .attr("stroke", "#fff")
                    .attr("stroke-width", 2)
                    .style("opacity", 1);
            })
            .on("mouseout", function() {
                // Restaura tudo
                svg.selectAll("rect").transition().style("opacity", 1).style("filter", function() {
                     // Restaura o filtro original baseado no lado
                     const isLeftBar = d3.select(this.parentNode.parentNode).select("text").text() === "PRÉ-ELEIÇÃO";
                     return `drop-shadow(0 0 8px ${isLeftBar ? "#00f3ff" : "#ff2a6d"})`;
                });
                svg.selectAll("text").transition().style("opacity", 1);
                d3.selectAll(".connectors path")
                    .transition()
                    .attr("stroke", "rgba(255, 255, 255, 0.1)")
                    .attr("stroke-width", 1);
            });
    };

    drawSide(dataL, true);
    drawSide(dataR, false);
}