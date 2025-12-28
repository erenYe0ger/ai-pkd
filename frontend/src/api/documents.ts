export async function fetchDocuments() {
    const res = await fetch("http://localhost:8000/api/documents");
    return res.json();
}
