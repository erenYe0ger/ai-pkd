type Props = {
    isOpen: boolean;
    onClose: () => void;
    contexts: string[];
};

export default function ContextPanel({ isOpen, onClose, contexts }: Props) {
    return (
        <div
            className={`fixed right-0 top-0 h-full w-80 bg-white border p-4 
                ${isOpen ? "translate-x-0" : "translate-x-full"}
                transition-transform duration-300 `}
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Contexts Used</h3>
                <button
                    onClick={onClose}
                    className="cursor-pointer text-red-600"
                >
                    X
                </button>
            </div>
            <div className="overflow-y-auto space-y-3">
                {contexts.map((context, index) => (
                    <div className="bg-gray-100 rounded p-2" key={index}>
                        {context}
                    </div>
                ))}
            </div>
        </div>
    );
}
