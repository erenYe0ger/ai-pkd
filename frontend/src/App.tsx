import Sidebar from "./components/Sidebar";
import MainPanel from "./components/MainPanel";
import ContextPanel from "./components/ContextPanel";
import { useState } from "react";

function App() {
    const [isContextOpen, setIsContextOpen] = useState(false);
    const [contexts, setContexts] = useState<string[]>([]);

    return (
        <div className="h-screen flex">
            <Sidebar />

            <MainPanel
                onShowContexts={(newContexts: string[]) => {
                    setContexts(newContexts);
                    setIsContextOpen(true);
                }}
            />

            <ContextPanel
                contexts={contexts}
                isOpen={isContextOpen}
                onClose={() => setIsContextOpen(false)}
            />
        </div>
    );
}
export default App;
