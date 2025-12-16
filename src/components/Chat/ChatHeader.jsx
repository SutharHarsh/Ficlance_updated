"use client";

import React, { useEffect, useState } from "react";
import { TfiMenu } from "react-icons/tfi";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function ChatHeader({
  onInfoClick,
  isDetailsOpen,
  clientName = "Client",
  projectName = "Project",
  isLoading = false,
}) {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);

      // Trigger animation on next tick
      requestAnimationFrame(() => {
        setAnimateIn(true);
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getInitials = (name) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const initials = getInitials(clientName);

  const bgColors = [
    "bg-blue-100",
    "bg-green-100",
    "bg-purple-100",
    "bg-pink-100",
    "bg-yellow-100",
  ];
  const textColors = [
    "text-blue-600",
    "text-green-600",
    "text-purple-600",
    "text-pink-600",
    "text-yellow-600",
  ];
  const colorIndex = clientName.charCodeAt(0) % bgColors.length;

  /* ---------------- SKELETON ---------------- */
  if (showSkeleton || isLoading) {
    return (
      <div className="bg-card border-b border-border px-4 py-2 flex items-center justify-between animate-pulse">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-full bg-card-foreground" />
          <div>
            <div className="h-4 bg-card-foreground rounded w-32 mb-2" />
            <div className="h-3 bg-card-foreground rounded w-24" />
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-card-foreground" />
      </div>
    );
  }

  /* ---------------- REAL CONTENT ---------------- */
  return (
    <div
      className={`
        bg-card border-b border-border px-4 py-2
        flex items-center justify-between
        transition-all duration-300 ease-out
        ${animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
      `}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className={`w-10 h-10 rounded-full ${bgColors[colorIndex]} flex items-center justify-center`}
        >
          <span className={`${textColors[colorIndex]} font-semibold text-sm`}>
            {initials}
          </span>
        </div>

        <div className="min-w-0">
          <h3 className="text-base font-semibold text-foreground truncate">
            {clientName}
          </h3>
          <p className="text-xs text-low-foreground truncate">{projectName}</p>
        </div>
      </div>

      <button
        onClick={onInfoClick}
        className="p-2 rounded-full hover:bg-card-foreground transition-colors"
      >
        {isDetailsOpen ? (
          <TfiMenu size={20} />
        ) : (
          <BsThreeDotsVertical size={20} />
        )}
      </button>
    </div>
  );
}
