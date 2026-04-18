export default function DocumentList({ docs, onSelect, onDelete }) {
  if (!docs.length) return null;

  return (
    <div className="doc-list">
      <div className="doc-list-header">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path
            d="M2 1.5h7l2.5 2.5V12a.5.5 0 01-.5.5H2a.5.5 0 01-.5-.5V2a.5.5 0 01.5-.5z"
            stroke="currentColor"
            strokeWidth="1.1"
          />
          <path
            d="M9 1.5V4H11.5"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
        </svg>
        <span>Documents ({docs.length})</span>
      </div>

      {docs.map((doc) => (
        <div key={doc.doc_id} className="doc-item">
          <button
            className="doc-name"
            onClick={() => onSelect(doc.doc_id)}
            title="Query this document"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path
                d="M2 1.5h7l2.5 2.5V12a.5.5 0 01-.5.5H2a.5.5 0 01-.5-.5V2a.5.5 0 01.5-.5z"
                stroke="currentColor"
                strokeWidth="1.1"
              />
              <path
                d="M4 5.5h5M4 7.5h3"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </svg>
            <span>{doc.name || doc.doc_id.slice(0, 10) + "…"}</span>
          </button>
          <button
            className="doc-delete"
            onClick={() => onDelete(doc.doc_id)}
            title="Remove"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 2l8 8M10 2L2 10"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
