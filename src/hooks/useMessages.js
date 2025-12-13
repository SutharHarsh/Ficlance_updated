import { useState, useEffect } from "react";

export function useMessages(initialMessages, conversationId, session) {
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [clientTyping, setClientTyping] = useState(false);

  const sortMessagesByDate = (list = []) => {
    return [...list].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      if (timeA !== timeB) return timeA - timeB;
      return String(a._id || "").localeCompare(String(b._id || ""));
    });
  };

  useEffect(() => {
    if (initialMessages.length > 0) {
      const isPlaceholder = (m) =>
        m.type === "document_placeholder" ||
        (m.type !== "document" && 
         typeof m.content === "string" && 
         m.content.trim().toLowerCase() === "project requirements document");

      const messagesToShow = sortMessagesByDate(initialMessages).filter(
        (m) => !isPlaceholder(m)
      );
      setMessages(messagesToShow);
    }
  }, [initialMessages]);

  const sendMessage = async (message, clientName) => {
    const trimmed = message?.trim();
    if (!trimmed) return;

    setIsSending(true);

    const userTimestamp = new Date();
    const userTimestampISO = userTimestamp.toISOString();

    const tempUserMsg = {
      _id: Date.now().toString(),
      content: trimmed,
      sender: { role: "user", userId: session?.user?.email },
      createdAt: userTimestampISO,
      from: "me",
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setClientTyping(true);

    try {
      const aiResponse = await fetch("/api/proxy/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Question: trimmed,
          client_name: clientName,
          conversationId: conversationId,
        }),
      });

      if (!aiResponse.ok) throw new Error("AI API Failed");
      const aiData = await aiResponse.json();
      const aiReplyContent =
        aiData.response || aiData.message || JSON.stringify(aiData);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const aiTimestamp = new Date();
      const aiTimestampISO = aiTimestamp.toISOString();

      const tempAiMsg = {
        _id: (Date.now() + 1).toString(),
        content: aiReplyContent,
        sender: { role: "assistant", userId: "ai-assistant" },
        createdAt: aiTimestampISO,
      };
      setMessages((prev) => [...prev, tempAiMsg]);

      fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conversationId,
          content: trimmed,
          type: "text",
          userId: session?.user?.email,
          role: "user",
          skipAI: true,
          createdAt: userTimestampISO,
        }),
      });

      fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conversationId,
          content: aiReplyContent,
          type: "text",
          userId: "ai-assistant",
          role: "assistant",
          skipAI: true,
          createdAt: aiTimestampISO,
        }),
      });

      setClientTyping(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => prev.slice(0, -2));
      setClientTyping(false);
    } finally {
      setIsSending(false);
    }
  };

  return {
    messages,
    setMessages,
    isSending,
    clientTyping,
    sendMessage,
  };
}
