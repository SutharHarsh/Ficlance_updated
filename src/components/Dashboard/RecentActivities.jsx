"use client"; // required for components using hooks or browser APIs

import { recentActivities as activitiesData } from "@/data/dashboard";

const RecentActivities = ({ items = activitiesData }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Recent Activities
      </h2>
      {items.map((activity, index) => (
        <div
          key={index}
          className={`relative pl-8 pb-6 border-l-2 border-gray-200 ${
            index === items.length - 1 ? "pb-0" : ""
          }`}
        >
          {/* Icon Dot */}
          <div
            className={`absolute left-0 top-0 w-6 h-6 rounded-full ${activity.bgColor} -translate-x-1/2 flex items-center justify-center`}
          >
            {activity.icon}
          </div>

          {/* Activity Content */}
          <div className="mb-1">
            <span className="font-medium text-gray-900">{activity.title}</span>
            <span className="text-sm text-gray-500 ml-2">
              {activity.subtitle}
            </span>
          </div>
          <p className="text-sm text-gray-600">{activity.description}</p>
          <span className="text-xs text-gray-400 mt-1 block">
            {activity.timestamp}
          </span>
        </div>
      ))}
    </div>
  );
};

export default RecentActivities;
