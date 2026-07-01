import { BiSolidCircle, BiSolidRectangle } from "react-icons/bi";
import { BsTriangleFill, BsDiamondFill } from "react-icons/bs";

import MenuItem, { type MenuItemProps } from "./components/MenuItem";
import { useNodeStore } from "../../../store/useNodeStore";
import type { ShapeType } from "../../../types/nodes";
import { PiParallelogramFill } from "react-icons/pi";

const createDefaultNode = (shape: ShapeType) => {
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
        },
        style: {
            color: "#f03bf6",
            border: { width: 1, color: "#1e40af" },
        },
        value: { header: "New Task" },
        state: {
            isSelected: false,
            isDragging: false,
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
        ports: [
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
            subItems: SHAPE_OPTIONS.map((item) => ({
                id: item.id,
                label: item.label,
                icon: item.icon,
                onClick: () =>
                    addNode(createDefaultNode(item.shape as ShapeType)),
            })),
        },
    ];

    return (
        <div className="fixed bottom-7.5 right-7.5 p-2 bg-white rounded-[50px] shadow-[0_4px_12px_rgba(0,0,0,0.3)] z-1000 flex flex-col gap-3">
            {menuConfig.map((menu, i) => (
                <MenuItem key={menu.id} items={menu} index={i} />
            ))}
        </div>
    );
}
