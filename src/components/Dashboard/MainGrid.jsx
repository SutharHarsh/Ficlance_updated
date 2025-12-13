'use client';
import React from "react";
import InprogressProject from "./InprogressProject";
import CompletedProject from "./CompletedProject";
import UpcomingDeadlines from "./UpcomingDeadlines";
import AchievementBadges from "./Achivement";
import SkillsStatistics from "./SkillsStatistics";
import RecentActivities from "./RecentActivities";
import Recommendations from "./Recommendations";
import {
  inProgressProjects,
  completedProjects,
  deadlines,
  skills,
  recentActivities,
  recommendations,
} from "@/data/dashboard";

const MainGrid = () => {
  const handleViewAll = () => {
    console.log("Redirect to all projects...");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Left section: Projects */}
      <div className="lg:col-span-2 space-y-6">
        <InprogressProject projects={inProgressProjects} />
        <CompletedProject
          projects={completedProjects}
          onViewAll={handleViewAll}
        />
        <RecentActivities items={recentActivities} />
      </div>

      {/* Right section: Deadlines, Skills, Achievements */}
      <div className="space-y-6">
        <UpcomingDeadlines deadlines={deadlines} />
        <div className="p-4 bg-white rounded-xl shadow-sm">
          <SkillsStatistics skills={skills} />
        </div>
        <AchievementBadges />
        <Recommendations items={recommendations} />
      </div>
    </div>
  );
};

export default MainGrid;