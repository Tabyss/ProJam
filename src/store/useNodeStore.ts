import { create } from "zustand";

export type HandlePos = "top" | "right" | "bottom" | "left";

export interface CanvasNode {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    title: string;
    color: string;
}
export interface NodeSize {
    id: string;
    startW: number;
    startH: number;
    startX: number;
    startY: number;
}

interface NodeState {
    nodes: CanvasNode[];
    selectedNodeId: string | null;
    editingNodeId: string | null;
    draggedNodeId: string | null;
    resizingNode: NodeSize | null;
    nodeOffset: { x: number; y: number };

    setSelectedNodeId: (id: string | null) => void;
    setEditingNodeId: (id: string | null) => void;
    setDraggedNodeId: (id: string | null) => void;
    setResizingNode: (node: NodeSize | null) => void;
    setNodeOffset: (x: number, y: number) => void;

    addNode: (node: CanvasNode) => void;
    updateNode: (id: string, updates: Partial<CanvasNode>) => void;
    removeNode: (id: string) => void;
}

export const useNodeStore = create<NodeState>((set) => ({
    nodes: [
        {
            id: "1",
            x: 100,
            y: 150,
            width: 150,
            height: 80,
            title: "Planning",
            color: "#3b82f6",
        },
    ],
    selectedNodeId: null,
    editingNodeId: null,
    draggedNodeId: null,
    resizingNode: null,
    nodeOffset: { x: 0, y: 0 },

    setSelectedNodeId: (id) => set({ selectedNodeId: id }),
    setEditingNodeId: (id) => set({ editingNodeId: id }),
    setDraggedNodeId: (id) => set({ draggedNodeId: id }),
    setResizingNode: (node) => set({ resizingNode: node }),
    setNodeOffset: (x, y) => set({ nodeOffset: { x, y } }),

    addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),

    updateNode: (id, updates) =>
        set((state) => ({
            nodes: state.nodes.map((n) =>
                n.id === id ? { ...n, ...updates } : n,
            ),
        })),

    removeNode: (id) =>
        set((state) => ({
            nodes: state.nodes.filter((n) => n.id !== id),
        })),
}));
