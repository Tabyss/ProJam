import React from "react";
import type { HandlePos } from "../store/useNodeStore";
import { useEdgeStore } from "../store/useEdgeStore";
import { useCanvasStore } from "../store/useCanvasStore";

const useEdge = () => {
    const { x, y, scale } = useCanvasStore();
    const { setDraftEdge } = useEdgeStore();
    const handleConnectorMouseDown = (
        e: React.MouseEvent,
        sourceId: string,
        handlePos: HandlePos,
    ) => {
        e.stopPropagation();
        setDraftEdge({
            source: sourceId,
            sourceHandle: handlePos,
            x: (e.clientX - x) / scale,
            y: (e.clientY - y) / scale,
        });
    };
    return {
        handleConnectorMouseDown,
    };
};

export default useEdge;
