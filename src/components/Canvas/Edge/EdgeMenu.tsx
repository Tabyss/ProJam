import { useState } from "react";
import { getThemePalette } from "../../../utils/colors";
import { LuCircle, LuCircleDashed, LuCircleDotDashed } from "react-icons/lu";
import type { EdgeProps, EdgeStyleProps } from "../../../types/edge";
import { TbLine } from "react-icons/tb";

interface EdgeMenuProps {
    edge: EdgeProps;
    updateEdge: (id: string, data: Partial<EdgeProps>) => void;
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
                className="w-6 h-6 rounded-md border border-text-500 shadow-sm hover:border-text-300"
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
                className="w-6 h-6 text-sm rounded-md border border-text-500 cursor-pointer outline-none flex items-center justify-center hover:bg-text-400 hover:border-text-300 "
                style={{
                    backgroundColor:`var(${isOpen ? "--color-text-500" : "--color-text-100"})`,
                    color:`var(${isOpen ? "--color-text-100" : "--color-text-500"})`
                }}
                onClick={(e) => {
                    e.preventDefault();
                    onToggle();
                }}
            >
                {currentLabel}
            </button>

            {isOpen && (
                <div
                    className="absolute bottom-10 mt-2 left-1/2 -translate-x-1/2 bg-text-100 p-1.5 rounded-md shadow-lg z-60 flex gap-1"
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
            <input
                className="text-xs border border-text-500 rounded p-1 px-2 bg-text-100 cursor-pointer outline-none hover:border-text-300 w-8 h-6"
                onClick={(e) => {
                    e.preventDefault();
                    onToggle();
                }}
                value={value}
            />

            {isOpen && (
                <div
                    className="absolute bottom-10 mt-2 left-1/2 -translate-x-1/2 bg-text-100 p-3 rounded-md shadow-lg z-60 flex flex-col items-center gap-2"
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

const EdgeMenu = ({ edge, updateEdge }: EdgeMenuProps) => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const edgeStyle: EdgeStyleProps = edge.style ?? {
        width: 2,
        color: "#000000",
        type: "solid",
    };

    const handleToggleMenu = (menuName: string) => {
        setActiveMenu((prev) => (prev === menuName ? null : menuName));
    };

    const handleCloseMenu = () => {
        setActiveMenu(null);
    };

    const handleStyleChange = (key: "color" | "type", value: string) => {
        updateEdge(edge.id, {
            style: { ...edgeStyle, [key]: value },
        });
    };

    const handleWidthChange = (value: number) => {
        updateEdge(edge.id, {
            style: { ...edgeStyle, width: value },
        });
    };

    return (
        <div
            className="absolute -top-16 left-1/2 -translate-x-1/2 bg-text-100 text-text-500 p-2 rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center gap-2 z-50 whitespace-nowrap"
            onMouseDown={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}
        >
            <div className="flex items-center gap-1.5" title="Line Color">
                <TbLine className="text-text-800 text-sm" />
                <ColorPicker
                    value={edgeStyle.color}
                    onChange={(val) => handleStyleChange("color", val)}
                    isOpen={activeMenu === "lineColor"}
                    onToggle={() => handleToggleMenu("lineColor")}
                    onClose={handleCloseMenu}
                />
            </div>

            <div className="flex items-center gap-1.5" title="Line Width">
                <RangePicker
                    value={edgeStyle.width}
                    min={1}
                    max={20}
                    onChange={handleWidthChange}
                    isOpen={activeMenu === "lineWidth"}
                    onToggle={() => handleToggleMenu("lineWidth")}
                    onClose={handleCloseMenu}
                />
            </div>

            <div className="flex items-center gap-1.5" title="Line Style">
                <DropdownPicker
                    value={edgeStyle.type}
                    onChange={(val) => handleStyleChange("type", val)}
                    options={[
                        { label: <LuCircle />, value: "solid" },
                        { label: <LuCircleDashed />, value: "dashed" },
                        { label: <LuCircleDotDashed />, value: "dotted" },
                    ]}
                    isOpen={activeMenu === "lineType"}
                    onToggle={() => handleToggleMenu("lineType")}
                    onClose={handleCloseMenu}
                />
            </div>
        </div>
    );
};

export default EdgeMenu;
