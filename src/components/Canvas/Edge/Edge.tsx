import useEdge from "../../../hooks/useEdge";
import { type Point, useEdgeStore } from "../../../store/useEdgeStore";
import { useNodeStore } from "../../../store/useNodeStore";
import {
    createRoundedPath,
    getDynamicWaypoints,
} from "../../../utils/EdgeRouting";
import { getNodePointCoords } from "../../../utils/Point";
import EdgeMenu from "./EdgeMenu";

export const Edge = () => {
    //store
    const { edges, draftEdge, selectedEdgeId, updateEdge } = useEdgeStore();
    const { nodes } = useNodeStore();
    const selectedEdge = selectedEdgeId
        ? edges.find((x) => x.id === selectedEdgeId)
        : undefined;

    //hook
    const {
        handleEdgeTerminalMouseDown,
        handleEdgeMouseDown,
        handleSegmentMouseDown,
    } = useEdge();

    const computedEdges = edges
        ?.map((edge) => {
            const sourceNode = nodes.find(
                (n) => n.id === edge.source[0].nodeId,
            );
            const targetNode = nodes.find(
                (n) => n.id === edge.target[0].nodeId,
            );

            if (!sourceNode || !targetNode) return null;

            const currentStartCoords = getNodePointCoords(
                sourceNode,
                edge.source[0].nodeFace,
            );
            const currentEndCoords = getNodePointCoords(
                targetNode,
                edge.target[0].nodeFace,
            );

            let points: Point[];

            if (edge.waypoints && edge.waypoints.length >= 2) {
                points = [...edge.waypoints];
                points[0] = currentStartCoords;
                points[points.length - 1] = currentEndCoords;

                if (points.length > 2) {
                    const sourceFace = edge.source[0].nodeFace;
                    if (sourceFace === "left" || sourceFace === "right") {
                        points[1].y = currentStartCoords.y;
                    } else {
                        points[1].x = currentStartCoords.x;
                    }

                    const targetFace = edge.target[0].nodeFace;
                    if (targetFace === "left" || targetFace === "right") {
                        points[points.length - 2].y = currentEndCoords.y;
                    } else {
                        points[points.length - 2].x = currentEndCoords.x;
                    }
                }
            } else {
                points = getDynamicWaypoints(
                    sourceNode,
                    edge.source[0].nodeFace,
                    currentEndCoords,
                    edge.target[0].nodeFace,
                );
            }

            if (points.length < 2) return null;

            return { edge, points };
        })
        .filter(Boolean) as { edge: (typeof edges)[0]; points: Point[] }[];

    let menuCoords: Point | null = null;
    if (selectedEdgeId) {
        const activeComputedEdge = computedEdges.find(
            (ce) => ce.edge.id === selectedEdgeId,
        );
        if (activeComputedEdge) {
            const pts = activeComputedEdge.points;
            const minX = Math.min(...pts.map((c) => c.x));
            const maxX = Math.max(...pts.map((c) => c.x));
            const maxY = Math.min(...pts.map((c) => c.y));

            menuCoords = {
                x: (minX + maxX) / 2,
                y: maxY,
            };
        }
    }

    return (
        <div
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
            }}
        >
            <svg
                style={{
                    width: "100%",
                    height: "100%",
                    overflow: "visible",
                }}
            >
                {computedEdges.map(({ edge, points }) => {
                    const startPoint = points[0];
                    const endPoint = points[points.length - 1];

                    return (
                        <g
                            key={edge.id}
                            className="group"
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            <path
                                pointerEvents="stroke"
                                onMouseDown={(e) =>
                                    handleEdgeMouseDown(e, edge)
                                }
                                d={createRoundedPath(points, 0)}
                                stroke={
                                    edge.id === selectedEdgeId
                                        ? edge.style?.color
                                        : edge.style?.color
                                }
                                strokeWidth={edge.style?.width}
                                fill="none"
                                cursor="pointer"
                                strokeLinecap="round"
                                strokeDasharray={
                                    edge.style?.type === "dashed"
                                        ? `5,${edge.style?.width + 5}`
                                        : edge.style?.type === "dotted"
                                          ? `0,${edge.style?.width + 5}`
                                          : "0,0"
                                }
                            />

                            {edge.id === selectedEdgeId &&
                                points.map((p, index) => {
                                    if (index === points.length - 1)
                                        return null;

                                    const nextP = points[index + 1];
                                    const isHorizontal =
                                        Math.abs(p.y - nextP.y) < 1;

                                    const midX = (p.x + nextP.x) / 2;
                                    const midY = (p.y + nextP.y) / 2;

                                    return (
                                        <g
                                            key={`segment-wrapper-${edge.id}-${index}`}
                                        >
                                            <rect
                                                pointerEvents="all"
                                                x={
                                                    midX -
                                                    (isHorizontal ? 8 : 3)
                                                }
                                                y={
                                                    midY -
                                                    (isHorizontal ? 3 : 8)
                                                }
                                                width={
                                                    isHorizontal ? "16" : "6"
                                                }
                                                height={
                                                    isHorizontal ? "6" : "16"
                                                }
                                                stroke={edge.style?.color}
                                                strokeWidth="2"
                                                rx="4"
                                                fill="var(--color-text-100)"
                                                style={{
                                                    cursor: isHorizontal
                                                        ? "ns-resize"
                                                        : "ew-resize",
                                                }}
                                                onMouseDown={(e) =>
                                                    handleSegmentMouseDown(
                                                        e,
                                                        edge.id,
                                                        index,
                                                        isHorizontal,
                                                        points,
                                                    )
                                                }
                                            />
                                        </g>
                                    );
                                })}

                            {/* dot Source */}
                            {edge.id === selectedEdgeId && (
                                <circle
                                    pointerEvents="all"
                                    cx={startPoint.x}
                                    cy={startPoint.y}
                                    r={8}
                                    fill="var(--color-text-100)"
                                    stroke={edge.style?.color}
                                    strokeWidth="2"
                                    style={{ cursor: "grab" }}
                                    onMouseDown={(e) =>
                                        handleEdgeTerminalMouseDown(
                                            e,
                                            edge.id,
                                            "source",
                                        )
                                    }
                                />
                            )}

                            {/* dot Target */}
                            {edge.id === selectedEdgeId && (
                                <circle
                                    pointerEvents="all"
                                    cx={endPoint.x}
                                    cy={endPoint.y}
                                    r={8}
                                    fill="var(--color-text-100)"
                                    stroke={edge.style?.color}
                                    strokeWidth="2"
                                    style={{ cursor: "grab" }}
                                    onMouseDown={(e) =>
                                        handleEdgeTerminalMouseDown(
                                            e,
                                            edge.id,
                                            "target",
                                        )
                                    }
                                />
                            )}
                        </g>
                    );
                })}

                {draftEdge && (
                    <path
                        d={createRoundedPath(draftEdge.point, 0)}
                        stroke="#3b82f6"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        fill="none"
                    />
                )}
            </svg>

            {selectedEdge && menuCoords && (
                <div
                    style={{
                        position: "absolute",
                        left: menuCoords.x,
                        top: menuCoords.y,
                        transform: "translate(-50%, -150%)",
                        pointerEvents: "all",
                        zIndex: 50,
                    }}
                >
                    <EdgeMenu edge={selectedEdge} updateEdge={updateEdge} />
                </div>
            )}
        </div>
    );
};
