"use client";

import React from "react";
import ConversationList from "./ConversationList";

export default function LeftSidebar({ 
  showLeftSidebar, 
  setShowLeftSidebar, 
  onConversationClick 
}) {
  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setShowLeftSidebar(!showLeftSidebar)}
        className="md:hidden fixed top-20 left-4 z-50 bg-primary text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all"
        title="Toggle conversations"
      >
        <i
          className={`ri-${showLeftSidebar ? "close" : "menu"}-line text-lg`}
        ></i>
      </button>

      {/* Sidebar Container */}
      <div
        className={`${
          showLeftSidebar ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative w-80 md:w-80 z-40 transition-transform duration-300 ease-in-out h-full`}
      >
        <ConversationList onItemClick={onConversationClick} />
      </div>

      {/* Mobile Overlay */}
      {showLeftSidebar && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setShowLeftSidebar(false)}
        ></div>
      )}
    </>
  );
}
