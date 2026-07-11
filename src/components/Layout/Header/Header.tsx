import { useState } from "react";

const Header = () => {
    const [title, setTitle] = useState("Untitled Board");

    return (
        <header className="absolute top-7 left-7 z-50 flex items-start gap-2">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nama Papan..."
                className="px-3 py-2 rounded-md text-background-500 focus:text-text-500 bg-text-500 focus:bg-background-500 border-2 border-text-500 focus:border-text text-md font-bold outline-none backdrop-blur-md transition-colors w-36 placeholder:text-text-500"
            />
        </header>
    );
};

export default Header;
