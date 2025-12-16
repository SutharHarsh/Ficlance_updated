"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ProjectCard from "./ProjectCard";
import { RiArrowRightLine, RiSearchLine } from "react-icons/ri";

const InprogressProject = () => {
  const { data: session } = useSession();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(4);

  useEffect(() => {
    if (session?.user?.email) {
      fetchInProgressProjects();
    }
  }, [session]);

  useEffect(() => {
    // Filter projects based on search query
    if (!searchQuery.trim()) {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
    // Reset display count when search changes
    setDisplayCount(4);
  }, [searchQuery, projects]);

  const fetchInProgressProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/dashboard/projects?userId=${session.user.email}&type=in-progress`
      );
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
        setFilteredProjects(data);
      }
    } catch (error) {
      console.error("Error fetching in-progress projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 4);
  };

  const visibleProjects = filteredProjects.slice(0, displayCount);
  const hasMore = displayCount < filteredProjects.length;

  return (
    <div className="bg-card rounded-xl shadow-sm p-6 mb-6">
      {/* Header with search */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            In Progress Projects
          </h2>
          {/* Search Bar */}
          <div className="relative w-96">
            <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 bg-secondary dark:bg-card-foreground focus:ring-primary/20 focus:border-primary transition"
            />
          </div>
        </div>
      </div>

      {/* Grid of project cards */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>
            {searchQuery
              ? "No projects found matching your search"
              : "No in-progress projects yet. Start your first project!"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {visibleProjects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        </>
      )}

      {/* Footer CTA */}
      <div className="mt-6 text-center">
        <Link
          href="/chat"
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
