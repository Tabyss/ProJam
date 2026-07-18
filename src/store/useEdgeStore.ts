import { create } from "zustand";
import type { pos } from "../types/global";
import type { EdgeProps } from "../types/edge";

export interface Point {
    x: number;
    y: number;
}

export interface DraftEdge {
    sourceNodeId: string | number;
    sourceHandle: pos;
    point: Point[];
    isReversing?: boolean;
}

export interface DraggedSegment {
    edgeId: string;
    index: number;
    isHorizontal: boolean;
}

interface EdgeState {
    // --- State ---
    edges: EdgeProps[];
    draftEdge: DraftEdge | null;
    selectedEdgeId: string | null;
    draggedSegment: DraggedSegment | null;

    // --- Core Actions ---
    addEdge: (edge: EdgeProps) => void;
    updateEdge: (id: string, updates: Partial<EdgeProps>) => void;
    updateEdgeWaypoints: (id: string, waypoints: Point[]) => void;
    removeEdge: (id: string) => void;

    // --- Interaction Actions ---
    setDraftEdge: (draft: DraftEdge | null) => void;
    updateDraftEdge: (updates: Partial<DraftEdge>) => void;
    removeDraftEdge: () => void;
    
    setSelectedEdgeId: (id: string | null) => void;
    setDraggedSegment: (segment: DraggedSegment | null) => void;
}

export const useEdgeStore = create<EdgeState>((set) => ({
    edges: [],
    draftEdge: null,
    selectedEdgeId: null,
    draggedSegment: null,

    addEdge: (edge) => 
        set((state) => ({ edges: [...state.edges, edge] })),
        
    updateEdge: (id, updates) =>
        set((state) => ({
            edges: state.edges.map((edge) =>
                edge.id === id ? { ...edge, ...updates } : edge
            ),
        })),

    updateEdgeWaypoints: (id, waypoints) =>
        set((state) => ({
            edges: state.edges.map((edge) =>
                edge.id === id ? { ...edge, waypoints } : edge
            ),
        })),

    removeEdge: (id) =>
        set((state) => ({
            edges: state.edges.filter((edge) => edge.id !== id),
        })),

    setDraftEdge: (draft) => set({ draftEdge: draft }),
    
    updateDraftEdge: (updates) =>
        set((state) => {
            if (!state.draftEdge) return { draftEdge: null };
            return { draftEdge: { ...state.draftEdge, ...updates } };
        }),
        
    removeDraftEdge: () => set({ draftEdge: null }),
    
    setSelectedEdgeId: (id) => set({ selectedEdgeId: id }),
    setDraggedSegment: (segment) => set({ draggedSegment: segment }),
}));