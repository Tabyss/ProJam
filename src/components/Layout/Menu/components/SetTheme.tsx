import { useEffect, useState } from "react";

const AVAILABLE_THEMES = ["theme1", "theme2", "theme3"];

const SetTheme = () => {
    const [activeTheme, setActiveTheme] = useState("theme1");

    useEffect(() => {
        document.body.setAttribute("data-theme", activeTheme);
    }, [activeTheme]);

    return (
        <div className="group flex flex-col-reverse items-end p-1 gap-2 relative">
            <button
                data-theme={activeTheme}
                title="Tema Aktif"
                className="w-7 h-7 rounded-md shadow-sm hover:scale-110 active:scale-95 transition-all duration-200 border-2 border-text-500 relative z-10"
                style={{
                    background:
                        "linear-gradient(to right, var(--color-primary-500) 50%, var(--color-accent-500) 50%)",
                }}
            />

            <div className="absolute top-0 right-0 flex items-center p-1 gap-2 opacity-0 translate-x-0 pointer-events-none group-hover:opacity-100 group-hover:-translate-x-9 group-hover:pointer-events-auto transition-all duration-300 ease-out">
                {AVAILABLE_THEMES.filter((t) => t !== activeTheme).map(
                    (theme) => (
                        <button
                            key={theme}
                            data-theme={theme}
                            onClick={() => setActiveTheme(theme)}
                            className="w-7 h-7 rounded-md opacity-70 hover:opacity-100 shadow-sm hover:scale-110 active:scale-95 transition-all duration-200 border-2 border-text-500 border-dashed hover:border-solid"
                            style={{
                                background:
                                    theme === "theme1"
                                        ? "linear-gradient(to right, #a54b43 50%, #658963 50%)"
                                        : "linear-gradient(to right, var(--color-primary-500) 50%, var(--color-accent-500) 50%)",
                            }}
                        />
                    ),
                )}
            </div>
        </div>
    );
};

export default SetTheme;
