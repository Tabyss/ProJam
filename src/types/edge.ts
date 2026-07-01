import type { point, pos } from "./global";

export type EdgeType = "bezier" | "straight" | "step"; 

export interface EdgeMetadata {
    animated: boolean;
    label?: string;
    color: string;
    style: "dashed" | "solid";
}

export interface EdgeProps {
    id: string;
    source: string;
    target: string;
    sourceHandle: pos;
    targetHandle: pos;
    
    type: EdgeType;
    waypoints: point[]; 
    metadata: EdgeMetadata;
    
    isActive: boolean; 
    isValid: boolean;
}