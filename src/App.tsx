import Layout from "./components/Layout";
import useKeyboard from "./hooks/useKeyboard";

export default function App() {
    useKeyboard();

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <Layout />

            {/* <div className="absolute top-6 right-6 z-50 bg-secondary-500 p-4 rounded-xl shadow-xl border-2 border-text-500 flex flex-col gap-3">
                <span className="text-text-500 text-sm font-bold text-center">
                    Ganti Tema
                </span>
                
                <div className="flex flex-col gap-2">
                    <button 
                        onClick={() => setActiveTheme("theme1")} 
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            activeTheme === "theme1" ? "bg-primary text-background-500 ring-2 ring-accent" : "bg-background-500 text-text-500 hover:bg-primary/50"
                        }`}
                    >
                        Theme 1 (Earthy)
                    </button>
                    
                    <button 
                        onClick={() => setActiveTheme("theme2")} 
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            activeTheme === "theme2" ? "bg-primary text-background-500 ring-2 ring-accent" : "bg-background-500 text-text-500 hover:bg-primary/50"
                        }`}
                    >
                        Theme 2 (Neon)
                    </button>
                    
                    <button 
                        onClick={() => setActiveTheme("theme3")} 
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            activeTheme === "theme3" ? "bg-primary text-background-500 ring-2 ring-accent" : "bg-background-500 text-text-500 hover:bg-primary/50"
                        }`}
                    >
                        Theme 3 (Teal)
                    </button>
                </div>

                <div className="flex justify-between gap-1 mt-2 pt-2 border-t border-text-500">
                    <div className="w-5 h-5 rounded-full bg-primary-500 shadow-sm"></div>
                    <div className="w-5 h-5 rounded-full bg-secondary-500 shadow-sm"></div>
                    <div className="w-5 h-5 rounded-full bg-accent-500 shadow-sm"></div>
                    <div className="w-5 h-5 rounded-full bg-background-500 border border-text-500 shadow-sm"></div>
                    <div className="w-5 h-5 rounded-full bg-text-500 shadow-sm"></div>
                </div>
            </div> */}
        </div>
    );
}