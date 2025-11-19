// components/Chat/ChatWindow.jsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { FaPlay } from "react-icons/fa";

/**
 * ChatWindow props:
 * - chatId: string (conversation id)
 * - chatMeta: { title, subtitle, ... }
 */

const SAMPLE_HISTORY = {
  "website-redesign": [
    { id: 1, from: "client", text: "Hi John, I hope you're doing well! Could you share the latest mockups for the homepage?", time: "10:30 AM" },
    { id: 2, from: "me", text: "Hello Emma! I'm doing great, thanks. I've been working on the homepage mockups and they're almost ready.", time: "10:35 AM", status: "Seen" },
  ],
  "mobile-app": [
    { id: 1, from: "client", text: "The timeline looks good. Let's proceed with the next phase.", time: "Yesterday" }
  ],
  // fallback
  default: [
    { id: 1, from: "client", text: "Welcome to the project chat. Start by saying hi!", time: "Now" }
  ]
};

export default function ChatWindow({ chatId, chatMeta = {} }) {
  const [messages, setMessages] = useState(() => SAMPLE_HISTORY[chatId] ? [...SAMPLE_HISTORY[chatId]] : [...(SAMPLE_HISTORY.default)]);
  const [typing, setTyping] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [quickReplies] = useState([
    "I'll send the mockups today",
    "Can we schedule a call?",
    "I need more information",
    "Let me check and get back to you"
  ]);
  const inputRef = useRef(null);
  const messagesRef = useRef(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    // when chatId changes, load history (simulate fetching)
    setMessages(SAMPLE_HISTORY[chatId] ? [...SAMPLE_HISTORY[chatId]] : [...SAMPLE_HISTORY.default]);
    // auto-scroll
    setTimeout(() => scrollToBottom(), 50);
  }, [chatId]);

  const scrollToBottom = () => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (d = new Date()) => {
    const hrs = d.getHours();
    const mins = d.getMinutes();
    const ampm = hrs >= 12 ? "PM" : "AM";
    return `${hrs % 12 === 0 ? 12 : hrs % 12}:${mins < 10 ? "0"+mins : mins} ${ampm}`;
  };

  const sendMessage = (text) => {
    const trimmed = text?.trim();
    if (!trimmed) return;
    setIsSending(true);
    const newMsg = { id: Date.now(), from: "me", text: trimmed, time: formatTime(new Date()), status: "Sent" };
    setMessages(prev => [...prev, newMsg]);
    // clear input
    if (inputRef.current) {
      inputRef.current.textContent = "";
      inputRef.current.setAttribute("data-empty", "true");
      inputRef.current.focus();
    }
    setIsSending(false);
    // simulate typing + response
    setTimeout(() => {
      setTyping(true);
      scrollToBottom();
      setTimeout(() => {
        setTyping(false);
        simulateResponse();
      }, 2000 + Math.random() * 2000);
    }, 600);
  };

  const simulateResponse = () => {
    const responses = [
      "Thanks for the update! Looking forward to seeing the final mockups.",
      "That sounds great! When do you think you'll have the complete design ready?",
      "I appreciate your quick response. Could we schedule a call tomorrow to discuss the details?",
      "The progress looks good. I have a few questions about the mobile responsiveness though.",
      "Perfect! I'll share this with the team and get back to you with their feedback.",
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const resp = { id: Date.now() + 1, from: "client", text: randomResponse, time: formatTime(new Date()) };
    setMessages(prev => [...prev, resp]);
  };

  const onSendClick = () => {
    if (inputRef.current) {
      const text = inputRef.current.textContent || "";
      sendMessage(text);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendClick();
    }
  };

  // emoji handling: insert emoji at end
  const insertEmoji = (emoji) => {
    if (!inputRef.current) return;
    inputRef.current.textContent += emoji;
    inputRef.current.removeAttribute("data-empty");
    // place caret at end
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(inputRef.current);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
    inputRef.current.focus();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
            <span className="text-green-600 font-medium">{(chatMeta.title || "Chat").split(" ").map(w=>w[0]).slice(0,2).join("")}</span>
          </div>
          <div>
            <h2 className="font-medium text-gray-900">{chatMeta.title || "Conversation"}</h2>
            <div className="flex items-center text-sm">
              <span className="text-green-500 mr-2">●</span>
              <span className="text-gray-600">{chatMeta.subtitle || "Client"} • Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600">📞</button>
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600">🎥</button>
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600">ℹ️</button>
        </div>
      </div>

      {/* Messages container */}
      <div ref={messagesRef} id="chat-messages" className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {/* Date separator sample */}
        <div className="flex items-center justify-center my-4">
          <div className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">Today</div>
        </div>

        {messages.map((m) => (
          <div key={m.id} className={`flex mb-4 chat-message ${m.from === "me" ? "justify-end" : ""}`}>
            {m.from !== "me" && (
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 self-start mt-1 flex-shrink-0">
                <span className="text-green-600 font-medium text-xs">{(chatMeta.title || "Client").split(" ").map(w=>w[0]).slice(0,2).join("")}</span>
              </div>
            )}
            <div className={`max-w-[75%] ${m.from === "me" ? "text-right" : ""}`}>
              <div className={`${m.from === "me" ? "bg-primary text-white rounded-lg rounded-tr-none" : "bg-gray-100 rounded-lg rounded-tl-none"} p-3 mb-1`}>
                <p className={`${m.from === "me" ? "text-white" : "text-gray-800"}`}>{m.text}</p>
              </div>
              <div className={`flex items-center ${m.from === "me" ? "justify-end" : ""} text-xs text-gray-500`}>
                <span>{m.time}</span>
                {m.status && <><span className="mx-2">•</span><span>{m.status}</span></>}
              </div>
            </div>

            {m.from === "me" && (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center ml-3 self-start mt-1 flex-shrink-0">
                <span className="text-primary font-medium text-xs">JD</span>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div className="flex mb-4 chat-message">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 self-start mt-1 flex-shrink-0">
              <span className="text-green-600 font-medium text-xs">{(chatMeta.title || "C").split(" ").map(w=>w[0]).slice(0,2).join("")}</span>
            </div>
            <div className="bg-gray-100 rounded-lg rounded-tl-none py-2 px-4 inline-block">
              <div className="typing-indicator flex">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick replies + input */}
      <div className="px-4 py-3 border-t border-gray-200">
        <div className="flex space-x-2 mb-3 overflow-x-auto pb-1">
          {quickReplies.map((q) => (
            <button key={q} onClick={() => {
              if (inputRef.current) inputRef.current.textContent = q;
              sendFromInput();
            }} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm whitespace-nowrap hover:bg-gray-200">
              {q}
            </button>
          ))}
        </div>

        <div className="relative">
          <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
            <div ref={inputRef} contentEditable
                 id="message-input" placeholder="Type your message..."
                 data-placeholder="Type your message..."
                 data-empty="true"
                 className="min-h-[60px] max-h-[120px] p-3 overflow-y-auto"
                 onKeyDown={onKeyDown}></div>

            <div className="flex items-center justify-between p-2 border-t border-gray-200">
              <div className="flex space-x-2 items-center">
                <button onClick={() => setEmojiOpen((s) => !s)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600" type="button">😊</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600">📎</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600">🖼️</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600">📄</button>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => { const text = inputRef.current?.textContent || ""; sendMessageFromText(text); }} className="bg-primary text-white px-4 py-2 rounded-button flex items-center justify-center font-medium">
                  <FaPlay className="mr-2 text-xs" /> Send
                </button>
              </div>
            </div>
          </div>

          {/* Emoji picker */}
          <div className={`emoji-picker ${emojiOpen ? "active" : ""}`}>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-700">Emojis</h4>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setEmojiOpen(false)}>✖</button>
            </div>
            <div className="grid grid-cols-8 gap-1">
              {["😊","👍","❤","😂","🎉","🔥","👏","🙏","😍","🤔","😎","😢","😡","🤯","💯","⭐"].map(e => (
                <button key={e} onClick={() => { insertEmojiToInput(e); setEmojiOpen(false); }} className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded text-lg">{e}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // helper functions referenced inside JSX (declared after return to keep them hoisted)
  function insertEmojiToInput(emoji) {
    const el = inputRef.current;
    if (!el) return;
    el.textContent += emoji;
    // caret to end
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
    el.focus();
  }

  function sendMessageFromText(txt) {
    sendMessage(txt);
  }

  function sendFromInput() {
    const txt = inputRef.current?.textContent || "";
    sendMessage(txt);
  }
}

ChatWindow.propTypes = {
  chatId: PropTypes.string,
  chatMeta: PropTypes.object,
};
