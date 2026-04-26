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
    supabase_url: str = "https://qpcevhshmhivcnyavery.supabase.co"
    supabase_anon_key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwY2V2aHNobWhpdmNueWF2ZXJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxOTM5MTMsImV4cCI6MjA5Mjc2OTkxM30.zcZcbTM-33dIozO343akAwc28bLEQMSRPMCJmHuQiM0"
    supabase_service_key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwY2V2aHNobWhpdmNueWF2ZXJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzE5MzkxMywiZXhwIjoyMDkyNzY5OTEzfQ.rHQnw11ktDvUeOSVzUEVSsw_SkCTBJIVIcqCXwhycdE"

    class Config:
        env_file = ".env.example"


settings = Settings()