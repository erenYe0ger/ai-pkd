export async function queryRag(doc_uid: string, question: string) {
    const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc_uid, question }),
    });

    return res.json();
}
