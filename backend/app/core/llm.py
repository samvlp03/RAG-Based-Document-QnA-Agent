from langchain_ollama import ChatOllama  # NOT langchain_community — that import path is deprecated and slower
from app.config import settings


def get_llm(streaming: bool = False) -> ChatOllama:
    return ChatOllama(
        model=settings.llm_model,
        temperature=0,
        streaming=streaming,
        keep_alive=settings.llm_keep_alive,  # keeps model hot in VRAM; prevents 15s cold-start per query
        num_ctx=4096,                          # explicit context window for llama3.1:8b
    )