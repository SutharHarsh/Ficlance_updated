"use client";

import React, { useMemo, useRef, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import MessageRenderer from "./MessageRenderer";

export default function ChatArea({
  clientName,
  projectName,
  messages,
  clientTyping,
  message,
  setMessage,
  sendMessage,
  isSending,
  handleDownloadDocument,
  onInfoClick,
  isDetailsOpen,
  onGitHubClick,
}) {
  const chatRef = useRef(null);

  const formatTime = (d) => {
    const date = new Date(d);
    const hrs = date.getHours();
    const mins = date.getMinutes();
    const ampm = hrs >= 12 ? "PM" : "AM";
    return `${hrs % 12 === 0 ? 12 : hrs % 12}:${
      mins < 10 ? "0" + mins : mins
    } ${ampm}`;
  };

  const getInitials = (name) => {
    if (!name) return "AI";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const clientInitials = getInitials(clientName);

  const todayLabel = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date());
  }, []);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, clientTyping]);

  return (
    <div className="flex-1 flex flex-col bg-white min-w-0">
      <ChatHeader
        onInfoClick={onInfoClick}
        isDetailsOpen={isDetailsOpen}
        clientName={clientName}
        projectName={projectName}
      />

      <div
        className="flex-1 p-2 sm:p-4 overflow-y-auto no-scrollbar"
        ref={chatRef}
      >
        <div className="flex items-center justify-center my-4">
          <div className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
            Today, {todayLabel}
          </div>
        </div>

        {messages.map((msg) => (
          <MessageRenderer
            key={msg._id || msg.id}
            msg={msg}
            isUser={msg.sender?.role === "user" || msg.from === "me"}
            clientInitials={clientInitials}
            formatTime={formatTime}
            handleDownloadDocument={handleDownloadDocument}
            projectName={projectName}
          />
        ))}

        {clientTyping && <TypingIndicator clientInitials={clientInitials} />}
      </div>

      <div className="px-2 sm:px-4 py-3 border-t border-gray-200">
        <MessageInput
          message={message}
          setMessage={setMessage}
          onSend={sendMessage}
          isSending={isSending}
          onGitHubClick={onGitHubClick}
        />
      </div>
    </div>
  );
}
