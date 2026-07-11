import { BiSolidCircle, BiSolidRectangle } from "react-icons/bi";
import { BsTriangleFill, BsDiamondFill } from "react-icons/bs";
import { PiCursorTextBold, PiParallelogramFill } from "react-icons/pi";

import MenuItem, { type MenuItemProps } from "./components/MenuItem";
import { useNodeStore } from "../../../store/useNodeStore";
import type { ShapeType } from "../../../types/nodes";
import { FaShapes, FaVectorSquare } from "react-icons/fa";
import SetTheme from "./components/SetTheme";

interface NodeOverrides {
    obj?: Partial<{
        x: number;
        y: number;
        width: number;
        height: number;
        shape: ShapeType;
        rotation: number;
    }>;
    style?: {
        color?: string;
        border?: Partial<{
            width: number;
            color: string;
            type: "solid" | "dashed";
        }>;
        text?: Partial<{
            size: number;
            color: string;
            align: "left" | "center" | "right";
            type: "bold" | "italic" | "normal";
        }>;
    };
    value?: Partial<{
        header: string;
    }>;
    state?: Partial<{
        isRich: boolean;
        isSelected: boolean;
        isDragging: boolean;
        isfullfill: boolean;
        isFullFill: boolean;
        isError: boolean;
        isReadOnly: boolean;
        zIndex: number;
    }>;
    metadata?: Partial<{
        type: string;
        tags: string[];
        version: number;
        updatedAt: number;
    }>;
    ports?: Array<{
        id: string;
        type: "input" | "output";
        pos: "top" | "bottom" | "left" | "right";
    }>;
}

const createDefaultNode = (shape: ShapeType, overrides: NodeOverrides = {}) => {
    const isSquareRatio =
        shape === "circle" || shape === "diamond" || shape === "triangle";

    return {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
        obj: {
            x: 100,
            y: 150,
            width: isSquareRatio ? 100 : 150,
            height: isSquareRatio ? 100 : 80,
            shape: shape,
            rotation: 0,
            ...overrides.obj,
        },
        style: {
            color: overrides.style?.color || "#f03bf6",
            border: {
                width: 1,
                color: "#1e40af",
                type: "solid" as const,
                ...overrides.style?.border,
            },
            text: {
                size: 14,
                color: "#000000",
                align: "left" as const,
                type: "normal" as const,
                ...overrides.style?.text,
            },
        },
        value: {
            header: "New Task",
            ...overrides.value,
        },
        state: {
            isRich: false,
            isSelected: false,
            isDragging: false,
            isfullfill: false,
            isError: false,
            isReadOnly: false,
            zIndex: 1,
            ...overrides.state,
        },
        metadata: {
            type: "default",
            tags: ["start"],
            version: 1,
            updatedAt: Date.now(),
            ...overrides.metadata,
        },
        ports: overrides.ports || [
            { id: "port-1", type: "output" as const, pos: "right" as const },
        ],
    };
};

const SHAPE_OPTIONS = [
    {
        id: "rectangle",
        label: "Rectangle",
        shape: "rectangle",
        icon: <BiSolidRectangle />,
    },
    { id: "circle", label: "Circle", shape: "circle", icon: <BiSolidCircle /> },
    {
        id: "oval",
        label: "Oval",
        shape: "oval",
        icon: <BiSolidCircle className="scale-x-150" />,
    },
    {
        id: "triangle",
        label: "Triangle",
        shape: "triangle",
        icon: <BsTriangleFill />,
    },
    {
        id: "diamond",
        label: "Diamond",
        shape: "diamond",
        icon: <BsDiamondFill />,
    },
    {
        id: "parallelogram",
        label: "Parallelogram",
        shape: "parallelogram",
        icon: <PiParallelogramFill />,
    },
    {
        id: "trapezoid",
        label: "Trapezoid",
        shape: "trapezoid",
        icon: <BsTriangleFill className="clip-path-trapezoid" />,
    },
] as const;

export default function Menu() {
    const addNode = useNodeStore((s) => s.addNode);

    const menuConfig: MenuItemProps[] = [
        {
            id: "node1",
            label: "Node",
            icon: <FaShapes />,
            subItems: SHAPE_OPTIONS.map((item) => ({
                id: item.id,
                label: item.label,
                icon: item.icon,
                onClick: () =>
                    addNode(createDefaultNode(item.shape as ShapeType)),
            })),
        },
        {
            id: "rich",
            label: "Rich Node",
            icon: <FaVectorSquare />,
            onClick: () => {
                addNode(
                    createDefaultNode("rectangle", {
                        value: { header: "New Rich Task" },
                        state: { isRich: true, isFullFill: true },
                        style: {
                            color: "var(--color-primary-500)",
                            border: {
                                width: 1,
                                color: "var(--color-secondary-500)",
                                type: "solid",
                            },
                            text: {
                                size: 16,
                                color: "var(--color-primary-500)",
                                align: "center",
                                type: "normal",
                            },
                        },
                    }),
                );
            },
        },
        {
            id: "text",
            label: "Text",
            icon: <PiCursorTextBold />,
            onClick: () => {
                addNode(
                    createDefaultNode("rectangle", {
                        value: { header: "New Rich Task" },
                        state: { isRich: false, isFullFill: true },
                        style: {
                            color: "transparent",
                            border: {
                                color: "var(--color-secondary-500)",
                                width: 0,
                                type: "solid",
                            },
                            text: {
                                size: 16,
                                color: "var(--color-primary-500)",
                                align: "center",
                                type: "normal",
                            },
                        },
                    }),
                );
            },
        },
    ];

    return (
        <div className="fixed bottom-7 right-7 z-1000">
            <SetTheme />
            <div className=" flex flex-row-reverse items-start">
                <div className="p-1 h-max bg-text-500 rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.3)] flex flex-col gap-1.5">
                    {menuConfig.map((menu) => (
                        <MenuItem items={menu} />
                    ))}
                </div>
            </div>
        </div>
    );
}
