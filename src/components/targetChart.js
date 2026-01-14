import { targetData } from "../data/targetData.js";

let svg, width = 800, height = 600;
let center = { x: width / 2, y: height / 2 };
let tooltip;

// Raios das zonas
const coreRadius = 90;
const peripheryRadiusMin = 130;
const peripheryRadiusMax = 280;

export function init(selector) {
    d3.select(selector).select("svg").remove();
    d3.select("body").select(".target-tooltip").remove();
    
    const container = d3.select(selector);
    const box = container.node().getBoundingClientRect();
    width = box.width || 800;
    height = box.height || 600;
    center = { x: width / 2, y: height / 2 };

    // 1. Cria o SVG
    svg = container.append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("overflow", "visible");

    // 2. Filtros de Brilho (Glow)
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "glow-core");
    filter.append("feGaussianBlur").attr("stdDeviation", "2.5").attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // 3. Cria o Tooltip
    tooltip = d3.select("body").append("div")
        .attr("class", "target-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "rgba(10, 10, 10, 0.95)")
        .style("border", "1px solid #fff")
        .style("padding", "8px 12px")
        .style("border-radius", "4px")
        .style("color", "#fff")
        .style("font-family", "Courier New")
        .style("font-size", "12px")
        .style("pointer-events", "none") // O mouse ignora o tooltip e foca na bolinha
        .style("z-index", "9999")
        .style("box-shadow", "0 0 15px rgba(0,0,0,0.5)");
}

// Calcula posição aleatória nos anéis
function getPos(role) {
    const angle = Math.random() * 2 * Math.PI;
    let r;
    
    if (role === "Core") {
        r = Math.sqrt(Math.random()) * coreRadius;
    } else {
        r = Math.sqrt(Math.random() * (peripheryRadiusMax**2 - peripheryRadiusMin**2) + peripheryRadiusMin**2);
    }
    
    return {
        x: center.x + r * Math.cos(angle),
        y: center.y + r * Math.sin(angle)
    };
}

export function update({ title, periodStart, periodEnd }) {
    svg.selectAll("*").remove();

    // Título
    svg.append("text")
        .attr("x", width/2).attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .style("font-size", "22px").style("font-family", "Courier New")
        .style("text-transform", "uppercase").style("letter-spacing", "2px")
        .text(title);

    const g = svg.append("g");

    // --- DESENHA A ESTRUTURA (ALVOS) ---
    // Zona Core
    g.append("circle")
        .attr("cx", center.x).attr("cy", center.y).attr("r", coreRadius + 10)
        .attr("fill", "rgba(255, 42, 109, 0.05)")
        .attr("stroke", "#ff2a6d").attr("stroke-width", 1).attr("stroke-dasharray", "4 2");
    
    g.append("text").attr("x", center.x).attr("y", center.y).attr("dy", "0.3em").attr("text-anchor", "middle")
        .attr("fill", "#ff2a6d").style("font-family", "Courier New").style("font-weight", "bold").style("opacity", 0.6)
        .text("CORE");

    // Zona Periferia
    g.append("circle")
        .attr("cx", center.x).attr("cy", center.y).attr("r", peripheryRadiusMin - 10)
        .attr("fill", "none").attr("stroke", "#00f3ff").attr("stroke-width", 0.5).attr("stroke-dasharray", "2 2").attr("opacity", 0.5);
    
    g.append("text").attr("x", center.x).attr("y", center.y - peripheryRadiusMin - 15).attr("text-anchor", "middle")
        .attr("fill", "#00f3ff").style("font-family", "Courier New").style("font-size", "10px").style("opacity", 0.8)
        .text("PERIFERIA");

    // --- PREPARA DADOS ---
    const nodes = targetData.map(d => {
        const start = getPos(d[periodStart]);
        const end = getPos(d[periodEnd]);
        return {
            id: d.id,
            roleStart: d[periodStart],
            roleEnd: d[periodEnd],
            x1: start.x, y1: start.y,
            x2: end.x,   y2: end.y
        };
    });

    // --- DESENHA PONTOS E INTERAÇÃO ---
    const circles = g.selectAll(".node")
        .data(nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("cx", d => d.x1)
        .attr("cy", d => d.y1)
        .attr("r", 3)
        // Cor inicial
        .attr("fill", d => d.roleStart === "Core" ? "#ff2a6d" : "#00f3ff")
        .attr("opacity", 0.8)
        .style("cursor", "crosshair") // Cursor de mira para dar efeito de análise
        
        // INTERAÇÃO DO TOOLTIP
        .on("mouseover", function(event, d) {
            // Realce visual no nó
            d3.select(this)
                .transition().duration(100)
                .attr("r", 8) // Aumenta bolinha
                .attr("fill", "#fff") // Fica branca
                .style("filter", "url(#glow-core)"); // Brilha muito

            // Define cor do texto baseada no destino
            const colorEnd = d.roleEnd === "Core" ? "#ff2a6d" : "#00f3ff";

            tooltip.style("visibility", "visible")
                .style("border-color", colorEnd)
                .html(`
                    <div style="font-size:10px; color:#aaa; margin-bottom:2px;">USER ID (HASH)</div>
                    <div style="font-weight:bold; color:#fff; font-size:12px; margin-bottom:5px;">${d.id.substring(0, 12)}...</div>
                    <div style="font-size:11px;">
                        <span style="color:${d.roleStart==='Core'?'#ff2a6d':'#00f3ff'}">${d.roleStart}</span>
                        <span style="color:#fff"> ➔ </span>
                        <span style="color:${d.roleEnd==='Core'?'#ff2a6d':'#00f3ff'}">${d.roleEnd}</span>
                    </div>
                `);
        })
        .on("mousemove", function(event) {
            tooltip
                .style("top", (event.pageY - 40) + "px")
                .style("left", (event.pageX + 15) + "px");
        })
        .on("mouseout", function(event, d) {
            // Restaura estado original
            const currentColor = d.roleEnd === "Core" ? "#ff2a6d" : "#00f3ff";
            
            d3.select(this)
                .transition().duration(200)
                .attr("r", d.roleStart !== d.roleEnd ? 5 : 3) // Mantém tamanho final da animação
                .attr("fill", currentColor)
                .style("filter", d.roleEnd === "Core" ? "url(#glow-core)" : "none");

            tooltip.style("visibility", "hidden");
        });

    // --- ANIMAÇÃO DE TRANSIÇÃO ---
    circles.transition()
        .delay((d, i) => i * 0.5)
        .duration(2500)
        .ease(d3.easeCubicInOut)
        .attr("cx", d => d.x2)
        .attr("cy", d => d.y2)
        .attr("fill", d => d.roleEnd === "Core" ? "#ff2a6d" : "#00f3ff")
        // Se mudou de papel, fica um pouco maior para destacar a migração
        .attr("r", d => d.roleStart !== d.roleEnd ? 5 : 3)
        .style("filter", d => d.roleEnd === "Core" ? "url(#glow-core)" : "none");
}