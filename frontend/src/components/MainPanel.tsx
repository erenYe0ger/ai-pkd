export default function MainPanel({ onShowContexts }: any) {
    const hasActiveDoc = true;

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
                <div className="self-end bg-gray-200 p-3 rounded">
                    What is this document about?
                </div>
                <div className="self-start bg-white border p-3 rounded">
                    This document discusses...
                    <button
                        className="text-blue-500 mt-2 block text-sm cursor-pointer"
                        onClick={() => onShowContexts(["context1", "context2"])}
                    >
                        Show Contexts
                    </button>
                </div>
            </div>
            {/* input */}
            <div className="border-t p-4 flex gap-2">
                <input
                    placeholder="Ask something..."
                    className="border rounded p-2 flex-1"
                />
                <button className="px-4 border rounded">Send</button>
            </div>
        </div>
    );
}
