"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { FaSearch } from "react-icons/fa";

// Skeleton Loader Component
const ConversationSkeleton = () => (
  <div className="px-4 py-4 border-b border-card-foreground animate-pulse">
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <div className="h-5 bg-card-foreground rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-card-foreground rounded w-full"></div>
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <div className="h-3 bg-card-foreground rounded w-12"></div>
      </div>
    </div>
  </div>
);

export default function ConversationList({ onItemClick }) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Extract current conversation ID from pathname
  const getCurrentConversationId = () => {
    const match = pathname.match(/\/chat\/([a-f0-9]{24})/);
    return match ? match[1] : null;
  };

  const activeConversationId = getCurrentConversationId();

  // Fetch all conversations for the user
  useEffect(() => {
    if (session?.user?.email) {
      fetchConversations();
    }
  }, [session]);

  const fetchConversations = async () => {
    try {
      // Only show loading on initial load
      if (isInitialLoad) {
        setLoading(true);
      }
      const res = await fetch(
        `/api/conversations?userId=${session.user.email}`
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const formattedConversations = data.map((c) => {
            // Safely extract last message content
            let lastMessageText = "No messages yet";
            if (c.lastMessage) {
              if (typeof c.lastMessage === "string") {
                lastMessageText = c.lastMessage;
              } else if (typeof c.lastMessage === "object") {
                // Extract content from message object
                lastMessageText = c.lastMessage.content || "No messages yet";
                // Ensure it's a string
                if (typeof lastMessageText === "object") {
                  lastMessageText = JSON.stringify(lastMessageText);
                }
              }
            }

            // Format time to show "10:42 AM", "Yesterday", "Jun 28", etc.
            const formatTime = (dateStr) => {
              if (!dateStr) return "";
              const date = new Date(dateStr);
              const now = new Date();
              const diffMs = now - date;
              const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

              if (diffDays === 0) {
                // Today - show time
                return date.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                });
              } else if (diffDays === 1) {
                return "Yesterday";
              } else if (diffDays < 365) {
                // Within a year - show month and day
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              } else {
                // Over a year - show full date
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
              }
            };

            return {
              id: c._id,
              title: c.projectName || "Untitled Project",
              subtitle:
                c.participants?.find((p) => p.role === "assistant")?.name ||
                "AI Assistant",
              lastMessage: String(lastMessageText).substring(0, 60), // Limit length for better UI
              time: formatTime(c.lastMessage?.createdAt || c.createdAt),
              unreadCount: c.unreadCount || 0, // Add unread count support
            };
          });
          setConversations(formattedConversations);
          setFilteredConversations(formattedConversations);
        }
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
      // Mark that initial load is complete
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          c.lastMessage.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredConversations(filtered);
    }
  };

  const handleConversationClick = (conversationId) => {
    if (onItemClick) {
      onItemClick();
    }
    router.push(`/chat/${conversationId}`);
  };

  return (
    <div className="w-full h-full dark:bg-background bg-card border-r border-border flex flex-col">
      <div className="p-3 sm:p-4 border-b border-border flex-shrink-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-input rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />

          <i className="ri-search-line absolute left-3 top-2.5 text-foreground">
            <FaSearch />
          </i>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {loading ? (
          <div className="space-y-0">
            {[...Array(5)].map((_, index) => (
              <ConversationSkeleton key={index} />
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center text-foreground text-sm py-8">
            <p>
              {searchQuery
                ? "No conversations match your search"
                : "No conversations yet"}
            </p>
          </div>
        ) : (
          <>
            {filteredConversations.map((conversation) => {
              const isActive = activeConversationId === conversation.id;

              return (
                <div
                  key={conversation.id}
                  onClick={() => handleConversationClick(conversation.id)}
                  className={`px-4 py-4 cursor-pointer transition-colors border-b border-card-secondary last:border-b-0 ${
                    isActive
                      ? "bg-destructive-foreground dark:bg-card border-l-4 border-l-primary"
                      : "hover:bg-secondary dark:hover:bg-card-foreground"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4
                          className={`font-medium text-base truncate ${
                            isActive ? "text-foreground font-medium" : "text-low-foreground"
                          }`}
                        >
                          {String(conversation.title || "Untitled Project")}
                        </h4>
                      </div>
                      <p
                        className={`text-sm truncate ${
                          isActive ? "text-low-foreground" : "text-low-foreground"
                        }`}
                      >
                        {String(conversation.lastMessage || "No messages yet")}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span
                        className={`text-xs whitespace-nowrap ${
                          isActive ? "text-low-foreground" : "text-low-foreground"
                        }`}
                      >
                        {conversation.time || "Today"}
                      </span>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-primary text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
