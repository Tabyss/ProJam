import { create } from "zustand";
import type { HandlePos } from "./useNodeStore";

export interface Edge {
    id: string;
    source: string;
    sourceHandle: HandlePos;
    target: string;
    targetHandle: HandlePos;
}

export interface DraftEdge {
    source: string;
    sourceHandle: HandlePos;
    x: number;
    y: number;
}

interface EdgeState {
    edges: Edge[];
    draftEdge: DraftEdge | null;
    addEdge: (edge: Edge) => void;
    setDraftEdge: (draft: DraftEdge | null) => void;
    updateDraftEdge: (updates: Partial<DraftEdge>) => void;
    removeDraftEdge: () => void;
}

export const useEdgeStore = create<EdgeState>((set) => ({
    edges: [
        {
            id: "e1",
            source: "1",
            sourceHandle: "right",
            target: "2",
            targetHandle: "left",
        },
    ],
    draftEdge: null,
    addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),
    setDraftEdge: (draft) => set({ draftEdge: draft }),
    updateDraftEdge: (updates) =>
        set((state) => ({
            draftEdge: state.draftEdge
                ? { ...state.draftEdge, ...updates }
                : null,
        })),
    removeDraftEdge: () => set({ draftEdge: null }),
}));
