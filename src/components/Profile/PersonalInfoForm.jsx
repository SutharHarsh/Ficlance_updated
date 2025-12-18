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
    <div className="bg-card rounded-xl border border-border p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Personal Information</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Update your personal details and profile information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Username */}
        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-semibold text-foreground">
            Username
          </label>
          <p className="text-xs text-muted-foreground">Your unique identifier on the platform</p>
          <div className="relative">
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className={`w-full px-4 py-3 bg-secondary border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all ${
                errors.username ? "border-red-500 ring-2 ring-red-200" : "border-border"
              }`}
              placeholder="johndoe_123"
            />
            {isCheckingUsername && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader size={18} className="animate-spin text-primary" />
              </div>
            )}
            {!isCheckingUsername && usernameAvailable === true && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Check size={18} className="text-green-500" />
              </div>
            )}
            {!isCheckingUsername && usernameAvailable === false && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <X size={18} className="text-red-500" />
              </div>
            )}
          </div>
          {errors.username && (
            <p className="text-red-500 text-sm mt-2">{errors.username}</p>
          )}
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label htmlFor="bio" className="block text-sm font-semibold text-foreground">
            Bio
          </label>
          <p className="text-xs text-muted-foreground">Tell us about yourself and your goals</p>
          <textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
            maxLength={250}
            className={`w-full px-4 py-3 bg-secondary border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none ${
              errors.bio ? "border-red-500 ring-2 ring-red-200" : "border-border"
            }`}
            placeholder="I'm passionate about..."
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-muted-foreground"></p>
            <p className="text-xs text-muted-foreground">
              {formData.bio.length}/250 characters
            </p>
          </div>
          {errors.bio && (
            <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
          )}
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <label htmlFor="skill-input" className="block text-sm font-semibold text-foreground">
            Skills
          </label>
          <p className="text-xs text-muted-foreground">Add technologies and skills you're proficient in</p>
          <div className="flex gap-2">
            <input
              id="skill-input"
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
              className="flex-1 px-4 py-3 bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              placeholder="e.g., React, Node.js, Python"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-6 py-3 bg-secondary border border-border text-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium text-sm"
            >
              Add
            </button>
          </div>
          
          {/* Skills List */}
          {formData.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4">
              {formData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full text-sm font-medium group hover:bg-primary/20 transition-colors"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {errors.skills && (
            <p className="text-red-500 text-sm mt-2">{errors.skills}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            {formData.skills.length}/20 skills
          </p>
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <label htmlFor="experience" className="block text-sm font-semibold text-foreground">
            Experience Level
          </label>
          <p className="text-xs text-muted-foreground">How would you describe your experience?</p>
          <select
            id="experience"
            value={formData.experienceLevel}
            onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
            className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          >
            <option value="beginner">Beginner - Just starting out</option>
            <option value="intermediate">Intermediate - Some experience</option>
            <option value="advanced">Advanced - Highly skilled</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-8 border-t border-border">
          <div>
            {saveStatus === "success" && (
              <p className="text-green-600 text-sm flex items-center gap-2 font-medium">
                <Check size={16} className="flex-shrink-0" />
                Changes saved successfully
              </p>
            )}
            {saveStatus === "error" && (
              <p className="text-red-600 text-sm flex items-center gap-2 font-medium">
                <X size={16} className="flex-shrink-0" />
                {errors.submit || "Failed to save changes"}
              </p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isSaving || isCheckingUsername}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
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
