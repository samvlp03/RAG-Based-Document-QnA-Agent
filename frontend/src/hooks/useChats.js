import { useEffect, useState } from "react";

export default function useChats() {
  const [chats, setChats] = useState(() => {
    try {
      const saved = localStorage.getItem("thynk_chats");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeChatId, setActiveChatId] = useState(null);

  useEffect(() => {
    localStorage.setItem("thynk_chats", JSON.stringify(chats));
  }, [chats]);

  /**
   * createChat(docName?)
   * If docName is passed, the chat is titled after the document (without extension).
   * Otherwise it falls back to "HH:MM" timestamp.
   */
  const createChat = (docName = null) => {
    const title = docName
      ? docName.replace(/\.[^/.]+$/, "") // strip file extension e.g. "paper.pdf" → "paper"
      : `Chat ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

    const newChat = { id: Date.now(), title, messages: [] };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    return newChat;
  };

  /**
   * updateChat — also auto-renames the chat from the first user message
   * if the chat still has a time-based default title.
   */
  const updateChat = (id, messages) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== id) return chat;

        let { title } = chat;
        const isDefaultTitle = /^Chat \d{1,2}:\d{2}$/.test(title);
        if (isDefaultTitle) {
          const firstUserMsg = messages.find((m) => m.role === "user");
          if (firstUserMsg) {
            title =
              firstUserMsg.content.length > 44
                ? firstUserMsg.content.slice(0, 44).trimEnd() + "…"
                : firstUserMsg.content;
          }
        }

        return { ...chat, title, messages };
      }),
    );
  };

  const deleteChat = (id) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    setActiveChatId((prev) => (prev === id ? null : prev));
  };

  const renameChat = (id, title) => {
    if (!title.trim()) return;
    setChats((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: title.trim() } : c)),
    );
  };

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;

  return {
    chats,
    activeChat,
    activeChatId,
    setActiveChatId,
    createChat,
    updateChat,
    deleteChat,
    renameChat,
  };
}
