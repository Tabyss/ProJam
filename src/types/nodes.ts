import type { pos } from "./global";

export type ShapeType =
    | "rectangle"
    | "circle"
    | "oval"
    | "parallelogram"
    | "trapezoid"
    | "diamond"
    | "triangle";

export interface BorderStyle {
    width: number;
    color: string;
    type: "solid" | "dashed";
}
export interface TextStyle {
    size: number;
    color: string
    align: "left" | "center" | "right" ;
    type: "bold" | "italic" | "normal";
}

export interface NodeSize {
    id: string;
    startW: number;
    startH: number;
    startX: number;
    startY: number;
}

export interface NodeStyleProps {
    color: string;
    border: BorderStyle;
    text: TextStyle;
}

export interface NodeObjProps {
    x: number;
    y: number;
    width: number;
    height: number;
    minWidth?: number;
    minHeight?: number;
    shape: ShapeType;
    rotation: number;
}

export interface NodeValueProps {
    header: string;
    text?: string;
}

export interface NodeStateProps {
    isRich: boolean;
    isSelected: boolean;
    isDragging: boolean;
    isfullfill: boolean;
    isError: boolean;
    isReadOnly: boolean;
    zIndex: number;
}

export interface NodeMetadata {
    type: string;
    tags: string[];
    version: number;
    updatedAt: number;
}

export interface PortProps {
    id: string;
    type: "input" | "output";
    pos: pos;
    label?: string;
}

export interface NodeProps {
    id: string;
    obj: NodeObjProps;
    style: NodeStyleProps;
    value: NodeValueProps;
    state: NodeStateProps;
    metadata: NodeMetadata;
    ports: PortProps[];

    onNodeClick?: (id: string) => void;
    onNodeUpdate?: (id: string, updates: Partial<NodeProps>) => void;
}
