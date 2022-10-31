

export class Node {
    prevNodes = new Set<Node>(); // Used when exporting graph for visualization 
    nextNodes = new Map<Node, Set<Edge>>(); // Used when exporting graph for visualization
    prevNodeIndexs = new Set<number>();

    edgesToInspectIndexes:number[] = [];
    distance:number = -1;
    isImportant:boolean = false;

    pathFromGC:number[] = [];
    

    constructor(public readonly originalNodeFields: number[],
        public readonly originalIndex: number, 
        public readonly edgeStartIndex:number) {
    }

    reset(){
        this.edgesToInspectIndexes = [];
        this.distance = 0;
        this.isImportant = false;
        this.pathFromGC = [];

        this.prevNodes = new Set<Node>();
        this.nextNodes = new Map<Node, Set<Edge>>();
    }
}

export class HeapNodeHelper {

    static connectPrevNode(heapNode: Node, node: Node) {
        if (node === heapNode) {
            return;
        }
        heapNode.prevNodes.add(node);
    }

    static connectNextNode(heapNode: Node, node: Node, edge: Edge) {
        if (node === heapNode) {
            return;
        }
        let set = heapNode.nextNodes.get(node);
        if (!set) {
            set = new Set<Edge>();
            heapNode.nextNodes.set(node, set);
        }
        set.add(edge);
    }

   static  removePrevNode(heapNode: Node, node: Node) {
        heapNode.prevNodes.delete(node);
    }

   static  getEdgeCount(heapNode: Node) {
        let counter = 0;
        for (const edges of heapNode.nextNodes.values()) {
            counter += edges.size;
        }
        return counter;
    }

   static  getNextNodesAndEdges(heapNode: Node): EdgeAndNode[] {
        const result: EdgeAndNode[] = [];
        for (const [node, edges] of heapNode.nextNodes.entries()) {
            for (const edge of edges) {
                result.push({ node, edge });
            }
        }
        return result;
    }

    static getOriginalEdgeCount(heapNode: Node): number {
        return heapNode.originalNodeFields[4];
    }

    static getNodeId(heapNode: Node) {
        return heapNode.originalNodeFields[2];
    }

    static getNodeNameIndex(heapNode: Node) {
        return heapNode.originalNodeFields[1];
    }

    static getNodeTypeIndex(heapNode: Node) {
        return heapNode.originalNodeFields[0];
    }

    static disconnectNextNodes(heapNode: Node) {
        for (const nextNode of heapNode.nextNodes.keys()) {
            HeapNodeHelper.removePrevNode(heapNode, nextNode);
        }
        heapNode.nextNodes.clear();
    }

    static removeEdge(heapNode: Node, node: Node, edge: Edge) {
        const edges = heapNode.nextNodes.get(node);
        if (edges) {
            edges.delete(edge);
            if (!edges.size) {
                heapNode.nextNodes.delete(node);
                HeapNodeHelper.removePrevNode(heapNode, node);
            }
        }
    }

    static getPrevNodes(heapNode: Node): Node[] {
        return [...heapNode.prevNodes];
    }

    static getNextNodes(heapNode: Node): Node[] {
        return [...heapNode.nextNodes.keys()];
    }

    static disconnectPrevNodes(heapNode: Node) {
        for (const prevNode of HeapNodeHelper.getPrevNodes(heapNode)) {
            prevNode.nextNodes.delete(heapNode);
        }
        heapNode.prevNodes.clear();
    }

    static disconnectPrevNode(heapNode: Node, node: Node) {
        node.nextNodes.delete(heapNode);
        heapNode.prevNodes.delete(node);
    }
}

export interface Edge {
    type: number;
    nameOrIndexToStrings: number | string;
}

export interface EdgeAndNode {
    edge: Edge;
    node: Node;
}
