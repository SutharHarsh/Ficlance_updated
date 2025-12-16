"use client";

import React from "react";
import { achievementBadges } from "@/data/dashboard";

const AchievementBadges = ({ badges = achievementBadges }) => {
  return (
    <div className="bg-card rounded-xl shadow-sm p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-foreground">
          Achievement Badges
        </h2>
        <button className="text-sm text-low-foreground hover:text-primary hover:underline transition-colors duration-200">
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
            <span className="text-xs text-foreground">{badge.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementBadges;