import { useCallback } from "react";
import { useCanvasStore } from "../store/useCanvasStore";
import { useNodeStore } from "../store/useNodeStore";
import { useEdgeStore } from "../store/useEdgeStore";
import useEdge from "./useEdge";

export const useCanvas = () => {
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
        selectedNodeId,
        setDraggedNodeId,
        setResizingNode,
        setSelectedNodeId,
        updateNode,
        nodeOffset,
    } = useNodeStore();

    const { 
        draftEdge, 
        selectedEdgeId, 
        draggedSegment,      
        setDraftEdge, 
        setSelectedEdgeId,
        setDraggedSegment,   
    } = useEdgeStore();
    
    const { handleEdgeMouseMove, handleSegmentMouseMove } = useEdge(); 

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
                        width: Math.max(80, newW),
                        height: Math.max(40, newH),
                    },
                });
            }
        },
        [resizingNode, scale, updateNode],
    );

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

            if (selectedNodeId) setSelectedNodeId(null);
            if (selectedEdgeId) setSelectedEdgeId(null);
        },
        [
            coord,
            setIsPanning,
            setPanStart,
            selectedNodeId,
            selectedEdgeId,
            setSelectedNodeId,
            setSelectedEdgeId,
        ],
    );

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (isPanning) return handlePanning(e);
            if (draggedNodeId) return handleNodeDragging(e);
            if (resizingNode) return handleNodeResizing(e);
            if (draggedSegment) return handleSegmentMouseMove(e);
            if (draftEdge) return handleEdgeMouseMove(e);
        },
        [
            isPanning,
            draggedNodeId,
            resizingNode,
            draggedSegment, 
            draftEdge,
            handlePanning,
            handleNodeDragging,
            handleNodeResizing,
            handleSegmentMouseMove,
            handleEdgeMouseMove,
        ],
    );

    const handleCanvasMouseUp = useCallback(() => {
        setIsPanning(false);
        setDraggedNodeId(null);
        setResizingNode(null);
        setDraftEdge(null);
        if (setDraggedSegment) setDraggedSegment(null);
    }, [
        setIsPanning, 
        setDraggedNodeId, 
        setResizingNode, 
        setDraftEdge, 
        setDraggedSegment 
    ]);

    return {
        handleWheel,
        handleCanvasMouseDown,
        handleMouseMove,
        handleCanvasMouseUp,
    };
};