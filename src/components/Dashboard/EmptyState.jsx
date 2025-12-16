"use client";
import React from "react";
import { useRouter } from "next/navigation";

const EmptyState = ({ onCreate }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = React.useState(false);

  const handleCreate = () => {
    if (typeof onCreate === "function") {
      onCreate();
    } else {
      router.push("/new-project");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-lg w-full">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10 opacity-40">
          <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>

        <div className="text-center space-y-8">
          {/* Illustration Icon */}
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl transform rotate-45 opacity-20"></div>
            <div className="absolute inset-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl transform rotate-3 flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="white" />
              </svg>
            </div>
          </div>

          {/* Main Heading */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-3">
              Welcome to Your Dashboard!
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Every great journey starts with a single step. Create your first project to see your progress, track deadlines, and unlock personalized insights.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 mb-8">
            <div className="bg-card backdrop-blur-sm bg-opacity-60 border border-border rounded-xl p-4 hover:border-indigo-300 transition-colors">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" fill="currentColor" className="text-indigo-600" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground text-sm">Track Progress</h3>
              <p className="text-xs text-gray-600 mt-1">Monitor milestones and completion rates</p>
            </div>

            <div className="bg-card backdrop-blur-sm bg-opacity-60 border border-border rounded-xl p-4 hover:border-purple-300 transition-colors">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" fill="currentColor" className="text-purple-600" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground text-sm">Smart Deadlines</h3>
              <p className="text-xs text-gray-600 mt-1">Never miss important milestones</p>
            </div>

            <div className="bg-card backdrop-blur-sm bg-opacity-60 border border-border rounded-xl p-4 hover:border-pink-300 transition-colors">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor" className="text-pink-600" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground text-sm">Get Insights</h3>
              <p className="text-xs text-gray-600 mt-1">Personalized recommendations & tips</p>
            </div>

            <div className="bg-card backdrop-blur-sm bg-opacity-60 border border-border rounded-xl p-4 hover:border-blue-300 transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 13.18v4c0 .55.45 1 1 1h1v4h6v-4h1c.55 0 1-.45 1-1v-4l4.69-4.69c.52.4.81 1.02.81 1.69A2.5 2.5 0 0 1 19 12.5a2.5 2.5 0 0 1-2.5-2.5c0-.67.29-1.29.81-1.69L5 13.18zM3 6.5c.83 0 1.5-.67 1.5-1.5S3.83 3.5 3 3.5 1.5 4.17 1.5 5 2.17 6.5 3 6.5z" fill="currentColor" className="text-blue-600" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground text-sm">Build Skills</h3>
              <p className="text-xs text-gray-600 mt-1">Grow your expertise with challenges</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="space-y-4">
            <button
              onClick={handleCreate}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor" />
                </svg>
                Create Your First Project
              </span>
              <div className={`absolute inset-0 bg-white opacity-0 transition-opacity duration-300 ${isHovered ? "opacity-10" : ""}`}></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
