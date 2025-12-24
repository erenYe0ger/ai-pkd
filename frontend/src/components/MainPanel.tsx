import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { queryRag } from "../api/chat";

type Message = {
    role: "User" | "AI";
    content: string;
    contexts?: string[];
};

type Props = {
    onShowContexts: () => void;
    setNewContexts: (newContexts: string[]) => void;
    activeDoc: string | null;
    messages: Message[];
    setMessages: (newMsgs: Message[]) => void;
};

export default function MainPanel({
    onShowContexts,
    setNewContexts,
    activeDoc,
    messages,
    setMessages,
}: Props) {
    const [input, setInput] = useState("");

    async function handleQuery() {
        if (!activeDoc) return;

        const userMsg: Message = { role: "User", content: input };
        const addedUserMessage = [...messages, userMsg];
        setMessages(addedUserMessage);
        setInput("");

        const res = await queryRag(activeDoc, input);

        const aiMsg: Message = {
            role: "AI",
            content: res.response,
            contexts: res.contexts,
        };
        const finalMessage = [...addedUserMessage, aiMsg];
        setMessages(finalMessage);
    }

    return (
        <div className="flex-1 flex flex-col bg-black/20 backdrop-blur-xl border-x border-white/10 relative">
            {!activeDoc ? (
                <div className="flex-1 flex justify-center items-center">
                    <div className="text-transparent bg-clip-text bg-linear-to-r from-purple-300 to-cyan-300 text-lg font-medium">
                        Select or Upload a PDF to start
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex-1 overflow-y-auto px-8 py-7 space-y-7 aurora-scroll flex flex-col">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`rounded-xl px-6 py-4 max-w-[70%] shadow-[0_4px_20px_-5px_rgba(0,0,0,0.6)] transition-all backdrop-blur-xl border ${
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
                                        className="text-cyan-300 hover:text-cyan-200 text-sm mt-3 transition cursor-pointer"
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
                    </div>
                    <div className="border-t border-white/10 bg-black/20 backdrop-blur-xl p-4 flex gap-3">
                        <input
                            placeholder="Ask something..."
                            className="flex-1 px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-purple-500/40 outline-none"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleQuery();
                            }}
                        />
                        <button
                            className="px-5 py-2.5 rounded-xl bg-[#0a0a12] text-[#d8faff] font-medium border border-cyan-500/40 transition-all hover:text-white hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,255,255,0.45)] hover:scale-[1.04] active:scale-95 cursor-pointer"
                            onClick={handleQuery}
                        >
                            Send
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
