"use client";

import { useEffect, useState } from "react";
import NavbarBelowSection from "@/components/NewProject/NavbarBelowSection";
import ProjectSection from "@/components/NewProject/ProjectSection";
import FilterStepper from "@/components/NewProject/FilterStepper";
// import WelcomeSection from "@/components/NewProject/WelcomeSection"; // if you use it

export default function NewProject() {
  const [filters, setFilters] = useState(null);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // On mount, try to load saved filters from localStorage
  useEffect(() => {
    try {
      const d = localStorage.getItem("fp_difficulty");
      const s = JSON.parse(localStorage.getItem("fp_skills") || "null");
      const du = localStorage.getItem("fp_duration");
      if (d || s || du) {
        setFilters({
          difficulty: d || "All",
          skills: Array.isArray(s) ? s : [],
          duration: du || "Any duration",
        });
      }
    } catch {
      // ignore
    }
  }, []);

  const handleOpenFilters = () => setFilterModalOpen(true);
  const handleCloseFilters = () => setFilterModalOpen(false);

  const handleApplyFilters = (f) => {
    // f = { difficulty, skills, duration }
    setFilters(f);
    // filters are already stored by FilterStepper to localStorage
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavbarBelowSection />

      <div className="p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Choose a Project</h2>

          <div>
            <button
              onClick={handleOpenFilters}
              className="bg-[#2D3047] text-yellow-200 px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition flex items-center whitespace-nowrap"
            >
              Open Filters
            </button>
          </div>
        </div>
      </div>

      {/* Projects — when filterModalOpen is true, blur this area */}
      <div className={`${filterModalOpen ? "filter-blur pointer-events-none" : ""}`}>
        <ProjectSection filters={filters} />
      </div>

      {/* Filter stepper overlay */}
      <FilterStepper
        open={filterModalOpen}
        onClose={handleCloseFilters}
        onApply={handleApplyFilters}
      />
    </div>
  );
}
