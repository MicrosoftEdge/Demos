import type { HeapSnapshotSchema } from "./Schema";
import { Edge, Node, HeapNodeHelper } from "./Node";
import { SnapshotInfo, IHIerarchy, IHIerarchyTree, ICategories } from "./types";

export class HeapSnapshotManager {

  private nodeMapById = new Map<number, Node>();
  private nodeMapByIndex = new Map<number, Node>();
  private nodeWorkingSet = new Set<Node>();
  private rootsIndex = new Set<number>();
  private lastKnownParentIndex = -1;

  // index of string, ids of nodes
  private categories = new Map<number, number[]>();

  private snapshotInfo: SnapshotInfo = {
    totalNodes: 0,
    totalEdges: 0,
    totalSkipped: 0,
    interestingNodeIds: []
  };

  constructor(private readonly jsonHeapDump: HeapSnapshotSchema, private nodeFilterValues: string[], private edgeFilterValues: string[]) {
    this.readNodes();
  }

  readNodes() {

    this.nodeMapById = new Map<number, Node>();
    this.nodeMapByIndex = new Map<number, Node>();
    this.nodeWorkingSet = new Set<Node>();
    this.rootsIndex = new Set<number>();

    this.snapshotInfo = {
      totalNodes: 0,
      totalEdges: 0,
      totalSkipped: 0,
      interestingNodeIds: []
    };

    console.log('1) Read nodes');
    let nodeCount = 0;
    let currentEdgeIndex = 0;
    for (let index = 0; index < this.jsonHeapDump.nodes.length; index += 7) {
      nodeCount++;
      // Create node representation
      const originalNodeFields = this.jsonHeapDump.nodes.slice(index, index + 7);
      const nameIndex = originalNodeFields[1];
      const id = originalNodeFields[2];
      let heapNode = new Node(originalNodeFields, index, currentEdgeIndex);

      // Index it in the maps for easy lookup
      this.nodeMapById.set(id, heapNode);
      this.nodeMapByIndex.set(index, heapNode);

      const name = this.jsonHeapDump.strings[nameIndex];
      if (name.includes('GC root')) {
        this.rootsIndex.add(index);
      }

      const c = this.categories.get(nameIndex);
      if (!c) {
        this.categories.set(nameIndex, [id])
      } else {
        c.push(id);
      }

      const isDetached = originalNodeFields[6] === 1;
      if (isDetached) {
        // this is a detached node
        if (this.snapshotInfo.interestingNodeIds.length < 10) {
          this.snapshotInfo.interestingNodeIds.push(id);
        }
      }

      // Get to the begining of the edges for the next node 
      const numEdges = HeapNodeHelper.getOriginalEdgeCount(heapNode);
      currentEdgeIndex += numEdges * 3;
    }

    this.snapshotInfo.totalNodes = nodeCount;


    console.log('2) Read edges');
    const notFoundIx = new Set();
    for (let [nodeIndex, heapNode] of this.nodeMapByIndex) {
      // Find its edges
      const numEdges = HeapNodeHelper.getOriginalEdgeCount(heapNode);
      const startIndex = heapNode.edgeStartIndex;
      const lastIndex = startIndex + (numEdges * 3);

      this.snapshotInfo.totalEdges += numEdges;

      for (let i = startIndex; i < lastIndex; i += 3) {
        const type = this.jsonHeapDump.edges[i];
        const toNodeOriginalIndex = this.jsonHeapDump.edges[i + 2];
        const toNode = this.nodeMapByIndex.get(toNodeOriginalIndex);
        if (toNode && this.filterEdge(type)) {
          toNode.prevNodeIndexs.add(nodeIndex);
        } else {
          notFoundIx.add(toNodeOriginalIndex);
          this.snapshotInfo.totalSkipped += 1;
        }
      }
    }

  }

  getSortedCategories() {
    let categoriesAggregates: ICategories[] = [];

    this.categories.forEach((nodeIds, stringIndex) => {
      categoriesAggregates.push({
        name: this.jsonHeapDump.strings[stringIndex],
        ids: nodeIds,
        count: nodeIds.length
      })
    });

    categoriesAggregates = categoriesAggregates.sort((a, b) => b.count - a.count);

    categoriesAggregates = categoriesAggregates.filter(a => {
      return !a.name.includes('HTML')
        && !a.name.includes('system')
        && !a.name.includes('style')
        && !a.name.includes('Text')
        && !a.name.includes('object properties')
        && !a.name.includes('SVG')
        && !a.name.includes('CSS')
        && !a.name.includes('DOM')
        && !a.name.includes('V8')
        && !a.name.includes('Internal');
    });

    categoriesAggregates.forEach(c => {
      c.ids = c.ids.slice(0, 5);
    });

    return categoriesAggregates;
  }

