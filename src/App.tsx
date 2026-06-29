import CanvasWrapper from "./components/Canvas/CanvasWrapper";
import { Edge } from "./components/Canvas/Edge";
import Node from "./components/Canvas/Node";
import { useNodeStore } from "./store/useNodeStore";
import "./App.css";
import { AddNodeButton } from "./components/Sidebar/AddNodeButton";

export default function App() {
    const { nodes } = useNodeStore();
    return (
        <div
            style={{
                display: "flex",
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                backgroundColor: "#1a1a1a",
                color: "white",
            }}
        >
            <CanvasWrapper>
                <Edge />
                {nodes.map((node, i: number) => {
                    return <Node key={i} node={node} />;
                })}
            </CanvasWrapper>
            <AddNodeButton />
        </div>
    );
}
