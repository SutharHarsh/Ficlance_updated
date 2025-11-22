"use client";

import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { FaPlay, FaGithub } from "react-icons/fa";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import GitHubFeedbackModal from "./GitHubFeedbackModal";

export default function ChatWindow({ chatId, chatMeta = {}, initialMessages = [] }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState(initialMessages);
  const [typing, setTyping] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [quickReplies] = useState([
    "I'll send the mockups today",
    "Can we schedule a call?",
    "I need more information",
    "Let me check and get back to you"
  ]);
  const inputRef = useRef(null);
  const messagesRef = useRef(null);
  const [isSending, setIsSending] = useState(false);
  
  // GitHub Feedback Modal States
  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackStep, setFeedbackStep] = useState(0);

  // Initialize Socket.io
  useEffect(() => {
    const socketInstance = io({
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    socketInstance.on("connect", () => {
      console.log("Connected to socket");
      if (chatId) {
        socketInstance.emit("join_conversation", chatId);
      }
    });

    socketInstance.on("new_message", (message) => {
      setMessages((prev) => {
        // Avoid duplicates
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [chatId]);

  // Fetch messages
  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages?conversationId=${chatId}`);
        if (res.ok) {
            const data = await res.json();
            setMessages(data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    
    fetchMessages(); 
  }, [chatId]);

  const scrollToBottom = () => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (d) => {
    const date = new Date(d);
    const hrs = date.getHours();
    const mins = date.getMinutes();
    const ampm = hrs >= 12 ? "PM" : "AM";
    return `${hrs % 12 === 0 ? 12 : hrs % 12}:${mins < 10 ? "0"+mins : mins} ${ampm}`;
  };

  const sendMessage = async (text) => {
    const trimmed = text?.trim();
    if (!trimmed) return;
    setIsSending(true);

    // Optimistic UI Update for User Message
    const tempUserMsg = {
        _id: Date.now().toString(),
        content: trimmed,
        sender: { role: "user", userId: session?.user?.email },
        createdAt: new Date().toISOString(),
        from: "me"
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    // Clear input immediately
    if (inputRef.current) {
        inputRef.current.textContent = "";
        inputRef.current.setAttribute("data-empty", "true");
        inputRef.current.focus();
    }

    try {
      // 1. Call External AI API via Proxy (to avoid CORS)
      const aiResponse = await fetch("/api/proxy/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Question: trimmed })
      });

      if (!aiResponse.ok) throw new Error("AI API Failed");
      const aiData = await aiResponse.json();
      const aiReplyContent = aiData.response || aiData.message || JSON.stringify(aiData);

      // Optimistic UI Update for AI Message
      const tempAiMsg = {
          _id: (Date.now() + 1).toString(),
          content: aiReplyContent,
          sender: { role: "assistant", userId: "ai-assistant" },
          createdAt: new Date().toISOString()
      };
      setMessages((prev) => [...prev, tempAiMsg]);

      // 2. Sync User Message to DB (Background)
      fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: chatId,
          content: trimmed,
          type: "text",
          userId: session?.user?.email,
          role: "user",
          skipAI: true 
        }),
      });

      // 3. Sync AI Message to DB (Background)
      fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: chatId,
          content: aiReplyContent,
          type: "text",
          userId: "ai-assistant",
          role: "assistant",
          skipAI: true
        }),
      });

    } catch (error) {
      console.error("Error sending message:", error);
      // Ideally show error state to user
    } finally {
      setIsSending(false);
    }
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

  // Multi-step loading messages
  const feedbackSteps = [
    "Analyzing repository structure...",
    "Checking UI components...",
    "Gathering requirements...",
    "Generating feedback..."
  ];

  // Helper to handle GitHub feedback submission
  const handleGithubSubmit = async (url) => {
      setFeedbackLoading(true);
      setFeedbackStep(0);
      
      try {
          // Simulate multi-step progress
          const stepInterval = setInterval(() => {
              setFeedbackStep(prev => {
                  if (prev < feedbackSteps.length - 1) return prev + 1;
                  return prev;
              });
          }, 800);

          // Call feedback API via proxy
          const res = await fetch("/api/proxy/feedback", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ RepoURL: url }),
          });
          
          clearInterval(stepInterval);
          
          if (!res.ok) {
              const errorData = await res.json();
              console.error("Feedback API error:", errorData);
              alert(`Failed to get feedback: ${errorData.error || 'Unknown error'}`);
              setFeedbackLoading(false);
              setShowGitHubModal(false);
              return;
          }
          
          const data = await res.json();
          
          // Format the feedback response nicely
          const feedbackContent = formatFeedbackResponse(data, url);
          
          // Add feedback message to chat
          const feedbackMsg = {
              _id: Date.now().toString(),
              content: feedbackContent,
              sender: { role: "assistant", userId: "github-feedback" },
              createdAt: new Date().toISOString(),
              type: "github_feedback",
              metadata: data
          };
          
          setMessages(prev => [...prev, feedbackMsg]);
          
          // Save to database
          fetch("/api/messages", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  conversationId: chatId,
                  content: feedbackContent,
                  type: "github_feedback",
                  userId: "github-feedback",
                  role: "assistant",
                  skipAI: true,
                  metadata: data
              }),
          });
          
          setFeedbackLoading(false);
          setShowGitHubModal(false);
          setFeedbackStep(0);

      } catch (e) {
          console.error("Github feedback error", e);
          alert("Failed to submit GitHub feedback. Please try again.");
          setFeedbackLoading(false);
          setShowGitHubModal(false);
          setFeedbackStep(0);
      }
  };

  // Format feedback response for display
  const formatFeedbackResponse = (data, repoUrl) => {
      const repoName = repoUrl.split('/').slice(-2).join('/').replace('.git', '');
      
      // Try to extract JSON from message field if it exists
      let parsedData = data;
      if (data.message && typeof data.message === 'string') {
          try {
              // Extract JSON from markdown code blocks
              const jsonMatch = data.message.match(/```json\s*([\s\S]*?)\s*```/);
              if (jsonMatch) {
                  parsedData = JSON.parse(jsonMatch[1]);
              } else {
                  // Try parsing the message directly
                  parsedData = JSON.parse(data.message);
              }
          } catch (e) {
              // If parsing fails, use original data
              console.log("Could not parse JSON from message, using original data");
          }
      }
      
      let formatted = `**GitHub Repository Analysis**\n`;
      formatted += `**Repository:** ${repoName}\n\n`;
      formatted += `---\n\n`;
      
      // Handle feedback_summary array
      if (parsedData.feedback_summary && Array.isArray(parsedData.feedback_summary)) {
          formatted += `**Key Findings**\n\n`;
          parsedData.feedback_summary.forEach((item, index) => {
              formatted += `${index + 1}. ${item}\n`;
          });
          formatted += '\n';
      }
      
      // Handle completion metrics
      if (typeof parsedData.requirements_completed !== 'undefined') {
          formatted += `**Project Status**\n\n`;
          formatted += `• Completed: ${parsedData.requirements_completed} requirement${parsedData.requirements_completed !== 1 ? 's' : ''}\n`;
          formatted += `• Pending: ${parsedData.requirements_pending} requirement${parsedData.requirements_pending !== 1 ? 's' : ''}\n`;
          if (typeof parsedData.completion_percentage !== 'undefined') {
              formatted += `• Progress: ${parsedData.completion_percentage}%\n`;
          }
          formatted += '\n';
      }
      
      // Handle generic feedback or message (if not already parsed)
      if (!parsedData.feedback_summary && parsedData.feedback && !Array.isArray(parsedData.feedback)) {
          formatted += parsedData.feedback + '\n\n';
      } else if (!parsedData.feedback_summary && data.message && !data.message.includes('```json')) {
          formatted += data.message + '\n\n';
      }
      
      return formatted.trim();
  };

  return (
    <div className="flex flex-col h-full bg-[#efeae2]">
      {/* Messages container */}
      <div ref={messagesRef} id="chat-messages" className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {/* Date separator sample */}
        <div className="flex items-center justify-center my-4">
          <div className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">Today</div>
        </div>

        {messages.map((m) => (
          <div key={m._id || m.id} className={`flex mb-4 chat-message ${m.sender?.role === "user" || m.from === "me" ? "justify-end" : ""}`}>
            {m.sender?.role !== "user" && m.from !== "me" && (
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 self-start mt-1 flex-shrink-0">
                <span className="text-green-600 font-medium text-xs">{(chatMeta.title || "Client").split(" ").map(w=>w[0]).slice(0,2).join("")}</span>
              </div>
            )}
            <div className={`max-w-[75%] ${m.sender?.role === "user" || m.from === "me" ? "text-right" : ""}`}>
              <div className={`${m.sender?.role === "user" || m.from === "me" ? "bg-indigo-600 text-white rounded-lg rounded-tr-none" : "bg-white shadow-sm rounded-lg rounded-tl-none"} p-3 mb-1`}>
                <div className={`${m.sender?.role === "user" || m.from === "me" ? "text-white" : "text-gray-800"} text-sm leading-relaxed overflow-hidden`}>
                    {renderMessageContent(m.content || m.text)}
                </div>
              </div>
              <div className={`flex items-center ${m.sender?.role === "user" || m.from === "me" ? "justify-end" : ""} text-xs text-gray-500`}>
                <span>{formatTime(m.createdAt || m.time)}</span>
                {/* {m.status && <><span className="mx-2">•</span><span>{m.status}</span></>} */}
              </div>
            </div>

            {(m.sender?.role === "user" || m.from === "me") && (
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

            <div className="flex items-center justify-between p-2 border-t border-gray-200 bg-white">
              <div className="flex space-x-2 items-center">
                <button onClick={() => setEmojiOpen((s) => !s)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600" type="button">😊</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600" title="Attach File">📎</button>
                <button 
                    onClick={() => setShowGitHubModal(true)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-indigo-50 text-indigo-600 transition-colors" 
                    title="GitHub Feedback"
                >
                    <FaGithub size={18} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => { const text = inputRef.current?.textContent || ""; sendMessageFromText(text); }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full flex items-center justify-center font-medium transition-colors" disabled={isSending}>
                  <FaPlay className="ml-1 text-xs" />
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

      {/* GitHub Feedback Modal with Integrated Loader */}
      {showGitHubModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all">
            {feedbackLoading ? (
              // Loading State
              <div className="p-6">
                <div className="flex flex-col items-center">
                  {/* Animated Icon */}
                  <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
                    <FaGithub className="text-indigo-600 text-2xl animate-pulse" />
                  </div>
                  
                  {/* Current Step */}
                  <p className="text-sm font-medium text-gray-900 mb-4 text-center">
                    {feedbackSteps[feedbackStep]}
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden mb-3">
                    <div 
                      className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${((feedbackStep + 1) / feedbackSteps.length) * 100}%` }}
                    ></div>
                  </div>
                  
                  {/* Step Counter */}
                  <p className="text-xs text-gray-500">
                    Step {feedbackStep + 1} of {feedbackSteps.length}
                  </p>
                </div>
              </div>
            ) : (
              // Input Form State
              <GitHubFeedbackModal
                isOpen={true}
                onClose={() => setShowGitHubModal(false)}
                onSubmit={handleGithubSubmit}
                isLoading={false}
              />
            )}
          </div>
        </div>
      )}
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

  // Basic Markdown Parser for Rich Text Display
  function renderMessageContent(text) {
    if (!text) return null;
    
    // Split by code blocks first
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
        if (part.startsWith("```") && part.endsWith("```")) {
            // Code block
            const content = part.slice(3, -3).replace(/^[a-z]+\n/, ""); // Remove language identifier if present
            return (
                <pre key={index} className="bg-gray-800 text-gray-100 p-2 rounded my-2 overflow-x-auto text-xs font-mono">
                    <code>{content}</code>
                </pre>
            );
        }
        
        // Process inline formatting for non-code blocks
        // Split by newlines to handle paragraphs
        return (
            <div key={index} className="whitespace-pre-wrap">
                {part.split('\n').map((line, i) => (
                    <div key={i} className="min-h-[1.2em]">
                        {parseInline(line)}
                    </div>
                ))}
            </div>
        );
    });
  }

  function parseInline(text) {
    // Simple parser for **bold**, *italic*, `code`
    // This is a naive implementation but works for basic cases
    // We can use regex to split and map
    
    // Regex for bold: \*\*(.*?)\*\*
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    
    return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
             // User wants this to be bold/emphasized
            return <strong key={i} className="font-bold">{part.slice(1, -1)}</strong>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
            return <code key={i} className="bg-black/10 px-1 rounded font-mono text-xs">{part.slice(1, -1)}</code>;
        }
        return part;
    });
  }
}

ChatWindow.propTypes = {
  chatId: PropTypes.string,
  chatMeta: PropTypes.object,
  initialMessages: PropTypes.array, // Added prop
};
