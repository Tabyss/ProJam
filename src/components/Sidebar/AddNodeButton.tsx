import { useNodeStore } from "../../store/useNodeStore";

export const AddNodeButton = () => {
    const addNode = useNodeStore((s) => s.addNode);

    const createNewNode = () => {
        const newNode = {
            id: Date.now().toString(),
            x: 200, // Posisi default saat baru dibuat
            y: 200,
            width: 150,
            height: 80,
            title: "New Task",
            color: "#8b5cf6",
        };
        addNode(newNode);
    };

    return (
        <button
            onClick={createNewNode}
            style={{
                position: "fixed",
                bottom: "30px",
                right: "30px",
                padding: "12px 24px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "50px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                zIndex: 1000, // Pastikan di atas layer lain
                transition: "transform 0.2s, background-color 0.2s",
            }}
            onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
            + Add Task
        </button>
    );
};
