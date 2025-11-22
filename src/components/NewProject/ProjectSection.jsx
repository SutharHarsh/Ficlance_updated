"use client"; 

import { useEffect, useMemo, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaCode, FaPlay } from "react-icons/fa";
import ProjectCard from "./ProjectCard";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const projectsData = [
  {
    id: 1,
    title: "E-commerce Product Page",
    description:
      "Design and develop a responsive product page with filtering options, image gallery, and add-to-cart functionality.",
    duration: "3-5 days",
    difficulty: "Intermediate",
    difficultyLevel: 3,
    estimatedHours: "12-15",
    technologies: ["React", "CSS", "API"],
    gradientColors: "from-blue-500 via-blue-600 to-indigo-600",
  },
  {
    id: 2,
    title: "Landing Page Design",
    description:
      "Create a modern landing page for a SaaS product with responsive layout, animations, and email signup form.",
    duration: "1-2 days",
    difficulty: "Beginner",
    difficultyLevel: 2,
    estimatedHours: "6-8",
    technologies: ["HTML", "CSS", "JavaScript"],
    gradientColors: "from-purple-500 via-purple-600 to-pink-500",
  },
  {
    id: 3,
    title: "Dashboard UI Development",
    description:
      "Build a complete admin dashboard with data visualization, user management, and responsive layouts.",
    duration: "1 week+",
    difficulty: "Advanced",
    difficultyLevel: 4,
    estimatedHours: "20-25",
    technologies: ["React", "TypeScript", "Chart.js"],
    gradientColors: "from-green-500 via-emerald-500 to-teal-500",
  },
  {
    id: 4,
    title: "Blog Platform API",
    description:
      "Develop a RESTful API for a blog platform with user authentication, post management, and comments.",
    duration: "3-5 days",
    difficulty: "Intermediate",
    difficultyLevel: 3,
    estimatedHours: "15-18",
    technologies: ["Node.js", "Express", "MongoDB"],
    gradientColors: "from-yellow-400 via-orange-400 to-orange-500",
  },
  {
    id: 5,
    title: "Mobile App UI Design",
    description:
      "Create a mobile app UI design for a fitness tracking application with clean and modern aesthetics.",
    duration: "1-2 days",
    difficulty: "Beginner",
    difficultyLevel: 2,
    estimatedHours: "8-10",
    technologies: ["Figma", "UI/UX", "Mobile"],
    gradientColors: "from-red-500 via-rose-500 to-pink-500",
  },
  {
    id: 6,
    title: "Full-Stack Social Platform",
    description:
      "Build a social media platform with user profiles, posts, comments, and real-time notifications.",
    duration: "1 week+",
    difficulty: "Advanced",
    difficultyLevel: 5,
    estimatedHours: "30-35",
    technologies: ["React", "Node.js", "Socket.io"],
    gradientColors: "from-blue-400 via-cyan-400 to-cyan-500",
  },
];

