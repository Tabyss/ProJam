import Layout from "./components/Layout";
import useKeyboard from "./hooks/useKeyboard";

export default function App() {
    useKeyboard();
    return (
        <Layout/>
    );
}
