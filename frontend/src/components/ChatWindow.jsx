import { useState, useRef, useEffect } from "react";
import useStream from "../hooks/useStream";
import ChatBubble from "./ChatBubble";
import SourceCard from "./SourceCard";

export default function ChatWindow({ chat, updateChat, selectedDoc }) {
  const messages = chat?.messages ?? [];
  const [input, setInput] = useState("");
  const [sources, setSources] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const { streamQuery } = useStream();
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    setIsStreaming(true);
    setSources([]);

    const newMessages = [
      ...messages,
      { role: "user", content: input },
      { role: "assistant", content: "", streaming: true },
    ];

    updateChat(chat.id, newMessages);
    const currentInput = input;
    setInput("");

    let answer = "";

    await streamQuery(currentInput, selectedDoc, (data) => {
      if (data.type === "token") {
        answer += data.content;
        newMessages[newMessages.length - 1].content = answer;
        newMessages[newMessages.length - 1].streaming = true;
        updateChat(chat.id, [...newMessages]);
      }
      if (data.type === "sources") {
        setSources(data.sources);
      }
    });

    newMessages[newMessages.length - 1].streaming = false;
    updateChat(chat.id, [...newMessages]);
    setIsStreaming(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
    }
  };

  return (
    <div className="chat-window">
      <div className="messages-area">
        {messages.length === 0 && (
          <div className="empty-chat">
            <p>Ask anything about your uploaded documents.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatBubble
            key={i}
            role={msg.role}
            content={msg.content}
            streaming={msg.streaming}
          />
        ))}

        {sources.length > 0 && (
          <div className="sources-section">
            <div className="sources-label">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path
                  d="M2 2h9a1 1 0 011 1v7a1 1 0 01-1 1H2a1 1 0 01-1-1V3a1 1 0 011-1z"
                  stroke="currentColor"
                  strokeWidth="1.1"
                />
                <path
                  d="M3 5h7M3 7.5h5"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
              </svg>
              Sources
            </div>
            <div className="sources-grid">
              {sources.map((s, i) => (
                <SourceCard
                  key={i}
                  source={s}
                  query={
                    messages.findLast?.((m) => m.role === "user")?.content || ""
                  }
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="input-area">
        <div className="input-box">
          <textarea
            ref={textareaRef}
            className="chat-input"
            placeholder="Ask anything about your documents… (Shift+Enter for new line)"
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            onClick={handleSend}
            className={`send-btn ${isStreaming ? "loading" : ""}`}
            disabled={isStreaming || !input.trim()}
            title="Send"
          >
            {isStreaming ? (
              <span className="spinner" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14 2L2 7l5 3 3 5 4-13z" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>
        <p className="input-hint">
          Powered by Llama 3.1 · Runs locally via Ollama
        </p>
      </div>
    </div>
  );
}
