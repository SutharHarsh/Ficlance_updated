"use client";

import React, { useEffect, useState } from "react";

export default function ProjectDetails({
  onClose,
  completionPercentage = 0,
  dueDate = "N/A",
  projectDescription = "",
  techStack = [],
  difficulty = "",
  deadline = null,
}) {
  const [timeLeft, setTimeLeft] = useState("");

  const computeTimeLeft = (deadlineStr) => {
    if (!deadlineStr) return "No deadline set";
    const deadlineDate = new Date(deadlineStr);
    const now = new Date();
    const diff = deadlineDate - now;
    if (diff <= 0) return "Deadline passed";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const hh = hours.toString().padStart(2, "0");
    const mm = minutes.toString().padStart(2, "0");
    const ss = seconds.toString().padStart(2, "0");

    if (days > 0) {
      return `${days}d ${hh}:${mm}:${ss}`;
    }
    return `${hh}:${mm}:${ss}`;
  };

  useEffect(() => {
    setTimeLeft(computeTimeLeft(deadline));
    if (!deadline) return;

    const interval = setInterval(() => {
      setTimeLeft(computeTimeLeft(deadline));
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline]);
  return (
    <div className="w-full h-full bg-white border-l border-gray-200 flex flex-col py-1">
      {/* Header with close button */}
      <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        <h3 className="font text-gray-900 text-sm sm:text-[20px]">
          Project Details
        </h3>
        <button
          onClick={onClose}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Close details"
        >
          <i className="ri-close-line text-lg text-gray-600"></i>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-4">
        {/* Project Status */}
        <div className="mb-6">
          <h4 className="text-xs sm:text-[15px] font-medium text-gray-700 mb-2">
            Project Status
          </h4>
          <div className="bg-gray-100 h-2 rounded-full">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{completionPercentage}% Complete</span>
            <span>Due: {dueDate}</span>
          </div>
        </div>

        {/* Deadline Timer */}
        <div className="mb-6 text-center">
          <div className="rounded-lg border border-blue-100 bg-blue-50/80 px-4 py-3 shadow-sm">
            <p className="text-[15px] font-semibold uppercase tracking-wide text-blue-700 mb-2">
              Deadline Timer
            </p>
            <p className=" text-3xl font-semibold text-red-600 leading-tight">
              {timeLeft}
            </p>
          </div>
        </div>

        {/* Mission Brief */}
        {projectDescription && (
          <div className="mb-6">
            <h4 className="text-xs sm:text-[15px] font-medium text-gray-700 mb-3">
              Project Description
            </h4>
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                {projectDescription}
              </p>
            </div>
          </div>
        )}

        {/* Tech Stack */}
        {techStack && techStack.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs sm:text-[15px] font-medium text-gray-700 mb-3">
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full border border-blue-100"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Difficulty */}
        {difficulty && (
          <div className="mb-6">
            <h4 className="text-xs sm:text-[15px] font-medium text-gray-700 mb-2">
              Difficulty
            </h4>
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-xs text-gray-700 font-medium">
              {difficulty}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}