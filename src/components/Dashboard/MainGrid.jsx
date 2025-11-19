'use client';
import React from "react";
import InprogressProject from "./InprogressProject";
import CompletedProject from "./CompletedProject";
import UpcomingDeadlines from "./UpcomingDeadlines";
import AchievementBadges from "./Achivement";
import SkillsStatistics from "./SkillsStatistics";


const completedProjects = [
  {
    title: "Landing Page Redesign",
    date: "June 15, 2025",
    rating: "4.8",
  },
  {
    title: "User Authentication System",
    date: "June 2, 2025",
    rating: "4.9",
  },
  {
    title: "Database Schema Design",
    date: "May 28, 2025",
    rating: "4.7",
  },
];

const deadlinesData = [
  {
    month: "JUL",
    date: "08",
    title: "API Integration",
    description: "Payment gateway implementation",
    priority: "High",
  },
  {
    month: "JUL",
    date: "15",
    title: "E-commerce Dashboard",
    description: "Admin panel design & implementation",
    priority: "Medium",
  },
  {
    month: "JUL",
    date: "22",
    title: "Mobile App UI",
    description: "Fitness app interface design",
    priority: "Low",
  },
];

const skillsData = [
  { name: "React.js", percent: 95 },
  { name: "Node.js", percent: 70 },
  { name: "UI/UX Design", percent: 75 },
  { name: "Testing", percent: 80 },
  { name: "API Design", percent: 85 },
  { name: "TypeScript", percent: 65 },
];

const MainGrid = () => {
  const handleViewAll = () => {
    console.log("Redirect to all projects...");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Left section: Projects */}
      <div className="lg:col-span-2 space-y-6">
        <InprogressProject />
        <CompletedProject
          projects={completedProjects}
          onViewAll={handleViewAll}
        />
      </div>

      {/* Right section: Deadlines, Skills, Achievements */}
      <div className="space-y-6">
        <UpcomingDeadlines deadlines={deadlinesData} />
        <div className="p-4 bg-white rounded-xl shadow-sm">
          <SkillsStatistics skills={skillsData} />
        </div>
        <AchievementBadges />
      </div>
    </div>
  );
};

export default MainGrid;