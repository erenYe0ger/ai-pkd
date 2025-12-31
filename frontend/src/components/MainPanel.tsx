import ReactMarkdown from "react-markdown";
import { useState, useEffect, useRef } from "react";
import { queryRag } from "../api/chat";

type DocumentItem = {
    id: string;
    docName: string;
};

type Message = {
    role: "User" | "AI";
    content: string;
    contexts?: string[];
};

type Props = {
    documents: DocumentItem[];
    onShowContexts: () => void;
    setNewContexts: (newContexts: string[]) => void;
    activeDoc: string | null;
    messages: Message[];
    setMessages: (newMsgs: Message[]) => void;
    toggleSidebar: () => void;
};

export default function MainPanel({
    documents,
    onShowContexts,
    setNewContexts,
    activeDoc,
    messages,
    setMessages,
    toggleSidebar,
}: Props) {
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    async function handleQuery() {
        if (!activeDoc) return;

        const userMsg: Message = { role: "User", content: input };
        const addedUserMessage = [...messages, userMsg];
        setMessages(addedUserMessage);
        setInput("");

        try {
            setError(null);
            setIsLoading(true);
            const res = await queryRag(activeDoc, input);
            const aiMsg: Message = {
                role: "AI",
                content: res.response,
                contexts: res.contexts,
            };
            const finalMessage = [...addedUserMessage, aiMsg];
            setMessages(finalMessage);
        } catch {
            setError("Something went wrong. Try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const activeDocument = documents.find((doc) => doc.id === activeDoc);

    return (
        <div className="flex-1 flex flex-col bg-black/20 backdrop-blur-xl border-x border-white/10 relative">
            <div className="relative w-full h-14 flex items-center justify-center border-b border-white/20 px-3 font-semibold text-gray-400">
                <button
                    className="lg:hidden absolute left-3 z-10 p-2 rounded-lg
                   transition touch-manipulation
                   hover:bg-white/10 active:bg-white/10"
                    onClick={toggleSidebar}
                >
                    ☰
                </button>
                <span className="text-sm md:text-base">
                    {activeDocument?.docName}
                </span>
            </div>

            {!activeDoc ? (
                <div className="flex-1 flex justify-center items-center">
                    <div className="text-base md:text-lg text-transparent bg-clip-text bg-linear-to-r from-purple-300 to-cyan-300 font-medium">
                        Select or Upload a PDF to start
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex-1 overflow-y-auto px-8 py-7 space-y-7 aurora-scroll flex flex-col">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`text-sm md:text-base rounded-xl px-6 py-4 max-w-[90%] md:max-w-[70%] shadow-[0_4px_20px_-5px_rgba(0,0,0,0.6)] transition-all backdrop-blur-xl border ${
                                    msg.role === "User"
                                        ? "self-end bg-linear-to-br from-[#6a3cff]/40 to-[#00eaff]/30 border-[#875dff]/40"
                                        : "self-start bg-linear-to-br from-[#1a1a2a]/60 to-[#14141f]/40 border-[#2d2d40]/60"
                                }`}
                            >
                                <div className="prose prose-invert max-w-none text-gray-200">
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                                {msg.role === "AI" && (
                                    <button
                                        className="text-cyan-300 hover:text-cyan-200 text-xs md:text-sm mt-3 transition cursor-pointer"
                                        onClick={() => {
                                            if (msg.contexts)
                                                setNewContexts(msg.contexts);
                                            onShowContexts();
                                        }}
                                    >
                                        Show Contexts
                                    </button>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="self-start text-gray-500 text-xs md:text-sm px-6 py-2 animate-pulse">
                                Thinking...
                            </div>
                        )}
                        {error && (
                            <div
                                className="self-start
                                            max-w-[70%]
                                            rounded-xl
                                            px-6
                                            py-4
                                            shadow-[0_4px_20px_-5px_rgba(0,0,0,0.6)]
                                            backdrop-blur-xl
                                            transition-all
                                            bg-linear-to-br from-[#1a1a2a]/60 to-[#14141f]/40
                                            border border-red-500/30"
                            >
                                <div className="text-red-400 text-xs md:text-sm leading-relaxed">
                                    {error}
                                </div>
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </div>
                    <div className="text-sm md:text-base border-t border-white/10 bg-black/20 backdrop-blur-xl p-4 flex gap-3">
                        <input
                            placeholder="Ask something..."
                            className="flex-1 px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-purple-500/40 outline-none"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleQuery();
                            }}
                            disabled={isLoading}
                        />
                        <button
                            className="text-sm md:text-base px-5 py-2.5 rounded-xl bg-[#0a0a12] text-[#d8faff] font-medium border border-cyan-500/40 transition-all hover:text-white hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,255,255,0.45)] hover:scale-[1.04] active:scale-95 cursor-pointer"
                            onClick={handleQuery}
                            disabled={isLoading}
                        >
                            Send
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
