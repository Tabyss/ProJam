import { useState } from "react";
import useEdge from "../../../hooks/useEdge";
import useNodes from "../../../hooks/useNodes";
import { useNodeStore } from "../../../store/useNodeStore";
import { useEdgeStore } from "../../../store/useEdgeStore";
import type { pos } from "../../../types/global";
import type { NodeProps, ShapeType } from "../../../types/nodes";
import NodeText from "./NodeText";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import NodeMenu from "./NodeMenu";

const Node = ({ node }: { node: NodeProps }) => {
    const [isNodeHovered, setIsNodeHovered] = useState(false);
    const [hoveredDot, setHoveredDot] = useState<pos | null>(null);

    const getShapeClasses = (shape?: ShapeType): string => {
        switch (shape) {
            case "circle":
                return "rounded-full";
            case "oval":
                return "rounded-[50%]";
            case "parallelogram":
                return "[clip-path:polygon(15%_0,100%_0,85%_100%,0%_100%)]";
            case "trapezoid":
                return "[clip-path:polygon(20%_0%,80%_0%,100%_100%,0%_100%)]";
            case "diamond":
                return "[clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]";
            case "triangle":
                return "[clip-path:polygon(50%_0%,100%_100%,0%_100%)]";
            case "rectangle":
                return "rounded-sm";
            default:
                return "";
        }
    };

    const {
        selectedNodeId,
        editingNodeId,
        draggedNodeId,
        setEditingNodeId,
        updateNode,
    } = useNodeStore();

    const { draftEdge } = useEdgeStore();

    const { handleResizeMouseDown, handleNodeMouseDown, handleNodeMouseUp } =
        useNodes();

    const { handleConnectorMouseDown, handleConnectorMouseUp } = useEdge();

    const renderConnectorDot = (node: NodeProps, pos: pos) => {
        let positionClasses = "";
        if (pos === "top")
            positionClasses = "-top-1.5 left-1/2 -translate-x-1/2";
        if (pos === "right")
            positionClasses = "-right-1.5 top-1/2 -translate-y-1/2";
        if (pos === "bottom")
            positionClasses = "-bottom-1.5 left-1/2 -translate-x-1/2";
        if (pos === "left")
            positionClasses = "-left-1.5 top-1/2 -translate-y-1/2";

        const isVisible =
            selectedNodeId === node.id || (!!draftEdge && isNodeHovered);

        const isActive = !!draftEdge && hoveredDot === pos;

        return (
            <div
                onMouseEnter={() => setHoveredDot(pos)}
                onMouseLeave={() => setHoveredDot(null)}
                onMouseDown={(e) => handleConnectorMouseDown(e, node, pos)}
                onMouseUp={(e) =>
                    handleConnectorMouseUp &&
                    handleConnectorMouseUp(e, node, pos)
                }
                className={`absolute size-3 rounded-full cursor-pointer transition-all duration-100 ease-in-out z-10 shadow-[0_4px_6px_rgba(0,0,0,0.3)]
                ${isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} 
                ${isVisible && isActive ? "scale-150 bg-blue-400" : "bg-white"} 
                ${positionClasses}`}
            />
        );
    };

    if (!node) return null;

    const isDragged = draggedNodeId === node.id;
    const isEditing = editingNodeId === node.id;
    const isSelected = selectedNodeId === node.id;

    return (
        <div
            key={node.id}
            onMouseDown={(e) => handleNodeMouseDown(e, node)}
            onMouseUp={(e) => handleNodeMouseUp(e, node)}
            onMouseEnter={() => setIsNodeHovered(true)}
            onMouseLeave={() => setIsNodeHovered(false)}
            onDoubleClick={(e) => {
                e.stopPropagation();
                setEditingNodeId(node.id);
            }}
            style={{
                left: node.obj.x,
                top: node.obj.y,
                width: `${!node.state.isRich || node.state.isfullfill ? node.obj.width : 80}px`,
                height: `${!node.state.isRich || node.state.isfullfill ? node.obj.height : 40}px`,
                transformOrigin: "center",
            }}
            className={`absolute group/content ${
                isDragged ? "cursor-grabbing" : "cursor-grab"
            }`}
        >
            {isSelected && (
                <NodeMenu node={node} updateNode={updateNode} />
            )}
            <div
                className={`absolute inset-0 ${
                    isDragged
                        ? "shadow-[0_4px_6px_rgba(0,0,0,0.3)]"
                        : "shadow-none"
                } ${getShapeClasses(node.obj.shape)}`}
                style={{
                    backgroundColor: node.style.color,
                    border: `2px ${node.style.border.type}`,
                    borderColor: node.style.border.color
                }}
            />

            <div className="flex w-full h-full p-1.5 gap-2 ">
                {node.state.isRich && (
                    <button
                        className={`hidden absolute group-hover/content:inline w-6 h-6 p-1 cursor-pointer z-1 rounded-sm`}
                        style={{
                            backgroundColor: node.style.border.color,
                            color: node.style.color,
                        }}
                        onClick={(e) => {
                            e.preventDefault()
                            updateNode(node.id, {
                                state: { isfullfill: !node.state.isfullfill },
                            });
                        }}
                    >
                        {node.state.isfullfill ? (
                            <IoIosArrowUp />
                        ) : (
                            <IoIosArrowDown />
                        )}
                    </button>
                )}

                <NodeText
                    id={node.id}
                    text={node.value.header}
                    isEditing={isEditing}
                    node={node}
                    updateNode={updateNode}
                    setEditingNodeId={setEditingNodeId}
                />
            </div>

            {/* Connectors */}
            {renderConnectorDot(node, "top")}
            {renderConnectorDot(node, "right")}
            {renderConnectorDot(node, "bottom")}
            {renderConnectorDot(node, "left")}

            {/* Handle Resize */}
            {(!node.state.isRich || node.state.isfullfill) && (
                <div
                    onMouseDown={(e) =>
                        selectedNodeId && handleResizeMouseDown(e, node)
                    }
                    className={`absolute -right-4 -bottom-4 size-3.5 ${
                        selectedNodeId ? "cursor-nwse-resize" : ""
                    } bg-text-400 rounded-md z-10 ${
                        selectedNodeId === node.id ? "opacity-50" : "opacity-0"
                    }`}
                />
            )}
        </div>
    );
};

export default Node;
