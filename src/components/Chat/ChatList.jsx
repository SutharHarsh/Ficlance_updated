// components/Chat/ChatList.jsx
"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";

export default function ChatList({ chats = [], selected, onSelect = () => {} }) {
  const [query, setQuery] = useState("");

  const filtered = chats.filter(c => c.title.toLowerCase().includes(query.toLowerCase()) || c.subtitle.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="w-full flex flex-col">
      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <div className="absolute left-3 top-2 text-gray-500 w-5 h-5 flex items-center justify-center">🔎</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="font-medium text-gray-700">Recent</h3>
          <button className="text-primary text-sm font-medium">See all</button>
        </div>

        {filtered.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`px-4 py-3 cursor-pointer ${selected === c.id ? "bg-blue-50 border-l-4 border-primary" : "hover:bg-gray-50"} ${c.unread ? "" : ""}`}
          >
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-medium text-gray-900">{c.title}</h4>
              <span className="text-xs text-gray-500">{c.time}</span>
            </div>
            <div className="flex justify-between items-start">
              <p className="text-sm text-gray-600 truncate w-48">{c.last}</p>
              {c.unread ? <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{c.unread}</span> : null}
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between px-4 py-3 mt-2">
          <h3 className="font-medium text-gray-700">Archived</h3>
          <button className="text-primary text-sm font-medium">See all</button>
        </div>

        {/* archived sample */}
        <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-medium text-gray-900">SEO Optimization</h4>
            <span className="text-xs text-gray-500">Jun 15</span>
          </div>
          <p className="text-sm text-gray-500 truncate">Project completed. Thank you for your excellent work!</p>
        </div>
      </div>

      <div className="p-4 border-t">
        <button className="w-full bg-primary text-white py-2 rounded-button flex items-center justify-center font-medium">➕ New Conversation</button>
      </div>
    </div>
  );
}

ChatList.propTypes = {
  chats: PropTypes.array,
  selected: PropTypes.string,
  onSelect: PropTypes.func,
};
