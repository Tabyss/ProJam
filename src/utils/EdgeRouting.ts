import type { NodeProps } from "../types/nodes";
import type { pos } from "../types/global";
import { getNodePointCoords } from "./Point"; // Pastikan path ini sesuai dengan file utils kamu
import type { Point } from "../store/useEdgeStore";

const MARGIN = 20;

const getMarginOffset = (handle: pos) => {
    const margins = {
        top: { x: 0, y: -MARGIN },
        bottom: { x: 0, y: MARGIN },
        left: { x: -MARGIN, y: 0 },
        right: { x: MARGIN, y: 0 },
    };
    return margins[handle] || { x: 0, y: 0 };
};

export const getDynamicWaypoints = (
    sourceNode: NodeProps,
    sourceHandle: pos,
    targetNode: NodeProps,
    targetHandle: pos
): Point[] => {
    const startCoords = getNodePointCoords(sourceNode, sourceHandle);
    const endCoords = getNodePointCoords(targetNode, targetHandle);

    const startOffset = getMarginOffset(sourceHandle);
    const endOffset = getMarginOffset(targetHandle);

    const startMargin = { x: startCoords.x + startOffset.x, y: startCoords.y + startOffset.y };
    const endMargin = { x: endCoords.x + endOffset.x, y: endCoords.y + endOffset.y };

    // Kalkulasi jalur orthogonal dasar (step-routing)
    const isStartHorizontal = sourceHandle === "left" || sourceHandle === "right";
    const isEndHorizontal = targetHandle === "left" || targetHandle === "right";

    const points: Point[] = [startCoords, startMargin];

    if (isStartHorizontal && isEndHorizontal) {
        const midX = (startMargin.x + endMargin.x) / 2;
        points.push({ x: midX, y: startMargin.y });
        points.push({ x: midX, y: endMargin.y });
    } else if (!isStartHorizontal && !isEndHorizontal) {
        const midY = (startMargin.y + endMargin.y) / 2;
        points.push({ x: startMargin.x, y: midY });
        points.push({ x: endMargin.x, y: midY });
    } else {
        if (isStartHorizontal) {
            points.push({ x: endMargin.x, y: startMargin.y });
        } else {
            points.push({ x: startMargin.x, y: endMargin.y });
        }
    }

    points.push(endMargin);
    points.push(endCoords);

    return points;
};