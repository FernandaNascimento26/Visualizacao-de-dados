import { networkData } from "../data/networkData.js";

let svg, width = 800, height = 600;
let simulation;
let tooltip;

// 1. Criamos uma escala de cores automática (Paleta Tableau 10 ou Set3 para mais variedade)
// O D3 vai atribuir uma cor única para cada ID de grupo que encontrar
const colorScale = d3.scaleOrdinal(d3.schemeTableau10); 

export function init(selector) {
    // Limpeza
    d3.select(selector).select("svg").remove();
    d3.select("body").selectAll(".network-tooltip").remove();

    // SVG
    svg = d3.select(selector).append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`);

    // Tooltip
    tooltip = d3.select("body").append("div")
        .attr("class", "network-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "rgba(10, 10, 10, 0.95)") 
        .style("border", "1px solid #444") // Borda neutra inicial
        .style("padding", "15px")
        .style("border-radius", "8px")
        .style("color", "#fff")
        .style("font-family", "Courier New")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("z-index", "9999")
        .style("box-shadow", "0 0 15px rgba(0, 0, 0, 0.5)")
        .style("min-width", "220px")
        .style("text-align", "center");
}

export function update({ period, title }) {
    svg.selectAll("*").remove();

    // Título
    svg.append("text").attr("x", width/2).attr("y", 40).attr("text-anchor", "middle")
        .attr("fill", "#fff").style("font-size", "22px").style("font-family", "Courier New").text(title);

    // Carrega dados
    const rawData = networkData[period] || networkData['p2'];
    if (!rawData) return;

    const nodes = JSON.parse(JSON.stringify(rawData.nodes));
    let links = JSON.parse(JSON.stringify(rawData.links));

    // Filtro de segurança
    const nodeIds = new Set(nodes.map(n => n.id));
    links = links.filter(l => nodeIds.has(l.source) && nodeIds.has(l.target));

    const g = svg.append("g");

    // Física
    simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(50))
        .force("charge", d3.forceManyBody().strength(-100))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide().radius(d => (d.val * 1.5) + 2));

    // Zoom
    const zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => g.attr("transform", event.transform));

    svg.call(zoom).on("dblclick.zoom", null);

    // Arestas
    const link = g.append("g")
        .selectAll("line")
        .data(links).enter().append("line")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", d => Math.sqrt(d.value || 1));

    // Nós
    const node = g.append("g")
        .selectAll("circle")
        .data(nodes).enter().append("circle")
        .attr("r", d => (d.val ? d.val * 1.5 : 4) + 3)
        
        // --- AQUI ESTÁ A MUDANÇA DE COR ---
        // Usa a escala automática baseada no número do grupo
        .attr("fill", d => colorScale(d.group))
        
        .attr("stroke", "#fff").attr("stroke-width", 1)
        .call(drag(simulation))

        // Interatividade
        .on("mouseover", function(event, d) {
            // Pega a cor exata deste nó para usar no highlight e tooltip
            const nodeColor = colorScale(d.group);

            d3.select(this)
                .transition().duration(200)
                .attr("stroke", "#fff")
                .attr("stroke-width", 4)
                .attr("r", (d.val * 1.5 + 3) * 1.4);
            
            const imgUrl = `public/img/clouds/user_${d.id}.png`;

            // Atualiza borda do tooltip para combinar com a cor da comunidade
            tooltip.style("border", `1px solid ${nodeColor}`)
                   .style("box-shadow", `0 0 15px ${nodeColor}40`); // 40 é transparência hex

            tooltip.style("visibility", "visible")
                   .html(`
                       <div style="border-bottom: 1px solid #333; margin-bottom: 8px; padding-bottom: 5px;">
                           <strong style="color: ${nodeColor}; text-shadow: 0 0 5px ${nodeColor}40;">
                               AGENTE: ${d.id.substring(0, 6)}...
                           </strong>
                       </div>
                       
                       <img src="${imgUrl}" 
                            style="width: 200px; height: 200px; object-fit: contain; background: #000; border-radius: 4px;"
                            onerror="this.style.display='none'; this.parentNode.insertAdjacentHTML('beforeend', '<div style=\\'padding:20px 0; color:#777; font-size:11px;\\'>Sem conteúdo tóxico detectado<br>(Score < 0.7)</div>')"
                       />
                       
                       <div style="margin-top: 8px; font-size: 10px; color: #aaa;">
                           <span style="color:${nodeColor}">●</span> Comunidade: ${d.group} | Grau: ${d.val}
                       </div>
                   `);
        })
        .on("mousemove", function(event) {
            tooltip.style("top", (event.pageY - 280) + "px")
                   .style("left", (event.pageX + 20) + "px");
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition().duration(200)
                .attr("stroke", "#fff").attr("stroke-width", 1)
                .attr("r", d => (d.val ? d.val * 1.5 : 4) + 3);
            tooltip.style("visibility", "hidden");
        });

    simulation.on("tick", () => {
        link.attr("x1", d => d.source.x).attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
        node.attr("cx", d => d.x).attr("cy", d => d.y);
    });
}

function drag(simulation) {
    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }
    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }
    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }
    return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
}