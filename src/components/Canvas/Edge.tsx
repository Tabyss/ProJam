import { useEdgeStore, type Point } from "../../store/useEdgeStore";
import { useNodeStore } from "../../store/useNodeStore";
import { getDynamicWaypoints } from "../../utils/EdgeRouting";
import useEdge from "../../hooks/useEdge";

const createRoundedPath = (points: Point[], radius = 12): string => {
    if (points.length < 2) return "";
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length - 1; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const next = points[i + 1];

        const dir1 = {
            x: Math.sign(curr.x - prev.x),
            y: Math.sign(curr.y - prev.y),
        };
        const dir2 = {
            x: Math.sign(next.x - curr.x),
            y: Math.sign(next.y - curr.y),
        };

        const dist1 = Math.sqrt(
            Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2),
        );
        const dist2 = Math.sqrt(
            Math.pow(next.x - curr.x, 2) + Math.pow(next.y - curr.y, 2),
        );
        const actualRadius = Math.min(radius, dist1 / 2, dist2 / 2);

        const startArc = {
            x: curr.x - dir1.x * actualRadius,
            y: curr.y - dir1.y * actualRadius,
        };
        const endArc = {
            x: curr.x + dir2.x * actualRadius,
            y: curr.y + dir2.y * actualRadius,
        };

        path += ` L ${startArc.x} ${startArc.y} Q ${curr.x} ${curr.y} ${endArc.x} ${endArc.y}`;
    }
    path += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`;
    return path;
};

export const Edge = () => {
    const { edges, draftEdge, selectedEdgeId } = useEdgeStore();
    const { nodes } = useNodeStore();
    const { handleEdgeTerminalMouseDown, handleEdgeMouseDown } = useEdge();

    return (
        <svg
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                overflow: "visible",
                pointerEvents: "none",
            }}
        >
            {edges?.map((edge) => {
                const sourceNode = nodes.find(
                    (n) => n.id === edge.source[0].nodeId,
                );
                const targetNode = nodes.find(
                    (n) => n.id === edge.target[0].nodeId,
                );

                if (!sourceNode || !targetNode) return null;

                const points = getDynamicWaypoints(
                    sourceNode,
                    edge.source[0].nodeFace,
                    targetNode,
                    edge.target[0].nodeFace,
                );

                if (points.length < 2) return null;

                const startPoint = points[0];
                const endPoint = points[points.length - 1];

                return (
                    <g
                        key={edge.id}
                        pointerEvents="all"
                        className="group"
                        onMouseDown={(e) => handleEdgeMouseDown(e, edge)}
                    >
                        <path
                            d={createRoundedPath(points)}
                            stroke="#64748b"
                            strokeWidth="2"
                            fill="none"
                            cursor="pointer"
                        />
                        {edge.id == selectedEdgeId && (
                            <circle
                                cx={startPoint.x}
                                cy={startPoint.y}
                                r={8}
                                fill="#cbd5e1"
                                stroke="#64748b"
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
                        {edge.id == selectedEdgeId && (
                            <circle
                                cx={endPoint.x}
                                cy={endPoint.y}
                                r={8}
                                fill="#cbd5e1"
                                stroke="#64748b"
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
                    d={createRoundedPath(draftEdge.point)}
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    fill="none"
                />
            )}
        </svg>
    );
};
