import { uploadPDF } from "../api/upload";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";

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
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
        });
    }, []);

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
            <h2 className="text-base md:text-lg font-semibold mb-6 bg-linear-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
                Your Docs
            </h2>
            <label className="text-sm md:text-base rounded-xl bg-linear-to-r from-purple-600/40 to-cyan-500/40 backdrop-blur-md border border-white/10 py-3 mb-10 text-center cursor-pointer text-gray-100 font-medium shadow-[0_0_12px_rgba(0,0,0,0.4)] hover:shadow-[0_0_22px_rgba(120,0,255,0.5)] transition-all">
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
                        className={`text-xs md:text-sm px-3 py-2 rounded-lg cursor-pointer transition-all ${
                            activeDoc === doc.id
                                ? "bg-linear-to-r from-purple-600/40 to-cyan-500/40 border border-purple-500/30 shadow-[0_0_12px_rgba(120,0,255,0.35)]"
                                : "bg-white/5 border border-white/5 text-gray-300 hover:bg-white/10 hover:border-white/10 hover:shadow-[0_0_10px_rgba(255,255,255,0.08)]"
                        }`}
                    >
                        {doc.docName}
                    </div>
                ))}
            </div>
            <div className="mt-auto pt-4 border-t text-xs md:text-sm text-gray-400 flex flex-col items-center">
                <span className="mb-1">Logged in as</span>

                <span className="mb-2 font-semibold text-gray-200">
                    {(() => {
                        if (!user?.email) return "Guest";

                        const fullName =
                            user.user_metadata?.full_name ||
                            user.user_metadata?.name ||
                            "User";

                        const firstName = fullName.split(" ")[0];

                        return firstName.length > 15
                            ? `${firstName.slice(0, 13)}...`
                            : firstName;
                    })()}
                </span>

                <button
                    className={`cursor-pointer font-bold text-xs ${
                        user?.email ? "text-red-500" : "text-cyan-400"
                    }`}
                    onClick={() => supabase.auth.signOut()}
                >
                    {user?.email ? "Log out" : "Login"}
                </button>
            </div>
        </div>
    );
}
