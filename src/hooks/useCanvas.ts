import { useCallback } from "react";
import { useCanvasStore } from "../store/useCanvasStore";
import { useNodeStore } from "../store/useNodeStore";
import { useEdgeStore } from "../store/useEdgeStore";

export const useCanvas = () => {
    const {
        x,
        y,
        scale,
        isPanning,
        panStart,
        setScale,
        setCanvasPos,
        setIsPanning,
        setPanStart,
    } = useCanvasStore();

    const {
        draggedNodeId,
        resizingNode,
        setDraggedNodeId,
        setResizingNode,
        updateNode,
    } = useNodeStore();

    const { draftEdge, setDraftEdge, updateDraftEdge } = useEdgeStore();

    const handleWheel = (e: React.WheelEvent) => {
        const zoomFactor = 0.001;
        const delta = e.deltaY * zoomFactor;

        const newScale = Math.min(Math.max(0.2, scale - delta), 3);
        const scaleRatio = newScale / scale;

        const mouseX = e.clientX - x;
        const mouseY = e.clientY - y;

        const newCanvasX = mouseX - mouseX * scaleRatio;
        const newCanvasY = mouseY - mouseY * scaleRatio;

        setScale(newScale);
        setCanvasPos(x + newCanvasX, y + newCanvasY);
    };

    const handleCanvasMouseDown = useCallback(
        (e: React.MouseEvent) => {
            setIsPanning(true);
            setPanStart(e.clientX - x, e.clientY - y);
        },
        [x, y, setIsPanning, setPanStart],
    );

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isPanning) {
            setCanvasPos(e.clientX - panStart.x, e.clientY - panStart.y);
            return;
        }

        if (draggedNodeId !== null) {
            const { nodeOffset } = useNodeStore.getState();
            updateNode(draggedNodeId, {
                x: (e.clientX - x) / scale - nodeOffset.x,
                y: (e.clientY - y) / scale - nodeOffset.y,
            });
            return;
        }

        if (resizingNode) {
            const { id, startW, startH, startX, startY } = resizingNode;
            const newW = startW + (e.clientX - startX) / scale;
            const newH = startH + (e.clientY - startY) / scale;

            updateNode(id, {
                width: Math.max(100, newW),
                height: Math.max(50, newH),
            });
        }

        if (draftEdge !== null) {
            updateDraftEdge({
                x: (e.clientX - x) / scale,
                y: (e.clientY - y) / scale,
            });
        }
    };

    const handleMouseUp = () => {
        setIsPanning(false);
        setDraggedNodeId(null);
        setResizingNode(null);
        setDraftEdge(null);
    };

    return {
        handleWheel,
        handleCanvasMouseDown,
        handleMouseMove,
        handleMouseUp,
    };
};
