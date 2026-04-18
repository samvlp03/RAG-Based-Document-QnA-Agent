import HighlightedText from "./HighlightedText";

export default function SourceCard({ source, query }) {
  return (
    <div className="source-card">
      <div className="source-card-body">
        <p className="source-text">
          <HighlightedText text={source.content} highlight={query} />
        </p>
      </div>
      <div className="source-card-footer">
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <path
            d="M1.5 1.5h8a.5.5 0 01.5.5v7a.5.5 0 01-.5.5h-8a.5.5 0 01-.5-.5V2a.5.5 0 01.5-.5z"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            d="M3 4h5M3 6h3"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
        {source.source && (
          <span className="source-name">{source.source.split("/").pop()}</span>
        )}
        {source.page != null && (
          <span className="source-page">Page {source.page}</span>
        )}
      </div>
    </div>
  );
}
