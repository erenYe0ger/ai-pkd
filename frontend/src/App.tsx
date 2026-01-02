import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Dashboard from "./Dashboard";
import type { Session } from "@supabase/supabase-js";

export default function App() {
    const [session, setSession] = useState<Session | null>(null);
    const [text, setText] = useState("");

    const fullText =
        "Ask questions, get answers, and explore insights from your PDFs.";

    /* typing animation: type → wait 4s → restart */
    useEffect(() => {
        let i = 0;
        let interval: ReturnType<typeof setInterval>;
        let timeout: ReturnType<typeof setTimeout>;

        const startTyping = () => {
            i = 0;
            interval = setInterval(() => {
                setText(fullText.slice(0, i + 1));
                i++;

                if (i === fullText.length) {
                    clearInterval(interval);
                    timeout = setTimeout(() => {
                        setText("");
                        startTyping();
                    }, 4000);
                }
            }, 40);
        };

        startTyping();

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    /* auth handling + safe URL cleanup */
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);

            if (event === "SIGNED_IN") {
                // Replace history entry to remove OAuth hash
                window.history.replaceState(null, "", window.location.pathname);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    /* back-button protection (safe, non-intrusive) */
    useEffect(() => {
        const handlePopState = () => {
            if (window.location.hash) {
                window.history.replaceState(null, "", window.location.pathname);
            }
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    if (session) return <Dashboard />;

    return (
        <div className="h-screen flex bg-linear-to-br from-[#050510] via-[#0b0b23] to-[#1b0f2e] text-gray-200 relative overflow-hidden">
            {/* aurora glow (same as Dashboard) */}
            <div
                className="absolute inset-0 pointer-events-none opacity-30 blur-3xl"
                style={{
                    background:
                        "radial-gradient(circle at 20% 30%, #6a3cff, transparent 40%), radial-gradient(circle at 80% 60%, #00eaff, transparent 45%), radial-gradient(circle at 50% 90%, #ff00c8, transparent 55%)",
                }}
            />

            {/* content */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-6 text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-5 bg-linear-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
                    DocAI
                </h1>

                <p className="text-base md:text-lg h-7 mb-12 text-gray-300">
                    {text}
                    <span className="animate-pulse text-gray-400">|</span>
                </p>

                <div className="flex flex-col gap-4 w-full max-w-sm">
                    <button
                        onClick={() =>
                            supabase.auth.signInWithOAuth({
                                provider: "google",
                            })
                        }
                        className="
                            px-4 py-3 text-sm md:text-base
                            rounded-xl
                            bg-linear-to-r from-purple-600/40 to-cyan-500/40
                            border border-purple-500/30
                            text-gray-100 font-medium
                            backdrop-blur-md
                            shadow-[0_0_14px_rgba(120,0,255,0.35)]
                            hover:shadow-[0_0_22px_rgba(0,255,255,0.45)]
                            transition-all
                            hover:scale-[1.03] active:scale-95
                            cursor-pointer
                        "
                    >
                        Sign in with Google
                    </button>

                    <button
                        onClick={() => supabase.auth.signInAnonymously()}
                        className="
                            px-4 py-3 text-sm md:text-base
                            rounded-xl
                            bg-black/30
                            border border-white/10
                            text-gray-300
                            backdrop-blur-md
                            hover:bg-white/5 hover:text-gray-100
                            transition-all
                            hover:scale-[1.02] active:scale-95
                            cursor-pointer
                        "
                    >
                        Continue as Guest
                    </button>
                </div>

                <div className="absolute bottom-4 text-sm md:text-base text-gray-300">
                    Made with ❤️ by Goutam
                </div>
            </div>
        </div>
    );
}
