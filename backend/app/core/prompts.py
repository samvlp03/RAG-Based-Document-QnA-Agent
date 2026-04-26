from langchain_core.prompts import PromptTemplate

# What was wrong with the old prompt:
#   1. "You MUST extract the exact title" was injected on EVERY query, even
#      "explain the methodology" — Llama 3.1 tried to satisfy both the
#      title-extraction instruction AND the actual question simultaneously,
#      producing confused, incomplete answers.
#   2. Contradictory rules: "be confident" + "don't say I don't know" +
#      "don't guess" — the model oscillated between these, causing hallucinations.
#   3. Long prompt = more tokens processed before generation starts = slower TTFT.
#
# This version is short, unambiguous, and strictly grounding-focused.

QA_PROMPT = PromptTemplate.from_template(
    "You are a precise document assistant. "
    "Answer the question using ONLY the text in the context below. "
    "Use the exact wording from the document wherever possible. "
    "If the answer is clearly present, state it directly and concisely. "
    "If it is genuinely not in the context, say: "
    "'This information is not present in the provided document.' "
    "Do not guess, infer, or add anything beyond what is written.\n\n"
    "Context:\n{context}\n\n"
    "Question: {question}\n\n"
    "Answer:"
)