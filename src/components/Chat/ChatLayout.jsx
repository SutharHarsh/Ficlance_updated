// components/Chat/ChatLayout.jsx
"use client";

import React, { useState, useMemo } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import ProjectSidebar from "./ProjectSidebar";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";

const SAMPLE_CHATS = [
  { id: "website-redesign", title: "Website Redesign Project", subtitle: "Emma Clarke (Client)", last: "Could you share the latest mockups?", time: "10:42 AM", unread: 2 },
  { id: "mobile-app", title: "Mobile App Development", subtitle: "Client Team", last: "The timeline looks good.", time: "Yesterday" },
  { id: "logo", title: "Logo Design Project", subtitle: "Creative", last: "I've approved the final design.", time: "Jun 28" },
  { id: "ecommerce-integration", title: "E-commerce Integration", subtitle: "Sales", last: "Can we schedule a call?", time: "Jun 27" },
  { id: "content-writing", title: "Content Writing", subtitle: "Marketing", last: "The blog posts look fantastic.", time: "Jun 25" },
];

export default function ChatLayout({ projectSlug }) {
  const router = useRouter();
  // derive initial selected chat: if projectSlug matches any chat id use it, else use first
  const initialSelected = useMemo(() => {
    if (!projectSlug) return SAMPLE_CHATS[0].id;
    const match = SAMPLE_CHATS.find((c) => c.id === projectSlug);
    return match ? match.id : SAMPLE_CHATS[0].id;
  }, [projectSlug]);

  const [selectedChat, setSelectedChat] = useState(initialSelected);
  // mobile view: true = show chat window, false = show list
  const [mobileShowChat, setMobileShowChat] = useState(Boolean(projectSlug));

  const handleSelectChat = (chatId) => {
    setSelectedChat(chatId);
    setMobileShowChat(true);
    // update URL so user can copy link for a specific chat
    router.push(`/client/${chatId}`);
  };

  const handleBackToList = () => {
    setMobileShowChat(false);
    // go to /client with no slug (optional)
    router.push(`/client`);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <a className="text-2xl font-['Pacifico'] text-primary mr-8">logo</a>
            <nav className="hidden md:flex space-x-6">
              <a className="text-gray-600 hover:text-primary font-medium">Dashboard</a>
              <a className="text-primary font-medium border-b-2 border-primary pb-1">Messages</a>
              <a className="text-gray-600 hover:text-primary font-medium">Missions</a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 cursor-pointer">🔔</div>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">3</span>
            </div>
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <span className="text-primary font-medium">JD</span>
              </div>
              <span className="text-sm font-medium hidden md:block">John Doe</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left: Chat List */}
        <div className={`w-80 border-r border-gray-200 bg-white flex flex-col transform transition-transform duration-150 ${mobileShowChat ? "translate-x-[-100%] md:translate-x-0" : "translate-x-0"}`}>
          <ChatList chats={SAMPLE_CHATS} selected={selectedChat} onSelect={handleSelectChat} />
        </div>

        {/* Center: Chat Window */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Mobile back header */}
          <div className="md:hidden border-b border-gray-200">
            {!mobileShowChat ? (
              <div className="p-3 text-sm text-center text-gray-500">Select a conversation</div>
            ) : (
              <div className="flex items-center p-3">
                <button onClick={handleBackToList} className="w-9 h-9 mr-2 rounded-full hover:bg-gray-100 flex items-center justify-center">
                  <FiArrowLeft />
                </button>
                <div>
                  <div className="text-sm font-medium">{SAMPLE_CHATS.find(c => c.id === selectedChat)?.title}</div>
                  <div className="text-xs text-gray-500">{SAMPLE_CHATS.find(c => c.id === selectedChat)?.subtitle} • Online</div>
                </div>
              </div>
            )}
          </div>

          {/* Show chat window only when mobileShowChat true on mobile */}
          <div className={`flex-1 ${mobileShowChat ? "block" : "hidden"} md:block`}>
            <ChatWindow chatId={selectedChat} chatMeta={SAMPLE_CHATS.find(c => c.id === selectedChat) || {}} />
          </div>
        </div>

        {/* Right: Project Sidebar */}
        <div className="w-80 border-l border-gray-200 bg-white hidden lg:flex flex-col">
          <ProjectSidebar projectSlug={selectedChat} />
        </div>
      </main>
    </div>
  );
}

ChatLayout.propTypes = {
  projectSlug: PropTypes.string,
};
