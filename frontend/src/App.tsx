import Sidebar from "./components/Sidebar";
import MainPanel from "./components/MainPanel";
import ContextPanel from "./components/ContextPanel";
import { useEffect, useState } from "react";
import { fetchDocuments } from "./api/documents";

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
    const [isSidebarOpen, setIsSidebarOpen] = useState(
        window.innerWidth < 1024
    );

    useEffect(() => {
        fetchDocuments().then((res) => {
            setDocuments(res.documents);
        });
    }, []);

    function handleSelectDoc(doc_uid: string) {
        setActiveDoc(doc_uid);

        if (!chats[doc_uid]) {
            setChats((prev) => ({ ...prev, [doc_uid]: [] }));
        }

        setIsSidebarOpen(false);
    }

    function handleAddDoc(doc_uid: string, docName: string) {
        setDocuments((prev) => [...prev, { id: doc_uid, docName }]);
        setChats((prev) => ({ ...prev, [doc_uid]: [] }));
        setActiveDoc(doc_uid);
    }

    return (
        <div className="h-screen flex bg-linear-to-br from-[#050510] via-[#0b0b23] to-[#1b0f2e] text-gray-200 relative overflow-hidden">
            <div
                className="absolute inset-0 pointer-events-none opacity-30 blur-3xl"
                style={{
                    background:
                        "radial-gradient(circle at 20% 30%, #6a3cff, transparent 40%), radial-gradient(circle at 80% 60%, #00eaff, transparent 45%), radial-gradient(circle at 50% 90%, #ff00c8, transparent 55%)",
                }}
            ></div>

            {/* Desktop Sidebar (part of flex layout) */}
            <div className="hidden lg:flex">
                <Sidebar
                    documents={documents}
                    onAddDoc={handleAddDoc}
                    activeDoc={activeDoc}
                    onSelectDoc={handleSelectDoc}
                    isSidebarOpen={true}
                />
            </div>

            {/* Mobile Sidebar Overlay (NOT in flex layout) */}
            {isSidebarOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                    <Sidebar
                        documents={documents}
                        onAddDoc={handleAddDoc}
                        activeDoc={activeDoc}
                        onSelectDoc={handleSelectDoc}
                        isSidebarOpen={true}
                    />
                </>
            )}

            <MainPanel
                documents={documents}
                onShowContexts={() => setIsContextOpen(true)}
                setNewContexts={setContexts}
                activeDoc={activeDoc}
                messages={activeDoc ? chats[activeDoc] || [] : []}
                setMessages={(newMsgs) => {
                    if (!activeDoc) return;
                    setChats((prev) => ({ ...prev, [activeDoc]: newMsgs }));
                }}
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
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
