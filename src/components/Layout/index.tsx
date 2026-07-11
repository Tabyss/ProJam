import { useNodeStore } from "../../store/useNodeStore";
import CanvasWrapper from "../Canvas/CanvasWrapper";
import { Edge } from "../Canvas/Edge";
import Node from "../Canvas/Node/Node";
import Header from "./Header/Header";
import Menu from "./Menu/Menu";
import Zoom from "./Zoom";

const Layout = () => {
    const { nodes } = useNodeStore();

    return (
        <div
            style={{
                display: "flex",
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
            }}
        >
            <Header />
            <Menu />
            <Zoom />
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
