import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { queryRag } from "../api/chat";

type Message = {
    role: "User" | "AI";
    content: string;
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

        const aiMsg: Message = { role: "AI", content: res.response };
        const finalMessage = [...addedUserMessage, aiMsg];
        setMessages(finalMessage);

        setNewContexts(res.contexts);
    }

    if (!activeDoc) {
        return (
            <div className="flex-1 flex justify-center items-center">
                <div className="text-center text-gray-800 text-xl">
                    Select or Upload a PDF to start
                </div>
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
