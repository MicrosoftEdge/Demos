
export interface IHIerarchy {
  nodes: {
    name: string;
    id: number;
    important: boolean;
    type: number;
    typeName: string; 
  }[]; 
  
  links: {
    source: number;
    target: number;
    name: string;
  }[];
}

export interface IHIerarchyTree {
  name: string;
  id: number;
  important: boolean;
  type: number;
  children?: Array<IHIerarchyTree>;
}

export interface SnapshotInfo {
  totalNodes: number;
  totalEdges: number;
  totalSkipped: number;
  interestingNodeIds: number[];
}

export interface ICategories {
  name:string;
  ids: number[];
  count: number;
}
