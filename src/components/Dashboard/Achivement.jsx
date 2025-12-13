"use client";

import React from "react";
import { achievementBadges } from "@/data/dashboard";

const AchievementBadges = ({ badges = achievementBadges }) => {
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
              {badge.icon && (
                <badge.icon className={badge.iconClass} aria-hidden />
              )}
            </div>
            <span className={`text-xs ${badge.textColor}`}>{badge.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementBadges;