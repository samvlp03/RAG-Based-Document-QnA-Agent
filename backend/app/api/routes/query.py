from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.core.retriever import get_retriever
from app.core.llm import get_llm
from app.core.prompts import QA_PROMPT
from app.schemas.query import QueryRequest
import json

router = APIRouter()

@router.post("/query")
async def query_documents(request: QueryRequest):
    retriever = get_retriever(
        filter={"doc_id": request.doc_id} if request.doc_id else None
    )

    docs = retriever.invoke(request.question)
    docs = sorted(docs, key=lambda d: d.metadata.get("page", 0))

    sources = [
        {
            "content": d.page_content,
            "page": d.metadata.get("page"),
            "source": d.metadata.get("source"),
        }
        for d in docs
    ]

    context = "\n\n---\n\n".join(d.page_content for d in docs)

    llm = get_llm(streaming=True)

    prompt = QA_PROMPT.format(
        context=context,
        question=request.question
    )

    async def stream():
        # send sources first
        yield f"data: {json.dumps({'type': 'sources', 'sources': sources})}\n\n"

        async for chunk in llm.astream(prompt):
            if chunk.content:
                yield f"data: {json.dumps({'type': 'token', 'content': chunk.content})}\n\n"

        yield "data: [DONE]\n\n"

    return StreamingResponse(stream(), media_type="text/event-stream")