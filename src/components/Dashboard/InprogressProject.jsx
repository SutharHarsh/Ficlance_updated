'use client';
import React from 'react';
import Link from 'next/link';
import ProjectCard from './ProjectCard';
import { RiArrowRightLine } from 'react-icons/ri';
import { inProgressProjects } from '@/data/dashboard';

const InprogressProject = ({ projects = inProgressProjects }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      {/* Header with filters */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          In Progress Projects
        </h2>
        <div className="flex space-x-2">
          {['All', 'Frontend', 'Backend'].map((label, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded-full text-sm transition whitespace-nowrap ${
                label === 'All'
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of project cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>

      {/* Footer CTA */}
      <div className="mt-6 text-center">
        <Link
          href="/projects"
          className="text-primary font-medium hover:underline flex items-center justify-center mx-auto whitespace-nowrap"
        >
          View All Projects
          <span className="w-5 h-5 ml-1 flex items-center justify-center">
            <RiArrowRightLine />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default InprogressProject;