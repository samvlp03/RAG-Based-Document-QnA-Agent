from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from app.core.retriever import get_retriever
from app.core.llm import get_llm
from app.core.prompts import QA_PROMPT
from app.core.vectorstore import get_vectorstore
from app.schemas.query import QueryRequest
import json

router = APIRouter()

# Words that signal the user is asking about document metadata.
# For these queries we always inject the anchor (page-0) chunk so the
# title / authors / abstract are guaranteed to be in the LLM's context.
_METADATA_KEYWORDS = {
    "title", "author", "authors", "abstract", "published", "publication",
    "journal", "conference", "year", "institution", "university", "doi",
    "version", "written by", "paper name", "document name",
}


def _is_metadata_query(question: str) -> bool:
    q = question.lower()
    return any(kw in q for kw in _METADATA_KEYWORDS)


def _fetch_anchor(doc_id: str | None) -> list:
    """Directly fetch is_anchor=True chunks, bypassing MMR entirely."""
    vectorstore = get_vectorstore()
    try:
        where: dict = {"is_anchor": True}
        if doc_id:
            where = {"$and": [{"doc_id": doc_id}, {"is_anchor": True}]}
        results = vectorstore.get(where=where, include=["documents", "metadatas"])
        from langchain_core.documents import Document
        return [
            Document(page_content=text, metadata=meta)
            for text, meta in zip(results["documents"], results["metadatas"])
        ]
    except Exception:
        return []


@router.post("/query")
async def query_documents(request: QueryRequest):
    retriever = get_retriever(
        filter={"doc_id": request.doc_id} if request.doc_id else None
    )
    docs = retriever.get_relevant_documents(request.question)

    # For metadata questions, always prepend the anchor chunk.
    # This guarantees title/authors are in context even if MMR excluded them.
    if _is_metadata_query(request.question):
        anchors = _fetch_anchor(request.doc_id)
        existing = {d.page_content for d in docs}
        for a in anchors:
            if a.page_content not in existing:
                docs = [a] + docs

    # Cap at 5 chunks max to stay within num_ctx=4096 comfortably
    docs = docs[:5]

    sources = [
        {
            "content": d.page_content,
            "page": d.metadata.get("page"),
            "source": d.metadata.get("filename") or d.metadata.get("source"),
        }
        for d in docs
    ]

    context = "\n\n---\n\n".join(d.page_content for d in docs)
    prompt = QA_PROMPT.format(context=context, question=request.question)
    llm = get_llm(streaming=True)

    async def stream():
        yield f"data: {json.dumps({'type': 'sources', 'sources': sources})}\n\n"
        async for chunk in llm.astream(prompt):
            if chunk.content:
                yield f"data: {json.dumps({'type': 'token', 'content': chunk.content})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(stream(), media_type="text/event-stream")