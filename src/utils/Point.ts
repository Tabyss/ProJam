import type { Point } from "../store/useEdgeStore";
import type { pos } from "../types/global";
import type { NodeProps } from "../types/nodes";

export const getNodePointCoords = (node: NodeProps, handle: pos): Point => {
    switch (handle) {
        case "top": return { x: node.obj.x + node.obj.width / 2, y: node.obj.y };
        case "right": return { x: node.obj.x + node.obj.width, y: node.obj.y + node.obj.height / 2 };
        case "bottom": return { x: node.obj.x + node.obj.width / 2, y: node.obj.y + node.obj.height };
        case "left": return { x: node.obj.x, y: node.obj.y + node.obj.height / 2 };
    }
};