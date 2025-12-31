import { uploadPDF } from "../api/upload";

type DocumentItem = {
    id: string;
    docName: string;
};

type Props = {
    documents: DocumentItem[];
    onAddDoc: (doc_uid: string, docName: string) => void;
    activeDoc: string | null;
    onSelectDoc: (doc_uid: string) => void;
    isSidebarOpen: boolean;
};

export default function Sidebar({
    documents,
    onAddDoc,
    activeDoc,
    onSelectDoc,
    isSidebarOpen,
}: Props) {
    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const res = await uploadPDF(file);

        onAddDoc(res.doc_uid, file.name);
    }

    return (
        <div
            className={`fixed lg:static z-40 w-64 h-full
                        border-r border-white/10 bg-black/30 backdrop-blur-xl p-6
                        transform transition-transform duration-1000 ease-out
                        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                        lg:translate-x-0
                        flex flex-col shadow-lg shadow-black/30`}
        >
            <h2 className="font-semibold text-lg mb-6 bg-linear-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
                Your Docs
            </h2>
            <label className="rounded-xl bg-linear-to-r from-purple-600/40 to-cyan-500/40 backdrop-blur-md border border-white/10 py-3 mb-10 text-center cursor-pointer text-gray-100 font-medium shadow-[0_0_12px_rgba(0,0,0,0.4)] hover:shadow-[0_0_22px_rgba(120,0,255,0.5)] transition-all">
                Upload PDF
                <input
                    type="file"
                    accept="application/pdf"
                    hidden
                    onChange={handleUpload}
                />
            </label>
            <div className="flex-1 space-y-4 overflow-y-auto aurora-scroll">
                {documents.map((doc) => (
                    <div
                        key={doc.id}
                        onClick={() => onSelectDoc(doc.id)}
                        className={`px-3 py-2 rounded-lg cursor-pointer transition-all ${
                            activeDoc === doc.id
                                ? "bg-linear-to-r from-purple-600/40 to-cyan-500/40 border border-purple-500/30 shadow-[0_0_12px_rgba(120,0,255,0.35)]"
                                : "bg-white/5 border border-white/5 text-gray-300 hover:bg-white/10 hover:border-white/10 hover:shadow-[0_0_10px_rgba(255,255,255,0.08)]"
                        }`}
                    >
                        {doc.docName}
                    </div>
                ))}
            </div>
        </div>
    );
}
