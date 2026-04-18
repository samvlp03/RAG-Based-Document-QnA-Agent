import { useEffect, useState } from "react";

export default function useChats() {
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("chats");
    return saved ? JSON.parse(saved) : [];
  });
  const [activeChatId, setActiveChatId] = useState(null);

  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  const createChat = () => {
    const newChat = {
      id: Date.now(),
      title: "New Chat",
      messages: [],
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const updateChat = (id, messages) => {
    setChats((prev) =>
      prev.map((chat) => (chat.id === id ? { ...chat, messages } : chat)),
    );
  };

  const activeChat = chats.find((c) => c.id === activeChatId);

  return {
    chats,
    activeChat,
    activeChatId,
    setActiveChatId,
    createChat,
    updateChat,
  };
}
