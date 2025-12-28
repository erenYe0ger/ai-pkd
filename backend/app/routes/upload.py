import uuid
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
    doc_uid = str(uuid.uuid4())

    doc_folder = f"{UPLOAD_DIR}/{doc_uid}"
    os.makedirs(doc_folder, exist_ok=True)

    file_path = os.path.join(doc_folder, file.filename)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    text = extract_text_from_pdf(file_path)

    chunks = chunk_text(text)

    embeddings = [get_embedding(chunk) for chunk in chunks]

    add_embeddings(doc_uid, chunks, embeddings)

    return {
        "doc_uid": doc_uid,
        "filename": file.filename,
    }
