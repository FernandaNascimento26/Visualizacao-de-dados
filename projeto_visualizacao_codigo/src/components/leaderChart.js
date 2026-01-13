let svg, width = 800, height = 500;
let margin = { top: 60, right: 50, bottom: 50, left: 150 };

export function init(selector) {
    d3.select(selector).select("svg").remove();
    svg = d3.select(selector)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`);
}

export function update({ dataLeft, dataRight, colorLeft, colorRight, title }) {
    svg.selectAll("*").remove();

    // Title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 35)
        .attr("text-anchor", "middle")
        .attr("fill", "#E6EAF0")
        .style("font-size", "22px")
        .style("font-family", "Courier New")
        .text(title);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const gap = 40;
    const innerWidthHalf = (innerWidth - gap) / 2;

    // Unified label domain
    const labels = Array.from(new Set([
        ...dataLeft.map(d => d.label),
        ...dataRight.map(d => d.label)
    ]));

    const yScale = d3.scaleBand()
        .domain(labels)
        .range([0, innerHeight])
        .padding(0.35);

    const xScaleLeft = d3.scaleLinear()
        .domain([0, d3.max(dataLeft, d => d.value) || 0])
        .range([0, innerWidthHalf]);

    const xScaleRight = d3.scaleLinear()
        .domain([0, d3.max(dataRight, d => d.value) || 0])
        .range([0, innerWidthHalf]);

    const gLeft = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const gRight = svg.append("g")
        .attr("transform", `translate(${margin.left + innerWidthHalf + gap}, ${margin.top})`);

    // Background bars
    gLeft.selectAll(".bg-left")
        .data(labels)
        .enter()
        .append("rect")
        .attr("y", d => yScale(d))
        .attr("width", innerWidthHalf)
        .attr("height", yScale.bandwidth())
        .attr("fill", "#1A2230")
        .attr("rx", 4);

    gRight.selectAll(".bg-right")
        .data(labels)
        .enter()
        .append("rect")
        .attr("y", d => yScale(d))
        .attr("width", innerWidthHalf)
        .attr("height", yScale.bandwidth())
        .attr("fill", "#1A2230")
        .attr("rx", 4);

    // Value bars
    gLeft.selectAll(".bar-left")
        .data(dataLeft, d => d.label)
        .enter()
        .append("rect")
        .attr("y", d => yScale(d.label))
        .attr("x", 0)
        .attr("height", yScale.bandwidth())
        .attr("width", 0)
        .attr("fill", colorLeft)
        .attr("rx", 4)
        .transition()
        .duration(1200)
        .attr("width", d => xScaleLeft(d.value));

    gRight.selectAll(".bar-right")
        .data(dataRight, d => d.label)
        .enter()
        .append("rect")
        .attr("y", d => yScale(d.label))
        .attr("x", 0)
        .attr("height", yScale.bandwidth())
        .attr("width", 0)
        .attr("fill", colorRight)
        .attr("rx", 4)
        .transition()
        .duration(1200)
        .attr("width", d => xScaleRight(d.value));

    // Labels at start of bars
    gLeft.selectAll(".label-left")
        .data(dataLeft, d => d.label)
        .enter()
        .append("text")
        .attr("x", 10)
        .attr("y", d => yScale(d.label) + yScale.bandwidth() / 2 + 5)
        .text(d => d.label)
        .attr("fill", "#0B0F14")
        .style("font-family", "Courier New")
        .style("font-size", "13px")
        .style("pointer-events", "none");

    gRight.selectAll(".label-right")
        .data(dataRight, d => d.label)
        .enter()
        .append("text")
        .attr("x", 10)
        .attr("y", d => yScale(d.label) + yScale.bandwidth() / 2 + 5)
        .text(d => d.label)
        .attr("fill", "#0B0F14")
        .style("font-family", "Courier New")
        .style("font-size", "13px")
        .style("pointer-events", "none");

    // Values at end of bars
    gLeft.selectAll(".value-left")
        .data(dataLeft, d => d.label)
        .enter()
        .append("text")
        .attr("x", d => xScaleLeft(d.value) + 10)
        .attr("y", d => yScale(d.label) + yScale.bandwidth() / 2 + 5)
        .text(d => d.value)
        .attr("fill", colorLeft)
        .style("font-family", "Roboto Mono")
        .style("font-weight", "bold")
        .style("opacity", 0)
        .transition()
        .delay(900)
        .duration(400)
        .style("opacity", 1);

    gRight.selectAll(".value-right")
        .data(dataRight, d => d.label)
        .enter()
        .append("text")
        .attr("x", d => xScaleRight(d.value) + 10)
        .attr("y", d => yScale(d.label) + yScale.bandwidth() / 2 + 5)
        .text(d => d.value)
        .attr("fill", colorRight)
        .style("font-family", "Roboto Mono")
        .style("font-weight", "bold")
        .style("opacity", 0)
        .transition()
        .delay(900)
        .duration(400)
        .style("opacity", 1);

    // Bottom legends
    const legendY = height - 15;

    svg.append("text")
        .attr("x", margin.left + innerWidthHalf / 2)
        .attr("y", legendY)
        .attr("text-anchor", "middle")
        .text("Pré-eleição")
        .attr("fill", colorLeft)
        .style("font-family", "Courier New")
        .style("font-size", "14px")
        .style("font-weight", "bold");

    svg.append("text")
        .attr("x", margin.left + innerWidthHalf + gap + innerWidthHalf / 2)
        .attr("y", legendY)
        .attr("text-anchor", "middle")
        .text("Pós-eleição")
        .attr("fill", colorRight)
        .style("font-family", "Courier New")
        .style("font-size", "14px")
        .style("font-weight", "bold");
}