const additionalProjects = [
  {
    id: 7,
    title: "Weather App PWA",
    description:
      "Create a progressive web app for weather forecasting with offline functionality and location services.",
    duration: "2-3 days",
    difficulty: "Intermediate",
    difficultyLevel: 3,
    estimatedHours: "10-12",
    technologies: ["React", "PWA", "API"],
    gradientColors: "from-cyan-500 via-sky-500 to-blue-500",
  },
  {
    id: 8,
    title: "Task Management Tool",
    description:
      "Build a collaborative task management application with drag-and-drop functionality and team features.",
    duration: "1 week",
    difficulty: "Advanced",
    difficultyLevel: 4,
    estimatedHours: "25-30",
    technologies: ["React", "Node.js", "MongoDB"],
    gradientColors: "from-emerald-500 via-green-500 to-teal-600",
  },
  {
    id: 9,
    title: "Real-time Chat Application",
    description:
      "Develop a real-time messaging app with file sharing, emoji support, and group chat functionality.",
    duration: "4-6 days",
    difficulty: "Advanced",
    difficultyLevel: 4,
    estimatedHours: "18-22",
    technologies: ["React", "Socket.io", "Node.js"],
    gradientColors: "from-violet-500 via-purple-500 to-indigo-600",
  },
  {
    id: 10,
    title: "Portfolio Website Builder",
    description:
      "Create a customizable portfolio website builder with drag-and-drop components and theme selection.",
    duration: "1 week",
    difficulty: "Advanced",
    difficultyLevel: 4,
    estimatedHours: "22-28",
    technologies: ["React", "Next.js", "Tailwind"],
    gradientColors: "from-pink-500 via-rose-500 to-red-500",
  },
  {
    id: 11,
    title: "Recipe Sharing Platform",
    description:
      "Build a recipe sharing platform with user-generated content, ratings, and cooking timers.",
    duration: "3-5 days",
    difficulty: "Intermediate",
    difficultyLevel: 3,
    estimatedHours: "14-18",
    technologies: ["React", "Firebase", "CSS"],
    gradientColors: "from-orange-500 via-amber-500 to-yellow-500",
  },
  {
    id: 12,
    title: "Expense Tracker App",
    description:
      "Develop a personal finance tracker with budget planning, expense categorization, and visual reports.",
    duration: "2-3 days",
    difficulty: "Beginner",
    difficultyLevel: 2,
    estimatedHours: "8-12",
    technologies: ["React", "Chart.js", "LocalStorage"],
    gradientColors: "from-green-400 via-emerald-400 to-teal-400",
  },
  {
    id: 13,
    title: "Video Streaming Platform",
    description:
      "Create a video streaming platform with playlist management, comments, and user subscriptions.",
    duration: "1 week+",
    difficulty: "Advanced",
    difficultyLevel: 5,
    estimatedHours: "35-40",
    technologies: ["React", "Node.js", "AWS"],
    gradientColors: "from-red-600 via-pink-600 to-purple-600",
  },
  {
    id: 14,
    title: "Fitness Workout Planner",
    description:
      "Build a workout planning app with exercise library, progress tracking, and custom routines.",
    duration: "3-5 days",
    difficulty: "Intermediate",
    difficultyLevel: 3,
    estimatedHours: "12-16",
    technologies: ["React", "MongoDB", "API"],
    gradientColors: "from-blue-500 via-indigo-500 to-purple-500",
  },
  {
    id: 15,
    title: "E-learning Platform",
    description:
      "Develop an online learning platform with course management, quizzes, and progress tracking.",
    duration: "1 week+",
    difficulty: "Advanced",
    difficultyLevel: 5,
    estimatedHours: "30-35",
    technologies: ["React", "Node.js", "PostgreSQL"],
    gradientColors: "from-indigo-500 via-blue-500 to-cyan-500",
  },
];


// const router = useRouter();

const projectMatchesFilters = (project, filters) => {
  if (!filters) return true;

  const { difficulty, skills, duration } = filters;

  // Difficulty filter
  if (difficulty && difficulty !== "All") {
    if (
      !project.difficulty ||
      project.difficulty.toLowerCase() !== difficulty.toLowerCase()
    ) {
      return false;
    }
  }

  // Duration filter
  if (duration && duration !== "Any duration") {
    if (
      !project.duration ||
      !project.duration.toLowerCase().includes(duration.split(" ")[0])
    ) {
      // fallback check: if duration text doesn't include the same token, attempt simple contains
      if (!project.duration.toLowerCase().includes(duration.toLowerCase())) {
        return false;
      }
    }
  }

  // Skills filter (if any skills selected)
  if (Array.isArray(skills) && skills.length > 0) {
    // normalize strings
    const projectTechs = (project.technologies || []).map((t) =>
      (t || "").toLowerCase()
    );

    // If any selected skill matches any project tech (loose matching), it's a hit.
    const selected = skills.map((s) => (s || "").toLowerCase());

    const anyMatch = selected.some((sel) =>
      projectTechs.some((tech) => tech.includes(sel) || sel.includes(tech))
    );

    if (!anyMatch) return false;
  }

  return true;
};

