import { useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatBubble({ role, content, streaming }) {
  const cursorRef = useRef(null);

  return (
    <div className={`bubble-wrap ${role}`}>
      {role === "assistant" && (
        <div className="avatar assistant-avatar">
          <svg width="14" height="14" viewBox="0 0 48 48" fill="none">
            <path
              d="M14 34L20 18L26 28L30 22L34 34"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="34" cy="16" r="4" fill="white" fillOpacity="0.9" />
          </svg>
        </div>
      )}

      <div className={`bubble ${role}`}>
        {role === "assistant" ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        ) : (
          content
        )}

        {streaming && <span className="cursor-blink" ref={cursorRef} />}
      </div>

      {role === "user" && (
        <div className="avatar user-avatar">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle
              cx="6.5"
              cy="4"
              r="2.5"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M1 12c0-3.038 2.462-5.5 5.5-5.5S12 8.962 12 12"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
