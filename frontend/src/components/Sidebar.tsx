import { uploadPDF } from "../api/upload";

export default function Sidebar() {
    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        await uploadPDF(file);
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
                <div className="p-2 rounded bg-gray-100 cursor-pointer">
                    Sample.pdf
                </div>
            </div>
        </div>
    );
}
