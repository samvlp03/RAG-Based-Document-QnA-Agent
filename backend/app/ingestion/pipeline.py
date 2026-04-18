from langchain_community.document_loaders import PyMuPDFLoader, UnstructuredWordDocumentLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.core.embeddings import get_embeddings
from langchain_chroma import Chroma
from app.config import settings
import uuid, pathlib
from app.core.vectorstore import get_vectorstore



LOADERS = {
    ".pdf":  PyMuPDFLoader,
    ".docx": UnstructuredWordDocumentLoader,
    ".txt":  lambda p: __import__('langchain_community.document_loaders', fromlist=['TextLoader']).TextLoader(p),
}

def ingest_file(file_path: str, metadata: dict = {}) -> dict:
    ext = pathlib.Path(file_path).suffix.lower()
    if ext not in LOADERS:
        raise ValueError(f"Unsupported file type: {ext}")

    loader = LOADERS[ext](file_path)
    docs = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap,
        separators=["\n\n", "\n", ".", " ", ""],
    )
    chunks = splitter.split_documents(docs)

    # Attach file-level metadata to every chunk
    doc_id = str(uuid.uuid4())
    for chunk in chunks:
        chunk.metadata.update({
    **metadata,
    "doc_id": doc_id,
    "filename": metadata.get("filename", "Unnamed")
})

    embeddings = get_embeddings()
    
    vectorstore = get_vectorstore()
    vectorstore.add_documents(chunks)

    return {"doc_id": doc_id, "chunks_stored": len(chunks)}