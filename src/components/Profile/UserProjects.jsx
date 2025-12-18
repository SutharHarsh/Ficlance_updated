"use client";

import React, { useState, useEffect } from "react";
import {
  FolderOpen,
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  Plus,
  ChevronRight,
  Calendar,
  Flag
} from "lucide-react";

const statusConfig = {
  active: {
    label: "Active",
    icon: Zap,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950"
  },
  completed: {
    label: "Completed",
    icon: CheckCircle,
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-950"
  },
  paused: {
    label: "Paused",
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950"
  },
  overdue: {
    label: "Overdue",
    icon: AlertCircle,
    color: "text-red-500",
    bg: "bg-red-50 dark:bg-red-950"
  }
};

const priorityConfig = {
  low: { label: "Low", color: "text-gray-500" },
  medium: { label: "Medium", color: "text-blue-500" },
  high: { label: "High", color: "text-orange-500" },
  urgent: { label: "Urgent", color: "text-red-500" }
};

export default function UserProjects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  useEffect(() => {
    fetchUserProjects();
  }, []);

  const fetchUserProjects = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/profile/user-projects");
      const data = await response.json();

      if (data.success) {
        setProjects(data.data || []);
      } else {
        setError(data.error || "Failed to load projects");
      }
    } catch (err) {
      console.error("Projects fetch error:", err);
      setError("Failed to load your projects");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "No deadline";
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";

    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 30) return "bg-amber-500";
    return "bg-gray-300";
  };

  if (isLoading) {
    return (
      <div className="relative bg-card/30 backdrop-blur-sm rounded-2xl border border-border/50 p-12">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative w-16 h-16 mb-6">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-muted-foreground font-medium">Loading your projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative bg-card/30 backdrop-blur-sm rounded-2xl border border-border/50 p-12">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <AlertCircle size={40} className="text-red-500" />
          </div>
          <p className="text-foreground font-semibold text-lg mb-2">Something went wrong</p>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={fetchUserProjects}
            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-card/50 to-secondary/30 backdrop-blur-sm rounded-2xl border border-border/50 p-12">
        {/* Decorative gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 -z-10" />
        
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full flex items-center justify-center border border-border/50">
              <FolderOpen size={40} className="text-primary" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-foreground mb-3">
            Your Portfolio Awaits
          </h3>
          <p className="text-muted-foreground text-center max-w-md mb-8 leading-relaxed">
            Start building your professional portfolio. Create projects to showcase your work and track your progress.
          </p>
          
          <a
            href="/new-project"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl hover:shadow-2xl transition-all shadow-lg font-medium hover:scale-105"
          >
            <Plus size={20} />
            Create Your First Project
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Refined Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Project Showcase</h2>
          <p className="text-sm text-muted-foreground">
            {projects.length} {projects.length === 1 ? "project" : "projects"} in progress
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Mode Toggle - More Premium */}
          <div className="inline-flex items-center gap-1 p-1 bg-secondary/50 rounded-xl border border-border/50">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === "grid"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === "list"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              List
            </button>
          </div>
          
          <a
            href="/new-project"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-blue-600 transition-all shadow-md hover:shadow-lg text-sm font-medium"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">New Project</span>
          </a>
        </div>
      </div>

      {/* Projects Showcase Grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const status = project.status || "active";
            const StatusIcon = statusConfig[status]?.icon || Zap;
            const priority = project.priority || "medium";

            return (
              <div
                key={project._id}
                className="group relative overflow-hidden bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-primary/30 p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 rounded-2xl" />
                
                <div className="relative">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0 pr-3">
                      <h3 className="font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors truncate">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                      )}
                    </div>
                    <span
                      className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm ${statusConfig[status]?.bg} border border-${status === 'completed' ? 'green' : status === 'active' ? 'blue' : status === 'overdue' ? 'red' : 'amber'}-200 dark:border-${status === 'completed' ? 'green' : status === 'active' ? 'blue' : status === 'overdue' ? 'red' : 'amber'}-800`}
                    >
                      <StatusIcon size={12} className={statusConfig[status]?.color} />
                      <span className="hidden sm:inline">{statusConfig[status]?.label}</span>
                    </span>
                  </div>

                  {/* Progress Section - More Visual */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Progress</span>
                      <span className="text-sm font-bold text-foreground">
                        {project.progress || 0}%
                      </span>
                    </div>
                    <div className="relative w-full h-2.5 bg-secondary/50 rounded-full overflow-hidden shadow-inner">
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${getProgressColor(
                          project.progress || 0
                        )} shadow-sm`}
                        style={{ width: `${project.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Meta Info with Icons */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/30">
                    {project.deadline && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                        <Calendar size={14} />
                        {formatDate(project.deadline)}
                      </div>
                    )}
                    <div
                      className={`flex items-center gap-1.5 text-xs font-semibold ${
                        priorityConfig[priority]?.color
                      }`}
                    >
                      <Flag size={14} />
                      {priorityConfig[priority]?.label}
                    </div>
                  </div>

                  {/* Quick Action - Appears on Hover */}
                  <a
                    href={`/client/${project.title}`}
                    className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1 text-xs font-semibold text-primary hover:text-blue-600"
                  >
                    View
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View - Also Premium */
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {projects.map((project) => {
                  const status = project.status || "active";
                  const StatusIcon = statusConfig[status]?.icon || Zap;
                  const priority = project.priority || "medium";

                  return (
                    <tr
                      key={project._id}
                      className="group hover:bg-secondary/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {project.title}
                          </span>
                          {project.description && (
                            <span className="text-xs text-muted-foreground mt-1 line-clamp-1">
                              {project.description}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${statusConfig[status]?.bg} border border-border/50 shadow-sm`}
                        >
                          <StatusIcon size={12} className={statusConfig[status]?.color} />
                          {statusConfig[status]?.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 max-w-[120px]">
                            <div className="w-full h-2 bg-secondary/50 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${getProgressColor(
                                  project.progress || 0
                                )}`}
                                style={{ width: `${project.progress || 0}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-foreground min-w-[35px] text-right">
                            {project.progress || 0}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                            priorityConfig[priority]?.color
                          }`}
                        >
                          <Flag size={12} />
                          {priorityConfig[priority]?.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                          <Calendar size={12} />
                          {formatDate(project.deadline)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <a
                          href={`/client/${project.title}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-blue-600 transition-colors"
                        >
                          View
                          <ChevronRight size={14} />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
