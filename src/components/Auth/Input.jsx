"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Input Component
 * Premium form input with label, error states, and optional password visibility toggle
 */
export default function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  disabled = false,
  autoComplete,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="space-y-1.5">
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-foreground"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          required={required}
          className={`
            w-full px-4 py-3 rounded-xl border transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
            disabled:opacity-60 disabled:cursor-not-allowed
            bg-white dark:bg-secondary text-gray-900 dark:text-foreground
            placeholder:text-gray-400 dark:placeholder:text-muted-foreground
            ${
              error
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-border"
            }
          `}
        />

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-muted-foreground hover:text-gray-700 dark:hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}
