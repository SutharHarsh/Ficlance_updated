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

// Skeleton Components
const ProjectCardSkeleton = () => (
  <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center flex-1">
        <div className="w-9 h-9 rounded-lg bg-gray-200 mr-3"></div>
        <div className="h-5 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="h-5 bg-gray-200 rounded w-16"></div>
    </div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-4/5 mb-4"></div>
    <div className="w-full bg-gray-200 rounded-full h-2 mb-4"></div>
    <div className="flex justify-between">
      <div className="flex -space-x-2">
        <div className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white"></div>
        <div className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </div>
  </div>
);

const CompletedProjectSkeleton = () => (
  <div className="flex items-center p-3 border border-gray-100 rounded-lg animate-pulse">
    <div className="w-10 h-10 rounded-lg bg-gray-200 mr-4 flex-shrink-0"></div>
    <div className="flex-1">
      <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </div>
    <div className="flex flex-col items-end gap-2">
      <div className="h-4 bg-gray-200 rounded w-12"></div>
    </div>
  </div>
);

const DeadlineSkeleton = () => (
  <div className="flex items-start animate-pulse">
    <div className="w-12 h-12 rounded-lg bg-gray-200 mr-4 flex-shrink-0"></div>
    <div className="flex-1">
      <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </div>
  </div>
);

const MainGrid = ({ isLoading = false }) => {
  const handleViewAll = () => {
    console.log("Redirect to all projects...");
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left section: Projects Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          {/* In Progress Projects Skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          </div>

          {/* Completed Projects Skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <CompletedProjectSkeleton key={i} />
              ))}
            </div>
          </div>

          {/* Recent Activities Skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="pl-8 pb-6 border-l-2 border-gray-200 animate-pulse">
                  <div className="w-6 h-6 rounded-full bg-gray-200 absolute left-0 top-0 -translate-x-1/2"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right section: Deadlines, Skills, Achievements Skeleton */}
        <div className="space-y-6">
          {/* Deadlines Skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <DeadlineSkeleton key={i} />
              ))}
            </div>
          </div>

          {/* Skills Skeleton */}
          <div className="p-4 bg-white rounded-xl shadow-sm animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-48 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-gray-200 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations Skeleton */}
          <div className="grid grid-cols-1 p-8 rounded-2xl bg-white gap-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="p-4 border border-gray-100 rounded-lg">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 animate-fadeIn">
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