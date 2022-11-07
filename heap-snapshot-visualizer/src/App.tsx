import React from 'react';
import './App.css';
import Chart from './Chart';
import { useState } from 'react';
import FileInput from './FileInput';
import { HeapSnapshotManager } from './HeapSnapshot';
import { ICategories, IHIerarchy, IHIerarchyTree, SnapshotInfo } from "./types";
import TreeChart from './TreeChart';
import StatusMessage from './StatusMessage';

type IChartType = 'graph' | 'tree';

function App() {
  const testData: IHIerarchy = {
    nodes: [],
    links: []
  };

  const testDataTree: IHIerarchyTree = {
    name: '',
    id: 0,
    important: false,
    type: -1
  };

  const snapshotInfoDefault: SnapshotInfo = {
    totalNodes: 0,
    totalEdges: 0,
    totalSkipped: 0,
    interestingNodeIds: []
  };

  const defaultEdgeFilterValues = ['property', 'element', 'internal'];
  const defaultNodeFilterValues = ['array', 'object', 'native', 'synthetic'];

  let defaultFocusId = '';
  // let defaultRootId = 'Window / ';

  // State management
  let [data, setData] = useState(testData);
  let [treeData, setTreeData] = useState(testDataTree);
  let [nodeToFocusId, setNodeToFocusId] = useState(defaultFocusId);
  let [focusedNodeId, setFocusedNodeId] = useState('');
  // let [rootId, setRootId] = useState(defaultRootId);
  let [heapSnapshotManager, setHSManager] = useState<HeapSnapshotManager | null>(null);
  let [snapshotInfo, setSnapshotInfo] = useState(snapshotInfoDefault);

  let [chartType, setChartType] = useState<IChartType>('graph');

  let [gcLevelsToExpand, setGcLevelsToExpand] = useState(1);
  let [gcEdgeCountPerLevel, setGcEdgeCountPerLevel] = useState(1);

  let [schema, setSchema] = useState('{}');

  let [categories, setCategories] = useState<ICategories[]>([]);

  let [nodeTypeFilters, setNodeTypeFilters] = useState<string[]>(defaultNodeFilterValues);
  let [allNodeTypes, setAllNodeTypes] = useState<string[]>([]); // all available edge types from metadata

  let [edgeTypeFilters, setEdgeTypeFilters] = useState<string[]>(defaultEdgeFilterValues);
  let [allEdgeTypes, setAllEdgeTypes] = useState<string[]>([]); // all available node types from metadata

  let [statusMessage, setStatusMessage] = useState<string>('');


  async function onLoad(fileHandle: File | null) {
    if (!fileHandle) return;

    const content = await fileHandle.text();
    const jsonData = JSON.parse(content);

    const schema = { snapshot: {} };
    schema.snapshot = jsonData.snapshot;
    setSchema(JSON.stringify(schema));

    setAllNodeTypes(jsonData.snapshot.meta.node_types[0]);
    setAllEdgeTypes(jsonData.snapshot.meta.edge_types[0])

    const hsManager = new HeapSnapshotManager(jsonData, nodeTypeFilters, edgeTypeFilters);
    setHSManager(hsManager);

    if (hsManager) {
      const info = hsManager.getSnapshotInfo();
      setSnapshotInfo(info);
      hsManager.findGCRoots(gcLevelsToExpand, gcEdgeCountPerLevel);
      exportGraphAndSetData(hsManager);

      const cat = hsManager.getSortedCategories();
      setCategories(cat.slice(0, 35));
    }
  }

  async function onFocusNodeInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    let newValue = event.target.value || defaultFocusId;
    newValue = newValue.replace('@', '');
    setNodeToFocusId(newValue);
  }

  // async function onRootInputChange(event: React.ChangeEvent<HTMLInputElement>) {
  //   const newValue = event.target.value || defaultRootId;
  //   setRootId(newValue);
  // }

  async function onShowGCRootsClicked(event: any) {
    if (heapSnapshotManager) {
      heapSnapshotManager.findGCRoots(gcLevelsToExpand, gcEdgeCountPerLevel);
      exportGraphAndSetData(heapSnapshotManager);
    }
  }

  async function onFocusNodeClicked(event: any) {
    const nodeId = parseInt(nodeToFocusId) || 0;
    tryToFocusOnNode(nodeId);
  }

  async function tryToFocusOnNode(nodeId: number) {
    if (heapSnapshotManager && nodeId) {
      const node = heapSnapshotManager.getNodeById(nodeId);
      if (node) {
        setFocusedNodeId(nodeToFocusId);
        heapSnapshotManager.findRetainersForNode(node);
        exportGraphAndSetData(heapSnapshotManager);
      }
    }
  }

  async function tryToSetFilters(nodeFilterValues: string[], edgeFilterValues: string[]) {
    setNodeTypeFilters(nodeFilterValues);
    setEdgeTypeFilters(edgeFilterValues);
    if (heapSnapshotManager) {
      setStatusMessage('Setting filters...');
      heapSnapshotManager.setFilters(nodeFilterValues, edgeFilterValues);
      setStatusMessage('Finding roots...');
      heapSnapshotManager.findGCRoots(gcLevelsToExpand, gcEdgeCountPerLevel);
      setStatusMessage('Export graph...');
      exportGraphAndSetData(heapSnapshotManager);
      setStatusMessage('');
    }
  }

  function exportGraphAndSetData(gm: HeapSnapshotManager) {
    if (gm) {
      const ext = gm.exportGraph();
      setData(ext);
      const extTree = gm.exportGraphAsHierarchy();
      setTreeData(extTree);
    }
  }

  async function onGraphButtonClicked(event: any) {
    setChartType('graph');
  }

  async function onTreeButtonClicked(event: any) {
    setChartType('tree');
  }

  function handleDetachedDivClick(event: any) {
    if (event.target.matches('div.item')) {
      const liValue = event.target.innerText || '';
      setNodeToFocusId(liValue);
      const nodeId = parseInt(liValue) || 0;
      tryToFocusOnNode(nodeId)
    }
  }

  function handleCategoriesULClick(event: any) {
    if (event.target.matches('span')) {
      const liValue = event.target.innerText || '';
      setNodeToFocusId(liValue);
      const nodeId = parseInt(liValue) || 0;
      tryToFocusOnNode(nodeId)
    }
  }

  function onGCLevelsToExpandChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.value || '1';
    setGcLevelsToExpand(parseInt(newValue));
  }

  function onGCEdgeCountPerLevelChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.value || '1';
    setGcEdgeCountPerLevel(parseInt(newValue));
  }

  function onApplyFiltersClicked(event: any) {
    const nodeFilterinputs = document.querySelectorAll('div.node-filters input');
    const edgeFilterinputs = document.querySelectorAll('div.edge-filters input');

    const nodeFilterValues: string[] = [];
    const edgeFilterValues: string[] = [];

    nodeFilterinputs.forEach(option => {
      if ((option as HTMLInputElement).checked) {
        nodeFilterValues.push((option as HTMLInputElement).value);
      }
    });

    edgeFilterinputs.forEach(option => {
      if ((option as HTMLInputElement).checked) {
        edgeFilterValues.push((option as HTMLInputElement).value);
      }
    });

    tryToSetFilters(nodeFilterValues, edgeFilterValues);
  }

  return (
    <div className="App">
      <div className="controls">
        <div className='section file-input snapshot-info'>
          <h2>Load a file</h2>
          <FileInput load={onLoad} />
          {
            heapSnapshotManager === null ? <div></div> :
              <p>
                We processed your file and found <span>{snapshotInfo.totalNodes} </span> total nodes and <span> {snapshotInfo.totalEdges} </span>total edges.
                While processing we skipped <span>{snapshotInfo.totalSkipped} </span> edges that were of type <code>weak</code>
              </p>
          }
        </div>

        {
          heapSnapshotManager === null ? <div></div> :

            <div>

              <div className='section'>
                <h2>
                  <span className='info' title='Selct the types to be include when re-constructing the graph'>
                    ℹ️
                  </span>
                  Filters</h2>
                <div className='filter-container'>
                  <div className='node-filters'>
                    <h3>Node types</h3>
                    {
                      allNodeTypes.map(id =>
                        <div>
                          <input type={'checkbox'} value={id} defaultChecked={nodeTypeFilters.indexOf(id) !== -1} />
                          {id}
                        </div>
                      )
                    }
                  </div>

                  <div className='edge-filters'>
                    <h3>Edge types</h3>
                    {
                      allEdgeTypes.map(id =>
                        <div>
                          <input type={'checkbox'} value={id} defaultChecked={edgeTypeFilters.indexOf(id) !== -1} />
                          {id}
                        </div>
                      )
                    }
                  </div>
                </div>

                <button onClick={onApplyFiltersClicked}>Apply filters</button>
              </div>

              <div className='section roots-input'>
                <h2>GC Roots</h2>
                <div>Levels to expand: <input type={'number'} min={1} max={10} value={gcLevelsToExpand} onChange={onGCLevelsToExpandChange} /> </div>
                <div>Cap edges for each level: <input type={'number'} min={1} max={5} value={gcEdgeCountPerLevel} onChange={onGCEdgeCountPerLevelChange} /> </div>
                <button onClick={onShowGCRootsClicked}>Show GC Roots</button>
              </div>

              <div className='section node-input'>
                <h2>
                  <span className='info' title='You can copy the object id from the Memory panel, usually seen with the format @xxxxx next to the object name.'>
                    ℹ️
                  </span>
                  Focus on a node</h2>

                <label>Id to select:
                  <input type="text" id="nodeId" onChange={onFocusNodeInputChange} value={nodeToFocusId} />
                </label>
                {/* <br />
                  <label>Name of root:
                    <input type="text" id="rootId" onChange={onRootInputChange} value={rootId} />
                  </label> */
                }
                <button onClick={onFocusNodeClicked}>Focus on node</button>
              </div>

              <div className='section'>
                <h2>
                  <span className='info' title='Click on an id to focus on that node.'>
                    ℹ️
                  </span>
                  Some detached elements</h2>
                <div className='detached' onClick={handleDetachedDivClick}>
                  {
                    snapshotInfo.interestingNodeIds.map(id => <div className='item' key={id}> {id}</div>)
                  }
                </div>
              </div>

              <div className='section'>
                <h2><span className='info' title='Click on an id to focus on that node.'>
                  ℹ️
                </span>A sample of most common objects </h2>
                <ul className='aggregates' onClick={handleCategoriesULClick}>
                  {
                    categories.map(cat =>
                      <li key={cat.name}> 
                      <div> <strong> {cat.name || '(empty)'} </strong> x{cat.count}</div>
                      <div>
                        {
                          cat.ids.map(id => <span>{id}</span>)
                        }
                        </div>
                      </li>)
                  }
                </ul>
              </div>

              <div className='section'>
                <h2>Schema</h2>
                <div>
                  <textarea readOnly rows={15} cols={80} value={schema}></textarea>
                </div>

              </div>
            </div>
        }

      </div>
      <div className="visualization">
        <button onClick={onGraphButtonClicked} className='viz-button'>Graph</button>
        <button onClick={onTreeButtonClicked} className='viz-button'>Tree</button>

        <StatusMessage message={statusMessage} />

        {
          chartType === 'graph' ?
            <Chart focusedNodeId={focusedNodeId} data={data} />
            :
            <TreeChart focusedNodeId={focusedNodeId} data={treeData} />
        }
      </div>
    </div>
  );
}



export default App;
