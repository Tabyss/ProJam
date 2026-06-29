import React from "react";
import { useCanvas } from "../../hooks/useCanvas";
import { useCanvasStore } from "../../store/useCanvasStore";

const CanvasWrapper = ({ children }: { children: React.ReactNode }) => {
    const { x, y, scale, isPanning } = useCanvasStore();

    const {
        handleWheel,
        handleCanvasMouseDown,
        handleMouseMove,
        handleMouseUp,
    } = useCanvas();

    return (
        <div
            onWheel={handleWheel}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
                flex: 1,
                backgroundImage:
                    "radial-gradient(#ffffff44 1px, transparent 1px)",
                backgroundSize: `${20 * scale}px ${20 * scale}px`,
                backgroundPosition: `${x}px ${y}px`,
                cursor: isPanning ? "grabbing" : "default",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    transform: `translate(${x}px, ${y}px) scale(${scale})`,
                    transformOrigin: "0 0",
                    width: "100%",
                    height: "100%",
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default CanvasWrapper;
