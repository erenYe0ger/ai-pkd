import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { queryRag } from "../api/chat";

type Message = {
    role: "User" | "AI";
    content: string;
};

export default function MainPanel({ onShowContexts, setNewContexts }: any) {
    const hasActiveDoc = true;

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");

    async function handleQuery() {
        setMessages((prev) => [...prev, { role: "User", content: input }]);
        setInput("");

        const res = await queryRag(input);
        setMessages((prev) => [...prev, { role: "AI", content: res.response }]);

        setNewContexts(res.contexts);
    }

    if (!hasActiveDoc) {
        return (
            <div className="flex-1 flex justify-center items-center">
                <button className="cursor-pointer p-4 border rounded">
                    Upload a PDF to start
                </button>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col">
            {/* messages */}

            <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`p-3 rounded max-w-4/5 ${
                            msg.role === "User"
                                ? "bg-gray-200 self-end"
                                : "bg-white border self-start"
                        }`}
                    >
                        <ReactMarkdown>{msg.content}</ReactMarkdown>

                        {msg.role === "AI" && (
                            <button
                                className="text-blue-500 mt-2 block text-sm cursor-pointer"
                                onClick={onShowContexts}
                            >
                                Show Contexts
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* input */}

            <div className="border-t p-4 flex gap-2">
                <input
                    placeholder="Ask something..."
                    className="border rounded p-2 flex-1"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleQuery();
                    }}
                />
                <button
                    className="px-4 border rounded cursor-pointer"
                    onClick={handleQuery}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
