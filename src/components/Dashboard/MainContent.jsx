// app/dashboard/MainContent.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import WelcomeSection from "@/components/WelcomeSection";
// import ProgressCard from "@/components/ProgressCard";
import MainGrid from "./MainGrid";
import FilterStepper from "@/components/NewProject/FilterStepper";
import WelcomeSection from "./WelcomeSection";
import ProgressCard from "./ProgressCard";
import EmptyState from "./EmptyState";
import dashboardData from "@/data/dashboard";

// Skeleton Components
const WelcomeSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-card-foreground rounded w-1/3 mb-2"></div>
    <div className="h-4 bg-card-foreground rounded w-1/4 mb-6"></div>
  </div>
);

const ProgressCardSkeleton = () => (
  <div className="bg-card rounded-xl shadow-sm p-6 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <div className="h-4 bg-card-foreground rounded w-1/2 mb-2"></div>
        <div className="h-6 bg-card-foreground rounded w-1/3"></div>
      </div>
      <div className="w-10 h-10 rounded-full bg-card-foreground"></div>
    </div>
    <div className="w-full bg-card-foreground rounded-full h-2"></div>
  </div>
);

export default function MainContent() {
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [forceEmpty, setForceEmpty] = useState(false);
  const router = useRouter();

  // Check for ?empty=true query param to preview empty state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setForceEmpty(params.get("empty") === "true");
    }
  }, []);

  // Simulate data loading from API
  useEffect(() => {
    // Replace this with actual API call when ready
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const openNewProjectStepper = () => setFilterModalOpen(true);
  const closeStepper = () => setFilterModalOpen(false);

  // intermediate apply (optional)
  const handleApply = (filters) => {
    // optional: update dashboard state or analytics
    // console.log("intermediate apply:", filters);
  };

  // This runs when user finishes the stepper
  const handleComplete = (filters) => {
    try {
      if (filters) {
        localStorage.setItem("fp_difficulty", filters.difficulty ?? "All");
        localStorage.setItem("fp_skills", JSON.stringify(filters.skills ?? []));
        localStorage.setItem("fp_duration", filters.duration ?? "Any duration");
      }
    } catch (e) {
      // ignore localStorage errors
    }

    setFilterModalOpen(false);

    // Redirect to full page
    router.push("/new-project");
  };

  // Safely read dashboard data with fallbacks
  const {
    dashboardCards: cards = [],
    welcomeInfo = {},
    inProgressProjects: inProgress = [],
    completedProjects: completed = [],
    recentActivities: activities = [],
    deadlines: deadlineList = [],
  } = dashboardData || {};

  // Determine if there is any real dashboard data to show
  const metricsNotEmpty = Array.isArray(cards) && cards.length > 0;
  const projectsNotEmpty = (inProgress?.length || 0) + (completed?.length || 0) > 0;
  const activityNotEmpty = (activities?.length || 0) > 0;
  const deadlinesNotEmpty = (deadlineList?.length || 0) > 0;
  const isEmpty = forceEmpty || (!metricsNotEmpty && !projectsNotEmpty && !activityNotEmpty && !deadlinesNotEmpty);

  return (
    <main className="flex-1 p-6 dark:bg-background bg-secondary">
      <div className="container mx-auto">
        {isLoading ? <WelcomeSkeleton /> : (
          <div className="animate-fadeIn">
            <WelcomeSection
              username={welcomeInfo.username}
              date={welcomeInfo.date}
              day={welcomeInfo.day}
              onOpenNewProject={openNewProjectStepper}
            />
          </div>
        )}

        {!isEmpty && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {isLoading
                ? [...Array(4)].map((_, index) => (
                    <ProgressCardSkeleton key={index} />
                  ))
                : (
                  <div className="contents animate-fadeIn">
                    {cards.map((card, index) => (
                      <ProgressCard key={index} {...card} />
                    ))}
                  </div>
                )}
            </div>
          </div>
        )}
      </div>

      {/* Empty dashboard experience */}
      {!isLoading && isEmpty ? (
        <div className="px-6">
          <EmptyState onCreate={openNewProjectStepper} />
        </div>
      ) : (
        <MainGrid isLoading={isLoading} />
      )}

      {/* Stepper modal only (exactly what you asked) */}
      {filterModalOpen && (
        <FilterStepper
          open={filterModalOpen}
          onClose={closeStepper}
          onApply={handleApply}
          onComplete={handleComplete} // final -> redirect
        />
      )}
    </main>
  );
}
