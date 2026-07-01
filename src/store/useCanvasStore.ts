import { create } from "zustand";
import type { point } from "../types/global";

interface CanvasState {
    coord: point;
    scale: number;
    isPanning: boolean;
    panStart: point;

    setCanvasPos: (coord: point) => void;
    setScale: (scale: number) => void;
    setIsPanning: (isPanning: boolean) => void;
    setPanStart: (coord: point) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
    coord: { x: 0, y: 0 },
    scale: 1,
    isPanning: false,
    panStart: { x: 0, y: 0 },

    setScale: (scale) => set({ scale }),
    setIsPanning: (isPanning) => set({ isPanning }),
    setCanvasPos: (coord) => set({ coord }),
    setPanStart: (panStart) => set({ panStart }),
}));
