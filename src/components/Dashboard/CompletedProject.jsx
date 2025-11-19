"use client"; // ensure client-side rendering in Next.js app router

import { AiOutlineCheck, AiFillStar } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";

// Single reusable card
const CompletedProjectCard = ({ title, date, rating }) => {
  return (
    <div className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
      {/* Icon Section */}
      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mr-4">
        <AiOutlineCheck className="text-green-600 text-lg" />
      </div>

      {/* Title + Date */}
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">Completed on {date}</p>
      </div>

      {/* Rating + More Options */}
      <div className="flex items-center">
        <div className="flex items-center">
          <AiFillStar className="text-yellow-400 w-5 h-5 mr-1" />
          <span className="text-sm font-medium text-gray-700">{rating}</span>
        </div>
        <button
          aria-label="More options"
          className="ml-4 text-gray-400 hover:text-gray-500"
        >
          <BsThreeDotsVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Main component
const CompletedProject = ({ projects = [], onViewAll }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Completed Projects
        </h2>
        <button
          onClick={onViewAll}
          className="text-sm text-gray-500 hover:text-primary"
        >
          View All
        </button>
      </div>

      {/* Project List */}
      <div className="space-y-4">
        {projects.length === 0 ? (
          <p className="text-sm text-gray-400">No completed projects yet.</p>
        ) : (
          projects.map((project, idx) => (
            <CompletedProjectCard
              key={idx}
              title={project.title}
              date={project.date}
              rating={project.rating}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CompletedProject;