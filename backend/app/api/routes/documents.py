from fastapi import APIRouter
from app.core.vectorstore import get_vectorstore

router = APIRouter()

@router.get("/documents")
def list_documents():
    vectorstore = get_vectorstore()
    data = vectorstore._collection.get(include=["metadatas"])

    docs = {}
    for meta in data["metadatas"]:
        doc_id = meta.get("doc_id")
        if doc_id not in docs:
            docs[doc_id] = {
                "id": doc_id,
                "name": meta.get("filename", "Unnamed")
            }

    return list(docs.values())


@router.delete("/documents/{doc_id}")
def delete_document(doc_id: str):
    vectorstore = get_vectorstore()
    vectorstore._collection.delete(where={"doc_id": doc_id})

    return {"message": f"Deleted document {doc_id}"}