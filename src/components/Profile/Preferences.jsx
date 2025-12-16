"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader, Check, X, Bell, Moon, Sun, Monitor, Globe } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function Preferences({ profile, onSave }) {
  const { theme: currentTheme, setTheme: setAppTheme } = useTheme();
  
  const [formData, setFormData] = useState({
    notifications: {
      deadlines: true,
      messages: true,
      projectUpdates: true
    },
    theme: "system",
    language: "en"
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (profile?.preferences) {
      setFormData(profile.preferences);
    }
    
    // Sync with current app theme
    if (currentTheme && formData.theme !== currentTheme) {
      setFormData(prev => ({ ...prev, theme: currentTheme }));
    }
  }, [profile, currentTheme]);

  const handleNotificationToggle = (key) => {
    setFormData({
      ...formData,
      notifications: {
        ...formData.notifications,
        [key]: !formData.notifications[key]
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSaving(true);
    setSaveStatus(null);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences: formData
        })
      });

      const data = await response.json();

      if (data.success) {
        setSaveStatus("success");
        onSave && onSave(data.data);
        
        // Apply theme immediately
        setAppTheme(formData.theme);
        
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

  // Handle theme change immediately (before save)
  const handleThemeChange = (newTheme) => {
    setFormData({ ...formData, theme: newTheme });
    setAppTheme(newTheme); // Apply immediately for instant feedback
  };

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor }
  ];

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "ja", name: "日本語" },
    { code: "zh", name: "中文" }
  ];

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Bell size={24} />
          Preferences
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Customize your experience and notification settings
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Notifications */}
        <div className="pb-6 border-b border-border">
          <h3 className="text-sm font-medium text-foreground mb-4">Notifications</h3>
          <div className="space-y-4">
            {/* Deadline Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Deadline Reminders</p>
                <p className="text-sm text-muted-foreground">
                  Get notified about upcoming project deadlines
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleNotificationToggle("deadlines")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.notifications.deadlines ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.notifications.deadlines ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Message Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">New Messages</p>
                <p className="text-sm text-muted-foreground">
                  Get notified when you receive new chat messages
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleNotificationToggle("messages")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.notifications.messages ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.notifications.messages ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Project Update Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Project Updates</p>
                <p className="text-sm text-muted-foreground">
                  Get notified about project status changes and updates
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleNotificationToggle("projectUpdates")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.notifications.projectUpdates ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.notifications.projectUpdates ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="pb-6 border-b border-border">
          <h3 className="text-sm font-medium text-foreground mb-4">Appearance</h3>
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleThemeChange(option.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    formData.theme === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-border"
                  }`}
                >
                  <Icon size={24} className={formData.theme === option.value ? "text-primary" : "text-muted-foreground"} />
                  <span className={`text-sm font-medium ${
                    formData.theme === option.value ? "text-primary" : "text-foreground"
                  }`}>
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Choose your preferred theme or use system settings
          </p>
        </div>

        {/* Language */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
            <Globe size={16} />
            Language
          </h3>
          <select
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-2">
            Language preference for the interface (coming soon)
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            {saveStatus === "success" && (
              <p className="text-green-600 text-sm flex items-center gap-2">
                <Check size={16} />
                Preferences saved successfully
              </p>
            )}
            {saveStatus === "error" && (
              <p className="text-red-600 text-sm flex items-center gap-2">
                <X size={16} />
                {errors.submit || "Failed to save preferences"}
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
                Save Preferences
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
