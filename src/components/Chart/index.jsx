import * as React from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey'
import { Paragraph } from '../typography';
import styled from 'styled-components';

function col(key) {
    return (
        {
            green: "#7D9845",
            orange: "#E17A17",
            red: "#D01A46"
        }[key] ||
        key ||
        "#999999"
    );
}

function percent(val) {
    const pc = val * 100;
    if (pc < 1) {
        return "<1%";
    }
    return `${Math.floor(pc)}%`;
}

function label(node, total) {
    return `${node.name} (${percent(
        node.value / total
    )} - ${new Intl.NumberFormat().format(node.value)})`;
}

const renderChart = (svgEl, nodes, links) => {

    if (!nodes.length || !links.length) {
        return;
    }

    const nodeIds = nodes.map(n => n.id);
    const data = {
        nodes: nodes.map((n) => ({ ...n, color: col(n.color) })),
        links: links.filter(({ source, target }) => {
            return nodeIds.includes(source) && nodeIds.includes(target);
        })
    };

    if (links.length > data.links.length) {
        console.error('Some links have a source or target which is not defined in the nodes');
    }

    const width = 800;
    const height = 600;
    const padding = 25;

    const svg = d3.select('svg').attr("viewBox", [0, 0, width, height + padding]);

    const sankeyData = sankey()
        .nodeId((d) => d.id)
        .nodeSort(null)
        .nodeWidth(20)
        .nodePadding(padding + 15)
        .extent([
            [0, 5],
            [width, height - 5]
        ])({ ...data });


    const removeUnusedNodesData = {
        links: sankeyData.links.slice(),
        nodes: sankeyData.nodes.filter(n => n.targetLinks.length > 0 || n.sourceLinks.length > 0),
    }

    const total = removeUnusedNodesData.links
        .filter(l => l.source.depth === 0)
        .reduce((acc, l) => { return acc + l.value }, 0);

    const offsetYBy = (by) => (obj) => ({
        ...obj,
        y0: obj.y0 + by,
        y1: obj.y1 + by
    });

    const offset = {
        links: removeUnusedNodesData.links.map(offsetYBy(padding)),
        nodes: removeUnusedNodesData.nodes.map(offsetYBy(padding)),
    }

    svg
        .append("g")
        .selectAll("rect")
        .data(offset.nodes.slice())
        .join("rect")
        .attr("x", (d) => d.x0)
        .attr("y", (d) => d.y0)
        .attr("height", (d) => d.y1 - d.y0)
        .attr("width", (d) => d.x1 - d.x0)
        .attr("fill", (d) => d.color)
        .append("title")
        .text(label);

    const link = svg
        .append("g")
        .attr("fill", "none")
        .attr("stroke-opacity", 0.5)
        .selectAll("g")
        .data(offset.links.slice())
        .join("g")
        .style("mix-blend-mode", "multiply");

    link
        .append("path")
        .attr("d", sankeyLinkHorizontal())
        .attr("fill", "none")
        .attr("stroke", (d) => d.source.color || d.target.color)
        .attr("stroke-width", (d) => Math.max(1, d.width));

    link
        .append("title")
        .text((d) => `${d.source.name} → ${d.target.name}\n${d.value}`);

    svg
        .append("g")
        .attr("font-family", "roboto, sans-serif")
        .attr("font-size", 14)
        .selectAll("text")
        .data(offset.nodes.slice())
        .join("text")
        .attr("x", (d) => (d.sourceLinks.length ? d.x0 : d.x1))
        .attr("y", (d) => d.y0 - padding / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", (d) => (d.x0 < width / 2 ? "start" : "end"))
        .text(n => label(n, total));
}

const ChartContainer = styled.div`
    color: #222;
    padding: 20px;
    background: ${({ hasData }) => hasData ? 'white' : 'transparent'};
`

export const Chart = React.memo(({ nodes = [], links = [], title = 'Sankey chart' }) => {

    const chartRef = React.useRef(null);

    React.useEffect(() => {
        const svgEl = chartRef.current;
        if (svgEl) {
            renderChart(svgEl, nodes.slice(), links.slice());
        }
    }, [chartRef.current, nodes, links])

    return <div>
        <Paragraph as="h3">{title}</Paragraph>
        <ChartContainer id="sankeyChart" hasData={nodes.length && links.length}>
            <svg ref={chartRef}></svg>
        </ChartContainer>
    </div>
})


// // Copy to clipboard

// const copyButton = document.getElementById("btnCopy");

// copyButton.addEventListener("click", () => {
//     console.log("click");
//     const svgHtml = svg.node().outerHTML;
//     console.log(svgHtml);
//     copyToClipboard(svgHtml);
//     // navigator.clipboard.writeText(svgHtml);
// });

// function copyToClipboard(str) {
//     const el = document.createElement("textarea");
//     el.value = str;
//     document.body.appendChild(el);
//     el.select();
//     document.execCommand("copy");
//     document.body.removeChild(el);
// }