from fastapi import APIRouter, UploadFile, File
import os
from app.services.pdf_extractor import extract_text_from_pdf
from app.services.chunker import chunk_text
from app.services.embeddings import get_embedding
from app.services.vectorstore import add_embeddings

router = APIRouter()
UPLOAD_DIR = "data/uploads"

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    text = extract_text_from_pdf(file_path)

    chunks = chunk_text(text)

    embeddings = [get_embedding(chunk) for chunk in chunks]

    doc_id = file.filename
    add_embeddings(doc_id, chunks, embeddings)

    return {
        "filename": file.filename,
        "chunks": len(chunks),
        "status": "stored in vector db"
    }
