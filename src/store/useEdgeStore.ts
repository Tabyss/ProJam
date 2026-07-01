import { create } from "zustand";
import type { pos } from "../types/global";

export interface Point {
    x: number;
    y: number;
}
export interface Edge {
    id: string;
    source: string;
    sourceHandle: pos;
    target: string;
    targetHandle: pos;
    waypoints?: Point[];
}

export interface DraftEdge {
    source: string;
    sourceHandle: pos;
    point: Point[];
}

interface EdgeState {
    edges: Edge[];
    draftEdge: DraftEdge | null;

    addEdge: (edge: Edge) => void;
    updateEdge: (id: string, updates: Partial<Edge>) => void;

    setDraftEdge: (draft: DraftEdge | null) => void;
    updateDraftEdge: (updates: Partial<DraftEdge>) => void;
    removeDraftEdge: () => void;
}

export const useEdgeStore = create<EdgeState>((set) => ({
    edges: [],
    draftEdge: null,

    addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),
    updateEdge: (id, updates) =>
        set((state) => ({
            edges: state.edges.map((edge) =>
                edge.id === id ? { ...edge, ...updates } : edge,
            ),
        })),

    setDraftEdge: (draft) => set({ draftEdge: draft }),
    updateDraftEdge: (updates) =>
        set((state) => {
            if (!state.draftEdge) return { draftEdge: null };

            return {
                draftEdge: { ...state.draftEdge, ...updates },
            };
        }),
    removeDraftEdge: () => set({ draftEdge: null }),
}));
