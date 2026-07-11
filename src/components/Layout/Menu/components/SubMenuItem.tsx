import React from "react";
import type { MenuItemProps } from "./MenuItem";

const SubMenuItem: React.FC<{ item: MenuItemProps }> = ({ item }) => {
    return (
        <button
            className={`shrink-0 size-7 place-items-center bg-background-500 text-text-500 text-[16px] rounded-sm transition duration-300 cursor-pointer`}
            onClick={item.onClick}
            onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
            {item.icon}
        </button>
    );
};

export default SubMenuItem;