  getNodeById(index: number): Node | undefined {
    return this.nodeMapById.get(index);
  }

  resetAllNodes() {
    for (let [, heapNode] of this.nodeMapByIndex) {
      heapNode.reset();
    }

    this.lastKnownParentIndex = -1;
  }

  getSnapshotInfo() {
    return this.snapshotInfo;
  }

  findRetainersForNode(node_of_interest: Node) {
    // When we export the graph for visualization we rely on this set to know which nodes we need
    this.nodeWorkingSet = new Set();
    // Reset connections on all nodes
    this.resetAllNodes();

    // Distance is a heuristic we can use to stop our search when we go to far from our node of interest
    const maxDistance = 100;
    node_of_interest.distance = 0;
    // isImportant signals that this node should be rendered differently
    node_of_interest.isImportant = true;

    // 1) Traverse the graph, starting with the node of interest until we get to the root
    let nodesToConnect: Node[] | null = [node_of_interest];
    let nodeIndex = 0;
    let foundRoot = false;
    let rootNode: Node | null = null;

    while (nodeIndex < nodesToConnect.length && !foundRoot) {
      const node = nodesToConnect[nodeIndex];

      // Skip node if we have reached max distance
      if (node.distance > maxDistance /*|| !this.filterNode(node)*/) {
        nodeIndex++;
        continue;
      }

      let connectionFoundBetweenNodeAndARetainer = false;

      // Iterate all retainers of the node to see if they are the root, if not we add them to the list of nodes to be traversed
      for (const retainerIndex of node.prevNodeIndexs) {

        if (retainerIndex === node.originalIndex) {
          // Don't care about references to itself
          continue;
        }

        const retNode = this.nodeMapByIndex.get(retainerIndex);
        if (retNode === undefined /*|| retNode.edgesToInspectIndexes.length !== 0*/) {
          // For some reason the node doesnt exist or it was marked as previous (retainer) 
          // and it was already traversed by some other route and we have found
          continue;
        }

        // retNode has many edges, we know some of them point to the current node being traversed, we only want to keep those
        // in the future when we come the other way around we dont want to focus on all the other edges
        const numEdges = HeapNodeHelper.getOriginalEdgeCount(retNode);
        const startIndex = retNode.edgeStartIndex;
        const lastIndex = startIndex + (numEdges * 3);

        for (let i = startIndex; i < lastIndex; i += 3) {
          const edgeType = this.jsonHeapDump.edges[i];
          const toNodeIndex = this.jsonHeapDump.edges[i + 2];

          const edgePointsToNode = toNodeIndex === node.originalIndex;
          if (edgePointsToNode && this.filterEdge(edgeType)) {
            connectionFoundBetweenNodeAndARetainer = true;
            let isRoot = false;
            const retName = this.jsonHeapDump.strings[HeapNodeHelper.getNodeNameIndex(retNode)];

            if (retName?.trim() !== '') {
              isRoot = retName.includes('GC root');
            }

            if (isRoot) {
              this.lastKnownParentIndex = retNode.originalIndex;
              retNode.isImportant = true;
              foundRoot = true;
              rootNode = retNode;
            }
            retNode.distance = node.distance + 1;
            retNode.edgesToInspectIndexes.push(i);

            // only add it to the list to traverse if we havent already added it  
            if (!this.nodeWorkingSet.has(retNode)) {
              this.nodeWorkingSet.add(retNode);
              nodesToConnect.push(retNode);
            }
          }
        }
      }

      if (connectionFoundBetweenNodeAndARetainer) {
        this.nodeWorkingSet.add(node);
      } else {
        // didnt find connection
      }

      nodeIndex++;
    }

    // Conect the nodes
    for (const node of this.nodeWorkingSet.values()) {

      for (let i = 0; i < node.edgesToInspectIndexes.length; i++) {
        const index = node.edgesToInspectIndexes[i];
        const type = this.jsonHeapDump.edges[index];
        const toNodeOriginalIndex = this.jsonHeapDump.edges[index + 2];
        const toNode = this.nodeMapByIndex.get(toNodeOriginalIndex);

        if (toNode && this.nodeWorkingSet.has(toNode)) {
          const toNodeNext = toNode.nextNodes.keys();
          const toNodeNextIds = [...toNodeNext].map(node => node.originalIndex);

          if (toNodeNextIds.indexOf(node.originalIndex) === -1) {
            const nameOrIndexToStrings = this.jsonHeapDump.edges[index + 1];
            const edge: Edge = { type, nameOrIndexToStrings };
            HeapNodeHelper.connectNextNode(node, toNode, edge);
            HeapNodeHelper.connectPrevNode(toNode, node);
          }
        }
      }
    }

    //Remove nodes that are not connected to root
    if (rootNode !== null) {
      // Find all nodes that have a direct connection from the root node
      const nodesToKeepIdsx = new Set();
      nodesToConnect = null;
      nodesToConnect = [rootNode];
      nodesToKeepIdsx.add(rootNode.originalIndex);
      nodeIndex = 0;

      while (nodeIndex < nodesToConnect.length) {
        const node = nodesToConnect[nodeIndex];

        for (const nextNode of node.nextNodes.keys()) {
          if (!nodesToKeepIdsx.has(nextNode.originalIndex)) {
            nodesToConnect.push(nextNode);
            nodesToKeepIdsx.add(nextNode.originalIndex);
          }
        }
        nodeIndex++;
      }

      // remove all nodes that are not connected to root node
      this.nodeWorkingSet = new Set([...this.nodeWorkingSet].filter(node => nodesToKeepIdsx.has(node.originalIndex)));
    }

    // Remove cycles - of nodes that can be reached fromt he root but do not contribute to the search of node of interest 
    // Traverse the graph from the roo, update the path of each node
    // If we expand a node and it already has  a path then it has been visited before, 
    //    - we can mark difference of the two paths as nodes that are part of a cycle and can be removed 
    // At the end we see the path that was used by the node of interest, and we make sure to keep all of those nodes even if thy are part of a cycle.

    if (rootNode !== null) {
      console.log('Trying to remove cycles...');
      let indexToRemove: Set<number> = new Set();

      nodesToConnect = null;
      nodesToConnect = [rootNode];
      nodeIndex = 0;

      while (nodeIndex < nodesToConnect.length) {
        const node = nodesToConnect[nodeIndex];

        for (const nextNode of node.nextNodes.keys()) {

          if (nextNode.pathFromGC.length == 0) {
            nextNode.pathFromGC = [...node.pathFromGC]; // copy path from previous
            nextNode.pathFromGC.push(nextNode.originalIndex); // append itself
            nodesToConnect.push(nextNode);
          } else {
            // console.log('possible cycle at ', nextNodeId);
            const nodesToRemove = node.pathFromGC.filter(x => nextNode.pathFromGC.indexOf(x) === -1);
            nodesToRemove.forEach(index => indexToRemove.add(index));
          }
        }
        nodeIndex++;
      }

      // Keep nodes who are part of path to node of interest even if they have a cycle
      node_of_interest.pathFromGC.forEach(x => indexToRemove.delete(x));

      const oldSize = this.nodeWorkingSet.size;
      this.nodeWorkingSet = new Set([...this.nodeWorkingSet].filter(node => !indexToRemove.has(node.originalIndex)));
      const newSize = this.nodeWorkingSet.size;
      console.log(`Removing nodes with cycles: Previous size of set: ${oldSize} | New size of set: ${newSize}`);
    }

    this.cleanUpExistingWorkingSet();

    // Remove nodes that do not have a connection to node of interest
    this.removeAllNodesWithNoNextNodes(node_of_interest);

    this.cleanUpExistingWorkingSet();


    // const nodesArray2 = [...this.nodeWorkingSet];
    // const nodesWithoutPrev = nodesArray2.filter(node => node.prevNodes.size === 0);
    // const setYY = new Set(nodesWithoutPrev.map(node => node.originalIndex));

    // console.log('nodesWithoutPrev', nodesArray2.length, nodesWithoutPrev.length);
    // console.log('nodeWorkingSet = ', this.nodeWorkingSet.size);
    // this.nodeWorkingSet = new Set([...this.nodeWorkingSet].filter(node => !setYY.has(node.originalIndex)));
    // console.log('nodeWorkingSet = ', this.nodeWorkingSet.size);
  }

