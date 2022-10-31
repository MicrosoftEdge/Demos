/** The structure of the heap snapshot json. */
export interface HeapSnapshotSchema {
    snapshot: {
        meta: {
            "node_fields": string[], // ["type", "name", "id", "self_size", "edge_count", "trace_node_id"],
            "node_types": Array<string[] | string>, // ["hidden", "array", "string", "object", "code", "closure", "regexp", "number", "native", "synthetic", "concatenated string", "sliced string", "symbol", "bigint"],
            "edge_fields": string[], // [ "type", "name_or_index", "to_node" ],
            "edge_types": string[], // ["context", "element", "property", "internal", "hidden", "shortcut", "weak"]
            "trace_function_info_fields": string[],
            "trace_node_fields": string[],
            "sample_fields": string[],
            "location_fields": string[],
        }
        edge_count: number,
        node_count: number,
    }
    nodes: number[],
    edges: number[],
    trace_function_infos: string[],
    trace_tree: string[],
    samples: string[],
    locations: number[],
    strings: string[],
}

