'use client';
import React from 'react';
import Link from 'next/link';
import ProjectCard from './ProjectCard';
import {
  RiLayout4Line,
  RiDatabase2Line,
  RiSmartphoneLine,
  RiCodeSSlashLine,
  RiArrowRightLine,
} from 'react-icons/ri';

const projectData = [
  {
    title: 'E-commerce Dashboard',
    description:
      'Design and implement a responsive admin dashboard for an e-commerce platform.',
    icon: <RiLayout4Line />,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    priority: 'Medium',
    priorityColor: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    progress: 65,
    progressColor: 'bg-blue-500',
    team: [
      { initials: 'JD', bg: 'bg-indigo-500' },
      { initials: 'MK', bg: 'bg-pink-500' },
    ],
    dueDate: 'Jul 15',
  },
];

const InprogressProject = () => {
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
        {projectData.map((project, index) => (
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