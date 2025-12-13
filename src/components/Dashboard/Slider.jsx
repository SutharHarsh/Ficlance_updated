"use client";

import React from "react";
import Link from "next/link";
import { navItems, recentProjects } from "@/data/dashboard";

const Slider = () => {
  return (
    <aside className="w-64 bg-white shadow-sm hidden md:block h-[calc(100vh-72px)] sticky top-[72px] overflow-y-auto">
      <nav className="p-4 flex flex-col h-full justify-between">
        <ul className="space-y-1">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className={`flex items-center p-3 rounded-lg font-medium ${
                  item.active
                    ? "text-primary bg-indigo-50"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center mr-3 text-lg">
                  {item.icon}
                </div>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
            Recent Projects
          </h3>
          <ul className="space-y-1">
            {recentProjects.map((project, index) => (
              <li key={index}>
                <Link
                  href="#"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <div
                    className={`w-2 h-2 ${project.color} rounded-full mr-3`}
                  ></div>
                  {project.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Slider;
