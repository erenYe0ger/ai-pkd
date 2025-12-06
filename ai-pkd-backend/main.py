from fastapi import FastAPI
from app.routes.upload import router as upload_router

app = FastAPI()

@app.get("/")
def root():
    return {"status": "backend running"}

app.include_router(upload_router, prefix = "/api")
