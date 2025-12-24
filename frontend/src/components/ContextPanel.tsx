import ReactMarkdown from "react-markdown";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    contexts: string[];
};

export default function ContextPanel({ isOpen, onClose, contexts }: Props) {
    return (
        <div
            className={`flex flex-col fixed right-0 top-0 h-full w-90 bg-black/40 backdrop-blur-2xl border-l border-white/10 p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)] transform ${
                isOpen ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-300`}
        >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold bg-linear-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
                    Contexts Used
                </h3>
                <button
                    onClick={onClose}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-black/40 text-gray-300 transition-all duration-200 hover:bg-black/60 hover:text-red-400 hover:shadow-[0_0_16px_rgba(255,80,80,0.45)] active:scale-90 cursor-pointer"
                >
                    ✕
                </button>
            </div>
            <div className="overflow-y-auto flex-1 space-y-4 pr-2 aurora-scroll">
                {contexts.map((context, index) => (
                    <div
                        key={index}
                        className="bg-black/30 border border-white/10 rounded-xl p-4 shadow-md shadow-black/40"
                    >
                        <div className="prose prose-invert max-w-none text-gray-200">
                            <ReactMarkdown>{context}</ReactMarkdown>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
