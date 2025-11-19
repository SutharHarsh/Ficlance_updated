'use client';
import React from 'react';
import Link from 'next/link';
import { RiDownloadLine, RiAddLine } from 'react-icons/ri';

const WelcomeSection = ({ username = 'Alex', date = 'June 29, 2025', day = 'Sunday' }) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
      {/* Greeting Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {username}!
        </h1>
        <p className="text-gray-600">{date} | {day}</p>
      </div>

      {/* Button Actions */}
      <div className="mt-4 md:mt-0 flex space-x-3">
        <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition flex items-center whitespace-nowrap">
          <div className="w-5 h-5 flex items-center justify-center mr-2">
            <RiDownloadLine />
          </div>
          Export Report
        </button>
        
        <Link href="/new-project" className="flex items-center">
          <button className="bg-[#2D3047] text-yellow-200 px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition flex items-center whitespace-nowrap">
            <div className="w-5 h-5 flex items-center justify-center mr-2">
              <RiAddLine />
            </div>
            New Project
          </button>
        </Link>
      </div>
    </div>
  );
};

export default WelcomeSection;