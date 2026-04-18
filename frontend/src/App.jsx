import { useState } from "react";
import useChats from "./hooks/useChats";
import useDocuments from "./hooks/useDocuments";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import FileUpload from "./components/FileUpload";
import DocumentList from "./components/DocumentList";
import "./index.css";

export default function App() {
  const {
    chats,
    activeChat,
    activeChatId,
    setActiveChatId,
    createChat,
    updateChat,
  } = useChats();
  const { docs: rawDocs, uploadDoc, deleteDoc } = useDocuments();
  const docs = rawDocs ?? [];
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      <div className="app-layout">
        <Sidebar
          chats={chats}
          activeId={activeChatId}
          setActive={setActiveChatId}
          createChat={createChat}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
        />

        <main
          className={`main-content ${!sidebarOpen ? "sidebar-collapsed" : ""}`}
        >
          {!activeChat ? (
            <div className="landing">
              <div className="landing-inner">
                <div className="logo-mark">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <rect
                      width="48"
                      height="48"
                      rx="14"
                      fill="url(#logoGrad)"
                    />
                    <path
                      d="M14 34L20 18L26 28L30 22L34 34"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="34"
                      cy="16"
                      r="4"
                      fill="white"
                      fillOpacity="0.9"
                    />
                    <defs>
                      <linearGradient
                        id="logoGrad"
                        x1="0"
                        y1="0"
                        x2="48"
                        y2="48"
                      >
                        <stop stopColor="#6366f1" />
                        <stop offset="1" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <h1 className="landing-title">CortexDocs</h1>
                <p className="landing-sub">
                  Your documents, intelligently answered.
                </p>

                <div className="upload-zone">
                  <FileUpload onUpload={uploadDoc} />
                </div>

                {docs.length > 0 && (
                  <div className="doc-list-wrap">
                    <DocumentList
                      docs={docs}
                      onSelect={(id) => {
                        setSelectedDoc(id);
                        createChat();
                      }}
                      onDelete={deleteDoc}
                    />
                  </div>
                )}

                <div className="feature-pills">
                  <span className="pill">⚡ Llama 3.1 powered</span>
                  <span className="pill">🔒 Runs locally</span>
                  <span className="pill">📄 PDF · DOCX · TXT</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="chat-layout">
              <div className="chat-topbar">
                <div className="chat-topbar-left">
                  <button
                    className="icon-btn"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    title="Toggle sidebar"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <rect
                        x="2"
                        y="4"
                        width="14"
                        height="1.5"
                        rx="0.75"
                        fill="currentColor"
                      />
                      <rect
                        x="2"
                        y="8.25"
                        width="14"
                        height="1.5"
                        rx="0.75"
                        fill="currentColor"
                      />
                      <rect
                        x="2"
                        y="12.5"
                        width="14"
                        height="1.5"
                        rx="0.75"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                  <div className="chat-doc-badge">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M3 2h6l3 3v8a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                      <path
                        d="M9 2v3h3"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {selectedDoc
                      ? docs.find((d) => d.doc_id === selectedDoc)?.name ||
                        "Document"
                      : "All documents"}
                  </div>
                </div>
                <div className="chat-topbar-right">
                  <button
                    className="icon-btn"
                    onClick={() => {
                      setSelectedDoc(null);
                      setActiveChatId(null);
                    }}
                    title="Back to home"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M7 3L2 8l5 5M2 8h12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <ChatWindow
                chat={activeChat}
                updateChat={updateChat}
                selectedDoc={selectedDoc}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
