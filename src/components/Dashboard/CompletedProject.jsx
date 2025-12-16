"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { AiOutlineCheck, AiFillStar } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";

// Single reusable card
const CompletedProjectCard = ({ id, title, date, progress, icon }) => {
  return (
    <Link href={`/chat/${id}`}>
      <div className="flex items-center p-3  rounded-lg hover:bg-secondary dark:hover:bg-card-foreground transition cursor-pointer">
        {/* Icon Section */}
        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mr-4">
          {icon || <AiOutlineCheck className="text-green-600 text-lg" />}
        </div>

        {/* Title + Date */}
        <div className="flex-1">
          <h3 className="font-medium text-foreground">{title}</h3>
          <p className="text-sm text-low-foreground">Completed on {date}</p>
        </div>

        {/* Rating + More Options */}
        <div className="flex items-center">
          <div className="flex items-center text-sm text-low-foreground font-medium">
            <span>{progress ?? 0}% done</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Main component
const CompletedProject = ({ onViewAll }) => {
  const { data: session } = useSession();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      fetchCompletedProjects();
    }
  }, [session]);

  const fetchCompletedProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/dashboard/projects?userId=${session.user.email}&type=completed`
      );
      if (res.ok) {
        const data = await res.json();
        const now = Date.now();
        // Show only projects whose deadline has passed
        const pastDeadline = (data || []).filter((p) => {
          const ts = p.deadlineTimestamp ?? (p.deadline ? new Date(p.deadline).getTime() : null);
          return ts !== null && ts < now;
        });
        // Sort newest first and limit to 5
        const limited = pastDeadline
          .sort((a, b) => (b.deadlineTimestamp ?? 0) - (a.deadlineTimestamp ?? 0))
          .slice(0, 5);
        setProjects(limited);
      }
    } catch (error) {
      console.error("Error fetching completed projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // if (loading) {
  //   return (
  //     <div className="bg-card rounded-xl shadow-sm p-6">
  //       <div className="h-6 bg-card-foreground rounded w-1/3 mb-6 animate-pulse"></div>
  //       <div className="space-y-4">
  //         {[...Array(2)].map((_, i) => (
  //           <div key={i} className="flex items-center p-3 border border-card-foreground rounded-lg animate-pulse">
  //             <div className="w-10 h-10 rounded-lg bg-card-foreground mr-4"></div>
  //             <div className="flex-1">
  //               <div className="h-5 bg-card-foreground rounded w-1/2 mb-2"></div>
  //               <div className="h-4 bg-card-foreground rounded w-1/3"></div>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="bg-card rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-foreground">
          Completed Projects
        </h2>
        <Link
          href="/chat"
          className="text-sm text-gray-500 hover:text-primary hover:underline animation-all duration-200"
        >
          View All
        </Link>
      </div>

      {/* Project List */}
      <div className="flex flex-col gap-4">
        {projects.length === 0 ? (
          <p className="text-sm text-foreground">No completed projects yet.</p>
        ) : (
          projects.map((project) => (
            <CompletedProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              date={project.date}
              progress={project.progress}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CompletedProject;