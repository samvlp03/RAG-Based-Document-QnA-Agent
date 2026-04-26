from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # ChromaDB
    chroma_persist_dir: str = "./chroma_db"
    chroma_collection_name: str = "documents"

    # LLM — keep_alive stops Ollama unloading model from VRAM between requests
    llm_model: str = "llama3.1:8b"
    llm_keep_alive: str = "10m"

    # Embeddings
    embedding_model: str = "nomic-embed-text"

    # Chunking — 400/80 is the sweet spot: precise retrieval, fewer tokens per call
    chunk_size: int = 400
    chunk_overlap: int = 80

    # Retrieval
    retriever_k: int = 4            # final chunks returned to LLM
    retriever_fetch_k: int = 15     # candidates before MMR rerank (was k*6 = 36)
    retriever_lambda_mult: float = 0.75  # 1.0=pure relevance, 0.0=pure diversity (was 0.5)
    retriever_strategy: str = "mmr"

    # Supabase — leave blank if not using auth
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_key: str = ""

    class Config:
        env_file = ".env"


settings = Settings()