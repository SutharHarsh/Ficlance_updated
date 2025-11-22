// components/Chat/ChatLayout.jsx
"use client";

import React, { useState, useEffect } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import ProjectSidebar from "./ProjectSidebar";
import { FiArrowLeft } from "react-icons/fi";
import { MdDashboard, MdWork, MdPerson, MdInfo } from "react-icons/md";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { useSession } from "next-auth/react";

export default function ChatLayout({ projectSlug, initialConversation, initialMessages }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(projectSlug);
  const [showSidebar, setShowSidebar] = useState(true); // Right sidebar
  const [mobileView, setMobileView] = useState("chat"); // 'list', 'chat', 'info'

  // Fetch all conversations for the user
  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/conversations?userId=${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const formattedChats = data.map(c => ({
              id: c._id,
              title: c.projectName,
              subtitle: c.participants.find(p => p.role === "assistant")?.name || "AI Assistant",
              last: c.lastMessage?.content || "No messages yet",
              time: c.lastMessage ? new Date(c.lastMessage.createdAt).toLocaleDateString() : "",
              unread: 0, // TODO: Implement unread count
              ...c
            }));
            setChats(formattedChats);
          }
        })
        .catch(err => console.error("Error fetching chats:", err));
    }
  }, [session]);

  // Update selected chat when prop changes
  useEffect(() => {
    if (projectSlug) {
      setSelectedChatId(projectSlug);
      setMobileView("chat");
    }
  }, [projectSlug]);

  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
    setMobileView("chat");
    router.push(`/chat/${chatId}`);
  };

  const handleBackToList = () => {
    setMobileView("list");
  };

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
        setMobileView("info");
        setShowSidebar(true);
    } else {
        setShowSidebar(!showSidebar);
    }
  };

  const currentChatData = chats.find(c => c.id === selectedChatId) || {
      id: initialConversation?._id,
      title: initialConversation?.projectName,
      subtitle: initialConversation?.participants?.find(p => p.role === "assistant")?.name || "AI Assistant",
      ...initialConversation
  };

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">
      {/* Left: Chat List */}
      <div className={`${mobileView === "list" ? "flex" : "hidden"} md:flex w-full md:w-[350px] md:min-w-[300px] flex-col border-r border-gray-200 bg-white z-10`}>
        {/* Header for List */}
        <div className="h-16 bg-gray-50 border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {/* User Avatar */}
                <span className="text-gray-500 font-medium">{session?.user?.name?.[0] || "U"}</span>
            </div>
            <div className="flex space-x-4 text-gray-600">
                <button title="New Chat" className="hover:bg-gray-200 p-2 rounded-full">➕</button>
                <button title="Menu" className="hover:bg-gray-200 p-2 rounded-full">⋮</button>
            </div>
        </div>
        
        <ChatList chats={chats} selected={selectedChatId} onSelect={handleSelectChat} />
      </div>

      {/* Center: Chat Window */}
      <div className={`flex-1 flex flex-col bg-[#efeae2] relative ${mobileView === "chat" ? "flex" : "hidden md:flex"}`}>
        {/* Chat Header with Navigation */}
        {selectedChatId ? (
             <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 shadow-sm">
                <div className="flex items-center">
                    <button onClick={handleBackToList} className="md:hidden mr-3 text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors">
                        <FiArrowLeft size={20} />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <span className="text-indigo-600 font-semibold text-sm">{(currentChatData.title || "C").substring(0, 2).toUpperCase()}</span>
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-900">{currentChatData.title || "Select a chat"}</h2>
                        <p className="text-xs text-gray-500 truncate">{currentChatData.subtitle || "Click to view details"}</p>
                    </div>
                </div>
                
                
                {/* Navigation Buttons */}
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => router.push('/dashboard')}
                        className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Dashboard"
                    >
                        <MdDashboard className="text-base" />
                        <span className="hidden lg:inline">Dashboard</span>
                    </button>
                    <button 
                        onClick={() => router.push('/portfolio')}
                        className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Portfolio"
                    >
                        <MdWork className="text-base" />
                        <span className="hidden lg:inline">Portfolio</span>
                    </button>
                    <button 
                        onClick={() => router.push('/profile')}
                        className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Profile"
                    >
                        <MdPerson className="text-base" />
                        <span className="hidden lg:inline">Profile</span>
                    </button>
                    <button 
                        onClick={toggleSidebar} 
                        className="flex items-center justify-center w-9 h-9 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors" 
                        title="Project Info"
                    >
                        <MdInfo className="text-lg" />
                    </button>
                </div>
            </div>
        ) : (
            <div className="hidden md:flex h-16 bg-gray-50 border-b border-gray-200 items-center px-4"></div>
        )}

        {/* Chat Area */}
        <div className="flex-1 relative overflow-hidden">
            {selectedChatId ? (
                <ChatWindow 
                    chatId={selectedChatId} 
                    chatMeta={currentChatData} 
                    initialMessages={initialMessages}
                />
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <div className="w-64 h-64 bg-gray-200 rounded-full flex items-center justify-center mb-4 opacity-50">
                        <span className="text-6xl">💬</span>
                    </div>
                    <p className="text-lg font-medium">Select a conversation to start chatting</p>
                </div>
            )}
        </div>
      </div>

      {/* Right: Project Sidebar (Info) */}
      {selectedChatId && showSidebar && (
        <div className={`${mobileView === "info" ? "flex" : "hidden"} lg:flex w-full lg:w-[350px] lg:min-w-[300px] flex-col border-l border-gray-200 bg-white z-10 transition-all duration-300`}>
            <div className="h-16 bg-gray-50 border-b border-gray-200 flex items-center px-4 shrink-0">
                <button onClick={() => setShowSidebar(false)} className="mr-3 text-gray-600 lg:hidden">
                    <FiArrowLeft />
                </button>
                <h3 className="font-medium text-gray-900">Project Info</h3>
            </div>
            <ProjectSidebar projectSlug={selectedChatId} conversation={initialConversation} />
        </div>
      )}
    </div>
  );
}

ChatLayout.propTypes = {
  projectSlug: PropTypes.string,
  initialConversation: PropTypes.object,
  initialMessages: PropTypes.array,
};
