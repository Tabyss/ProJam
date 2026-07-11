import React, { useState, useEffect, useRef } from "react";
import SubMenuItem from "./SubMenuItem";

export interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    icon?: React.ReactNode;
    subItems?: MenuItemProps[];
}

const MenuItem: React.FC<{ items: MenuItemProps }> = ({ items }) => {
    const { label, icon, subItems, className, ...rest } = items;

    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={menuRef} className={`relative size-7 group/item`}>
            <button
                title={label}
                className={`size-full place-items-center content-center bg-background-500 text-text-500 rounded-sm transition duration-300 cursor-pointer ${className || ""}`}
                onClick={() => setIsOpen(!isOpen)}
                onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                }
                {...rest}
            >
                {icon}
            </button>

            {isOpen && subItems && subItems.length > 0 && (
                <div className="absolute -top-1 right-full mr-2 p-1 h-max bg-text-500 rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.3)] flex gap-1.5 whitespace-nowrap z-50">
                    {subItems.map((sub) => (
                        <SubMenuItem key={sub.id} item={sub} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MenuItem;
