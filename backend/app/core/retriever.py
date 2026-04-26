from app.config import settings
from app.core.vectorstore import get_vectorstore


def get_retriever(filter: dict | None = None):
    vectorstore = get_vectorstore()

    search_kwargs: dict = {
        "k": settings.retriever_k,
        "fetch_k": settings.retriever_fetch_k,
        "lambda_mult": settings.retriever_lambda_mult,
    }
    if filter:
        search_kwargs["filter"] = filter

    # Always MMR, but lambda_mult=0.75 keeps it relevance-biased.
    # The old value of 0.5 was the root cause of "title not found":
    # MMR was actively penalising page-0 chunks (which contain the title)
    # because they were too semantically similar to abstract chunks.
    return vectorstore.as_retriever(
        search_type="mmr",
        search_kwargs=search_kwargs,
    )