"use client"; // Required in Next.js App Router if interactive

import clsx from "clsx";

// Priority styles mapping
const priorityStyles = {
  High: {
    bg: "bg-red-100",
    text: "text-red-600",
    badgeBg: "bg-red-100",
    badgeText: "text-red-800",
  },
  Medium: {
    bg: "bg-yellow-100",
    text: "text-yellow-600",
    badgeBg: "bg-yellow-100",
    badgeText: "text-yellow-800",
  },
  Low: {
    bg: "bg-green-100",
    text: "text-green-600",
    badgeBg: "bg-green-100",
    badgeText: "text-green-800",
  },
};

// Single deadline card
const DeadlineCard = ({ month, date, title, description, priority }) => {
  const styles = priorityStyles[priority] || priorityStyles.Low;

  return (
    <div className="flex items-start">
      {/* Date Badge */}
      <div
        className={clsx(
          "w-12 h-12 rounded-lg flex flex-col items-center justify-center mr-4 flex-shrink-0",
          styles.bg
        )}
      >
        <span className={clsx("text-xs font-medium", styles.text)}>{month}</span>
        <span className={clsx("text-sm font-bold", styles.text)}>{date}</span>
      </div>

      {/* Content */}
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
        <span
          className={clsx(
            "inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium",
            styles.badgeBg,
            styles.badgeText
          )}
        >
          {priority} Priority
        </span>
      </div>
    </div>
  );
};

// Main component
const UpcomingDeadlines = ({ deadlines = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Upcoming Deadlines
      </h2>

      <div className="space-y-4">
        {deadlines.length === 0 ? (
          <p className="text-sm text-gray-400">No upcoming deadlines.</p>
        ) : (
          deadlines.map((item, idx) => (
            <DeadlineCard key={idx} {...item} />
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingDeadlines;