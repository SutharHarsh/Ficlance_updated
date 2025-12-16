"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader, Check, X } from "lucide-react";

export default function PersonalInfoForm({ profile, onSave }) {
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    skills: [],
    experienceLevel: "beginner"
  });

  const [skillInput, setSkillInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
  const [errors, setErrors] = useState({});
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        bio: profile.bio || "",
        skills: profile.skills || [],
        experienceLevel: profile.experienceLevel || "beginner"
      });
    }
  }, [profile]);

  // Debounced username availability check
  useEffect(() => {
    const checkUsername = async () => {
      if (!formData.username || formData.username === profile.username) {
        setUsernameAvailable(null);
        return;
      }

      if (formData.username.length < 3) {
        setUsernameAvailable(null);
        return;
      }

      setIsCheckingUsername(true);
      
      try {
        const response = await fetch(
          `/api/profile/check-username?username=${encodeURIComponent(formData.username)}`
        );
        const data = await response.json();
        
        if (data.success) {
          setUsernameAvailable(data.available);
        }
      } catch (error) {
        console.error("Username check failed:", error);
      } finally {
        setIsCheckingUsername(false);
      }
    };

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.username, profile.username]);

  const validateForm = () => {
    const newErrors = {};

    if (formData.username) {
      if (formData.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters";
      } else if (formData.username.length > 30) {
        newErrors.username = "Username must be less than 30 characters";
      } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
        newErrors.username = "Username can only contain letters, numbers, underscores, and hyphens";
      } else if (usernameAvailable === false) {
        newErrors.username = "Username is already taken";
      }
    }

    if (formData.bio && formData.bio.length > 250) {
      newErrors.bio = "Bio must be less than 250 characters";
    }

    if (formData.skills.length > 20) {
      newErrors.skills = "Maximum 20 skills allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSkill = () => {
    const trimmedSkill = skillInput.trim();
    
    if (!trimmedSkill) return;
    
    if (formData.skills.includes(trimmedSkill)) {
      setErrors({ ...errors, skills: "Skill already added" });
      return;
    }
    
    if (formData.skills.length >= 20) {
      setErrors({ ...errors, skills: "Maximum 20 skills allowed" });
      return;
    }

    setFormData({
      ...formData,
      skills: [...formData.skills, trimmedSkill]
    });
    setSkillInput("");
    setErrors({ ...errors, skills: null });
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSaving(true);
    setSaveStatus(null);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personal: formData
        })
      });

      const data = await response.json();

      if (data.success) {
        setSaveStatus("success");
        onSave && onSave(data.data);
        
        // Reset success status after 3 seconds
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus("error");
        setErrors({ submit: data.error || "Failed to save" });
      }
    } catch (error) {
      console.error("Save failed:", error);
      setSaveStatus("error");
      setErrors({ submit: "Network error occurred" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">Personal Information</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Update your personal details and profile information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <div className="relative">
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="johndoe_123"
            />
            {isCheckingUsername && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader size={16} className="animate-spin text-gray-400" />
              </div>
            )}
            {!isCheckingUsername && usernameAvailable === true && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Check size={16} className="text-green-500" />
              </div>
            )}
            {!isCheckingUsername && usernameAvailable === false && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={16} className="text-red-500" />
              </div>
            )}
          </div>
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            Your unique identifier. Letters, numbers, underscores, and hyphens only.
          </p>
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
            maxLength={250}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none ${
              errors.bio ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Tell us about yourself..."
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-gray-500 text-xs">
              A brief description about you and your goals
            </p>
            <p className="text-gray-500 text-xs">
              {formData.bio.length}/250
            </p>
          </div>
          {errors.bio && (
            <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
          )}
        </div>

        {/* Skills */}
        <div>
          <label htmlFor="skill-input" className="block text-sm font-medium text-gray-700 mb-2">
            Skills
          </label>
          <div className="flex gap-2 mb-3">
            <input
              id="skill-input"
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., React, Node.js, Python"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Add
            </button>
          </div>
          
          {/* Skills List */}
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-blue-900"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          
          {errors.skills && (
            <p className="text-red-500 text-sm mt-2">{errors.skills}</p>
          )}
          <p className="text-gray-500 text-xs mt-2">
            {formData.skills.length}/20 skills added
          </p>
        </div>

        {/* Experience Level */}
        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
            Experience Level
          </label>
          <select
            id="experience"
            value={formData.experienceLevel}
            onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            {saveStatus === "success" && (
              <p className="text-green-600 text-sm flex items-center gap-2">
                <Check size={16} />
                Changes saved successfully
              </p>
            )}
            {saveStatus === "error" && (
              <p className="text-red-600 text-sm flex items-center gap-2">
                <X size={16} />
                {errors.submit || "Failed to save changes"}
              </p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isSaving || isCheckingUsername}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
