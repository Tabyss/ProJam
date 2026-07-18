import type { NodeProps } from "../types/nodes";
import type { pos } from "../types/global";
import { getNodePointCoords } from "./Point";
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
    targetCoords: Point,
    targetHandle: pos,
): Point[] => {
    const startCoords = getNodePointCoords(sourceNode, sourceHandle);
    const endCoords = targetCoords;

    const isStartHorizontal =
        sourceHandle === "left" || sourceHandle === "right";
    const isEndHorizontal = targetHandle === "left" || targetHandle === "right";

    // =================================================================
    // 2 Dot Condition 
    // =================================================================
    if (isStartHorizontal && isEndHorizontal && sourceHandle !== targetHandle) {
        if (Math.abs(startCoords.y - endCoords.y) < 1) {
            if (
                (sourceHandle === "right" && startCoords.x < endCoords.x) ||
                (sourceHandle === "left" && startCoords.x > endCoords.x)
            ) {
                return [startCoords, endCoords];
            }
        }
    } else if (
        !isStartHorizontal &&
        !isEndHorizontal &&
        sourceHandle !== targetHandle
    ) {
        if (Math.abs(startCoords.x - endCoords.x) < 1) {
            if (
                (sourceHandle === "bottom" && startCoords.y < endCoords.y) ||
                (sourceHandle === "top" && startCoords.y > endCoords.y)
            ) {
                return [startCoords, endCoords];
            }
        }
    }

    // =================================================================
    // 4 Dot U-Shape Condition
    // =================================================================
    if (sourceHandle === targetHandle) {
        const padding = 40;
        if (isStartHorizontal) {
            const extX =
                sourceHandle === "right"
                    ? Math.max(startCoords.x, endCoords.x) + padding
                    : Math.min(startCoords.x, endCoords.x) - padding;

            return [
                startCoords,
                { x: extX, y: startCoords.y },
                { x: extX, y: endCoords.y },
                endCoords,
            ];
        } else {
            const extY =
                sourceHandle === "bottom"
                    ? Math.max(startCoords.y, endCoords.y) + padding
                    : Math.min(startCoords.y, endCoords.y) - padding;

            return [
                startCoords,
                { x: startCoords.x, y: extY },
                { x: endCoords.x, y: extY },
                endCoords,
            ]; 
        }
    }

    // =================================================================
    // 3 Dot ("L" Letter )
    // =================================================================
    if (isStartHorizontal !== isEndHorizontal) {
        const corner = isStartHorizontal
            ? { x: endCoords.x, y: startCoords.y }
            : { x: startCoords.x, y: endCoords.y };

        const validSourceDir =
            (sourceHandle === "right" && corner.x >= startCoords.x) ||
            (sourceHandle === "left" && corner.x <= startCoords.x) ||
            (sourceHandle === "bottom" && corner.y >= startCoords.y) ||
            (sourceHandle === "top" && corner.y <= startCoords.y);

        const validTargetDir =
            (targetHandle === "left" && corner.x <= endCoords.x) ||
            (targetHandle === "right" && corner.x >= endCoords.x) ||
            (targetHandle === "top" && corner.y <= endCoords.y) ||
            (targetHandle === "bottom" && corner.y >= endCoords.y);

        if (validSourceDir && validTargetDir) {
            return [startCoords, corner, endCoords];
        }
    }

    // =================================================================
    // 4 Dot Z-Shape / S-Shape Condition
    // =================================================================
    if (isStartHorizontal && isEndHorizontal) {
        const isSafeX =
            sourceHandle === "right"
                ? startCoords.x + 80 < endCoords.x
                : startCoords.x - 80 > endCoords.x;

        if (isSafeX) {
            const midX = (startCoords.x + endCoords.x) / 2;
            return [
                startCoords,
                { x: midX, y: startCoords.y },
                { x: midX, y: endCoords.y },
                endCoords,
            ]; 
        }
    } else if (!isStartHorizontal && !isEndHorizontal) {
        const isSafeY =
            sourceHandle === "bottom"
                ? startCoords.y + 80 < endCoords.y
                : startCoords.y - 80 > endCoords.y;

        if (isSafeY) {
            const midY = (startCoords.y + endCoords.y) / 2;
            return [
                startCoords,
                { x: startCoords.x, y: midY },
                { x: endCoords.x, y: midY },
                endCoords,
            ]; 
        }
    }

    // =================================================================
    // FALLBACK
    // =================================================================
    const startOffset = getMarginOffset(sourceHandle);
    const endOffset = getMarginOffset(targetHandle);

    const startMargin = {
        x: startCoords.x + startOffset.x,
        y: startCoords.y + startOffset.y,
    };
    const endMargin = {
        x: endCoords.x + endOffset.x,
        y: endCoords.y + endOffset.y,
    };

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

export const createRoundedPath = (points: Point[], radius: number): string => {
    if (points.length < 2) return "";
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length - 1; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const next = points[i + 1];

        const dir1 = {
            x: Math.sign(curr.x - prev.x),
            y: Math.sign(curr.y - prev.y),
        };
        const dir2 = {
            x: Math.sign(next.x - curr.x),
            y: Math.sign(next.y - curr.y),
        };

        const dist1 = Math.sqrt(
            Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2),
        );
        const dist2 = Math.sqrt(
            Math.pow(next.x - curr.x, 2) + Math.pow(next.y - curr.y, 2),
        );
        const actualRadius = Math.min(radius, dist1 / 2, dist2 / 2);

        const startArc = {
            x: curr.x - dir1.x * actualRadius,
            y: curr.y - dir1.y * actualRadius,
        };
        const endArc = {
            x: curr.x + dir2.x * actualRadius,
            y: curr.y + dir2.y * actualRadius,
        };

        path += ` L ${startArc.x} ${startArc.y} Q ${curr.x} ${curr.y} ${endArc.x} ${endArc.y}`;
    }
    path += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`;
    return path;
};
