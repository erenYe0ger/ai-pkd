from fastapi import FastAPI
from app.routes.upload import router as upload_router
from app.routes.chat import router as chat_router

app = FastAPI()

@app.get("/")
def root():
    return {"status": "backend running"}

app.include_router(upload_router, prefix = "/api")
app.include_router(chat_router, prefix = "/api")