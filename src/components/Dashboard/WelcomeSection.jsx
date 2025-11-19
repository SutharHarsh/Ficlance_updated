// components/WelcomeSection.jsx
"use client";

import React from "react";
import { RiDownloadLine, RiAddLine } from "react-icons/ri";
import PropTypes from "prop-types";
import Link from "next/link";

export default function WelcomeSection({ username = "Alex", date = "June 29, 2025", day = "Sunday", onOpenNewProject }) {
  const newProjectButton = (
    <button
      type="button"
      onClick={onOpenNewProject}
      aria-label="Open new project"
      className="bg-[#2D3047] text-yellow-200 px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition flex items-center whitespace-nowrap"
    >
      <div className="w-5 h-5 flex items-center justify-center mr-2" aria-hidden>
        <RiAddLine />
      </div>
      New Project
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {username}!</h1>
        <p className="text-gray-600">{date} | {day}</p>
      </div>

      <div className="mt-4 md:mt-0 flex space-x-3">
        <button
          className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition flex items-center whitespace-nowrap"
          type="button"
        >
          <div className="w-5 h-5 flex items-center justify-center mr-2" aria-hidden>
            <RiDownloadLine />
          </div>
          Export Report
        </button>

        {onOpenNewProject ? (
          newProjectButton
        ) : (
          <Link href="/new-project" className="flex items-center">
            {newProjectButton}
          </Link>
        )}
      </div>
    </div>
  );
}

WelcomeSection.propTypes = {
  username: PropTypes.string,
  date: PropTypes.string,
  day: PropTypes.string,
  onOpenNewProject: PropTypes.func,
};
