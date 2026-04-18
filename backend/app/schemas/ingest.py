from pydantic import BaseModel

class IngestResponse(BaseModel):
    doc_id: str
    chunks_stored: int