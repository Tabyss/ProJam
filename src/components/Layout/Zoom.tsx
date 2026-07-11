import { useCanvasStore } from "../../store/useCanvasStore";

const Zoom = () => {
    const { scale, setScale } = useCanvasStore();

    const zoomPercentage = Math.round(scale * 100);
    const version = import.meta.env.VITE_APP_VERSION;

    const handleZoomIn = () => setScale(Math.min(scale + 0.1, 5));
    const handleZoomOut = () => setScale(Math.max(scale - 0.1, 0.1));
    const handleResetZoom = () => setScale(1);

    return (
        <div className="absolute bottom-7 left-7 flex gap-2 content-end z-1000">
            <div className=" flex items-center gap-1 bg-text-500 shadow-lg rounded-md p-1 select-none z-50">
                <button
                    onClick={handleZoomOut}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-background-500 transition-colors"
                    title="Zoom Out"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>

                <button
                    onClick={handleResetZoom}
                    className="w-14 text-xs font-medium text-center rounded-lg py-1.5 cursor-pointer text-background-500 transition-colors"
                    title="Reset to 100%"
                >
                    {zoomPercentage}%
                </button>

                <button
                    onClick={handleZoomIn}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-background-500 transition-colors"
                    title="Zoom In"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
            </div>
            <span className="text-sm font-semibold self-end text-text-500">
                v.{version}
            </span>
        </div>
    );
};

export default Zoom;
