import { useNodeStore } from "../store/useNodeStore";
import { useCanvasStore } from "../store/useCanvasStore";
import { useEdgeStore } from "../store/useEdgeStore";
import type { NodeProps } from "../types/nodes";
import type { pos } from "../types/global";

const useNodes = () => {
    const { coord, scale } = useCanvasStore();
    const { draftEdge, addEdge, setSelectedEdgeId, removeDraftEdge } = useEdgeStore();
    const {
        setSelectedNodeId,
        setDraggedNodeId,
        setResizingNode,
        setNodeOffset,
    } = useNodeStore();

    const handleNodeMouseDown = (e: React.MouseEvent, node: NodeProps) => {
        e.stopPropagation();
        setSelectedNodeId(node.id);
        setDraggedNodeId(node.id);
        setSelectedEdgeId(null)
        setNodeOffset(
            (e.clientX - coord.x) / scale - node.obj.x,
            (e.clientY - coord.y) / scale - node.obj.y,
        );
    };

    const handleResizeMouseDown = (e: React.MouseEvent, node: NodeProps) => {
        e.stopPropagation();
        setResizingNode({
            id: node.id,
            startW: node.obj.width,
            startH: node.obj.height,
            startX: e.clientX,
            startY: e.clientY,
        });
    };

    const handleNodeMouseUp = (e: React.MouseEvent, targetNode: NodeProps) => {
        if (draftEdge && draftEdge.sourceNodeId !== targetNode.id) {
            const dropX = (e.clientX - coord.x) / scale;
            const dropY = (e.clientY - coord.y) / scale;

            const distances = {
                top: Math.abs(dropY - targetNode.obj.y),
                bottom: Math.abs(
                    dropY - (targetNode.obj.y + targetNode.obj.height),
                ),
                left: Math.abs(dropX - targetNode.obj.x),
                right: Math.abs(
                    dropX - (targetNode.obj.x + targetNode.obj.width),
                ),
            };

            const closestHandle = (Object.keys(distances) as pos[]).reduce(
                (a, b) => (distances[a] < distances[b] ? a : b),
            );

            const anchorDot = {
                nodeId: String(draftEdge.sourceNodeId),
                nodeFace: draftEdge.sourceHandle,
            };
            const dropDot = {
                nodeId: String(targetNode.id),
                nodeFace: closestHandle,
            };

            addEdge({
                id: `edge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                source: draftEdge.isReversing ? [dropDot] : [anchorDot],
                target: draftEdge.isReversing ? [anchorDot] : [dropDot],
                waypoints: [...draftEdge.point],
            });
        }
        removeDraftEdge();
    };

    return {
        handleNodeMouseDown,
        handleResizeMouseDown,
        handleNodeMouseUp,
    };
};

export default useNodes;
