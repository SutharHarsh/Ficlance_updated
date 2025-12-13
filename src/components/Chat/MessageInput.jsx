"use client";

import React, { useState, useRef } from "react";
import { FaGithub } from "react-icons/fa";
import { RiSendPlaneFill } from "react-icons/ri";

export default function MessageInput({ message, setMessage, onSend, isSending, onGitHubClick }) {
  const messageInputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="relative">
      <div className="border border-gray-300 rounded-lg p-2 flex flex-col">
        <textarea
          ref={messageInputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="min-h-[60px] sm:min-h-[40px] p-2 outline-none text-sm sm:text-base overflow-y-auto max-h-32 resize-none bg-transparent"
        />

        <div className="flex justify-between items-center p-2 border-t">
          <div className="flex space-x-2">
            <button
              onClick={onGitHubClick}
              type="button"
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
              title="GitHub Feedback"
            >
              <FaGithub className="text-sm sm:text-base" size={24}/>
            </button>
          </div>

          <button
            onClick={onSend}
            disabled={isSending}
            className=" rounded-button text-sm sm:text-base flex items-center gap-2 hover:rotate-45 transition-all duration-200 ease-in-out hover:bg-gray-100 rounded-full p-2"
          >
            {isSending ? (
              <>
                <i className="ri-loader-4-line animate-spin"></i>
                ...
              </>
            ) : (
              <>
                <RiSendPlaneFill size={24}/>
                {/* <i className="ri-send-plane-fill"></i> */}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
