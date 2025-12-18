"use client";

import Link from "next/link";

/**
 * AuthPageLayout Component
 * Two-column authentication layout with visual storytelling section
 * Responsive design that stacks on mobile
 */
export default function AuthPageLayout({ children, visualSection }) {
  return (
    <div className="min-h-screen bg-white dark:bg-background flex flex-col">
      {/* Top Navigation Bar */}
      <div className="w-full px-4 py-4 sm:px-6 lg:px-8 border-b border-gray-100 dark:border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 group transition-transform hover:scale-105"
          >
            <img src="/Logo1.png" alt="FicLance Logo" className="h-8 w-auto object-contain" />
          </Link>
          
          {/* Optional: Add help link */}
          <Link
            href="/"
            className="text-sm text-gray-600 dark:text-muted-foreground hover:text-accent transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side - Visual/Engagement Section */}
        {visualSection && (
          <div className="hidden lg:flex lg:w-1/2 xl:w-[45%] relative overflow-hidden">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-primary/5 to-transparent dark:from-accent/20 dark:via-primary/10" />
            
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]" 
                 style={{
                   backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                   backgroundSize: '32px 32px'
                 }} 
            />

            {/* Content */}
            <div className="relative z-10 flex items-center justify-center w-full p-8 lg:p-12 xl:p-16">
              {visualSection}
            </div>

            {/* Floating Shapes */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-accent/5 dark:bg-accent/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl animate-float-delayed" />
          </div>
        )}

        {/* Right Side - Authentication Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full px-4 py-6 border-t border-gray-100 dark:border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-gray-500 dark:text-muted-foreground">
            <Link href="/terms" className="hover:text-accent transition-colors">
              Terms of Service
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/privacy" className="hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <span className="hidden sm:inline">•</span>
            <span>© 2024 FicLance. All rights reserved.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
