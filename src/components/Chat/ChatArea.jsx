"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
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
  isLoading = false,
  isDeadlinePassed = false,
}) {
  const chatRef = useRef(null);

  const [showSkeleton, setShowSkeleton] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);

  /* 🔥 2 SECOND DELAY HANDLER */
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowSkeleton(false);

        // trigger animation next frame
        requestAnimationFrame(() => setAnimateIn(true));
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setShowSkeleton(true);
      setAnimateIn(false);
    }
  }, [isLoading]);

  /* Auto-scroll */
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, clientTyping]);

  const formatTime = (d) => {
    const date = new Date(d);
    const hrs = date.getHours();
    const mins = date.getMinutes();
    const ampm = hrs >= 12 ? "PM" : "AM";
    return `${hrs % 12 || 12}:${mins < 10 ? "0" + mins : mins} ${ampm}`;
  };

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "AI";

  const clientInitials = getInitials(clientName);

  const todayLabel = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date());
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-white min-w-0">
      <ChatHeader
        onInfoClick={onInfoClick}
        isDetailsOpen={isDetailsOpen}
        clientName={clientName}
        projectName={projectName}
        isLoading={showSkeleton}
      />

      <div
        ref={chatRef}
        className="flex-1 p-2 sm:p-4 overflow-y-auto no-scrollbar"
      >
        <div className="flex items-center justify-center my-4">
          <div className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
            Today, {todayLabel}
          </div>
        </div>

        {/* 🔹 SKELETON (2s guaranteed) */}
        {showSkeleton ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`flex ${i % 2 ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-md ${
                    i % 2 ? "bg-gray-100" : "bg-gray-200"
                  } rounded-2xl px-4 py-3 w-3/4`}
                >
                  <div className="h-4 bg-gray-300 rounded w-2/3 mb-2" />
                  <div className="h-4 bg-gray-300 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* 🔹 ANIMATED MESSAGE CONTENT */
          <div
            className={`
              transition-all duration-300 ease-out
              ${
                animateIn
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
              }
            `}
          >
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
          </div>
        )}

        {clientTyping && <TypingIndicator clientInitials={clientInitials} />}
      </div>

      {isDeadlinePassed && !showSkeleton ? (
        <div className="px-2 h-20 sm:px-4 py-3 border-t border-red-200 bg-red-50 text-red-700 text-lg font-medium flex items-center justify-center gap-2">
          <span className="mt-0.5">⚠️</span>
          <span>
            Deadline has passed. Messaging is disabled for this project.
          </span>
        </div>
      ) : (
        <div className="px-2 sm:px-4 py-3 border-t border-gray-200">
          <MessageInput
            message={message}
            setMessage={setMessage}
            onSend={sendMessage}
            isSending={isSending}
            onGitHubClick={onGitHubClick}
            disabled={showSkeleton || isDeadlinePassed}
          />
        </div>
      )}
    </div>
  );
}
