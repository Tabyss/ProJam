import useEdge from "../../hooks/useEdge";
import useNodes from "../../hooks/useNodes";
import { useNodeStore } from "../../store/useNodeStore";
import type { NodeProps, ShapeType } from "../../types/nodes";
import type { pos } from "../../types/global";

const Node = ({ node }: { node: NodeProps }) => {
    const getShapeClasses = (shape?: ShapeType): string => {
        switch (shape) {
            case "circle":
            case "oval":
                return "rounded-full";
            case "parallelogram":
                return "[clip-path:polygon(15%_0,100%_0,85%_100%,0%_100%)]";
            case "trapezoid":
                return "[clip-path:polygon(20%_0%,80%_0%,100%_100%,0%_100%)]";
            case "diamond":
                return "[clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]";
            case "triangle":
                return "[clip-path:polygon(50%_0%,100%_100%,0%_100%)]";
            case "rectangle":
            default:
                return "rounded-lg";
        }
    };

    const {
        selectedNodeId,
        editingNodeId,
        draggedNodeId,
        setEditingNodeId,
        updateNode,
    } = useNodeStore();

    const {
        handleResizeMouseDown,
        handleNodeMouseDown,
        handleRotateMouseDown,
        handleNodeMouseUp,
    } = useNodes();

    const { handleConnectorMouseDown } = useEdge();

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

        return (
            <div
                onMouseDown={(e) => handleConnectorMouseDown(e, node, pos)}
                className={`absolute size-3 bg-white border border-[#555] rounded-full cursor-pointer transition-opacity duration-100 ease-in-out z-10 ${
                    selectedNodeId === node.id
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                } ${positionClasses}`}
            />
        );
    };

    if (!node) return null;

    const isDragged = draggedNodeId === node.id;
    const currentRotation = node.obj.rotation || 0;

    return (
        <div
            key={node.id}
            onMouseDown={(e) => handleNodeMouseDown(e, node)}
            onMouseUp={(e) => handleNodeMouseUp(e, node)}
            onDoubleClick={(e) => {
                e.stopPropagation();
                setEditingNodeId(node.id);
            }}
            style={{
                left: node.obj.x,
                top: node.obj.y,
                width: `${node.obj.width}px`,
                height: `${node.obj.height}px`,
                transform: `rotate(${currentRotation}deg)`,
            }}
            className={`absolute select-none rounded-sm ${
                isDragged ? "cursor-grabbing" : "cursor-grab"
            }`}
        >
            <div
                style={{ backgroundColor: node.style.color }}
                className={`absolute inset-0 ${
                    isDragged
                        ? "shadow-[0_4px_6px_rgba(0,0,0,0.3)]"
                        : "shadow-none"
                } ${getShapeClasses(node.obj.shape)}`}
            />

            <div className="relative w-full h-full flex flex-col items-center justify-center font-bold">
                {editingNodeId === node.id ? (
                    <input
                        autoFocus
                        value={node.value.header}
                        onChange={(e) => {
                            updateNode(node.id, {
                                value: { header: e.target.value },
                            });
                        }}
                        onBlur={() => setEditingNodeId(null)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") setEditingNodeId(null);
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="w-[90%] bg-transparent border-none text-white text-base font-bold text-center outline-none"
                    />
                ) : (
                    <span
                        onDoubleClick={(e) => {
                            e.stopPropagation();
                            setEditingNodeId(node.id);
                        }}
                        className="pointer-events-none"
                    >
                        {node.value.header}
                    </span>
                )}
            </div>

            {renderConnectorDot(node, "top")}
            {renderConnectorDot(node, "right")}
            {renderConnectorDot(node, "bottom")}
            {renderConnectorDot(node, "left")}

            {/* Handle Resize */}
            <div
                onMouseDown={(e) => handleResizeMouseDown(e, node)}
                className={`absolute -right-4 -bottom-4 size-3.5 cursor-nwse-resize bg-base-300 rounded-md z-10 ${selectedNodeId === node.id ? "opacity-50" : "opacity-0"}`}
            />

            {/* Handle Rotate */}
            <div
                onMouseDown={(e) => handleRotateMouseDown(e, node)}
                className={`absolute -top-4 -left-4 size-3.5 cursor-crosshair bg-base-300 rounded-md z-10 ${selectedNodeId === node.id ? "opacity-50 hover:opacity-100" : "opacity-0"}`}
            />
        </div>
    );
};

export default Node;
