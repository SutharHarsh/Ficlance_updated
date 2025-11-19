"use client";

import React from "react";
import {
  FaCode,
  FaStopwatch,
  FaUsers,
  FaStar,
  FaBug,
  FaLock,
} from "react-icons/fa";

const badges = [
  {
    label: "Code Master",
    icon: <FaCode className="text-indigo-600 text-lg" />,
    bgColor: "bg-indigo-100",
    textColor: "text-gray-700",
  },
  {
    label: "Fast Learner",
    icon: <FaStopwatch className="text-green-600 text-lg" />,
    bgColor: "bg-green-100",
    textColor: "text-gray-700",
  },
  {
    label: "Team Player",
    icon: <FaUsers className="text-purple-600 text-lg" />,
    bgColor: "bg-purple-100",
    textColor: "text-gray-700",
  },
  {
    label: "Rising Star",
    icon: <FaStar className="text-yellow-600 text-lg" />,
    bgColor: "bg-yellow-100",
    textColor: "text-gray-700",
  },
  {
    label: "Bug Hunter",
    icon: <FaBug className="text-blue-600 text-lg" />,
    bgColor: "bg-blue-100",
    textColor: "text-gray-700",
  },
  {
    label: "Locked",
    icon: <FaLock className="text-gray-400 text-lg" />,
    bgColor: "bg-gray-100",
    textColor: "text-gray-400",
  },
];

const AchievementBadges = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Achievement Badges
        </h2>
        <button className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
          View All
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-4">
        {badges.map((badge, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center"
          >
            <div
              className={`w-14 h-14 rounded-full ${badge.bgColor} flex items-center justify-center mb-2`}
            >
              {badge.icon}
            </div>
            <span className={  `text-xs ${badge.textColor}`}>{badge.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementBadges;