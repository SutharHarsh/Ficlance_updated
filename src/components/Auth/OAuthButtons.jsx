"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";

/**
 * OAuthButtons Component
 * Premium OAuth authentication buttons for Google and GitHub
 * Includes loading states and visual feedback
 */
export default function OAuthButtons({ callbackUrl = "/dashboard" }) {
  const [loadingProvider, setLoadingProvider] = useState(null);

  const handleOAuthSignIn = async (providerId) => {
    setLoadingProvider(providerId);
    try {
      await signIn(providerId, { callbackUrl });
    } catch (error) {
      console.error(`${providerId} sign-in error:`, error);
      setLoadingProvider(null);
    }
  };

  const providers = [
    {
      id: "google",
      name: "Google",
      icon: FaGoogle,
      bgColor: "bg-white hover:bg-gray-50 dark:bg-card dark:hover:bg-secondary",
      textColor: "text-gray-700 dark:text-foreground",
      borderColor: "border-gray-300 dark:border-border",
    },
    {
      id: "github",
      name: "GitHub",
      icon: FaGithub,
      bgColor: "bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700",
      textColor: "text-white",
      borderColor: "border-gray-900 dark:border-gray-700",
    },
  ];

  return (
    <div className="space-y-3">
      {providers.map((provider) => {
        const Icon = provider.icon;
        const isLoading = loadingProvider === provider.id;
        const isDisabled = loadingProvider !== null;

        return (
          <button
            key={provider.id}
            onClick={() => handleOAuthSignIn(provider.id)}
            disabled={isDisabled}
            className={`
              w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl
              border transition-all duration-200 font-medium
              ${provider.bgColor} ${provider.textColor} ${provider.borderColor}
              disabled:opacity-60 disabled:cursor-not-allowed
              shadow-sm hover:shadow-md
              focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-background
            `}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Icon className="w-5 h-5" />
            )}
            <span>
              {isLoading ? `Signing in...` : `Continue with ${provider.name}`}
            </span>
          </button>
        );
      })}
    </div>
  );
}
