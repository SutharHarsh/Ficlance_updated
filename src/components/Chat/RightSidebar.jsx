"use client";

import React from "react";
import ProjectDetails from "./ProjectDetails";

export default function RightSidebar({
  showProjectDetails,
  setShowProjectDetails,
  completionPercentage,
  dueDate,
  projectDescription,
  techStack,
  difficulty,
  deadline,
}) {
  return (
    <>
      {/* Sidebar Container */}
      <div
        className={`fixed lg:relative right-0 z-40 h-full overflow-hidden transition-all duration-300 ease-in-out ${
          showProjectDetails ? "w-80 translate-x-0" : "w-0 translate-x-full"
        }`}
      >
        {showProjectDetails && (
          <ProjectDetails
            isOpen={showProjectDetails}
            onClose={() => setShowProjectDetails(false)}
            completionPercentage={completionPercentage}
            dueDate={dueDate}
            projectDescription={projectDescription}
            techStack={techStack}
            difficulty={difficulty}
            deadline={deadline}
          />
        )}
      </div>

      {/* Mobile Overlay */}
      {showProjectDetails && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setShowProjectDetails(false)}
        ></div>
      )}
    </>
  );
}
