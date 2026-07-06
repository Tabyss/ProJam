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

interface EdgeState {
    edges: EdgeProps[];
    draftEdge: DraftEdge | null;
    selectedEdgeId: string | null;
    
    addEdge: (edge: EdgeProps) => void;
    updateEdge: (id: string, updates: Partial<EdgeProps>) => void;
    removeEdge: (id: string) => void;
    
    setDraftEdge: (draft: DraftEdge | null) => void;
    setSelectedEdgeId: (id: string | null) => void;
    updateDraftEdge: (updates: Partial<DraftEdge>) => void;
    removeDraftEdge: () => void;
}

export const useEdgeStore = create<EdgeState>((set) => ({
    edges: [],
    draftEdge: null,
    selectedEdgeId: null,

    addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),
    updateEdge: (id, updates) =>
        set((state) => ({
            edges: state.edges.map((edge) =>
                edge.id === id ? { ...edge, ...updates } : edge,
            ),
        })),
    removeEdge: (id) =>
        set((state) => ({
            edges: state.edges.filter((edge) => edge.id !== id),
        })),

    setDraftEdge: (draft) => set({ draftEdge: draft }),
    setSelectedEdgeId: (id) => set({ selectedEdgeId: id }),
    updateDraftEdge: (updates) =>
        set((state) => {
            if (!state.draftEdge) return { draftEdge: null };
            return {
                draftEdge: { ...state.draftEdge, ...updates },
            };
        }),
    removeDraftEdge: () => set({ draftEdge: null }),
}));
