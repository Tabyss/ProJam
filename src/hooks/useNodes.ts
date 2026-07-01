import { useNodeStore } from "../store/useNodeStore";
import { useCanvasStore } from "../store/useCanvasStore";
import { useEdgeStore } from "../store/useEdgeStore";
import type { NodeProps } from "../types/nodes";
import type { pos } from "../types/global";

const useNodes = () => {
    const { coord, scale } = useCanvasStore();
    const { draftEdge, addEdge, removeDraftEdge } = useEdgeStore();
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

    const handleRotateMouseDown = (e: React.MouseEvent, node: NodeProps) => {
        e.stopPropagation();

        const nodeCenterX = node.obj.x + node.obj.width / 2;
        const nodeCenterY = node.obj.y + node.obj.height / 2;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - nodeCenterX;
            const deltaY = moveEvent.clientY - nodeCenterY;

            let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

            angle = (angle + 90) % 360;

            useNodeStore.getState().updateNode(node.id, {
                obj: { ...node.obj, rotation: Math.round(angle) },
            });
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    const handleNodeMouseUp = (e: React.MouseEvent, targetNode: NodeProps) => {
        if (draftEdge && draftEdge.source !== targetNode.id) {
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

            addEdge({
                id: Date.now().toString(),
                source: draftEdge.source,
                sourceHandle: draftEdge.sourceHandle,
                target: targetNode.id,
                targetHandle: closestHandle,
                waypoints: [...draftEdge.point],
            });
        }
        removeDraftEdge();
    };

    return {
        handleNodeMouseDown,
        handleResizeMouseDown,
        handleRotateMouseDown,
        handleNodeMouseUp,
    };
};

export default useNodes;