export default function ProjectSection({ filters = null }) {
  const router = useRouter(); 
  const { data: session } = useSession();
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  // combine lists
  const allProjects = useMemo(
    () => [...projectsData, ...additionalProjects],
    []
  );

  // Show loading when filters change
  useEffect(() => {
    if (filters) {
      setIsFiltering(true);
      const timer = setTimeout(() => setIsFiltering(false), 600);
      return () => clearTimeout(timer);
    }
  }, [filters]);

  // compute displayed projects based on filters
  const filteredProjects = useMemo(() => {
    if (!filters) {
      return showAllProjects ? allProjects : projectsData.slice(0, 6);
    }
    // apply filter to full list (include additionalProjects when filtering)
    const listToSearch = allProjects;
    const result = listToSearch.filter((p) =>
      projectMatchesFilters(p, filters)
    );
    // if user didn't explicitly click Load More, show up to 6
    return showAllProjects ? result : result.slice(0, 6);
  }, [filters, showAllProjects, allProjects]);

  useEffect(() => {
    // if filters change, reset selectedProject (optional)
    setSelectedProject((prev) => {
      if (!prev) return null;
      const stillExists = filteredProjects.some((p) => p.id === prev);
      return stillExists ? prev : null;
    });
  }, [filters]); // eslint-disable-line

  const handleProjectSelect = (projectId) => {
    setSelectedProject(projectId);
  };

  const handleLoadMore = () => {
    setShowAllProjects(true);
  };

  const handleStartSimulation = async () => {
    if (!selectedProject) return;
    if (!session) {
      alert("Please sign in to start a simulation.");
      return;
    }

    setIsLoading(true);
    const project = allProjects.find((p) => p.id === selectedProject);

    try {
      // 1. Call requirements API
      const payload = {
        Expertise: filters?.difficulty || "Intermediate",
        TechStack: filters?.skills || [],
        Duration: filters?.duration || "3-5 days",
        ProjectName: project.title,
        Description: project.description,
      };

      const reqResponse = await fetch("/api/proxy/requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!reqResponse.ok) {
        throw new Error("Failed to fetch requirements");
      }

      const reqData = await reqResponse.json();

      // 2. Create Conversation
      const convResponse = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.email, // Using email as userId for now, or session.user.id if available
          projectId: project.id,
          projectName: project.title,
          duration: reqData.duration || project.duration,
          requirements: reqData,
          aiName: reqData.ai_name,
        }),
      });

      if (!convResponse.ok) {
        throw new Error("Failed to create conversation");
      }

      const convData = await convResponse.json();

      // 3. Redirect to chat
      router.push(`/chat/${convData.conversationId}`);

    } catch (error) {
      console.error("Error starting simulation:", error);
      alert("An error occurred while starting the simulation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-10 bg-white m-8 rounded-2xl pb-24 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.description}
              duration={project.duration}
              difficulty={project.difficulty}
              difficultyLevel={project.difficultyLevel}
              estimatedHours={project.estimatedHours}
              technologies={project.technologies}
              gradientColors={project.gradientColors}
              isSelected={selectedProject === project.id}
              onSelect={handleProjectSelect}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-10">
            No projects match your filters.
          </div>
        )}
      </div>

      {/* Load More Button */}
      {!showAllProjects && filteredProjects.length > 6 && (
        <div className="flex justify-center">
          <button
            className="group flex items-center gap-2 px-6 py-3 text-blue-600 font-medium hover:text-white bg-blue-50 hover:bg-blue-600 rounded-full border border-blue-200 hover:border-blue-600 transition-all duration-300 shadow-sm"
            onClick={handleLoadMore}
          >
            <span>Load More Projects</span>
            <MdKeyboardArrowDown className="text-lg group-hover:translate-y-1 transition-transform duration-200" />
          </button>
        </div>
      )}

      {/* Selected Project Summary Bar */}
      {selectedProject && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] z-50 bg-white border border-gray-300 shadow-2xl rounded-2xl px-6 py-4 backdrop-blur-md transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Left Code Icon + Info */}
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-10 h-10 min-w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <FaCode className="text-white text-lg" />
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                  {allProjects.find((p) => p.id === selectedProject)?.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {
                    allProjects.find((p) => p.id === selectedProject)
                      ?.difficulty
                  }{" "}
                  • Est.{" "}
                  {
                    allProjects.find((p) => p.id === selectedProject)
                      ?.estimatedHours
                  }{" "}
                  hours
                </p>
              </div>
            </div>

            {/* CTA Button with Play Icon */}
            <button
              className={`group inline-flex items-center gap-2 px-6 py-2 text-white 
             text-sm sm:text-base font-semibold rounded-full 
             transition duration-200 shadow-md disabled:opacity-70 disabled:cursor-not-allowed
             ${isLoading ? "bg-gray-500" : "bg-[#2D3047] hover:bg-[#1f2235]"}`}
              onClick={handleStartSimulation}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Initializing Simulation...</span>
                </div>
              ) : (
                <>
                  <FaPlay className="text-xs group-hover:scale-110 transition-transform duration-200" />
                  Start Simulating
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Full screen loading overlay for better feedback */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center animate-bounce-small">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900">Setting up your workspace...</h3>
                <p className="text-sm text-gray-500 mt-2">Connecting to AI agents and preparing requirements.</p>
            </div>
        </div>
      )}

      {/* Filter loading popup */}
      {isFiltering && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg shadow-lg flex items-center gap-3">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-gray-700">Filtering projects...</p>
          </div>
        </div>
      )}
    </section>
  );
}
