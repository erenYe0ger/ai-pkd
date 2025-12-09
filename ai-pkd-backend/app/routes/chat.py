from fastapi import APIRouter
from pydantic import BaseModel
from app.services.embeddings import get_embedding
from app.services.vectorstore import query_embeddings
from app.services.chat_model import generate_answer

router = APIRouter()

class Query(BaseModel):
    question: str

@router.post("/chat")
def chat(query: Query) -> dict:
    query_embedding = get_embedding(query.question)

    # query_embeddings(query_embedding) returns a dict:
    # {"ids": [[...], [...], ...], "documents": [[...], [...], ...], "embeddings": [[...], [...], ...] }

    contexts = query_embeddings(query_embedding)["documents"][0]
    merged_context = "\n\n".join(contexts)

    chat_response = generate_answer(query.question, merged_context)

    return {"response": chat_response, "context": contexts}