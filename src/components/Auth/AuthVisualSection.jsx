"use client";

import { useEffect, useState } from "react";
import { Briefcase, Target, TrendingUp, Shield, CheckCircle2 } from "lucide-react";

/**
 * AuthVisualSection Component
 * Engaging visual content for authentication pages
 * Can be customized per page (login, signup, etc.)
 */
export default function AuthVisualSection({ 
  type = "login" // "login", "signup", "forgot-password"
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const content = {
    login: {
      title: "Welcome back to your journey",
      subtitle: "Continue building your freelance career with real-world projects",
      features: [
        {
          icon: Briefcase,
          text: "Access your ongoing projects"
        },
        {
          icon: TrendingUp,
          text: "Track your progress and growth"
        },
        {
          icon: Target,
          text: "Complete real-world challenges"
        }
      ]
    },
    signup: {
      title: "Start your freelance journey today",
      subtitle: "Join thousands of aspiring freelancers gaining real experience",
      features: [
        {
          icon: Briefcase,
          text: "Work on realistic project simulations"
        },
        {
          icon: Target,
          text: "Build a portfolio that stands out"
        },
        {
          icon: Shield,
          text: "Learn from industry professionals"
        }
      ]
    },
    "forgot-password": {
      title: "We've got you covered",
      subtitle: "Reset your password and get back to building your career",
      features: [
        {
          icon: Shield,
          text: "Secure password recovery"
        },
        {
          icon: CheckCircle2,
          text: "Quick and easy process"
        }
      ]
    }
  };

  const currentContent = content[type] || content.login;

  return (
    <div className={`
      max-w-lg w-full space-y-8 transition-all duration-1000 transform
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
    `}>
      {/* Main Title */}
      <div className="space-y-4">
        <h1 className="text-4xl xl:text-5xl font-bold leading-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
          {currentContent.title}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          {currentContent.subtitle}
        </p>
      </div>

      {/* Feature List */}
      <div className="space-y-4">
        {currentContent.features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className={`
                flex items-start gap-4 p-4 rounded-2xl 
                bg-white/50 dark:bg-white/5 backdrop-blur-sm
                border border-gray-100 dark:border-white/10
                transition-all duration-500 hover:bg-white/80 dark:hover:bg-white/10
                hover:border-accent/30 dark:hover:border-accent/30
                hover:shadow-lg hover:scale-[1.02]
                ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}
              `}
              style={{ transitionDelay: `${(index + 1) * 150}ms` }}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 dark:from-accent/30 dark:to-primary/30 flex items-center justify-center">
                <Icon className="w-5 h-5 text-accent dark:text-accent" />
              </div>
              <p className="flex-1 text-gray-700 dark:text-gray-300 leading-relaxed pt-1.5">
                {feature.text}
              </p>
            </div>
          );
        })}
      </div>

      {/* Trust Badge */}
      <div className="pt-6 border-t border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
          <span>Secure authentication with industry-standard encryption</span>
        </div>
      </div>

      {/* Stats (for signup only) */}
      {type === "signup" && (
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">5K+</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">10K+</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Projects Done</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">95%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Success Rate</div>
          </div>
        </div>
      )}
    </div>
  );
}
