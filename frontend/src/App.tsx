import Sidebar from "./components/Sidebar";
import MainPanel from "./components/MainPanel";
import ContextPanel from "./components/ContextPanel";
import { useState } from "react";

type Message = {
    role: "User" | "AI";
    content: string;
    contexts?: string[];
};

type DocumentItem = {
    id: string;
    docName: string;
};

function App() {
    const [isContextOpen, setIsContextOpen] = useState(false);
    const [contexts, setContexts] = useState<string[]>([]);
    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [activeDoc, setActiveDoc] = useState<string | null>(null);
    const [chats, setChats] = useState<Record<string, Message[]>>({});

    return (
        <div className="h-screen flex bg-linear-to-br from-[#050510] via-[#0b0b23] to-[#1b0f2e] text-gray-200 relative overflow-hidden">
            <div
                className="absolute inset-0 pointer-events-none opacity-30 blur-3xl"
                style={{
                    background:
                        "radial-gradient(circle at 20% 30%, #6a3cff, transparent 40%), radial-gradient(circle at 80% 60%, #00eaff, transparent 45%), radial-gradient(circle at 50% 90%, #ff00c8, transparent 55%)",
                }}
            ></div>

            <Sidebar
                documents={documents}
                onAddDoc={(doc_uid: string, docName: string) => {
                    setDocuments((prev) => [
                        ...prev,
                        { id: doc_uid, docName: docName },
                    ]);
                    setChats((prev) => ({ ...prev, [doc_uid]: [] }));
                    setActiveDoc(doc_uid);
                }}
                activeDoc={activeDoc}
                onSelectDoc={(doc_uid: string) => {
                    setActiveDoc(doc_uid);
                    if (!chats[doc_uid]) {
                        setChats((prev) => ({ ...prev, [doc_uid]: [] }));
                    }
                }}
            />

            <MainPanel
                onShowContexts={() => setIsContextOpen(true)}
                setNewContexts={setContexts}
                activeDoc={activeDoc}
                messages={activeDoc ? chats[activeDoc] || [] : []}
                setMessages={(newMsgs) => {
                    if (!activeDoc) return;
                    setChats((prev) => ({ ...prev, [activeDoc]: newMsgs }));
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
