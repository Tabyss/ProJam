import React, { useCallback } from "react";
import { useNodeStore } from "../store/useNodeStore";
import { useEdgeStore } from "../store/useEdgeStore";
import { useCanvasStore } from "../store/useCanvasStore";
import { getNodePointCoords } from "../utils/Point";
import type { NodeProps } from "../types/nodes";
import type { pos } from "../types/global";
import type { EdgeProps } from "../types/edge";

const useEdge = () => {
    const { coord, scale } = useCanvasStore();
    const { setSelectedNodeId } = useNodeStore();
    const {
        setSelectedEdgeId,
        setDraftEdge,
        updateDraftEdge,
        removeDraftEdge,
    } = useEdgeStore();

    const MARGIN = 20;

    const getMarginOffset = (handle: pos) => {
        const margins = {
            top: { x: 0, y: -MARGIN },
            bottom: { x: 0, y: MARGIN },
            left: { x: -MARGIN, y: 0 },
            right: { x: MARGIN, y: 0 },
        };
        return margins[handle] || { x: 0, y: 0 };
    };

    const handleConnectorMouseDown = (
        e: React.MouseEvent,
        node: NodeProps,
        handlePos: pos,
    ) => {
        e.stopPropagation();
        const coords = getNodePointCoords(node, handlePos);

        setDraftEdge({
            sourceNodeId: node.id,
            sourceHandle: handlePos,
            point: [
                { x: coords.x, y: coords.y },
                {
                    x: (e.clientX - coords.x) / scale,
                    y: (e.clientY - coords.y) / scale,
                },
            ],
        });
    };

    const handleConnectorMouseUp = (
        e: React.MouseEvent,
        targetNode: NodeProps,
        targetHandlePos: pos,
    ) => {
        e.stopPropagation();
        const { draftEdge, addEdge } = useEdgeStore.getState();

        if (draftEdge && draftEdge.sourceNodeId !== targetNode.id) {
            const anchorDot = {
                nodeId: String(draftEdge.sourceNodeId),
                nodeFace: draftEdge.sourceHandle,
            };
            const dropDot = {
                nodeId: String(targetNode.id),
                nodeFace: targetHandlePos,
            };

            const newEdge: EdgeProps = {
                id: `edge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                source: draftEdge.isReversing ? [dropDot] : [anchorDot],
                target: draftEdge.isReversing ? [anchorDot] : [dropDot],
                waypoints: draftEdge.point,
            };

            addEdge(newEdge);
        }
        removeDraftEdge();
    };

    const handleEdgeMouseDown = (e: React.MouseEvent, edge: EdgeProps) => {
        e.stopPropagation();
        setSelectedEdgeId(edge.id);
        setSelectedNodeId(null);
    };

    const handleEdgeMouseMove = useCallback(
        (e: React.MouseEvent) => {
            const { draftEdge } = useEdgeStore.getState();
            if (!draftEdge) return;

            const sourceNode = useNodeStore
                .getState()
                .nodes.find((n) => n.id === draftEdge.sourceNodeId);
            if (!sourceNode) return;

            const cursorPoint = {
                x: (e.clientX - coord.x) / scale,
                y: (e.clientY - coord.y) / scale,
            };

            const startPoint = draftEdge.point[0];
            const handle = draftEdge.sourceHandle;

            const offset = getMarginOffset(handle);
            const marginPoint = {
                x: startPoint.x + offset.x,
                y: startPoint.y + offset.y,
            };

            const nodeBounds = {
                top: sourceNode.obj.y - MARGIN,
                bottom: sourceNode.obj.y + sourceNode.obj.height + MARGIN,
                left: sourceNode.obj.x - MARGIN,
                right: sourceNode.obj.x + sourceNode.obj.width + MARGIN,
            };

            const isHandleHorizontal = handle === "left" || handle === "right";
            const pathPoints = [startPoint, marginPoint];

            if (isHandleHorizontal) {
                const isYInsideNode =
                    cursorPoint.y > nodeBounds.top &&
                    cursorPoint.y < nodeBounds.bottom;
                const isBehindNode =
                    handle === "right"
                        ? cursorPoint.x < nodeBounds.right
                        : cursorPoint.x > nodeBounds.left;

                if (isYInsideNode && isBehindNode) {
                    const routeY =
                        Math.abs(cursorPoint.y - nodeBounds.top) <
                        Math.abs(cursorPoint.y - nodeBounds.bottom)
                            ? nodeBounds.top
                            : nodeBounds.bottom;

                    pathPoints.push({ x: marginPoint.x, y: routeY });
                    pathPoints.push({ x: cursorPoint.x, y: routeY });
                } else {
                    pathPoints.push({ x: marginPoint.x, y: cursorPoint.y });
                }
            } else {
                const isXInsideNode =
                    cursorPoint.x > nodeBounds.left &&
                    cursorPoint.x < nodeBounds.right;
                const isBehindNode =
                    handle === "bottom"
                        ? cursorPoint.y < nodeBounds.bottom
                        : cursorPoint.y > nodeBounds.top;

                if (isXInsideNode && isBehindNode) {
                    const routeX =
                        Math.abs(cursorPoint.x - nodeBounds.left) <
                        Math.abs(cursorPoint.x - nodeBounds.right)
                            ? nodeBounds.left
                            : nodeBounds.right;

                    pathPoints.push({ x: routeX, y: marginPoint.y });
                    pathPoints.push({ x: routeX, y: cursorPoint.y });
                } else {
                    pathPoints.push({ x: cursorPoint.x, y: marginPoint.y });
                }
            }

            pathPoints.push(cursorPoint);
            updateDraftEdge({ point: pathPoints });
        },
        [coord, scale, updateDraftEdge],
    );

    const handleEdgeTerminalMouseDown = (
        e: React.MouseEvent,
        edgeId: string,
        terminalType: "source" | "target",
    ) => {
        e.stopPropagation();
        const { edges, removeEdge } = useEdgeStore.getState();
        const edge = edges.find((e) => e.id === edgeId);
        if (!edge) return;

        removeEdge(edgeId);

        const anchor =
            terminalType === "target" ? edge.source[0] : edge.target[0];

        const anchorNode = useNodeStore
            .getState()
            .nodes.find((n) => n.id === anchor.nodeId);
        if (!anchorNode) return;

        const startCoords = getNodePointCoords(anchorNode, anchor.nodeFace);

        setDraftEdge({
            sourceNodeId: anchor.nodeId,
            sourceHandle: anchor.nodeFace,
            isReversing: terminalType === "source",
            point: [
                { x: startCoords.x, y: startCoords.y },
                {
                    x: (e.clientX - coord.x) / scale,
                    y: (e.clientY - coord.y) / scale,
                },
            ],
        });
    };

    return {
        handleConnectorMouseDown,
        handleConnectorMouseUp,
        handleEdgeTerminalMouseDown,
        handleEdgeMouseDown,
        handleEdgeMouseMove,
        removeDraftEdge,
    };
};

export default useEdge;
