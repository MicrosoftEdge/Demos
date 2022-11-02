//@ts-nocheck

import React from 'react';
import * as d3 from 'd3';
import { IHIerarchyTree } from "./types";

interface IProps {
    data: IHIerarchyTree;
    focusedNodeId: string;
}

interface IState {

}

class TreeChart extends React.Component<IProps, IState> {
    ref: React.RefObject<SVGSVGElement>;

    constructor(props: IProps) {
        super(props);
        this.ref = React.createRef();
        this.state = { showingGCRoots: false };
        window.addEventListener('resize', ()=>{
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

    private resetSVG(){
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

    private buildGraph(data: IHIerarchyTree) {

        const vEl = document.querySelector('div.visualization');
        const rect: DOMRect | undefined = vEl?.getBoundingClientRect();
        const width = rect?.width || 1000;
        const height = rect?.height || 1000;
        this.TreeGraph(data, width, height, this.state.showLabels);
    }

    private TreeGraph(data) {

        const root = d3.hierarchy(data);
        const tree = d3.tree;

        let invalidation = new Promise(() => { });

        let nodeGroup = d => d.type || -1;
        let nodeTitle = d => `@${d.id} | ${d.name}`;
        let nodeLabel = d => `@${d.id} | ${d.name}`;
        let nodeGroups = []; // an array of ordinal values representing the node groups

        let linkStrokeOpacity = 0.6; // link stroke opacity
        let linkStrokeWidth = 1.5; // given d in links, returns a stroke width in pixels
        let linkStrokeLinecap = "round"; // link stroke linecap
        let colors = d3.schemeDark2; // an array of color strings, for the node groups
        let stroke = "#555";
        let fill = "#999";
        let r = 10;

        const descendants = root.descendants();
        const Labels = nodeLabel == null ? null : descendants.map(d => nodeLabel(d.data, d));
        const Titles = d3.map(descendants, nodeTitle);
        const Groups = d3.map(descendants, nodeGroup).map(intern);


        if (Groups && nodeGroups === undefined) nodeGroups = d3.sort(Groups);
        const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

        const dx = 30;
        const dy = 300;
        tree().nodeSize([dx, dy])(root);

        // Center the tree.
        let x0 = Infinity;
        let x1 = -x0;
        root.each(d => {
            if (d.x > x1) x1 = d.x;
            if (d.x < x0) x0 = d.x;
        });

        const svg = d3.select(this.ref.current);

        svg.selectAll("*").remove();


        svg.append("g")
            .attr("fill", "none")
            .attr("stroke", stroke)
            .attr("stroke-opacity", linkStrokeOpacity)
            .attr("stroke-linecap", linkStrokeLinecap)
            //.attr("stroke-linejoin", linkStrokeLinejoin)
            .attr("stroke-width", linkStrokeWidth)
            .selectAll("path")
            .data(root.links())
            .join("path")
            .attr("d", d3.linkHorizontal()
                .x(d => d.y)
                .y(d => d.x));

        const node = svg.append("g")
            .selectAll("a")
            .data(root.descendants())
            .join("a")
            .attr("stroke-width", d => d.data.important ? 3 : 1)
            .attr("stroke", d => { return d.data.important ? "#0ff" : "#fff" })
            //.attr("target", link == null ? null : linkTarget)
            .attr("transform", d => `translate(${d.y},${d.x})`);

        node.append("circle")
            .attr("fill", d => d.children ? stroke : fill)
            .attr("r", d => d.data.important ? 15 : r);

        if (Groups) node.attr("fill", ({ index: i }) => color(Groups[i]));
        if (Titles) {
            node.append("title").text(({ index: i }) => Titles[i]);

            node.append("text")
                .attr("dy", "0.32em")
                .attr("x", d => d.children ? -6 : 6)
                //.attr("text-anchor", d => d.children ? "end" : "start")
                .text((d, i) => Labels[i])
                .call(text => text.clone(true))
                .attr("fill", "#fff");
        }

        // Handle invalidation.
        if (invalidation != null) invalidation.then(() => simulation.stop());

        function intern(value) {
            return value;// !== null && typeof value === "object" ? value.valueOf() : value;
        }


        let zoom = d3.zoom()
            .on('zoom', handleZoom);

        function handleZoom(e) {
            d3.selectAll('svg g')
                .attr('transform', e.transform);
        }

        function initZoom() {
            d3.select('svg')
                .call(zoom);
        }

        initZoom();

        return Object.assign(svg.node(), { scales: { color } });
    }

    componentDidMount() {
        // activate 
        this.tryRenderGraph();
    }

    tryRenderGraph() {
        this.resetSVG();
        if (this.props.data && this.props.data.nodes && this.props.data.nodes.length > 10000) {
            console.log('TOO MANY nodes!', this.props.data.nodes.length);
        } else {
            this.buildGraph(this.props.data);
        }
    }

    onShowLabelsChange() {
        this.setState({ showLabels: !this.state.showLabels });
    }

    render() {
        return (<div>
            <div className='info'>
                {
                    this.state.showingGCRoots ?
                        <div>
                            {/* <p>Focusing on node: @{this.props.focusedNodeId}</p> */}
                            <div>
                                <input type={'checkbox'} onChange={this.onShowLabelsChange.bind(this)} /> <span>Show labels</span>
                            </div>
                        </div>
                        :
                        <div>
                            {/* <p>Showing GC Roots</p> */}
                        </div>


                }

            </div>
            <svg className="container" ref={this.ref}></svg>
        </div>);
    }
}

export default TreeChart;