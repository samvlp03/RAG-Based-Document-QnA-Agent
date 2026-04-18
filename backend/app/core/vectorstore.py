import chromadb
from chromadb.config import Settings as ChromaSettings
from langchain_chroma import Chroma
from app.config import settings
from app.core.embeddings import get_embeddings

_client = None
_vectorstore = None

def get_vectorstore():
    global _client, _vectorstore

    if _vectorstore is None:
        _client = chromadb.PersistentClient(
            path=settings.chroma_persist_dir,
            settings=ChromaSettings(anonymized_telemetry=False)
        )

        _vectorstore = Chroma(
            client=_client,
            collection_name=settings.chroma_collection_name,
            embedding_function=get_embeddings()
        )

    return _vectorstore