  cleanUpExistingWorkingSet() {
    // remove conections where the node connected to doesnt exist anymore
    this.nodeWorkingSet.forEach(node => {
      const filteredNextNodes: Map<Node, Set<Edge>> = new Map();
      for (const [nextNode, edges] of node.nextNodes.entries()) {
        if (this.nodeWorkingSet.has(nextNode)) {
          // Only keep the connection if the next node exists
          filteredNextNodes.set(nextNode, edges);
        }
      }
      node.nextNodes = filteredNextNodes;
    });
  }

  removeAllNodesWithNoNextNodes(node_of_interest: Node) {
    // remove dead ends by disconnecting all nodes that dont havenextNodes
    const nodesArray = [...this.nodeWorkingSet];
    const nodesWithoutNext = nodesArray.filter(node => node.nextNodes.size === 0);
    const setXX = new Set(nodesWithoutNext.map(node => node.originalIndex));
    setXX.delete(node_of_interest.originalIndex);

    console.log('nodesWithoutNext', nodesArray.length, nodesWithoutNext.length);
    const oldSize = this.nodeWorkingSet.size;
    this.nodeWorkingSet = new Set([...this.nodeWorkingSet].filter(node => !setXX.has(node.originalIndex)));
    const newSize = this.nodeWorkingSet.size;
    console.log(`Removing nodes with cycles: Previous size of set: ${oldSize} | New size of set: ${newSize}`);
  }

