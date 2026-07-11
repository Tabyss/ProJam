import React from "react";
import { useCanvas } from "../../hooks/useCanvas";
import { useCanvasStore } from "../../store/useCanvasStore";

const CanvasWrapper = ({ children }: { children: React.ReactNode }) => {
    const { coord, scale, isPanning } = useCanvasStore();

    const {
        handleWheel,
        handleCanvasMouseDown,
        handleMouseMove,
        handleCanvasMouseUp,
    } = useCanvas();

    const dotSize = 1 * scale;

    return (
        <div
            onWheel={handleWheel}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            className={`flex-1 relative overflow-hidden bg-background-500 w-full h-full ${
                isPanning ? "cursor-grabbing" : "cursor-default"
            }`}
            style={{
                backgroundImage: `radial-gradient(var(--color-text-300) ${dotSize}px, transparent ${dotSize}px)`,
                backgroundSize: `${20 * scale}px ${20 * scale}px`,
                backgroundPosition: `${coord.x}px ${coord.y}px`,
            }}
        >
            <div
                className="w-full h-full origin-top-left"
                style={{
                    transform: `translate(${coord.x}px, ${coord.y}px) scale(${scale})`,
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default CanvasWrapper;