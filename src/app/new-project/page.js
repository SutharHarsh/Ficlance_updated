
"use client";

import React, { useEffect, useState } from "react";
import ProjectSection from "@/components/NewProject/ProjectSection";

export default function NewProjectPage() {
  const [filters, setFilters] = useState(null);

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

  return (
    // page-level wrapper — full viewport height and background
    <div className="min-h-screen bg-gray-50">
      {/* Render ProjectSection full-bleed and full-height */}
      <ProjectSection filters={filters} className="min-h-screen" />
    </div>
  );
}
