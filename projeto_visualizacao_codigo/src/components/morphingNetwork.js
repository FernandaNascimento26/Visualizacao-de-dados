import { networkData } from "../data/networkData.js";

let svg, width = 800, height = 600;
let simulation;
let tooltip;
let linkGroup, nodeGroup;
let currentNodes = []; 

const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

export function init(selector) {
    // Limpeza
    d3.select(selector).select("svg").remove();
    d3.select("body").selectAll(".morph-tooltip").remove();

    svg = d3.select(selector).append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("overflow", "visible");

    const g = svg.append("g").attr("class", "zoom-layer");
    linkGroup = g.append("g").attr("class", "links");
    nodeGroup = g.append("g").attr("class", "nodes");

    const zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => g.attr("transform", event.transform));
    svg.call(zoom).on("dblclick.zoom", null);

    tooltip = d3.select("body").append("div")
        .attr("class", "morph-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "rgba(0, 0, 0, 0.9)")
        .style("border", "1px solid #fff")
        .style("padding", "8px")
        .style("border-radius", "4px")
        .style("color", "#fff")
        .style("font-family", "Courier New")
        .style("font-size", "11px")
        .style("pointer-events", "none")
        .style("z-index", "9999");

    simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(d => d.id).distance(40))
        .force("charge", d3.forceManyBody().strength(-30))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide().radius(d => (d.val * 1.5) + 3).iterations(2));
}

export function update({ period, title }) {
    // 1. Verificações de Segurança
    if (!networkData) {
        console.error("ERRO: networkData não importado.");
        return;
    }
    const rawData = networkData[period];
    if (!rawData) {
        console.error(`ERRO: Dados não encontrados para "${period}".`);
        return;
    }

    // Título
    svg.selectAll(".chart-title").remove();
    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2).attr("y", 40).attr("text-anchor", "middle")
        .attr("fill", "#fff").style("font-size", "22px").style("font-family", "Courier New")
        .text(title);

    const newNodes = JSON.parse(JSON.stringify(rawData.nodes));
    let newLinks = JSON.parse(JSON.stringify(rawData.links));

    const nodeIds = new Set(newNodes.map(n => n.id));
    newLinks = newLinks.filter(l => nodeIds.has(l.source) && nodeIds.has(l.target));

    // Lógica de Migração (Preserva Posição)
    const oldNodesMap = new Map(currentNodes.map(n => [n.id, n]));
    newNodes.forEach(n => {
        const old = oldNodesMap.get(n.id);
        if (old) {
            n.x = old.x;
            n.y = old.y;
            n.vx = old.vx;
            n.vy = old.vy;
        } else {
            n.x = width/2 + (Math.random() - 0.5) * 50;
            n.y = height/2 + (Math.random() - 0.5) * 50;
        }
    });
    currentNodes = newNodes;

    // Atualiza Simulação
    simulation.nodes(newNodes);
    simulation.force("link").links(newLinks);
    
    // CORREÇÃO AQUI: Agora forceCluster suporta .strength()
    simulation.force("cluster", forceCluster(newNodes).strength(0.5));
    
    simulation.alpha(1).restart();

    // Renderização Links
    const linkSel = linkGroup.selectAll("line")
        .data(newLinks, d => d.source.id + "-" + d.target.id);
    linkSel.exit().remove();
    const linkEnter = linkSel.enter().append("line")
        .attr("stroke", "#555").attr("stroke-opacity", 0.4)
        .attr("stroke-width", d => Math.sqrt(d.value || 1));
    const linkMerge = linkEnter.merge(linkSel);

    // Renderização Nós
    const nodeSel = nodeGroup.selectAll("circle")
        .data(newNodes, d => d.id);

    nodeSel.exit().transition().duration(500).attr("r", 0).remove();

    const nodeEnter = nodeSel.enter().append("circle")
        .attr("r", 0)
        .attr("stroke", "#fff").attr("stroke-width", 1)
        .call(drag(simulation));

    const nodeMerge = nodeEnter.merge(nodeSel);
    
    nodeMerge.transition().duration(750)
        .attr("r", d => (d.val ? d.val * 1.5 : 4) + 3)
        .attr("fill", d => colorScale(d.group));

    // Tooltip
    nodeMerge
        .on("mouseover", function(event, d) {
            d3.select(this).attr("stroke", "#fff").attr("stroke-width", 3);
            tooltip.style("visibility", "visible")
                   .html(`Agente: ${d.id.substring(0,6)}...<br>Comunidade: ${d.group}`);
        })
        .on("mousemove", event => {
            tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
            d3.select(this).attr("stroke", "#fff").attr("stroke-width", 1);
            tooltip.style("visibility", "hidden");
        });

    simulation.on("tick", () => {
        linkMerge.attr("x1", d => d.source.x).attr("y1", d => d.source.y)
                 .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
        nodeMerge.attr("cx", d => d.x).attr("cy", d => d.y);
    });
}

// --- CORREÇÃO DA FUNÇÃO CUSTOMIZADA ---
function forceCluster(nodes) {
    let strength = 0.1; // Valor padrão
    const nodesByGroup = d3.group(nodes, d => d.group);

    function force(alpha) {
        const groupCenters = new Map();
        
        // Calcula centros
        for (const [group, groupNodes] of nodesByGroup) {
            let x = 0, y = 0, n = 0;
            for (const node of groupNodes) { x += node.x; y += node.y; n++; }
            groupCenters.set(group, { x: x / n, y: y / n });
        }

        // Aplica força
        for (const node of nodes) {
            const center = groupCenters.get(node.group);
            if (center) {
                node.vx += (center.x - node.x) * alpha * strength;
                node.vy += (center.y - node.y) * alpha * strength;
            }
        }
    }

    // Adiciona o método .strength() para o D3 poder chamar
    force.strength = function(_) {
        return arguments.length ? (strength = +_, force) : strength;
    };

    return force;
}

function drag(sim) {
    return d3.drag()
        .on("start", (e) => { if (!e.active) sim.alphaTarget(0.3).restart(); e.subject.fx = e.subject.x; e.subject.fy = e.subject.y; })
        .on("drag", (e) => { e.subject.fx = e.x; e.subject.fy = e.y; })
        .on("end", (e) => { if (!e.active) sim.alphaTarget(0); e.subject.fx = null; e.subject.fy = null; });
}