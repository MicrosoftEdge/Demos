//@ts-nocheck

import React from 'react';
import * as d3 from 'd3';
import { IHIerarchy } from './types';
import internal from 'stream';

interface IProps {
  data: IHIerarchy;
  focusedNodeId: string;
}

interface IState {
  showLabels: boolean;
}

class Chart extends React.Component<IProps, IState> {
  ref: React.RefObject<SVGSVGElement>;
  simulation: d3.Simulation<NodeDatum, undefined>;

  constructor(props: IProps) {
    super(props);
    this.ref = React.createRef();
    this.state = { showLabels: false };
    window.addEventListener('resize', () => {
      this.resetSVG();
    });
  }
  shouldComponentUpdate(nextProps: IProps) {
    if (nextProps.data !== this.props.data) {
      return true;
    }

    return false;
  }

  componentDidUpdate() {
    this.tryRenderGraph();
  }

  componentWillUnmount() {
    this.simulation.stop();
  }

  private buildGraph(data: IHIerarchy) {
    this.resetSVG();
    this.createForceGraph(data, this.state.showLabels);
  }

  private resetSVG() {
    const vEl = document.querySelector('div.visualization');
    const rect: DOMRect | undefined = vEl?.getBoundingClientRect();
    const width = rect?.width || 1000;
    const height = rect?.height || 1000;

    d3.select(this.ref.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  }

  private drag(simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>) {
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fixed = true;
      // event.subject.fx = null;
      // event.subject.fy = null;
    }

    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  private createForceGraph(data: IHIerarchy, showLabels: boolean) {
    let { nodes, links } = data;
    let invalidation = new Promise(() => { });
    let nodeGroups = [];
    let linkStroke = "#999";
    let linkStrokeOpacity = 0.6;
    let linkStrokeWidth = 1.5; 
    let linkStrokeLinecap = "round"; 
    let colors = ['#001372', '#4900ff', '#e30050', '#fbbe00', '#e32e01', '#00b8ff', '#ff00c1'];//d3.schemeDark2; // an array of color strings, for the node groups

    // Compute values.
    const NodeIds = nodes.map(node => node.id);
    const Titles = nodes.map(node => `@${node.id} | ${node.typeName || '(empty type)'} | ${node.name || '(empty name)'}`);

    const uniqueTypesAndLabels: Map<internal, string> = new Map();
    nodes.forEach(node => {
      uniqueTypesAndLabels.set(node.type, node.typeName);
    });

    // Replace the input nodes and links with mutable objects for the simulation.
    nodes = nodes.map((node, i) => ({ id: node.id, important: node.important, type: node.type }));
    links = links.map((link, i) => ({ source: link.source, target: link.target, name: link.name }));

    // Compute default domains.
    nodeGroups = Array.from(uniqueTypesAndLabels.keys());
    // Construct the scales.
    const color = d3.scaleOrdinal(nodeGroups, colors);

    // Construct the forces.
    const forceNode = d3.forceManyBody();
    const forceLink = d3.forceLink(links).id(({ index: i }) => NodeIds[i]);

    this.simulation = d3.forceSimulation(nodes)
      .force("link", forceLink)
      .force("charge", forceNode)
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .on("tick", ticked);

    const svg = d3.select(this.ref.current);

    svg.selectAll("*").remove();

    svg.append("svg:defs").selectAll("marker")
      .data(["end"])      // Different link/path types can be defined here
      .enter().append("svg:marker")    // This section adds in the arrows
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 17)
      .attr("refY", 0)
      .attr("markerWidth", 5)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .attr("fill", linkStroke)
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5");

    const link = svg.append("g")
      .attr("stroke", linkStroke)
      .attr("stroke-opacity", linkStrokeOpacity)
      .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
      .attr("stroke-linecap", linkStrokeLinecap)
      .attr("marker-end", "url(#end)")
      .selectAll("line")
      .data(links)
      .join("line");

    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", d => { return d.important ? 10 : 5 })
      .attr("fill", d => color(d.type))
      .attr("stroke-width", d => d.important ? 3 : 1)
      .attr("stroke", d => { return d.important ? "#0ff" : "#fff" })
      .on("dblclick", dblclick)
      .call(this.drag(this.simulation));

    node.append("title").text(({ index: i }) => Titles[i]);


    let texts = null;

    if (showLabels) {
      texts = svg.append("g")
        .selectAll("text")
        .data(links)
        .join("text")
        .attr("font-size", "5px")
        .text(d => d.name);
    }

    // LEGENDS
    const groupNamesForLabels = Array.from(uniqueTypesAndLabels.values());
    const size = 20
    const deltaX = 250;
    svg.selectAll("myrect")
      .data(nodeGroups)
      .enter()
      .append("circle")
      .attr("cx", deltaX)
      .attr("cy", function (d, i) { return 10 + i * (size + 5) })
      .attr("r", 7)
      .attr("stroke", "#fff")
      .style("fill", function (d) { return color(d) })

    // Add labels beside legend dots
    svg.selectAll("mylabels")
      .data(groupNamesForLabels)
      .enter()
      .append("text")
      .attr("x", deltaX + size * .8)
      .attr("y", function (d, i) { return i * (size + 5) + (size / 2) })
      .style("fill", "#000")
      .text(function (d) { return d })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")

    // FORCE SIMULATION, ANIMATIONS, ZOOM

    // Handle invalidation.
    if (invalidation != null) invalidation.then(() => this.simulation.stop());

    function tx(d) {
      return (d.source.x + d.target.x) / 2;
    }
    function ty(d) {
      return (d.source.y + d.target.y) / 2;
    }

    function ticked() {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      if (showLabels && texts !== null) {

        texts
          .attr("x", d => tx(d) || 0)
          .attr("y", d => ty(d) || 0);
      }
    }

    function dblclick(d) {
      d.stopPropagation();
      d.target.__data__.fx = null;
      d.target.__data__.fy = null;
    }

    let zoom = d3.zoom()
      .on('zoom', handleZoom);

    function handleZoom(e) {
      svg.selectAll('g')
        .attr('transform', e.transform);
    }

    svg.call(zoom);
  }

  componentDidMount() {
    // activate 
    this.tryRenderGraph();
  }

  tryRenderGraph() {
    if (this.props.data && this.props.data.nodes && this.props.data.nodes.length > 10000) {
      console.log('TOO MANY NODES!', this.props.data.nodes.length);
    } else {
      this.buildGraph(this.props.data);
    }
  }

  onShowLabelsChange() {
    this.setState({ showLabels: !this.state.showLabels });
  }

  render() {
    return (<div className="svg">
      <div className='info'>
        {/* <p>Focusing on node: @{this.props.focusedNodeId}</p> */}
        <div>
          <input type={'checkbox'} onChange={this.onShowLabelsChange.bind(this)} /> <span>Show labels</span>
        </div>
      </div>
      <svg className="container" ref={this.ref}></svg>
    </div>);
  }
}

export default Chart;