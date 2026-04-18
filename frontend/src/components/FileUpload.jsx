import { useState, useRef } from "react";

export default function FileUpload({ onUpload }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState(null);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setFileName(file.name);
    setUploading(true);
    await onUpload(file);
    setUploading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      className={`upload-drop ${dragging ? "dragging" : ""} ${uploading ? "uploading" : ""}`}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files[0])}
      />

      <div className="upload-icon">
        {uploading ? (
          <span className="spinner large" />
        ) : (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 22V10M16 10l-5 5M16 10l5 5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 24h20"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>

      <p className="upload-title">
        {uploading
          ? `Uploading ${fileName}…`
          : fileName
            ? `Uploaded: ${fileName}`
            : "Drop your document here"}
      </p>
      <p className="upload-sub">
        {uploading
          ? "Processing and embedding…"
          : "PDF, DOCX, or TXT · Click or drag"}
      </p>
    </div>
  );
}
