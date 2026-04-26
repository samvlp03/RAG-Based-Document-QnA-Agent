import uuid
import pathlib

from langchain_community.document_loaders import (
    PyMuPDFLoader,
    UnstructuredWordDocumentLoader,
    TextLoader,
)
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.config import settings
from app.core.vectorstore import get_vectorstore


LOADERS = {
    ".pdf": PyMuPDFLoader,
    ".docx": UnstructuredWordDocumentLoader,
    ".txt": TextLoader,
}


def ingest_file(file_path: str, metadata: dict = {}) -> dict:
    ext = pathlib.Path(file_path).suffix.lower()
    if ext not in LOADERS:
        raise ValueError(f"Unsupported file type: {ext}")

    loader = LOADERS[ext](file_path)
    raw_docs = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,        # 400
        chunk_overlap=settings.chunk_overlap,   # 80
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    chunks = splitter.split_documents(raw_docs)

    doc_id = str(uuid.uuid4())
    filename = metadata.get("filename", "Unnamed")

    for chunk in chunks:
        chunk.metadata.update({
            **metadata,
            "doc_id": doc_id,
            "filename": filename,
            "is_anchor": False,
        })

    # ── Anchor chunk ────────────────────────────────────────────────────────
    # Page 0 of any paper/doc contains the title, authors, abstract.
    # MMR with any diversity weight can discard page-0 chunks if they're
    # "too similar" to other high-scoring chunks (like the abstract body).
    # We store the raw first page as a dedicated anchor (is_anchor=True) so
    # that metadata queries can always find it via a direct filter lookup
    # in the query route — completely bypassing MMR for those questions.
    anchor_chunks: list[Document] = []
    if raw_docs:
        first_page = raw_docs[0].page_content.strip()
        if first_page:
            anchor_chunks = [Document(
                page_content=first_page,
                metadata={
                    **metadata,
                    "doc_id": doc_id,
                    "filename": filename,
                    "page": 0,
                    "is_anchor": True,
                },
            )]

    vectorstore = get_vectorstore()
    vectorstore.add_documents(anchor_chunks + chunks)

    return {
        "doc_id": doc_id,
        "chunks_stored": len(chunks),
        "filename": filename,
    }