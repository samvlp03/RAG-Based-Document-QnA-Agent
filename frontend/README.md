# CortexDocs — RAG-Powered Document Q&A

<p align="center">
  <img src="https://img.shields.io/badge/LLM-Llama%203.1%3A8b-6366f1?style=flat-square" />
  <img src="https://img.shields.io/badge/Framework-FastAPI-009688?style=flat-square" />
  <img src="https://img.shields.io/badge/Vector%20DB-ChromaDB-teal?style=flat-square" />
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=flat-square" />
  <img src="https://img.shields.io/badge/Runs-100%25%20Locally-brightgreen?style=flat-square" />
</p>

> Upload a PDF, DOCX, or TXT file — then ask questions about it in natural language. Answers are grounded in your document, with source chunks cited. Everything runs locally using Ollama.

---

## Features

- **Fully local inference** via [Ollama](https://ollama.com) running Llama 3.1:8b — no API keys, no data sent to the cloud
- **RAG pipeline** using LangChain + ChromaDB for accurate, grounded answers
- **Streaming responses** — tokens appear in real time as the model generates
- **Source attribution** — every answer shows the exact document chunks it was derived from
- **Multi-document support** — upload multiple files and query all or a single one
- **Dark / Light mode** toggle
- **PDF, DOCX, TXT** support via PyMuPDF and Unstructured

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         React Frontend                       │
│   FileUpload → DocumentList → ChatWindow → SourceCards      │
└────────────────────────┬──────────────────────┬─────────────┘
                         │ POST /ingest          │ POST /query (SSE)
┌────────────────────────▼──────────────────────▼─────────────┐
│                        FastAPI Backend                        │
│                                                              │
│  Ingestion pipeline:          Query pipeline:                │
│  File → Loader                Query → Embedder               │
│       → TextSplitter               → ChromaDB (top-k MMR)   │
│       → OpenAIEmbeddings           → LLM (Llama via Ollama) │
│       → ChromaDB (persist)         → Streaming SSE response  │
└──────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
rag-qa-system/
├── backend/
│   ├── app/
│   │   ├── main.py               # FastAPI entry point
│   │   ├── config.py             # Pydantic settings
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── ingest.py     # POST /ingest
│   │   │       ├── query.py      # POST /query (streaming)
│   │   │       └── documents.py  # GET/DELETE /documents
│   │   ├── core/
│   │   │   ├── embeddings.py     # Embedding model wrapper
│   │   │   ├── vectorstore.py    # ChromaDB singleton
│   │   │   ├── retriever.py      # MMR retrieval
│   │   │   ├── llm.py            # Ollama LLM client
│   │   │   └── prompts.py        # Prompt templates
│   │   ├── ingestion/
│   │   │   ├── loader.py         # File → LangChain Documents
│   │   │   ├── splitter.py       # RecursiveCharacterSplitter
│   │   │   └── pipeline.py       # Full ingest orchestration
│   │   └── schemas/
│   │       ├── ingest.py
│   │       └── query.py
│   ├── chroma_db/                # Persisted vectors (git-ignored)
│   ├── uploads/                  # Temp file storage (git-ignored)
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── App.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── ChatBubble.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   ├── DocumentList.jsx
│   │   │   ├── SourceCard.jsx
│   │   │   └── HighlightedText.jsx
│   │   ├── hooks/
│   │   │   ├── useChats.js
│   │   │   ├── useDocuments.js
│   │   │   └── useStream.js
│   │   ├── api/
│   │   │   └── client.js
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml
└── README.md
```

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Python | 3.10+ | [python.org](https://python.org) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| Ollama | Latest | [ollama.com](https://ollama.com) |
| Git | Any | [git-scm.com](https://git-scm.com) |

---

## Setup & Running

### 1. Clone the repository

```bash
git clone https://github.com/your-username/rag-qa-system.git
cd rag-qa-system
```

### 2. Start Ollama and pull the model

```bash
# Install Ollama from https://ollama.com, then:
ollama pull llama3.1:8b

# Verify it's running
ollama list
```

### 3. Backend setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment variables
cp .env.example .env
```

Edit `.env`:

```env
# Ollama runs locally — no API key needed
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b

# Embedding model (uses nomic-embed-text via Ollama, or OpenAI)
EMBEDDING_MODEL=nomic-embed-text

# ChromaDB
CHROMA_PERSIST_DIR=./chroma_db
CHROMA_COLLECTION_NAME=documents

# Chunking
CHUNK_SIZE=512
CHUNK_OVERLAP=64

# Retrieval
RETRIEVER_K=5
RETRIEVER_STRATEGY=mmr
```

Pull the embedding model:

```bash
ollama pull nomic-embed-text
```

Start the backend:

```bash
uvicorn app.main:app --reload --port 8000
```

The API is now available at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

### 4. Frontend setup

```bash
cd ../frontend

npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Usage

### Basic flow

1. **Upload a document** — drag & drop or click the upload zone on the landing page. Supports PDF, DOCX, and TXT.
2. **Wait for processing** — the file is chunked, embedded, and stored in ChromaDB (typically 5–20 seconds for a 50-page PDF).
3. **Ask a question** — type in the chat input and press Enter or click Send.
4. **Review sources** — each answer displays the retrieved document chunks it was based on, with the page number.

### Scoped queries

Click a specific document in the document list to scope all queries to that file only. This uses ChromaDB's metadata filter under the hood:

```python
retriever = vectorstore.as_retriever(
    search_kwargs={"filter": {"doc_id": selected_doc_id}}
)
```

### Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Send message |
| `Shift + Enter` | New line in input |

---

## API Reference

### `POST /ingest`

Upload and index a document.

```bash
curl -X POST http://localhost:8000/ingest \
  -F "file=@your_document.pdf"
```

Response:
```json
{
  "doc_id": "a3f1c2d4-...",
  "chunks_stored": 47,
  "filename": "your_document.pdf"
}
```

### `POST /query`

Query the indexed documents. Returns a **Server-Sent Events** (SSE) stream.

```bash
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"question": "What are the main findings?", "doc_id": null}'
```

SSE events emitted:
```
data: {"type": "sources", "sources": [...]}
data: {"type": "token", "content": "The"}
data: {"type": "token", "content": " main"}
...
data: [DONE]
```

### `GET /documents`

List all indexed documents.

### `DELETE /documents/{doc_id}`

Remove a document and its embeddings from ChromaDB.

---

## Docker (optional)

```bash
docker-compose up --build
```

This starts the backend on port `8000`. You still need Ollama running on the host — the backend connects to `host.docker.internal:11434`.

---

## Retrieval Strategy

This project uses **MMR (Maximal Marginal Relevance)** retrieval instead of plain cosine similarity. MMR balances relevance with diversity — it avoids returning five near-identical chunks from the same paragraph and instead returns chunks that collectively cover more of the relevant information.

```python
vectorstore.as_retriever(
    search_type="mmr",
    search_kwargs={
        "k": 5,
        "fetch_k": 20,       # Candidates to consider
        "lambda_mult": 0.7   # 0 = max diversity, 1 = max relevance
    }
)
```

---

## Embedding Model

By default this project uses `nomic-embed-text` via Ollama — completely free and local. Alternatively, swap to OpenAI embeddings by changing `.env`:

```env
EMBEDDING_PROVIDER=openai
OPENAI_API_KEY=sk-...
EMBEDDING_MODEL=text-embedding-3-small
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| LLM | Llama 3.1:8b via Ollama |
| Embedding | nomic-embed-text via Ollama |
| Orchestration | LangChain 0.2 |
| Vector store | ChromaDB (persistent) |
| Backend | FastAPI + Uvicorn |
| Frontend | React 18 + Vite |
| Styling | Custom CSS (no UI library) |
| File parsing | PyMuPDF, Unstructured |

---

## Roadmap

- [ ] Conversational memory (multi-turn context)
- [ ] RAGAS evaluation harness
- [ ] Support for web URLs as documents
- [ ] Re-ranking with cross-encoder
- [ ] Export chat history as PDF

---

## License

MIT