  setFilters(nodeFilterValues: string[], edgeFilterValues: string[]) {
    this.nodeFilterValues = nodeFilterValues;
    this.edgeFilterValues = edgeFilterValues;
    // We need to re-read nodes and edges if the filters change
    this.readNodes();
  }

  // Returns true if node is allowed
  filterNode(node: Node): boolean {
    const nodeTypes = this.jsonHeapDump.snapshot.meta.node_types[0];
    const type = nodeTypes[HeapNodeHelper.getNodeTypeIndex(node)];
    return this.nodeFilterValues.indexOf(type) !== -1;
    // An example of the node types we cna expect
    //"hidden","array","string","object","code","closure","regexp","number","native","synthetic","concatenated string","sliced string","symbol","bigint"
  }

  // Returns true if edge is allowed
  filterEdge(edgeType: number): boolean {
    const edgeTypes = this.jsonHeapDump.snapshot.meta.edge_types[0];
    const typeName = edgeTypes[edgeType];
    return this.edgeFilterValues.indexOf(typeName) !== -1;
    // An example of the edge types we can expect
    // "context","element","property","internal","hidden","shortcut","weak"
  }

  exportGraph(): IHIerarchy {
    let hierarchy: IHIerarchy = { nodes: [], links: [] };

    for (const heapNode of this.nodeWorkingSet) {
      const nodeName = this.jsonHeapDump.strings[HeapNodeHelper.getNodeNameIndex(heapNode)];
      const nodeId = HeapNodeHelper.getNodeId(heapNode);
      const typeIndex = HeapNodeHelper.getNodeTypeIndex(heapNode);
      const typeName = this.jsonHeapDump.strings[typeIndex];

      let node_obj = {
        name: nodeName,
        id: nodeId,
        important: heapNode.isImportant,
        type: typeIndex,
        typeName: typeName || '' + typeIndex
      };
      hierarchy.nodes.push(node_obj);

      for (const { node, edge } of HeapNodeHelper.getNextNodesAndEdges(heapNode)) {
        if (!this.nodeWorkingSet.has(node)) { continue; }
        if (typeof edge.nameOrIndexToStrings === 'number') {
          const edgeName = this.jsonHeapDump.strings[edge.nameOrIndexToStrings as number];
          const targetId = HeapNodeHelper.getNodeId(node);
          let link_o = { source: nodeId, target: targetId, name: edgeName };
          hierarchy.links.push(link_o);
        }
      }
    }

    return hierarchy;
  }

