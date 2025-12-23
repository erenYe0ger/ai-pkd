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
};

export default function Sidebar({
    documents,
    onAddDoc,
    activeDoc,
    onSelectDoc,
}: Props) {
    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const res = await uploadPDF(file);

        onAddDoc(res.doc_uid, file.name);
    }

    return (
        <div className="w-60 border-r p-4 flex flex-col">
            <h2 className="font-bold m-4">My Docs</h2>

            <label className="border rounded p-2 mb-4 cursor-pointer text-center">
                Upload PDF
                <input
                    type="file"
                    accept="application/pdf"
                    hidden
                    onChange={handleUpload}
                />
            </label>

            <div className="flex-1 space-y-2 overflow-y-auto">
                {documents.map((doc) => (
                    <div
                        onClick={() => onSelectDoc(doc.id)}
                        key={doc.id}
                        className={`p-2 rounded cursor-pointer ${
                            activeDoc === doc.id
                                ? "bg-gray-200 font-medium"
                                : "hover:bg-gray-100"
                        }`}
                    >
                        {doc.docName}
                    </div>
                ))}
            </div>
        </div>
    );
}
