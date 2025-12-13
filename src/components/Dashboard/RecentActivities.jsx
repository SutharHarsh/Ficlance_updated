"use client"; // required for components using hooks or browser APIs

import {
  FiFileText,
  FiCheck,
  FiMessageSquare,
  FiAward,
  FiCalendar,
} from "react-icons/fi";

const activities = [
  {
    title: "Project Assigned",
    subtitle: "E-commerce Dashboard",
    description:
      "You've been assigned to a new project as a frontend developer.",
    timestamp: "Today, 10:30 AM",
    icon: <FiFileText className="text-white text-xs" />,
    bgColor: "bg-blue-500",
  },
  {
    title: "Task Completed",
    subtitle: "Mobile App UI",
    description: "You've completed the navigation design for the fitness app.",
    timestamp: "Yesterday, 3:45 PM",
    icon: <FiCheck className="text-white text-xs" />,
    bgColor: "bg-green-500",
  },
];

const RecentActivities = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Recent Activities
      </h2>
      {activities.map((activity, index) => (
        <div
          key={index}
          className={`relative pl-8 pb-6 border-l-2 border-gray-200 ${
            index === activities.length - 1 ? "pb-0" : ""
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
