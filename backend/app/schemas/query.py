from pydantic import BaseModel
from typing import List, Optional

class QueryRequest(BaseModel):
    question: str
    doc_id: Optional[str] = None

class SourceChunk(BaseModel):
    content: str
    page: Optional[int]
    source: Optional[str]

class QueryResponse(BaseModel):
    answer: str
    sources: List[SourceChunk]