  exportGraphAsHierarchy(): IHIerarchyTree {

    const nodesForTree = new Map<number, IHIerarchyTree>();
    // 1) Create a node for tree for each working node
    for (const node of this.nodeWorkingSet) {
      const nodeName = this.jsonHeapDump.strings[HeapNodeHelper.getNodeNameIndex(node)];
      const nodeId = HeapNodeHelper.getNodeId(node)
      let node_for_tree: IHIerarchyTree = { name: nodeName, id: nodeId, important: node.isImportant, type: HeapNodeHelper.getNodeTypeIndex(node), children: [] };
      nodesForTree.set(node.originalIndex, node_for_tree);
    }

    const nodesToConnect: Node[] = [];
    let originalRootIndex = 0;

    if (this.lastKnownParentIndex !== -1) {
      originalRootIndex = this.lastKnownParentIndex;
      const node = this.nodeMapByIndex.get(this.lastKnownParentIndex);
      if (node) {
        nodesToConnect.push(node);
      }
    } else {
      for (const rootIndex of this.rootsIndex) {
        const node = this.nodeMapByIndex.get(rootIndex);
        originalRootIndex = rootIndex;
        if (node) {
          nodesToConnect.push(node);
        }
      }
    }

    let nodeIndex = 0;
    let connectedNodes = new Set();
    while (nodeIndex < nodesToConnect.length) {
      const heapNode = nodesToConnect[nodeIndex];
      const nodeForTree = nodesForTree.get(heapNode.originalIndex);

      connectedNodes.add(heapNode.originalIndex);
      if (!nodeForTree || (nodeForTree.children && nodeForTree.children.length > 0)) {
        nodeIndex++;
        continue;
      }

      // Create children for node for trees
      const children = [];
      for (const childNode of HeapNodeHelper.getNextNodes(heapNode)) {

        if (!connectedNodes.has(childNode.originalIndex)) {
          nodesToConnect.push(childNode);
          const nft = nodesForTree.get(childNode.originalIndex);
          if (nft) {
            children.push(nft);
          }
        }
      }

      nodeForTree.children = children;

      nodeIndex++;
    }

    return nodesForTree.get(originalRootIndex) || { name: '', id: -1, important: false, type: -1, children: [] };
  }

  findGCRoots(max_distance_from_root = 3, max_edges_per_level = 5) {
    this.resetAllNodes();
    this.nodeWorkingSet = new Set<Node>();
    const nodesToConnect = [];

    for (const rootIndex of this.rootsIndex) {
      const node = this.nodeMapByIndex.get(rootIndex);
      if (node) {
        //const nodeName = this.jsonHeapDump.strings[HeapNodeHelper.getNodeNameIndex(node)];
        node.isImportant = true;
        nodesToConnect.push(node);
        this.nodeWorkingSet.add(node);
      }
    }

    let nodeIndex = 0;
    while (nodeIndex < nodesToConnect.length) {
      const node = nodesToConnect[nodeIndex];

      if (node.distance > max_distance_from_root || !this.filterNode(node)) {
        nodeIndex++;
        continue;
      }

      const numEdges = HeapNodeHelper.getOriginalEdgeCount(node);
      const startIndex = node.edgeStartIndex;
      const lastIndex = startIndex + (numEdges * 3);

      let edgesCount = 0;

      for (let i = startIndex; i < lastIndex; i += 3) {
        edgesCount++;

        if (nodeIndex > 1 && edgesCount > max_edges_per_level) {
          break;
        }
        const type = this.jsonHeapDump.edges[i];
        const toNodeOriginalIndex = this.jsonHeapDump.edges[i + 2];
        const toNode = this.nodeMapByIndex.get(toNodeOriginalIndex);


        if (toNode) {
          const nodeName = this.jsonHeapDump.strings[HeapNodeHelper.getNodeNameIndex(toNode)];
          if ((!nodeName.includes('Internalized') && !nodeName.includes('Template') && !nodeName.includes('string') && !nodeName.includes('Read-only roots')) && this.filterEdge(type)) {
            if (!this.nodeWorkingSet.has(toNode)) {
              toNode.distance = node.distance + 1;
              this.nodeWorkingSet.add(toNode);
              nodesToConnect.push(toNode);

              const nameOrIndexToStrings = this.jsonHeapDump.edges[i + 1];
              const edge: Edge = { type, nameOrIndexToStrings };
              HeapNodeHelper.connectNextNode(node, toNode, edge);
            }
          }
        }
      }

      nodeIndex++;
    }
  }

  // findNodeByName(name: string): HeapNode {
  //   for (const [nodeIndex, node] of this.nodeMapWorking.entries()) {
  //     const nodeName = this.jsonHeapDump.strings[HeapNodeHelper.getNodeNameIndex(node)];
  //     if (nodeName === name) {
  //       return node;
  //     }
  //   }
  //   throw new Error('Cannot find node with name: ' + name)
  // }

}
