import { useState } from "react";
import useEdge from "../../hooks/useEdge";
import useNodes from "../../hooks/useNodes";
import {
    useNodeStore,
    type CanvasNode,
    type HandlePos,
} from "../../store/useNodeStore";

const Node = ({ node }: { node: CanvasNode }) => {
    const {
        selectedNodeId,
        editingNodeId,
        draggedNodeId,
        setEditingNodeId,
        updateNode,
    } = useNodeStore();

    const { handleResizeMouseDown, handleNodeMouseDown, handleNodeMouseUp } =
        useNodes();

    const { handleConnectorMouseDown } = useEdge();

    const [isHovered, setIsHovered] = useState(false);

    const renderConnectorDot = (node: CanvasNode, pos: HandlePos) => {
        const styles: React.CSSProperties = {
            position: "absolute",
            width: "8px",
            height: "8px",
            backgroundColor: "white",
            border: "1px solid #555",
            borderRadius: "50%",
            cursor: "pointer",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.1s ease-in-out",
            pointerEvents: isHovered ? "auto" : "none",
        };

        if (pos === "top") {
            styles.top = "-6px";
            styles.left = "50%";
            styles.transform = "translateX(-50%)";
        }
        if (pos === "right") {
            styles.right = "-6px";
            styles.top = "50%";
            styles.transform = "translateY(-50%)";
        }
        if (pos === "bottom") {
            styles.bottom = "-6px";
            styles.left = "50%";
            styles.transform = "translateX(-50%)";
        }
        if (pos === "left") {
            styles.left = "-6px";
            styles.top = "50%";
            styles.transform = "translateY(-50%)";
        }

        return (
            <div
                onMouseDown={(e) => handleConnectorMouseDown(e, node.id, pos)}
                style={styles}
            />
        );
    };

    if (!node) return null;

    return (
        <div
            key={node.id}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseDown={(e) => handleNodeMouseDown(e, node)}
            onMouseUp={(e) => handleNodeMouseUp(e, node)}
            onDoubleClick={(e) => {
                e.stopPropagation();
                setEditingNodeId(node.id);
            }}
            style={{
                position: "absolute",
                left: node.x,
                top: node.y,
                width: `${node.width}px`,
                height: `${node.height}px`,
                backgroundColor: node.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                border:
                    selectedNodeId === node.id
                        ? "2px solid white"
                        : "2px solid transparent",
                boxShadow:
                    draggedNodeId === node.id
                        ? "0 10px 25px rgba(0,0,0,0.5)"
                        : "0 4px 6px rgba(0,0,0,0.3)",
                cursor: draggedNodeId === node.id ? "grabbing" : "grab",
                userSelect: "none",
                fontWeight: "bold",
                flexDirection: "column",
            }}
        >
            {editingNodeId === node.id ? (
                <input
                    autoFocus
                    value={node.title}
                    onChange={(e) => {
                        updateNode(node.id, { title: e.target.value });
                    }}
                    onBlur={() => setEditingNodeId(null)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") setEditingNodeId(null);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    style={{
                        width: "90%",
                        background: "transparent",
                        border: "none",
                        color: "white",
                        fontSize: "16px",
                        fontWeight: "bold",
                        textAlign: "center",
                        outline: "none",
                    }}
                />
            ) : (
                <span
                    onDoubleClick={(e) => {
                        e.stopPropagation();
                        setEditingNodeId(node.id);
                    }}
                    style={{ pointerEvents: "none" }}
                >
                    {node.title}
                </span>
            )}

            {renderConnectorDot(node, "top")}
            {renderConnectorDot(node, "right")}
            {renderConnectorDot(node, "bottom")}
            {renderConnectorDot(node, "left")}

            <div
                onMouseDown={(e) => handleResizeMouseDown(e, node)}
                style={{
                    position: "absolute",
                    right: "0",
                    bottom: "0",
                    width: "15px",
                    height: "15px",
                    cursor: "nwse-resize",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    borderTopLeftRadius: "8px",
                    borderBottomRightRadius: "6px",
                }}
            />
        </div>
    );
};

export default Node;
