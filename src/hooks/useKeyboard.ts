import { useEffect } from "react";
import { useNodeStore } from "../store/useNodeStore";
import { useEdgeStore } from "../store/useEdgeStore";

const useKeyboard = () => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable
            ) {
                return;
            }

            if (e.key === "Delete") {
                const { selectedNodeId, removeNode } = useNodeStore.getState();
                const { edges, selectedEdgeId, removeEdge } =
                    useEdgeStore.getState();

                if (selectedNodeId) {
                    removeNode(selectedNodeId);

                    edges.forEach((edge) => {
                        const isSource = edge.source.some(
                            (s) => s.nodeId === selectedNodeId,
                        );
                        const isTarget = edge.target.some(
                            (t) => t.nodeId === selectedNodeId,
                        );
                        if (isSource || isTarget) {
                            removeEdge(edge.id);
                        }
                    });
                } else if (selectedEdgeId) {
                    removeEdge(selectedEdgeId);
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
};

export default useKeyboard;
