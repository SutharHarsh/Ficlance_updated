"use client";

import React, { useState, useEffect, useRef } from "react";
import { MdNotifications } from "react-icons/md";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen && notifications.length === 0) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // Fetch conversations with upcoming or passed deadlines
      const res = await fetch("/api/conversations/deadlines");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDeadlineStatus = (deadline) => {
    if (!deadline) return { status: "none", color: "gray", bgClass: "bg-gray-500" };
    
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffMs = deadlineDate - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMs < 0) {
      return { status: "passed", color: "red", text: "Deadline passed", bgClass: "bg-red-500" };
    } else if (diffHours < 24) {
      return { status: "urgent", color: "red", text: `${diffHours}h remaining`, bgClass: "bg-red-500" };
    } else if (diffDays <= 3) {
      return { status: "soon", color: "orange", text: `${diffDays}d remaining`, bgClass: "bg-orange-500" };
    } else {
      return { status: "normal", color: "green", text: `${diffDays}d remaining`, bgClass: "bg-green-500" };
    }
  };

  const urgentCount = notifications.filter(n => {
    const status = getDeadlineStatus(n.deadline);
    return status.status === "passed" || status.status === "urgent";
  }).length;

  return (
    <div className="relative" ref={dropdownRef}>
        
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
      >
        <MdNotifications size={24}/>
        {/* <i className="ri-notification-3-line text-xl text-gray-700"></i> */}
        {urgentCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {urgentCount > 0 && (
              <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
                {urgentCount} urgent
              </span>
            )}
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                <i className="ri-loader-4-line animate-spin text-2xl mb-2"></i>
                <p className="text-sm">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <i className="ri-notification-off-line text-3xl mb-2"></i>
                <p className="text-sm">No deadline notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notif) => {
                  const deadlineInfo = getDeadlineStatus(notif.deadline);
                  return (
                    <a
                      key={notif._id}
                      href={`/chat/${notif._id}`}
                      className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 w-2 h-2 rounded-full ${deadlineInfo.bgClass} flex-shrink-0`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 truncate">
                            {notif.projectName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {deadlineInfo.text}
                          </p>
                          {notif.deadline && (
                            <p className="text-xs text-gray-400 mt-1">
                              Due: {new Date(notif.deadline).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
