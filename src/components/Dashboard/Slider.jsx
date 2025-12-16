"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { navItems } from "@/data/dashboard";

// Skeleton Components
const NavItemSkeleton = () => (
  <li className="animate-pulse">
    <div className="flex items-center p-3 rounded-lg">
      <div className="w-5 h-5 bg-card-foreground rounded mr-3"></div>
      <div className="h-4 bg-card-foreground rounded w-24"></div>
    </div>
  </li>
);

const RecentProjectSkeleton = () => (
  <li className="animate-pulse">
    <div className="flex items-center p-3 rounded-lg">
      <div className="w-2 h-2 bg-card-foreground rounded-full mr-3"></div>
      <div className="h-4 bg-card-foreground rounded w-32"></div>
    </div>
  </li>
);

const Slider = ({ isLoading = false }) => {
  const { data: session } = useSession();
  const [recentProjects, setRecentProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  // Fetch recent projects
  useEffect(() => {
    if (session?.user?.email) {
      fetchRecentProjects();
    }
  }, [session]);

  const fetchRecentProjects = async () => {
    try {
      setProjectsLoading(true);
      const res = await fetch(
        `/api/dashboard/projects?userId=${session.user.email}&type=recent`
      );
      if (res.ok) {
        const data = await res.json();
        setRecentProjects(data);
      }
    } catch (error) {
      console.error("Error fetching recent projects:", error);
    } finally {
      setProjectsLoading(false);
    }
  };

  return (
    <aside className="w-64 bg-card shadow-sm hidden md:block h-[calc(100vh-72px)] sticky top-[72px] overflow-y-auto">
      <nav className="p-4 flex flex-col h-full justify-between">
        <ul className="space-y-1">
          {isLoading ? (
            [...Array(4)].map((_, index) => <NavItemSkeleton key={index} />)
          ) : (
            <div className="animate-fadeIn">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-3 rounded-lg font-medium ${
                      item.active
                        ? "text-primary bg-primary/10"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    <div className="w-5 h-5 flex items-center justify-center mr-3 text-lg">
                      {item.icon}
                    </div>
                    {item.name}
                  </Link>
                </li>
              ))}
            </div>
          )}
        </ul>

        <div className="mt-8 pt-6 border-t border-border">
          {projectsLoading || isLoading ? (
            <>
              <div className="h-3 bg-card-foreground rounded w-24 mb-3 px-3 animate-pulse"></div>
              <ul className="space-y-1">
                {[...Array(3)].map((_, index) => (
                  <RecentProjectSkeleton key={index} />
                ))}
              </ul>
            </>
          ) : (
            <div className="animate-fadeIn">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                Recent Projects
              </h3>
              <ul className="space-y-1">
                {recentProjects.length === 0 ? (
                  <li className="px-3 py-2 text-sm text-muted-foreground">
                    No projects yet
                  </li>
                ) : (
                  recentProjects.map((project) => (
                    <li key={project.id}>
                      <Link
                        href={`/chat/${project.id}`}
                        className="flex items-center p-3 text-foreground hover:bg-secondary dark:hover:bg-card-foreground rounded-lg"
                      >
                        <div
                          className={`w-2 h-2 ${project.color} rounded-full mr-3`}
                        ></div>
                        {project.name}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Slider;
