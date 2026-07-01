export interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    id: string;
    label: string;
    icon?: React.ReactNode;
    subItems?: MenuItemProps[];
}

const MenuItem: React.FC<{ items: MenuItemProps; index: number }> = ({
    items,
    index,
}) => {
    const colorMap: Record<number, string[]> = {
        1: ["text-1-500", "border-1-500"],
        2: ["text-2-500", "border-2-500"],
        3: ["text-3-500", "border-3-500"],
        4: ["text-4-500", "border-4-500"],
        5: ["text-5-500", "border-5-500"],
    };
    const colorClass = colorMap[(index % 5) + 1];
    return (
        <div className={`relative size-7.5 group/item`}>
            <div
                className={`absolute right-0 flex flex-row-reverse flex-nowrap gap-3 bg-base-50 w-7.5 hover:w-(--hover-width) overflow-hidden transition-all duration-300 hover:border ${colorClass[1]} rounded-[50px]`}
                style={{
                    ["--hover-width" as string]: `${30 * (items?.subItems?.length || 0) + 12 * ((items?.subItems?.length || 0) - 1)}px`,
                }}
            >
                {items?.subItems &&
                    items?.subItems.map((item: MenuItemProps, i: number) => {
                        return (
                            <button
                                key={i}
                                className={`shrink-0 size-7.5 place-items-center bg-base-50 ${colorClass[0]} text-[16px] rounded-[50px] transition duration-300 cursor-pointer`}
                                onClick={item.onClick}
                                onMouseOver={(e) =>
                                    (e.currentTarget.style.transform =
                                        "scale(1.05)")
                                }
                                onMouseOut={(e) =>
                                    (e.currentTarget.style.transform =
                                        "scale(1)")
                                }
                            >
                                {item.icon}
                            </button>
                        );
                    })}
            </div>
        </div>
    );
};

export default MenuItem;
