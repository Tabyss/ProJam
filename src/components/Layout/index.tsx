import { useNodeStore } from "../../store/useNodeStore";
import CanvasWrapper from "../Canvas/CanvasWrapper";
import { Edge } from "../Canvas/Edge";
import Node from "../Canvas/Node/Node";
import Menu from "./Menu/Menu";

const Layout = () => {
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
            <Menu/>
            <CanvasWrapper>
                <Edge />
                {nodes.map((node, i: number) => {
                    return <Node key={i} node={node} />;
                })}
            </CanvasWrapper>
        </div>
    );
};

export default Layout;
