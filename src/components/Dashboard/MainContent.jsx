// app/dashboard/MainContent.jsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
// import WelcomeSection from "@/components/WelcomeSection";
// import ProgressCard from "@/components/ProgressCard";
import MainGrid from "./MainGrid";
import FilterStepper from "@/components/NewProject/FilterStepper";
import WelcomeSection from "./WelcomeSection";
import ProgressCard from "./ProgressCard";

const dashboardCards = [
  /* keep your existing cards array here (omitted for brevity) */
];

export default function MainContent() {
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const router = useRouter();

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

  return (
    <main className="flex-1 p-6 bg-gray-50">
      <div className="container mx-auto">
        <WelcomeSection
          username="Aditya"
          date="July 23, 2025"
          day="Wednesday"
          onOpenNewProject={openNewProjectStepper}
        />

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardCards.map((card, index) => (
              <ProgressCard key={index} {...card} />
            ))}
          </div>
        </div>
      </div>

      <MainGrid />

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
