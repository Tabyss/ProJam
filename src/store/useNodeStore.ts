import { create } from "zustand";
import type { NodeProps, NodeSize } from "../types/nodes";

type DeepPartial<T> = T extends (...args: unknown[]) => unknown
    ? T
    : T extends object
      ? { [P in keyof T]?: DeepPartial<T[P]> }
      : T;

interface NodeState {
    nodes: NodeProps[];
    selectedNodeId: string | null;
    editingNodeId: string | null;
    draggedNodeId: string | null;
    resizingNode: NodeSize | null;
    nodeOffset: { x: number; y: number };

    setSelectedNodeId: (id: string | null) => void;
    setEditingNodeId: (id: string | null) => void;
    setDraggedNodeId: (id: string | null) => void;
    setResizingNode: (node: NodeSize | null) => void;
    setNodeOffset: (x: number, y: number) => void;

    addNode: (node: NodeProps) => void;
    updateNode: (id: string, updates: DeepPartial<NodeProps>) => void;
    removeNode: (id: string) => void;
}

export const useNodeStore = create<NodeState>((set) => ({
    nodes: [
        {
            id: "1",
            obj: {
                x: 100,
                y: 150,
                width: 150,
                height: 80,
                minWidth: 80,
                minHeight: 40,
                shape: "rectangle",
                rotation: 0,
            },
            style: {
                color: "var(--color-primary-500)",
                border: {
                    width: 1,
                    color: "var(--color-secondary-500)",
                    type: "solid",
                },
                text: { size: 16, align: "center", type: "normal", color: "var(--color-primary-500)", },
            },
            value: {
                header: "Planning",
                text: "Deskripsi planning",
            },
            state: {
                isRich: false,
                isSelected: false,
                isDragging: false,
                isfullfill: false,
                isError: false,
                isReadOnly: false,
                zIndex: 1,
            },
            metadata: {
                type: "default",
                tags: ["start"],
                version: 1,
                updatedAt: Date.now(),
            },
            ports: [{ id: "port-1", type: "output", pos: "right" }],
        },
    ],

    selectedNodeId: null,
    editingNodeId: null,
    draggedNodeId: null,
    resizingNode: null,
    nodeOffset: { x: 0, y: 0 },

    setSelectedNodeId: (id) => set({ selectedNodeId: id }),
    setEditingNodeId: (id) => set({ editingNodeId: id }),
    setDraggedNodeId: (id) => set({ draggedNodeId: id }),
    setResizingNode: (node) => set({ resizingNode: node }),
    setNodeOffset: (x, y) => set({ nodeOffset: { x, y } }),

    addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),

    updateNode: (id, updates) =>
        set((state) => {
            const newNodes = state.nodes.map((n) => {
                if (n.id !== id) return n;

                const updated: NodeProps = {
                    ...n,
                    obj: updates.obj ? { ...n.obj, ...updates.obj } : n.obj,
                    style: updates.style
                        ? ({
                              ...n.style,
                              ...updates.style,
                          } as NodeProps["style"])
                        : n.style,
                    value: updates.value
                        ? ({
                              ...n.value,
                              ...updates.value,
                          } as NodeProps["value"])
                        : n.value,
                    state: updates.state
                        ? ({
                              ...n.state,
                              ...updates.state,
                          } as NodeProps["state"])
                        : n.state,
                    metadata: updates.metadata
                        ? ({
                              ...n.metadata,
                              ...updates.metadata,
                          } as NodeProps["metadata"])
                        : n.metadata,
                    ports: updates.ports
                        ? (updates.ports as NodeProps["ports"])
                        : n.ports,
                };

                return updated;
            });

            // // TRIGGER UPDATE EDGE JIKA POSISI/UKURAN BERUBAH
            // if (updates.obj && ('x' in updates.obj || 'y' in updates.obj || 'width' in updates.obj || 'height' in updates.obj)) {
            //     const updatedNode = newNodes.find(n => n.id === id);
            //     if (updatedNode) {
            //         useEdgeStore.getState().updateConnectedEdges(
            //             id,
            //             updatedNode.obj.x,
            //             updatedNode.obj.y,
            //             newNodes
            //         );
            //     }
            // }

            return { nodes: newNodes };
        }),

    removeNode: (id) =>
        set((state) => {
            const newNodes = state.nodes.filter((n) => n.id !== id);
            return { nodes: newNodes };
        }),
}));
