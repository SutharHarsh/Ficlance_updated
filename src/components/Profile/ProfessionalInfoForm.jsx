"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader, Check, X, Link as LinkIcon, Github, Globe, Linkedin } from "lucide-react";

export default function ProfessionalInfoForm({ profile, onSave }) {
  const [formData, setFormData] = useState({
    preferredTechStack: [],
    careerGoal: "learning",
    availability: { hoursPerWeek: 10 },
    portfolioLinks: {
      github: "",
      website: "",
      linkedin: ""
    }
  });

  const [techStackInput, setTechStackInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (profile) {
      setFormData({
        preferredTechStack: profile.preferredTechStack || [],
        careerGoal: profile.careerGoal || "learning",
        availability: profile.availability || { hoursPerWeek: 10 },
        portfolioLinks: profile.portfolioLinks || {
          github: "",
          website: "",
          linkedin: ""
        }
      });
    }
  }, [profile]);

  const validateForm = () => {
    const newErrors = {};

    // Validate hours per week
    if (formData.availability.hoursPerWeek < 0 || formData.availability.hoursPerWeek > 168) {
      newErrors.availability = "Hours per week must be between 0 and 168";
    }

    // Validate URLs
    const urlFields = ["github", "website", "linkedin"];
    urlFields.forEach(field => {
      const url = formData.portfolioLinks[field];
      if (url && url.trim()) {
        try {
          new URL(url);
        } catch {
          newErrors[field] = `Invalid ${field} URL`;
        }
      }
    });

    // Validate tech stack count
    if (formData.preferredTechStack.length > 15) {
      newErrors.techStack = "Maximum 15 tech stack items allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTech = () => {
    const trimmedTech = techStackInput.trim();
    
    if (!trimmedTech) return;
    
    if (formData.preferredTechStack.includes(trimmedTech)) {
      setErrors({ ...errors, techStack: "Technology already added" });
      return;
    }
    
    if (formData.preferredTechStack.length >= 15) {
      setErrors({ ...errors, techStack: "Maximum 15 technologies allowed" });
      return;
    }

    setFormData({
      ...formData,
      preferredTechStack: [...formData.preferredTechStack, trimmedTech]
    });
    setTechStackInput("");
    setErrors({ ...errors, techStack: null });
  };

  const handleRemoveTech = (techToRemove) => {
    setFormData({
      ...formData,
      preferredTechStack: formData.preferredTechStack.filter(tech => tech !== techToRemove)
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
          professional: formData
        })
      });

      const data = await response.json();

      if (data.success) {
        setSaveStatus("success");
        onSave && onSave(data.data);
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
        <h2 className="text-xl font-semibold text-foreground">Professional Details</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Share your career goals and technical expertise
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Preferred Tech Stack */}
        <div>
          <label htmlFor="tech-input" className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Tech Stack
          </label>
          <div className="flex gap-2 mb-3">
            <input
              id="tech-input"
              type="text"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTech())}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Next.js, TypeScript, MongoDB"
            />
            <button
              type="button"
              onClick={handleAddTech}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Add
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {formData.preferredTechStack.map((tech, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => handleRemoveTech(tech)}
                  className="hover:text-purple-900"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          
          {errors.techStack && (
            <p className="text-red-500 text-sm mt-2">{errors.techStack}</p>
          )}
          <p className="text-gray-500 text-xs mt-2">
            {formData.preferredTechStack.length}/15 technologies added
          </p>
        </div>

        {/* Career Goal */}
        <div>
          <label htmlFor="career-goal" className="block text-sm font-medium text-gray-700 mb-2">
            Career Goal
          </label>
          <select
            id="career-goal"
            value={formData.careerGoal}
            onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="learning">Learning & Skill Development</option>
            <option value="job">Looking for a Job</option>
            <option value="freelancing">Pursuing Freelancing</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Availability */}
        <div>
          <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-2">
            Availability (hours per week)
          </label>
          <input
            id="hours"
            type="number"
            min="0"
            max="168"
            value={formData.availability.hoursPerWeek}
            onChange={(e) => setFormData({
              ...formData,
              availability: { hoursPerWeek: parseInt(e.target.value) || 0 }
            })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.availability ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.availability && (
            <p className="text-red-500 text-sm mt-1">{errors.availability}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            How many hours per week can you dedicate to projects?
          </p>
        </div>

        {/* Portfolio Links */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Portfolio Links</h3>
          
          {/* GitHub */}
          <div>
            <label htmlFor="github" className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
              <Github size={16} />
              GitHub Profile
            </label>
            <input
              id="github"
              type="url"
              value={formData.portfolioLinks.github}
              onChange={(e) => setFormData({
                ...formData,
                portfolioLinks: { ...formData.portfolioLinks, github: e.target.value }
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.github ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="https://github.com/yourusername"
            />
            {errors.github && (
              <p className="text-red-500 text-sm mt-1">{errors.github}</p>
            )}
          </div>

          {/* Website */}
          <div>
            <label htmlFor="website" className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
              <Globe size={16} />
              Personal Website
            </label>
            <input
              id="website"
              type="url"
              value={formData.portfolioLinks.website}
              onChange={(e) => setFormData({
                ...formData,
                portfolioLinks: { ...formData.portfolioLinks, website: e.target.value }
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.website ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="https://yourwebsite.com"
            />
            {errors.website && (
              <p className="text-red-500 text-sm mt-1">{errors.website}</p>
            )}
          </div>

          {/* LinkedIn */}
          <div>
            <label htmlFor="linkedin" className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
              <Linkedin size={16} />
              LinkedIn Profile
            </label>
            <input
              id="linkedin"
              type="url"
              value={formData.portfolioLinks.linkedin}
              onChange={(e) => setFormData({
                ...formData,
                portfolioLinks: { ...formData.portfolioLinks, linkedin: e.target.value }
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.linkedin ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="https://linkedin.com/in/yourprofile"
            />
            {errors.linkedin && (
              <p className="text-red-500 text-sm mt-1">{errors.linkedin}</p>
            )}
          </div>
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
            disabled={isSaving}
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
