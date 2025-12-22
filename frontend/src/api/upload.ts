export async function uploadPDF(file: File) {
    const formdata = new FormData();
    formdata.append("file", file);

    const res = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formdata,
    });

    return res.json();
}
