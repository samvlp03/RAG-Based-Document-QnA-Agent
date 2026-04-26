import { useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default function useStream() {
  const streamQuery = useCallback(async (question, docId, onData) => {
    try {
      const res = await fetch(`${API_BASE}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, doc_id: docId }),
      });

      if (!res.ok) {
        onData({
          type: "token",
          content: `\n\n[Error ${res.status}: ${res.statusText}]`,
        });
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          const trimmed = part.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;
          const raw = trimmed.slice(6).trim();
          if (raw === "[DONE]") return;
          try {
            onData(JSON.parse(raw));
          } catch {
            /* skip malformed */
          }
        }
      }
    } catch (err) {
      console.error("streamQuery:", err);
      onData({
        type: "token",
        content: "\n\n[Connection error — is the backend running?]",
      });
    }
  }, []);

  return { streamQuery };
}
