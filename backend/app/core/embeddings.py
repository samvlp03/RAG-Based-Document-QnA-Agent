from langchain_ollama import OllamaEmbeddings
from app.config import settings

def get_embeddings():
    return OllamaEmbeddings(
        model=settings.embedding_model
    )