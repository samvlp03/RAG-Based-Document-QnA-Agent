const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default function useStream() {
  const streamQuery = async (question, docId, onData) => {
    const response = await fetch(`${API_BASE}/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, doc_id: docId }),
    });

    if (!response.ok) {
      onData({
        type: "token",
        content: `\n\n[Error ${response.status}: ${response.statusText}]`,
      });
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n\n");
      buffer = lines.pop() ?? ""; // keep last incomplete chunk

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data: ")) continue;

        const jsonStr = trimmed.slice(6).trim();
        if (jsonStr === "[DONE]") return;

        try {
          onData(JSON.parse(jsonStr));
        } catch {
          // skip malformed lines
        }
      }
    }
  };

  return { streamQuery };
}
