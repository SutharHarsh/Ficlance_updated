"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

/**
 * New Project Loading Page
 * Handles async project creation and redirects to chat
 * This page appears INSTANTLY while API calls happen in background
 */
export default function NewProjectPage() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const initializeProject = async () => {
      // Get project data from sessionStorage
      const projectDataStr = sessionStorage.getItem('pendingProject');
      
      if (!projectDataStr || !session) {
        // No project data or not authenticated - redirect
        router.replace('/new-project');
        return;
      }

      try {
        const projectData = JSON.parse(projectDataStr);
        
        // 1. Call requirements API
        const payload = {
          Expertise: projectData.Expertise,
          TechStack: projectData.TechStack,
          Duration: projectData.Duration,
          ProjectName: projectData.ProjectName,
          Description: projectData.Description,
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
            userId: projectData.userId,
            projectId: projectData.projectId,
            projectName: projectData.ProjectName,
            duration: reqData.duration || projectData.Duration,
            requirements: reqData,
            aiName: reqData.ai_name,
          }),
        });

        if (!convResponse.ok) {
          throw new Error("Failed to create conversation");
        }

        const convData = await convResponse.json();

        // Clear the stored data
        sessionStorage.removeItem('pendingProject');

        // 3. Redirect to chat
        router.replace(`/chat/${convData.conversationId}`);
      } catch (error) {
        console.error("Error initializing project:", error);
        // Redirect back with error
        router.replace('/new-project?error=initialization-failed');
      }
    };

    if (session) {
      initializeProject();
    }
  }, [session, router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Loading Spinner */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Preparing Your Project
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          Setting up your simulation environment and AI mentor...
        </p>

        {/* Progress dots animation */}
        <div className="flex justify-center gap-2 mt-6">
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
