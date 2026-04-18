from fastapi import FastAPI
from app.api.routes import ingest, query, documents
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="RAG QA System")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev (later restrict)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingest.router, prefix="/api")
app.include_router(query.router, prefix="/api")
app.include_router(documents.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "RAG QA API is running"}