export interface Viewport {
    x: number;
    y: number;
    zoom: number; 
}

export interface CanvasSettings {
    snapToGrid: boolean;
    gridSize: number;
    showGrid: boolean;
    isLocked: boolean;
}

export interface CanvasState {
    viewport: Viewport;
    settings: CanvasSettings;
    activeLayers: string[];
    history: {
        undoStack: string[];
        redoStack: string[];
    };
}