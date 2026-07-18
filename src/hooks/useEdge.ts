import React, { useCallback } from "react";
import { useNodeStore } from "../store/useNodeStore";
import { useEdgeStore, type Point } from "../store/useEdgeStore";
import { useCanvasStore } from "../store/useCanvasStore";
import { getNodePointCoords } from "../utils/Point";
import type { NodeProps } from "../types/nodes";
import type { pos } from "../types/global";
import type { EdgeProps } from "../types/edge";
import { getDynamicWaypoints } from "../utils/EdgeRouting";

const useEdge = () => {
    const { coord, scale } = useCanvasStore();
    const { setSelectedNodeId } = useNodeStore();
    const {
        setSelectedEdgeId,
        setDraftEdge,
        updateEdge,
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

        const startPoint = getNodePointCoords(node, handlePos);

        const currentMousePos = {
            x: (e.clientX - coord.x) / scale,
            y: (e.clientY - coord.y) / scale,
        };

        setDraftEdge({
            sourceNodeId: node.id,
            sourceHandle: handlePos,
            point: [{ x: startPoint.x, y: startPoint.y }, currentMousePos],
        });
    };

    const handleConnectorMouseUp = (
        e: React.MouseEvent,
        targetNode: NodeProps,
        targetHandlePos: pos,
    ) => {
        e.stopPropagation();

        const { draftEdge, addEdge, removeDraftEdge } = useEdgeStore.getState();
        const { nodes } = useNodeStore.getState();

        if (draftEdge && draftEdge.sourceNodeId !== targetNode.id) {
            const sourceNode = nodes.find(
                (n) => n.id === draftEdge.sourceNodeId,
            );

            if (sourceNode) {
                const anchorDot = {
                    nodeId: String(draftEdge.sourceNodeId),
                    nodeFace: draftEdge.sourceHandle,
                };
                const dropDot = {
                    nodeId: String(targetNode.id),
                    nodeFace: targetHandlePos,
                };

                const trueSourceNode = draftEdge.isReversing
                    ? targetNode
                    : sourceNode;
                const trueSourceHandle = draftEdge.isReversing
                    ? targetHandlePos
                    : draftEdge.sourceHandle;
                const trueTargetNode = draftEdge.isReversing
                    ? sourceNode
                    : targetNode;
                const trueTargetHandle = draftEdge.isReversing
                    ? draftEdge.sourceHandle
                    : targetHandlePos;

                const optimalWaypoints = getDynamicWaypoints(
                    trueSourceNode,
                    trueSourceHandle,
                    { x: trueTargetNode.obj.x, y: trueTargetNode.obj.y },
                    trueTargetHandle,
                );

                const newEdge: EdgeProps = {
                    id: `edge_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
                    source: draftEdge.isReversing ? [dropDot] : [anchorDot],
                    target: draftEdge.isReversing ? [anchorDot] : [dropDot],
                    style: {
                        width: 2,
                        type: "solid",
                        color: "var(--color-text-500)",
                    },
                    waypoints: optimalWaypoints,
                };

                addEdge(newEdge);
            }
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

            if (!draftEdge || !draftEdge.point || draftEdge.point.length === 0)
                return;

            const { nodes } = useNodeStore.getState();
            const sourceNode = nodes.find(
                (n) => n.id === draftEdge.sourceNodeId,
            );

            if (!sourceNode || !sourceNode.obj) return;

            const cursorPoint = {
                x: (e.clientX - coord.x) / scale,
                y: (e.clientY - coord.y) / scale,
            };

            const startPoint = draftEdge.point[0];
            const handle = draftEdge.sourceHandle;

            // const dh = Math.abs(cursorPoint.x - startPoint.x);
            // const dv = Math.abs(cursorPoint.y - startPoint.y);

            // console.log(draftEdge)

            const offset = getMarginOffset(handle);
            const marginPoint = {
                x: startPoint.x + offset.x,
                y: startPoint.y + offset.y,
            };

            const { x, y, width, height } = sourceNode.obj;
            const nodeBounds = {
                top: y - MARGIN,
                bottom: y + height + MARGIN,
                left: x - MARGIN,
                right: x + width + MARGIN,
            };

            const isHandleHorizontal = handle === "left" || handle === "right";
            const pathPoints = [startPoint, marginPoint];

            if (isHandleHorizontal) {
                const isYInsideNode =
                    cursorPoint.y >= nodeBounds.top &&
                    cursorPoint.y <= nodeBounds.bottom;
                const isBehindNode =
                    handle === "right"
                        ? cursorPoint.x <= nodeBounds.right
                        : cursorPoint.x >= nodeBounds.left;

                if (isYInsideNode && isBehindNode) {
                    const routeY =
                        Math.abs(cursorPoint.y - nodeBounds.top) <
                        Math.abs(cursorPoint.y - nodeBounds.bottom)
                            ? nodeBounds.top
                            : nodeBounds.bottom;

                    pathPoints.push(
                        { x: marginPoint.x, y: routeY },
                        { x: cursorPoint.x, y: routeY },
                    );
                } else {
                    pathPoints.push({ x: marginPoint.x, y: cursorPoint.y });
                }
            } else {
                const isXInsideNode =
                    cursorPoint.x >= nodeBounds.left &&
                    cursorPoint.x <= nodeBounds.right;
                const isBehindNode =
                    handle === "bottom"
                        ? cursorPoint.y <= nodeBounds.bottom
                        : cursorPoint.y >= nodeBounds.top;

                if (isXInsideNode && isBehindNode) {
                    const routeX =
                        Math.abs(cursorPoint.x - nodeBounds.left) <
                        Math.abs(cursorPoint.x - nodeBounds.right)
                            ? nodeBounds.left
                            : nodeBounds.right;

                    pathPoints.push(
                        { x: routeX, y: marginPoint.y },
                        { x: routeX, y: cursorPoint.y },
                    );
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

    const handleSegmentMouseDown = (
        e: React.MouseEvent,
        edgeId: string,
        index: number,
        isHorizontal: boolean,
        renderedPoints: Point[],
    ) => {
        e.stopPropagation();
        setSelectedEdgeId(edgeId);
        setSelectedNodeId(null);

        const { edges, updateEdge, setDraggedSegment } =
            useEdgeStore.getState();
        const edge = edges.find((item) => item.id === edgeId);
        if (!edge) return;

        const sourceNode = useNodeStore
            .getState()
            .nodes.find((n) => n.id === edge.source[0].nodeId);
        const targetNode = useNodeStore
            .getState()
            .nodes.find((n) => n.id === edge.target[0].nodeId);
        if (!sourceNode || !targetNode) return;

        const currentPoints =
            renderedPoints && renderedPoints.length >= 4
                ? [...renderedPoints].map((p) => ({ ...p }))
                : getDynamicWaypoints(
                      sourceNode,
                      edge.source[0].nodeFace,
                      { x: targetNode.obj.x, y: targetNode.obj.y },
                      edge.target[0].nodeFace,
                  );

        // if (!currentPoints || currentPoints.length < 4) return;

        const clickPoint = {
            x: (e.clientX - coord.x) / scale,
            y: (e.clientY - coord.y) / scale,
        };

        const face = edge.source[0].nodeFace;
        const targetFace = edge.target[0].nodeFace;
        const stubDist = 40;

        if (index === 0) {
            const [p0, p1, ...rest] = currentPoints;
            const isFaceHorizontal = face === "left" || face === "right";
            const signX = face === "right" ? 1 : face === "left" ? -1 : 0;
            const signY = face === "bottom" ? 1 : face === "top" ? -1 : 0;

            let newWaypoints: Point[];

            if (isFaceHorizontal) {
                const y3 = clickPoint.y;

                newWaypoints = [
                    p0,
                    { x: p0.x + signX * stubDist, y: p0.y },
                    { x: p0.x + signX * stubDist, y: y3 },
                    { x: p1.x, y: y3 },
                    ...rest,
                ];

                updateEdge(edgeId, { waypoints: newWaypoints });
                setDraggedSegment({ edgeId, index: 2, isHorizontal: true });
            } else {
                const x3 = clickPoint.x;

                newWaypoints = [
                    p0,
                    { x: p0.x, y: p0.y + signY * stubDist },
                    { x: x3, y: p0.y + signY * stubDist },
                    { x: x3, y: p1.y },
                    ...rest,
                ];

                updateEdge(edgeId, { waypoints: newWaypoints });
                setDraggedSegment({ edgeId, index: 2, isHorizontal: false });
            }
        } else if (index === currentPoints.length - 2) {
            const pPrev = currentPoints[currentPoints.length - 2];
            const pLast = currentPoints[currentPoints.length - 1];
            const rest = currentPoints.slice(0, -2);

            const isTargetHorizontal =
                targetFace === "left" || targetFace === "right";
            const signX =
                targetFace === "right" ? 1 : targetFace === "left" ? -1 : 0;
            const signY =
                targetFace === "bottom" ? 1 : targetFace === "top" ? -1 : 0;

            let newWaypoints: Point[];

            if (isTargetHorizontal) {
                const y3 = clickPoint.y;

                newWaypoints = [
                    ...rest,
                    { x: pPrev.x, y: y3 },
                    { x: pLast.x + signX * stubDist, y: y3 },
                    { x: pLast.x + signX * stubDist, y: pLast.y },
                    pLast,
                ];

                updateEdge(edgeId, { waypoints: newWaypoints });

                setDraggedSegment({
                    edgeId,
                    index: newWaypoints.length - 4,
                    isHorizontal: true,
                });
            } else {
                const x3 = clickPoint.x;

                newWaypoints = [
                    ...rest,
                    { x: x3, y: pPrev.y },
                    { x: x3, y: pLast.y + signY * stubDist },
                    { x: pLast.x, y: pLast.y + signY * stubDist },
                    pLast,
                ];

                updateEdge(edgeId, { waypoints: newWaypoints });

                setDraggedSegment({
                    edgeId,
                    index: newWaypoints.length - 4,
                    isHorizontal: false,
                });
            }
        } else {
            setDraggedSegment({ edgeId, index, isHorizontal });
        }
    };

    const handleSegmentMouseMove = useCallback(
        (e: React.MouseEvent) => {
            const { draggedSegment, edges } = useEdgeStore.getState();
            if (!draggedSegment) return;

            console.log(draggedSegment, edges);
            const cursorPoint = {
                x: (e.clientX - coord.x) / scale,
                y: (e.clientY - coord.y) / scale,
            };

            const edge = edges.find((e) => e.id === draggedSegment.edgeId);

            if (edge && edge.waypoints) {
                const newWaypoints = [...edge.waypoints];
                const i = draggedSegment.index;

                if (!newWaypoints[i] || !newWaypoints[i + 1]) return;

                if (draggedSegment.isHorizontal) {
                    newWaypoints[i].y = cursorPoint.y;
                    newWaypoints[i + 1].y = cursorPoint.y;
                } else {
                    newWaypoints[i].x = cursorPoint.x;
                    newWaypoints[i + 1].x = cursorPoint.x;
                }

                updateEdge(edge.id, { waypoints: newWaypoints });
            }
        },
        [coord, scale, updateEdge],
    );

    return {
        handleConnectorMouseDown,
        handleConnectorMouseUp,
        handleEdgeTerminalMouseDown,
        handleEdgeMouseDown,
        handleEdgeMouseMove,
        removeDraftEdge,
        handleSegmentMouseDown,
        handleSegmentMouseMove,
    };
};

export default useEdge;
