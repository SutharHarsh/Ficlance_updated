"use client";

import React, { useState, useEffect } from "react";
import { User, Briefcase, Activity, Shield, Settings, Loader } from "lucide-react";
import ProfileOverview from "@/components/Profile/ProfileOverview";
import PersonalInfoForm from "@/components/Profile/PersonalInfoForm";
import ProfessionalInfoForm from "@/components/Profile/ProfessionalInfoForm";
import ActivityStats from "@/components/Profile/ActivityStats";
import SecuritySettings from "@/components/Profile/SecuritySettings";
import Preferences from "@/components/Profile/Preferences";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/profile");
      const data = await response.json();

      if (data.success) {
        setProfile(data.data);
      } else {
        setError(data.error || "Failed to load profile");
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = () => {
    // Refetch profile after any update
    fetchProfile();
  };

  const handleAvatarUpdate = async (avatarUrl) => {
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customAvatar: avatarUrl
        })
      });

      const data = await response.json();

      if (data.success) {
        setProfile({ ...profile, customAvatar: avatarUrl });
      } else {
        alert("Failed to update avatar");
      }
    } catch (error) {
      console.error("Avatar update failed:", error);
      alert("Failed to update avatar");
    }
  };

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "professional", label: "Professional", icon: Briefcase },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "security", label: "Security", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Settings }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader size={48} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Error Loading Profile</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={fetchProfile}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Profile</h1>
              <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
            </div>
            <a
              href="/dashboard"
              className="px-4 py-2 text-foreground hover:bg-secondary rounded-lg transition-colors"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Overview (Always visible) */}
        <div className="mb-8">
          <ProfileOverview profile={profile} onAvatarUpdate={handleAvatarUpdate} />
        </div>

        {/* Tabs Navigation */}
        <div className="bg-card rounded-lg shadow-sm border border-border mb-6 overflow-hidden">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-max flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? "border-primary text-primary bg-primary/5"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "personal" && (
            <PersonalInfoForm profile={profile} onSave={handleProfileUpdate} />
          )}
          
          {activeTab === "professional" && (
            <ProfessionalInfoForm profile={profile} onSave={handleProfileUpdate} />
          )}
          
          {activeTab === "activity" && (
            <ActivityStats stats={profile.stats} />
          )}
          
          {activeTab === "security" && (
            <SecuritySettings profile={profile} />
          )}
          
          {activeTab === "preferences" && (
            <Preferences profile={profile} onSave={handleProfileUpdate} />
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Your data is secure and encrypted. We never share your personal information.</p>
          <p className="mt-1">
            Profile last updated: {new Date(profile.profileUpdatedAt || profile.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
