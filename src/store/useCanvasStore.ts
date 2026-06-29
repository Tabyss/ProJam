import { create } from "zustand";

interface CanvasState {
    x: number;
    y: number;
    scale: number;
    isPanning: boolean;
    panStart: { x: number; y: number };

    setCanvasPos: (x: number, y: number) => void;
    setScale: (scale: number) => void;
    setIsPanning: (isPanning: boolean) => void;
    setPanStart: (x: number, y: number) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
    x: 0,
    y: 0,
    scale: 1,
    isPanning: false,
    panStart: { x: 0, y: 0 },

    setScale: (scale) => set({ scale }),

    setIsPanning: (isPanning) => set({ isPanning }),

    setCanvasPos: (x, y) => set({ x, y }),

    setPanStart: (x, y) => set({ panStart: { x, y } }),
}));
