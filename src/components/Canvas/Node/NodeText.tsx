import { useRef, useLayoutEffect } from "react";
import type { NodeProps } from "../../../types/nodes";
import { parseMarkdownToReact } from "../../../utils/markdown";

type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface NodeTextProps {
    id: string;
    text: string;
    isEditing: boolean;
    node: NodeProps;
    updateNode: (id: string, updates: DeepPartial<NodeProps>) => void;
    setEditingNodeId: (id: string | null) => void;
}

const NodeText = ({
    id,
    text,
    isEditing,
    node,
    updateNode,
    setEditingNodeId,
}: NodeTextProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const MIN_HEIGHT = 80;

    useLayoutEffect(() => {
        if (!isEditing && containerRef.current) {
            requestAnimationFrame(() => {
                if (!containerRef.current) return;
                const requiredHeight = containerRef.current.scrollHeight;
                if (requiredHeight > node.obj.height) {
                    updateNode(id, { obj: { height: requiredHeight } });
                }
            });
        }
    }, [isEditing, text, node, id, updateNode]);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        updateNode(id, { value: { header: val } });

        const target = e.target;
        target.style.height = "auto";
        const requiredHeight = target.scrollHeight + 24;
        target.style.height = "100%";

        const nextHeight = Math.max(MIN_HEIGHT, requiredHeight);
        if (nextHeight !== node.obj.height) {
            updateNode(id, { obj: { height: nextHeight } });
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full flex flex-col justify-center font-bold overflow-hidden cursor-pointer"
        >
            {isEditing ? (
                <textarea
                    autoFocus
                    value={text}
                    onChange={handleTextChange}
                    onBlur={() => setEditingNodeId(null)}
                    onKeyDown={(e) => {
                        e.stopPropagation();
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    placeholder="Ketik sesuatu..."
                    className="w-full h-full text-base font-medium p-1 outline-none resize-none transition-colors bg-transparent rounded"
                    style={{
                        color: node.style.text.color,
                        textAlign: node.style.text.align,
                        fontSize: node.style.text.size,
                    }}
                />
            ) : (
                <div
                    className="markdown-node-content max-w-full w-full h-full flex flex-col items-center justify-center overflow-y-auto text-white wrap-break-word"
                    style={{
                        color: node.style.text.color,
                        textAlign: node.style.text.align,
                        fontSize: node.style.text.size,
                    }}
                >
                    <div className="w-full h-full overflow-y-auto">
                        {parseMarkdownToReact(text)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NodeText;
