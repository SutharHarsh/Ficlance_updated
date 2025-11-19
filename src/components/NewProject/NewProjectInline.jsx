"use client";

import React, { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";

// lazy load heavy pieces
const ProjectSection = dynamic(() => import("./ProjectSection"), { ssr: false });
const FilterStepper = dynamic(() => import("./FilterStepper"), { ssr: false });

const NewProjectInline = ({ onRequestFullPage }) => {
  const [filters, setFilters] = useState(null);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

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
      // ignore localStorage errors
    }
  }, []);

  const openFilters = useCallback(() => setFilterModalOpen(true), []);
  const closeFilters = useCallback(() => setFilterModalOpen(false), []);

  const handleApplyFilters = useCallback((f) => {
    setFilters(f);
    // If user clicks on "choose full page" or some filter action requires full page:
    // Caller / ProjectSection can call onRequestFullPage()
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Choose a Project</h2>
        <div>
          <button
            onClick={openFilters}
            className="bg-[#2D3047] text-yellow-200 px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition flex items-center whitespace-nowrap"
            type="button"
          >
            Open Filters
          </button>
        </div>
      </div>

      <div className={`${filterModalOpen ? "filter-blur pointer-events-none" : ""}`}>
        <ProjectSection filters={filters} onRequestFullPage={onRequestFullPage} />
      </div>

      <FilterStepper
        open={filterModalOpen}
        onClose={closeFilters}
        onApply={handleApplyFilters}
        onGoFullPage={() => {
          // If FilterStepper offers an action to redirect to full page
          onRequestFullPage();
        }}
      />
    </div>
  );
};

NewProjectInline.propTypes = {
  onRequestFullPage: PropTypes.func.isRequired,
};

export default NewProjectInline;
