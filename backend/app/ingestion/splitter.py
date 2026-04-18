from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.config import settings

def get_splitter():
    return RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap
    )