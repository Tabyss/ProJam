import { useState } from "react";
import type { NodeProps } from "../../../types/nodes";
import {
    FaFill,
    FaBorderAll,
    FaFont,
    FaAlignLeft,
    FaAlignCenter,
    FaAlignRight,
} from "react-icons/fa";
import { getThemePalette } from "../../../utils/colors";
import { LuCircle, LuCircleDashed, LuCircleDotDashed } from "react-icons/lu";

interface NodeMenuProps {
    node: NodeProps;
    updateNode: (id: string, data: Partial<NodeProps>) => void;
}

interface PickerProps {
    isOpen: boolean;
    onToggle: () => void;
    onClose: () => void;
}

const ColorPicker = ({
    value,
    onChange,
    isOpen,
    onToggle,
    onClose,
}: {
    value: string;
    onChange: (val: string) => void;
} & PickerProps) => {
    const palette = getThemePalette();

    return (
        <div className="relative flex items-center">
            <button
                type="button"
                className="w-6 h-6 rounded-md border border-text-500 shadow-sm transition-transform hover:scale-105"
                style={{ backgroundColor: value }}
                onClick={(e) => {
                    e.preventDefault();
                    onToggle();
                }}
            />

            {isOpen && (
                <div
                    className="absolute bottom-10 mt-2 left-1/2 -translate-x-1/2 bg-text-300 p-2 rounded-md shadow-lg z-60 grid grid-cols-9 gap-1 w-50"
                    onMouseLeave={onClose}
                >
                    {palette.map((color) => (
                        <button
                            key={color.id}
                            title={color.label}
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                onChange(color.cssValue);
                                onClose();
                            }}
                            className="w-4 h-4 rounded-sm border border-text-100 hover:scale-125 transition-transform"
                            style={{ backgroundColor: color.cssValue }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const DropdownPicker = ({
    value,
    options,
    onChange,
    isOpen,
    onToggle,
    onClose,
}: {
    value: string;
    options: { label: React.ReactNode; value: string }[];
    onChange: (val: string) => void;
} & PickerProps) => {
    const currentLabel =
        options.find((opt) => opt.value === value)?.label || value;

    return (
        <div className="relative flex content-center">
            <button
                type="button"
                className="w-6 h-6 text-sm rounded-md bg-text-300 cursor-pointer outline-none flex items-center justify-center hover:bg-text-400"
                onClick={(e) => {
                    e.preventDefault();
                    onToggle();
                }}
            >
                {currentLabel}
            </button>

            {isOpen && (
                <div
                    className="absolute bottom-10 mt-2 left-1/2 -translate-x-1/2 bg-text-300 p-1.5 rounded-md shadow-lg z-60 flex gap-1"
                    onMouseLeave={onClose}
                >
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                onChange(opt.value);
                                onClose();
                            }}
                            className={`text-sm p-1.5 rounded text-left transition-colors ${
                                value === opt.value
                                    ? "bg-text-500 text-white font-medium"
                                    : "hover:bg-text-400"
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const RangePicker = ({
    value,
    min,
    max,
    onChange,
    isOpen,
    onToggle,
    onClose,
}: {
    value: number;
    min: number;
    max: number;
    onChange: (val: number) => void;
} & PickerProps) => {
    return (
        <div className="relative flex items-center">
            <button
                type="button"
                className="text-xs border border-text-500 rounded p-1 px-2 bg-text-300 cursor-pointer outline-none hover:border-text-100 min-w-10"
                onClick={(e) => {
                    e.preventDefault();
                    onToggle();
                }}
            >
                {value}
            </button>

            {isOpen && (
                <div
                    className="absolute bottom-10 mt-2 left-1/2 -translate-x-1/2 bg-text-300 p-3 rounded-md shadow-lg z-60 flex flex-col items-center gap-2"
                    onMouseLeave={onClose}
                >
                    <input
                        type="range"
                        min={min}
                        max={max}
                        value={value}
                        onChange={(e) => onChange(parseInt(e.target.value))}
                        className="w-28 cursor-pointer accent-text-500"
                    />
                </div>
            )}
        </div>
    );
};

// Komponen Utama NodeMenu
const NodeMenu = ({ node, updateNode }: NodeMenuProps) => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const handleToggleMenu = (menuName: string) => {
        setActiveMenu((prev) => (prev === menuName ? null : menuName));
    };

    const handleCloseMenu = () => {
        setActiveMenu(null);
    };

    const handleStyleChange = (key: string, value: string | number) => {
        updateNode(node.id, {
            style: { ...node.style, [key]: value },
        });
    };

    const handleBorderChange = (key: string, value: string | number) => {
        updateNode(node.id, {
            style: {
                ...node.style,
                border: { ...node.style.border, [key]: value },
            },
        });
    };

    const handleTextChange = (key: string, value: string | number) => {
        updateNode(node.id, {
            style: {
                ...node.style,
                text: { ...(node.style.text || {}), [key]: value },
            },
        });
    };

    return (
        <div
            className="absolute -top-16 left-1/2 -translate-x-1/2 bg-text-300 text-text-500 p-2 rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center gap-3 z-50 whitespace-nowrap"
            onMouseDown={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}
        >
            {/* Background Color Picker */}
            <div className="flex items-center gap-1.5" title="Background Color">
                <FaFill className="text-text-800 text-sm" />
                <ColorPicker
                    value={node.style.color}
                    onChange={(val) => handleStyleChange("color", val)}
                    isOpen={activeMenu === "bgColor"}
                    onToggle={() => handleToggleMenu("bgColor")}
                    onClose={handleCloseMenu}
                />
            </div>

            <div className="w-px h-5 bg-text-500"></div>

            {/* Border Options */}
            <div className="flex items-center gap-1.5" title="Border">
                <FaBorderAll className="text-text-800 text-sm" />
                <ColorPicker
                    value={node.style.border.color}
                    onChange={(val) => handleBorderChange("color", val)}
                    isOpen={activeMenu === "borderColor"}
                    onToggle={() => handleToggleMenu("borderColor")}
                    onClose={handleCloseMenu}
                />
                <DropdownPicker
                    value={node.style.border.type || "solid"}
                    onChange={(val) => handleBorderChange("type", val)}
                    options={[
                        { label: <LuCircle />, value: "solid" },
                        { label: <LuCircleDashed />, value: "dashed" },
                        { label: <LuCircleDotDashed />, value: "dotted" },
                    ]}
                    isOpen={activeMenu === "borderType"}
                    onToggle={() => handleToggleMenu("borderType")}
                    onClose={handleCloseMenu}
                />
            </div>

            <div className="w-px h-5 bg-text-500"></div>

            {/* Text Options */}
            <div className="flex items-center gap-1.5" title="Text Style">
                <FaFont className="text-text-800 text-sm" />
                <ColorPicker
                    value={node.style.text?.color || "#000000"}
                    onChange={(val) => handleTextChange("color", val)}
                    isOpen={activeMenu === "textColor"}
                    onToggle={() => handleToggleMenu("textColor")}
                    onClose={handleCloseMenu}
                />
                <RangePicker
                    value={node.style.text?.size}
                    min={0}
                    max={72}
                    onChange={(val) => handleTextChange("size", val)}
                    isOpen={activeMenu === "textSize"}
                    onToggle={() => handleToggleMenu("textSize")}
                    onClose={handleCloseMenu}
                />
                <DropdownPicker
                    value={node.style.text?.align || "center"}
                    onChange={(val) => handleTextChange("align", val)}
                    options={[
                        { label: <FaAlignLeft />, value: "left" },
                        { label: <FaAlignCenter />, value: "center" },
                        { label: <FaAlignRight />, value: "right" },
                    ]}
                    isOpen={activeMenu === "textAlign"}
                    onToggle={() => handleToggleMenu("textAlign")}
                    onClose={handleCloseMenu}
                />
            </div>
        </div>
    );
};

export default NodeMenu;
