from fastapi import APIRouter, UploadFile, File
import os
from app.services.pdf_extractor import extract_text_from_pdf

router = APIRouter()
UPLOAD_DIR = "data/uploads"

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    extracted_text = extract_text_from_pdf(file_path)

    return {
        "filename": file.filename,
        "text_preview": extracted_text[:500]
    }
