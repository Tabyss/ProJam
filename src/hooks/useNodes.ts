import {
    useNodeStore,
    type CanvasNode,
    type HandlePos,
} from "../store/useNodeStore";
import { useCanvasStore } from "../store/useCanvasStore";
import { useEdgeStore } from "../store/useEdgeStore";

const useNodes = () => {
    const { x, y, scale} = useCanvasStore();
    const { draftEdge, addEdge, setDraftEdge } = useEdgeStore();
    const {
        setSelectedNodeId,
        setDraggedNodeId,
        setResizingNode,
        setNodeOffset,
    } = useNodeStore();

    const handleNodeMouseDown = (e: React.MouseEvent, node: CanvasNode) => {
        e.stopPropagation();
        setSelectedNodeId(node.id);
        setDraggedNodeId(node.id);
        setNodeOffset(
            (e.clientX - x) / scale - node.x,
            (e.clientY - y) / scale - node.y,
        );
    };

    const handleResizeMouseDown = (e: React.MouseEvent, node: CanvasNode) => {
        e.stopPropagation();
        setResizingNode({
            id: node.id,
            startW: node.width,
            startH: node.height,
            startX: e.clientX,
            startY: e.clientY,
        });
    };

    const handleNodeMouseUp = (e: React.MouseEvent, targetNode: CanvasNode) => {
        if (draftEdge && draftEdge.source !== targetNode.id) {
            const dropX = (e.clientX - x) / scale;
            const dropY = (e.clientY - y) / scale;

            const distances = {
                top: Math.abs(dropY - targetNode.y),
                bottom: Math.abs(dropY - (targetNode.y + targetNode.height)),
                left: Math.abs(dropX - targetNode.x),
                right: Math.abs(dropX - (targetNode.x + targetNode.width)),
            };

            const closestHandle = (
                Object.keys(distances) as HandlePos[]
            ).reduce((a, b) => (distances[a] < distances[b] ? a : b));

            addEdge({
                id: Date.now().toString(),
                source: draftEdge.source,
                sourceHandle: draftEdge.sourceHandle,
                target: targetNode.id,
                targetHandle: closestHandle,
            });
        }
        setDraftEdge(null);
    };

    return {
        handleNodeMouseDown,
        handleResizeMouseDown,
        handleNodeMouseUp,
    };
};

export default useNodes;
