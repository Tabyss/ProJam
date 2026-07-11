import ReactMarkdown from "react-markdown";
import { useRef, useLayoutEffect } from "react";
import remarkGfm from "remark-gfm";
import { markdownComponents } from "../../../utils/markdown";
import type { NodeProps } from "../../../types/nodes";

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
            className="relative w-full h-full flex flex-col  font-bold overflow-hidden"
        >
            {isEditing ? (
                <textarea
                    autoFocus
                    value={text}
                    onChange={handleTextChange}
                    onBlur={() => setEditingNodeId(null)}
                    onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            setEditingNodeId(null);
                        }
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    placeholder="Ketik markdown..."
                    className="w-full h-full text-white text-base font-medium p-1 outline-none resize-none transition-colors bg-transparent border border-white/20 rounded"
                    style={{
                        color: node.style.text.color,
                        textAlign: node.style.text.align
                    }}
                />
            ) : (
                <div
                    onDoubleClick={(e) => {
                        e.stopPropagation();
                        setEditingNodeId(id);
                    }}
                    className="pointer-events-none max-w-full w-full flex flex-col items-start overflow-hidden text-white truncate"
                    style={{
                        color: node.style.text.color,
                        textAlign: node.style.text.align
                    }}
                >
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                    >
                        {text}
                    </ReactMarkdown>
                </div>
            )}
        </div>
    );
};

export default NodeText;
