"use client";

import React from "react";
import { IoIosInformationCircle } from "react-icons/io";
import { TfiMoreAlt } from "react-icons/tfi";
import { TfiMenu } from "react-icons/tfi";
import { IoCloseSharp } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function ChatHeader({
  onInfoClick,
  isDetailsOpen,
  clientName = "Client",
  projectName = "Project",
}) {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className={`w-10 h-10 rounded-full ${bgColors[colorIndex]} flex items-center justify-center flex-shrink-0`}
        >
          <span className={`${textColors[colorIndex]} font-semibold text-sm`}>
            {initials}
          </span>
        </div>

        <div className="min-w-0">
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {clientName}
          </h3>
          <p className="text-xs text-gray-500 truncate">{projectName}</p>
        </div>
      </div>

      <button
        onClick={onInfoClick}
        className={`p-2 rounded-full transition-colors ml-4 hover:bg-gray-100`}
        title="Toggle project details"
      >
        {/* <IoIosInformationCircle size={24} /> */}
        {/* <TfiMoreAlt size={24}/> */}
        {isDetailsOpen ? <TfiMenu size={20}/> : <BsThreeDotsVertical size={20} />}
        
      </button>
    </div>
  );
}
