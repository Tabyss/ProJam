import { useEdgeStore, type Point } from "../../store/useEdgeStore";

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
    const { edges, draftEdge } = useEdgeStore();

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
            {/* 1. RENDER EDGES PERMANEN */}
            {edges?.map((edge) => {
                // Untuk edges permanen, kita asumsikan kamu punya logic
                // untuk mendapatkan titik-titik jalurnya di store/store-utils
                const points = edge.waypoints ?? [];
                return (
                    <path
                        key={edge.id}
                        d={createRoundedPath(points)}
                        stroke="#64748b"
                        strokeWidth="2"
                        fill="none"
                    />
                );
            })}

            {/* 2. RENDER DRAFT EDGE (STRUKTUR POINT TETAP SAMA) */}
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
