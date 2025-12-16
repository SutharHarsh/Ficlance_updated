"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
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

// Helper: format remaining time
const formatTimeLeft = (deadlineTs) => {
  const ms = deadlineTs - Date.now();
  if (ms <= 0) return null;
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) return `in ${days} day${days > 1 ? "s" : ""}`;
  if (hours > 0) return `in ${hours} hour${hours > 1 ? "s" : ""}`;
  if (minutes > 0) return `in ${minutes} min${minutes > 1 ? "s" : ""}`;
  return "in <1 min";
};

// Single deadline card
const DeadlineCard = ({ id, month, date, title, description, priority, deadlineTimestamp }) => {
  const styles = priorityStyles[priority] || priorityStyles.Low;
  const timeLeft = deadlineTimestamp ? formatTimeLeft(deadlineTimestamp) : null;

  return (
    <Link href={`/chat/${id}`}>
      <div className="flex items-start cursor-pointer hover:bg-secondary dark:hover:bg-card-foreground p-2 rounded-lg transition">
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
          <h3 className="font-medium text-foreground">{title}</h3>
          <p className="text-sm text-low-foreground">
            {description}
            {timeLeft && <span className="ml-2">• {timeLeft}</span>}
          </p>
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
    </Link>
  );
};

// Main component
const UpcomingDeadlines = () => {
  const { data: session } = useSession();
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(3);

  useEffect(() => {
    if (session?.user?.email) {
      fetchDeadlines();
    }
  }, [session]);

  const fetchDeadlines = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        // `/api/dashboard/projects?userId=${session.user.email}&type=deadlines`
        `/api/conversations/deadlines`
      );
      if (res.ok) {
        const data = await res.json();
        // Filter out passed deadlines - only show future deadlines
        const now = new Date().getTime();
        const futureDeadlines = data.filter(deadline => 
          deadline.deadlineTimestamp && deadline.deadlineTimestamp > now
        );
        setDeadlines(futureDeadlines);
      }
    } catch (error) {
      console.error("Error fetching deadlines:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeeMore = () => {
    setDisplayCount(prev => prev + 3);
  };

  const visibleDeadlines = deadlines.slice(0, displayCount);
  const hasMore = displayCount < deadlines.length;

  // if (loading) {
  //   return (
  //     <div className="bg-card rounded-xl shadow-sm p-6">
  //       <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
  //       <div className="space-y-4">
  //         {[...Array(2)].map((_, i) => (
  //           <div key={i} className="flex items-start animate-pulse">
  //             <div className="w-12 h-12 rounded-lg bg-gray-200 mr-4"></div>
  //             <div className="flex-1">
  //               <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
  //               <div className="h-4 bg-gray-200 rounded w-full"></div>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="bg-card rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Upcoming Deadlines
      </h2>

      <div className="space-y-4">
        {deadlines.length === 0 ? (
          <p className="text-sm text-gray-400">No upcoming deadlines.</p>
        ) : (
          <>
            {visibleDeadlines.map((item) => (
              <DeadlineCard key={item.id} id={item.id} {...item} />
            ))}
            
            {/* See More Button */}
            {hasMore && (
              <div className="pt-2">
                <button
                  onClick={handleSeeMore}
                  className="w-full py-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors hover:underline"
                >
                  See More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UpcomingDeadlines;