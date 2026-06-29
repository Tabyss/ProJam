import { useEdgeStore } from "../../store/useEdgeStore";
import {
    useNodeStore,
    type CanvasNode,
    type HandlePos,
} from "../../store/useNodeStore";

const getHandleCoords = (node: CanvasNode, handle: HandlePos) => {
    switch (handle) {
      case 'top': return { x: node.x + node.width / 2, y: node.y };
      case 'right': return { x: node.x + node.width, y: node.y + node.height / 2 };
      case 'bottom': return { x: node.x + node.width / 2, y: node.y + node.height };
      case 'left': return { x: node.x, y: node.y + node.height / 2 };
    }
  };

  const getControlPoint = (x: number, y: number, handle: HandlePos, offset = 80) => {
    switch (handle) {
      case 'top': return { x, y: y - offset };
      case 'right': return { x: x + offset, y };
      case 'bottom': return { x, y: y + offset };
      case 'left': return { x: x - offset, y };
    }
  };


export const Edge = () => {
    const { edges, draftEdge } = useEdgeStore();
    const nodes = useNodeStore((s) => s.nodes);
    console.log(edges)

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
            {edges.map((edge) => {
                const sourceNode = nodes.find((n) => n.id === edge.source);
                const targetNode = nodes.find((n) => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const start = getHandleCoords(sourceNode, edge.sourceHandle);
                const end = getHandleCoords(targetNode, edge.targetHandle);
                const cp1 = getControlPoint(
                    start.x,
                    start.y,
                    edge.sourceHandle,
                );
                const cp2 = getControlPoint(end.x, end.y, edge.targetHandle);

                const pathData = `M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${end.x} ${end.y}`;

                return (
                    <path
                        key={edge.id}
                        d={pathData}
                        stroke="#555"
                        strokeWidth="3"
                        fill="none"
                    />
                );
            })}

            {draftEdge &&
                (() => {
                    const sourceNode = nodes.find(
                        (n) => n.id === draftEdge.source,
                    );
                    if (!sourceNode) return null;

                    const start = getHandleCoords(
                        sourceNode,
                        draftEdge.sourceHandle,
                    );
                    const end = { x: draftEdge.x, y: draftEdge.y };
                    const cp1 = getControlPoint(
                        start.x,
                        start.y,
                        draftEdge.sourceHandle,
                    );
                    const pathData = `M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${end.x} ${end.y}, ${end.x} ${end.y}`;

                    return (
                        <path
                            d={pathData}
                            stroke="#3b82f6"
                            strokeWidth="3"
                            strokeDasharray="5,5"
                            fill="none"
                        />
                    );
                })()}
        </svg>
    );
};
