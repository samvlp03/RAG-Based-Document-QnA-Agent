# backend/eval/eval.py

from ragas import evaluate
from datasets import Dataset
from backend.core.retriever import get_retriever
from langchain_openai import ChatOpenAI
from backend.core.prompts import QA_PROMPT

def generate_answer(question, doc_id):
    retriever = get_retriever(filter={"doc_id": doc_id})

    docs = retriever.get_relevant_documents(question)
    context = "\n\n".join(d.page_content for d in docs)

    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    response = llm.invoke(QA_PROMPT.format(context=context, question=question))

    return {
        "answer": response.content,
        "contexts": [d.page_content for d in docs]
    }

def run_eval(dataset_path):
    import json

    with open(dataset_path) as f:
        data = json.load(f)

    results = []
    for item in data:
        out = generate_answer(item["question"], item["doc_id"])

        results.append({
            "question": item["question"],
            "answer": out["answer"],
            "contexts": out["contexts"],
            "ground_truth": item["ground_truth"]
        })

    dataset = Dataset.from_list(results)
    scores = evaluate(dataset)

    print(scores)

if __name__ == "__main__":
    run_eval("dataset.json")