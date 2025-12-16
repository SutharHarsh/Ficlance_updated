"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Camera, CheckCircle, Clock } from "lucide-react";

export default function ProfileOverview({ profile, onAvatarUpdate }) {
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      user: "bg-blue-100 text-blue-800",
      admin: "bg-purple-100 text-purple-800",
      freelancer: "bg-green-100 text-green-800"
    };
    return colors[role] || colors.user;
  };

  const getExperienceBadge = (level) => {
    const badges = {
      beginner: { label: "Beginner", color: "bg-gray-100 text-gray-800" },
      intermediate: { label: "Intermediate", color: "bg-blue-100 text-blue-800" },
      advanced: { label: "Advanced", color: "bg-green-100 text-green-800" }
    };
    return badges[level] || badges.beginner;
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // TODO: Implement actual upload to storage service (S3, Cloudinary, etc.)
      // For now, we'll use a data URL (not recommended for production)
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUrl = reader.result;
        await onAvatarUpdate(dataUrl);
        setIsUploadingAvatar(false);
      };
      reader.readAsDataURL(file);

    } catch (error) {
      console.error("Avatar upload failed:", error);
      alert("Failed to upload avatar");
      setIsUploadingAvatar(false);
    }
  };

  const avatarSrc = profile.customAvatar || profile.image || "/default-avatar.png";

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        {/* Avatar Section */}
        <div className="relative group">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100">
            <Image
              src={avatarSrc}
              alt={profile.name || "User avatar"}
              fill
              className="object-cover"
              priority
            />
            {isUploadingAvatar && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          
          {/* Upload Button */}
          <label 
            htmlFor="avatar-upload" 
            className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
          >
            <Camera size={20} />
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={isUploadingAvatar}
            />
          </label>
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {profile.name || "Unnamed User"}
              </h1>
              {profile.username && (
                <p className="text-muted-foreground mt-1">@{profile.username}</p>
              )}
              <p className="text-gray-500 mt-1">{profile.email}</p>
              
              {/* Bio Preview */}
              {profile.bio && (
                <p className="text-gray-700 mt-3 max-w-2xl line-clamp-2">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2">
              {/* Email Verified Badge */}
              {profile.emailVerified && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <CheckCircle size={14} />
                  Verified
                </span>
              )}
              
              {/* Role Badge */}
              {profile.roles?.map((role) => (
                <span
                  key={role}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(role)}`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </span>
              ))}
              
              {/* Experience Badge */}
              {profile.experienceLevel && (
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getExperienceBadge(profile.experienceLevel).color}`}
                >
                  {getExperienceBadge(profile.experienceLevel).label}
                </span>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-6 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>Joined {formatDate(profile.createdAt)}</span>
            </div>
            {profile.stats?.lastActiveDate && (
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>Last active {formatDate(profile.stats.lastActiveDate)}</span>
              </div>
            )}
          </div>

          {/* Skills Preview */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {profile.skills.slice(0, 5).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
              {profile.skills.length > 5 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  +{profile.skills.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
