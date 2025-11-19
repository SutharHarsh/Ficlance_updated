// components/Chat/ProjectSidebar.jsx
"use client";

import React from "react";
import PropTypes from "prop-types";

/**
 * ProjectSidebar
 * - Place this file at: components/Chat/ProjectSidebar.jsx
 * - Exports default component expected by ChatLayout.jsx
 */

export default function ProjectSidebar({ projectSlug }) {
  // In a real app you'd fetch project details by slug.
  // Keep this component static / mock data for now — you'll wire it later.
  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-medium text-gray-900">Project Details</h3>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Project Status</h4>
          <div className="bg-gray-100 rounded-full h-2 mb-2">
            <div className="bg-[#3b82f6] h-2 rounded-full w-[65%]"></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>65% Complete</span>
            <span>Due: July 15, 2025</span>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Mission Brief</h4>
          <div className="bg-gray-50 rounded p-3 text-sm text-gray-700">
            <p>
              Redesign the client's site with a focus on improving UX & conversions.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Team Members</h4>
          <div className="flex -space-x-2 mb-2">
            <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center">
              <span className="text-[#3b82f6] text-xs font-medium">JD</span>
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-100 flex items-center justify-center">
              <span className="text-purple-600 text-xs font-medium">SL</span>
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-white bg-yellow-100 flex items-center justify-center">
              <span className="text-yellow-600 text-xs font-medium">AR</span>
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-white bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-xs font-medium">EC</span>
            </div>
          </div>
          <button className="text-[#3b82f6] text-sm font-medium">View all</button>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Upcoming Deadlines</h4>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded p-3">
              <div className="flex justify-between items-start mb-1">
                <h5 className="text-sm font-medium text-gray-900">Homepage Mockups</h5>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Tomorrow</span>
              </div>
              <p className="text-xs text-gray-600">Final designs for homepage</p>
            </div>
            <div className="bg-gray-50 rounded p-3">
              <div className="flex justify-between items-start mb-1">
                <h5 className="text-sm font-medium text-gray-900">Product Page Prototype</h5>
                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">July 5</span>
              </div>
              <p className="text-xs text-gray-600">Interactive prototype</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Shared Files</h4>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded p-3 flex items-center">
              <div className="w-8 h-8 flex items-center justify-center bg-blue-50 rounded text-[#3b82f6] mr-3">📄</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Project Brief.pdf</p>
                <p className="text-xs text-gray-500">Shared 2 weeks ago</p>
              </div>
              <button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-600">⬇️</button>
            </div>
            <div className="bg-gray-50 rounded p-3 flex items-center">
              <div className="w-8 h-8 flex items-center justify-center bg-blue-50 rounded text-[#3b82f6] mr-3">🖼️</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Brand Assets.zip</p>
                <p className="text-xs text-gray-500">Shared 1 week ago</p>
              </div>
              <button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-600">⬇️</button>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Communication Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Email Notifications</span>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Desktop Notifications</span>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Sound Alerts</span>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

ProjectSidebar.propTypes = {
  projectSlug: PropTypes.string,
};
