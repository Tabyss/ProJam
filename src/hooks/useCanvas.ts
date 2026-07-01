import { useCallback } from "react";
import { useCanvasStore } from "../store/useCanvasStore";
import { useNodeStore } from "../store/useNodeStore";
import { useEdgeStore } from "../store/useEdgeStore";
import useEdge from "./useEdge";

export const useCanvas = () => {
    // 1. STORES
    const {
        coord,
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
        nodeOffset,
    } = useNodeStore();

    const { draftEdge, setDraftEdge } = useEdgeStore();
    const { handleEdgeMouseMove } = useEdge();

    // --- SUB-HANDLERS (Modular Logics) ---

    const handlePanning = useCallback(
        (e: React.MouseEvent) => {
            setCanvasPos({
                x: e.clientX - panStart.x,
                y: e.clientY - panStart.y,
            });
        },
        [panStart, setCanvasPos],
    );

    const handleNodeDragging = useCallback(
        (e: React.MouseEvent) => {
            if (draggedNodeId) {
                updateNode(draggedNodeId, {
                    obj: {
                        x: (e.clientX - coord.x) / scale - nodeOffset.x,
                        y: (e.clientY - coord.y) / scale - nodeOffset.y,
                    },
                });
            }
        },
        [draggedNodeId, coord, scale, nodeOffset, updateNode],
    );

    const handleNodeResizing = useCallback(
        (e: React.MouseEvent) => {
            if (resizingNode) {
                const { id, startW, startH, startX, startY } = resizingNode;
                const newW = startW + (e.clientX - startX) / scale;
                const newH = startH + (e.clientY - startY) / scale;
                updateNode(id, {
                    obj: {
                        width: Math.max(100, newW),
                        height: Math.max(50, newH),
                    },
                });
            }
        },
        [resizingNode, scale, updateNode],
    );

    // --- MAIN ORCHESTRATOR ---

    const handleWheel = (e: React.WheelEvent) => {
        const zoomFactor = 0.001;
        const delta = e.deltaY * zoomFactor;
        const newScale = Math.min(Math.max(0.2, scale - delta), 3);
        const scaleRatio = newScale / scale;

        const mouseX = e.clientX - coord.x;
        const mouseY = e.clientY - coord.y;

        const newCanvasX = mouseX - mouseX * scaleRatio;
        const newCanvasY = mouseY - mouseY * scaleRatio;

        setScale(newScale);
        setCanvasPos({ x: coord.x + newCanvasX, y: coord.y + newCanvasY });
    };

    const handleCanvasMouseDown = useCallback(
        (e: React.MouseEvent) => {
            setIsPanning(true);
            setPanStart({ x: e.clientX - coord.x, y: e.clientY - coord.y });
        },
        [coord, setIsPanning, setPanStart],
    );

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (isPanning) return handlePanning(e);
            if (draggedNodeId) return handleNodeDragging(e);
            if (resizingNode) return handleNodeResizing(e);
            if (draftEdge) return handleEdgeMouseMove(e);
        },
        [
            isPanning,
            draggedNodeId,
            resizingNode,
            draftEdge,
            handlePanning,
            handleNodeDragging,
            handleNodeResizing,
            handleEdgeMouseMove,
        ],
    );

    const handleCanvasMouseUp = useCallback(() => {
        setIsPanning(false);
        setDraggedNodeId(null);
        setResizingNode(null);
        setDraftEdge(null);
    }, [setIsPanning, setDraggedNodeId, setResizingNode, setDraftEdge]);

    return {
        handleWheel,
        handleCanvasMouseDown,
        handleMouseMove,
        handleCanvasMouseUp,
    };
};
