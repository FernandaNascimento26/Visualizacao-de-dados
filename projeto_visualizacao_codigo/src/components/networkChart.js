import { networkData } from "../data/networkData.js";

let svg, width = 800, height = 600;
let simulation;
let tooltip;

export function init(selector) {
    // 1. Limpeza geral
    d3.select(selector).select("svg").remove();
    d3.select("body").selectAll(".network-tooltip").remove();

    // 2. Container SVG
    svg = d3.select(selector).append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`);

    // 3. Tooltip
    tooltip = d3.select("body").append("div")
        .attr("class", "network-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "rgba(0, 0, 0, 0.9)")
        .style("border", "1px solid #00f3ff")
        .style("padding", "8px")
        .style("border-radius", "4px")
        .style("color", "#fff")
        .style("font-family", "Courier New")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("z-index", "9999");
}

export function update({ period, title }) {
    svg.selectAll("*").remove();

    // Título
    svg.append("text")
        .attr("x", width/2)
        .attr("y", 40)
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .style("font-size", "22px")
        .style("font-family", "Courier New")
        .text(title);

    // --- CORREÇÃO DO ERRO ---
    
    // 1. Carrega os dados brutos
    const rawData = networkData[period];
    if (!rawData) {
        console.error(`Dados para o período '${period}' não encontrados.`);
        return;
    }

    // 2. Faz uma cópia limpa
    const nodes = JSON.parse(JSON.stringify(rawData.nodes));
    let links = JSON.parse(JSON.stringify(rawData.links));

    // 3. [IMPORTANTE] Cria um conjunto com IDs válidos
    const nodeIds = new Set(nodes.map(n => n.id));

    // 4. [IMPORTANTE] Remove links que apontam para nós que não existem
    // Isso evita o erro "node not found"
    links = links.filter(l => nodeIds.has(l.source) && nodeIds.has(l.target));

    console.log(`Renderizando ${nodes.length} nós e ${links.length} conexões.`);

    const g = svg.append("g");

    // Física
    simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(60))
        .force("charge", d3.forceManyBody().strength(-150))
        .force("center", d3.forceCenter(width / 2, height / 2));

  
    const initialScale = 0.2; // ajuste o nível de zoom padrão 
    const initialTx = (width / 2) * (1 - initialScale);
    const initialTy = (height / 2) * (1 - initialScale);
    const initialTransform = d3.zoomIdentity.translate(initialTx, initialTy).scale(initialScale);

    const zoom = d3.zoom()
        .scaleExtent([0.1, 4]) // permitir zoom out até 0.1x e zoom in até 4x
        .on("zoom", (event) => {
            g.attr("transform", event.transform);
        });

    svg.call(zoom).call(zoom.transform, initialTransform);
    svg.call(zoom);

    // Double-click para resetar (zoom out para identidade)
    svg.on("dblclick.zoom", null); // remove comportamento padrão de dblclick se existir
    svg.on("dblclick", () => {
        svg.transition().duration(700).call(zoom.transform, d3.zoomIdentity);
    });

    // Desenha Linhas
    const link = g.append("g")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", d => Math.sqrt(d.value || 1));

    // Desenha Nós
    const node = g.append("g")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", d => (d.val ? d.val * 1.2 : 3) + 3)
        .attr("fill", d => {
            if(d.group === 2) return "#ff2a6d"; // Vermelho
            if(d.group === 25 || d.group === 13) return "#00f3ff"; // Azul
            return "#ffeb3b"; // Amarelo
        })
        .attr("stroke", "#fff").attr("stroke-width", 1.5)
        .call(drag(simulation))
        
        // Interatividade
        .on("mouseover", function(event, d) {
            d3.select(this).attr("stroke", "#00f3ff").attr("stroke-width", 3);
            tooltip.style("visibility", "visible")
                   .html(`
                       <strong>ID:</strong> ${d.id.substring(0, 8)}...<br>
                       <strong>Comunidade:</strong> ${d.group}<br>
                       <strong>Conexões:</strong> ${d.val}
                   `);
        })
        .on("mousemove", function(event) {
            tooltip.style("top", (event.pageY - 10) + "px")
                   .style("left", (event.pageX + 15) + "px");
        })
        .on("mouseout", function() {
            d3.select(this).attr("stroke", "#fff").attr("stroke-width", 1.5);
            tooltip.style("visibility", "hidden");
        });

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
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