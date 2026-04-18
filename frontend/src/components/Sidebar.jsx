export default function Sidebar({
  chats: rawChats,
  activeId,
  setActive,
  createChat,
  darkMode,
  setDarkMode,
  open,
  setOpen,
}) {
  const chats = rawChats ?? [];
  return (
    <aside className={`sidebar ${open ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="14" fill="url(#sLogoGrad)" />
            <path
              d="M14 34L20 18L26 28L30 22L34 34"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="34" cy="16" r="4" fill="white" fillOpacity="0.9" />
            <defs>
              <linearGradient id="sLogoGrad" x1="0" y1="0" x2="48" y2="48">
                <stop stopColor="#6366f1" />
                <stop offset="1" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          {open && <span className="sidebar-brand">CortexDocs</span>}
        </div>
        <button
          className="icon-btn collapse-btn"
          onClick={() => setOpen(!open)}
          title="Collapse"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d={open ? "M10 3L5 8l5 5" : "M6 3l5 5-5 5"}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <button className="new-chat-btn" onClick={createChat} title="New chat">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path
            d="M7.5 2v11M2 7.5h11"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        {open && <span>New Chat</span>}
      </button>

      {open && chats.length > 0 && (
        <div className="sidebar-section-label">Recent</div>
      )}

      <nav className="sidebar-nav">
        {chats.map((chat) => (
          <button
            key={chat.id}
            className={`chat-item ${activeId === chat.id ? "active" : ""}`}
            onClick={() => setActive(chat.id)}
            title={chat.title}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 2h10a1 1 0 011 1v6a1 1 0 01-1 1H8l-3 2V10H2a1 1 0 01-1-1V3a1 1 0 011-1z"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
            {open && (
              <span className="chat-item-title">
                {chat.title || "Untitled chat"}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle
                cx="8"
                cy="8"
                r="3.5"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <path
                d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.1 3.1l1.06 1.06M11.84 11.84l1.06 1.06M3.1 12.9l1.06-1.06M11.84 4.16l1.06-1.06"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M13.5 10.5A6 6 0 015.5 2.5a6 6 0 108 8z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          )}
          {open && <span>{darkMode ? "Light mode" : "Dark mode"}</span>}
        </button>
      </div>
    </aside>
  );
}
