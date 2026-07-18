import type { point, pos } from "./global";

export type EdgeType = "bezier" | "straight" | "step";

export interface dotPos {
    nodeId: string;
    nodeFace: pos;
}

export interface EdgeStyleProps {
    width: number;
    color: string;
    type: "solid" | "dashed" | "dotted";
}

export interface EdgeProps {
    id: string;
    source: dotPos[];
    target: dotPos[];
    style?: EdgeStyleProps;

    type?: EdgeType;
    waypoints: point[];

    isActive?: boolean;
}
