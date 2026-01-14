import { bubbleData } from "../data/bubbleData.js";

let svg, width = 800, height = 600;

// Cria Tooltip (se não existir)
let tooltip = d3.select("body").select(".bubble-tooltip");
if (tooltip.empty()) {
    tooltip = d3.select("body").append("div")
        .attr("class", "bubble-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "rgba(10, 10, 10, 0.95)")
        .style("border", "1px solid #fff")
        .style("padding", "12px")
        .style("border-radius", "6px")
        .style("color", "#fff")
        .style("font-family", "Courier New")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("z-index", "9999")
        .style("box-shadow", "0 0 20px rgba(0,0,0,0.5)");
}

export function init(selector) {
    d3.select(selector).select("svg").remove();
    svg = d3.select(selector).append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("overflow", "visible");
}

export function update({ title }) {
    svg.selectAll("*").remove();

    // 1. Título do Gráfico
    svg.append("text")
        .attr("x", width/2).attr("y", 30).attr("text-anchor", "middle")
        .attr("fill", "#fff").style("font-size", "22px").style("font-family", "Courier New")
        .style("text-transform", "uppercase")
        .style("letter-spacing", "2px")
        .text(title || "INTENSIDADE POR COMUNIDADE");

    // 2. Prepara Dados
    const p1 = bubbleData.p1 || [];
    const p2 = bubbleData.p2 || [];
    const allData = [...p1, ...p2];
    
    if (allData.length === 0) return;

    const g = svg.append("g").attr("transform", `translate(0, 40)`);

    // 3. Layout (Circle Packing)
    const pack = d3.pack()
        .size([width, height - 50])
        .padding(4); // Um pouco mais de espaço entre bolhas

    const root = d3.hierarchy({ children: allData })
        .sum(d => Number(d.volume) || 0)
        .sort((a, b) => b.value - a.value);

    pack(root);

    // 4. Desenha Bolhas
    const nodes = g.selectAll("g")
        .data(root.leaves())
        .enter().append("g")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    nodes.append("circle")
        .attr("r", 0) // Animação de entrada
        .attr("fill", d => {
            if (d.data.score >= 0.7) return "#ff0000"; // Vermelho Alerta
            return d.data.period === "p1" ? "#00f3ff" : "#ff2a6d"; // Cores Neon Padrão
        })
        .attr("stroke", d => d.data.score >= 0.7 ? "#ffff00" : "#fff") 
        .attr("stroke-width", d => d.data.score >= 0.7 ? 2 : 0.5)
        .attr("fill-opacity", d => d.data.score >= 0.7 ? 0.9 : 0.4)
        
        // --- TOOLTIP (Ajustado) ---
        .on("mouseover", function(event, d) {
            d3.select(this).attr("stroke", "#fff").attr("stroke-width", 3).attr("fill-opacity", 1);
            
            const isDanger = d.data.score >= 0.7;
            const color = isDanger ? "#ff0000" : (d.data.period === "p1" ? "#00f3ff" : "#ff2a6d");
            
            // Tratamento do ID (Remove "Comunidade " se existir para limpar)
            const cleanId = d.data.id.replace(/Comunidade /i, "");

            // Lista de Usuários
            let usersHtml = "";
            if (d.data.top_users && d.data.top_users.length > 0) {
                usersHtml = `
                    <div style="margin-top:8px; border-top:1px solid #444; padding-top:4px; color:#aaa; font-size:9px; letter-spacing:1px; text-transform:uppercase;">
                        Líderes (Nós Centrais):
                    </div>
                    <ul style="margin:2px 0; padding-left:15px; font-size:10px; color:#eee;">
                        ${d.data.top_users.map(u => `<li>${u}</li>`).join('')}
                    </ul>
                `;
            }

            tooltip.style("visibility", "visible")
                   .style("border-color", color)
                   .html(`
                       <div style="font-size:10px; color:#aaa; letter-spacing:1px;">COMUNIDADE (CLUSTER)</div>
                       <div style="color:${color}; font-weight:bold; font-size:20px; margin-bottom:5px;">#${cleanId}</div>
                       
                       <div style="display:flex; gap:15px; font-size:11px;">
                            <div>
                                <span style="color:#aaa">Score:</span> 
                                <strong style="color:${isDanger?'#ff0000':'#fff'}">${d.data.score.toFixed(3)}</strong>
                            </div>
                            <div>
                                <span style="color:#aaa">Volume:</span> 
                                <strong>${d.data.volume}</strong>
                            </div>
                       </div>
                       
                       <div style="font-size:10px; margin-top:4px; color:#ddd; font-style:italic;">
                           ${d.data.period === 'p1' ? 'Período: Pré-Eleição' : 'Período: Pós-Eleição'}
                       </div>
                       
                       ${usersHtml}
                   `);
        })
        .on("mousemove", function(event) {
            tooltip.style("top", (event.pageY - 20) + "px").style("left", (event.pageX + 25) + "px");
        })
        .on("mouseout", function() {
            const isDanger = d3.select(this).datum().data.score >= 0.7;
            d3.select(this)
                .attr("stroke", isDanger ? "#ffff00" : "#fff")
                .attr("stroke-width", isDanger ? 2 : 0.5)
                .attr("fill-opacity", isDanger ? 0.9 : 0.4);
            tooltip.style("visibility", "hidden");
        })
        .transition().duration(1000)
        .attr("r", d => d.r);

    // 5. Texto dentro da Bolha (Apenas o número)
    nodes.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".3em")
        .text(d => d.data.id.replace(/Comunidade /i, "")) // Remove texto, deixa só numero
        .style("font-family", "Courier New")
        .style("font-size", d => Math.min(d.r / 1.5, 14) + "px")
        .attr("fill", "#fff")
        .style("pointer-events", "none")
        .style("font-weight", "bold")
        .style("text-shadow", "0 1px 3px rgba(0,0,0,0.8)")
        .style("opacity", d => d.r > 12 ? 1 : 0); // Só mostra se couber
}