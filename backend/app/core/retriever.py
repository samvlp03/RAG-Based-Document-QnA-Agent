from langchain_chroma import Chroma
from app.core.embeddings import get_embeddings
from app.config import settings
from app.core.vectorstore import get_vectorstore

def get_retriever(filter: dict | None = None):
    vectorstore = get_vectorstore()

    base_kwargs = {"k": settings.retriever_k}
    if filter:
        base_kwargs["filter"] = filter

    if settings.retriever_strategy == "mmr":
        return vectorstore.as_retriever(
            search_type="mmr",
            search_kwargs={
                **base_kwargs,
                "fetch_k": settings.retriever_k * 6,
                "lambda_mult": 0.5
            }
        )

    return vectorstore.as_retriever(
        search_type="similarity_score_threshold",
        search_kwargs={
            
            **base_kwargs,
            "score_threshold": 0.5
        }
    )