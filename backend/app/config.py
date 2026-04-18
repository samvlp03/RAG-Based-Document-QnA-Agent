from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    chroma_persist_dir: str = "./chroma_db"
    chroma_collection_name: str = "documents"
    llm_model: str = "llama3.1:8b"
    embedding_model: str = "nomic-embed-text"
    chunk_size: int = 800
    chunk_overlap: int = 150
    retriever_k: int = 6
    retriever_strategy: str = "mmr"  # or "similarity"

    class Config:
        env_file = ".env"

settings = Settings()