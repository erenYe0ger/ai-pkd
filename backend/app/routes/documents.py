import uuid
from fastapi import APIRouter, UploadFile, File
import os

router = APIRouter()
UPLOAD_DIR = "data/uploads"


@router.get("/documents")
def list_documents():
    documents = []

    for doc_uid in os.listdir(UPLOAD_DIR):
        doc_folder = os.path.join(UPLOAD_DIR, doc_uid)
        file = os.listdir(doc_folder)[0]
        documents.append({"id": doc_uid, "docName": file})

    return {"documents": documents}
