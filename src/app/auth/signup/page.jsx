"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthPageLayout from "@/components/Auth/AuthPageLayout";
import AuthVisualSection from "@/components/Auth/AuthVisualSection";
import AuthCard from "@/components/Auth/AuthCard";
import OAuthButtons from "@/components/Auth/OAuthButtons";
import Divider from "@/components/Auth/Divider";
import Input from "@/components/Auth/Input";
import Button from "@/components/Auth/Button";

/**
 * Sign Up Page
 * Premium registration screen with engaging two-column layout
 * Left: Visual storytelling | Right: Registration form
 */
export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  // Handle error from URL params (optimistic navigation failure)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    if (error) {
      setServerError(decodeURIComponent(error));
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) setServerError("");
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) return;

    setLoading(true);

    // ✅ OPTIMISTIC NAVIGATION - Start signup in background
    const signupPromise = fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }),
    });

    // ✅ NAVIGATE IMMEDIATELY - Don't wait for API!
    router.push("/auth/login?registered=true");

    // Handle signup result in background
    signupPromise
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          // If signup fails, redirect back with error
          router.push(`/auth/signup?error=${encodeURIComponent(data.error || 'Registration failed')}`);
        }
      })
      .catch((error) => {
        console.error("Signup error:", error);
        router.push(`/auth/signup?error=${encodeURIComponent(error.message)}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (success) {
    return (
      <AuthPageLayout>
        <AuthCard title="Success! 🎉" subtitle="Your account has been created">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-muted-foreground">
              Redirecting to login...
            </p>
          </div>
        </AuthCard>
      </AuthPageLayout>
    );
  }

  return (
    <AuthPageLayout visualSection={<AuthVisualSection type="signup" />}>
      <AuthCard
        title="Create your account"
        subtitle="Start your freelance journey today"
      >
        {/* OAuth Buttons */}
        <OAuthButtons callbackUrl="/dashboard" />

        {/* Divider */}
        <Divider text="or sign up with email" />

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Server Error */}
          {serverError && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-sm text-red-600 dark:text-red-400">
                {serverError}
              </p>
            </div>
          )}

          {/* Name Input */}
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            error={errors.name}
            required
            autoComplete="name"
          />

          {/* Email Input */}
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            error={errors.email}
            required
            autoComplete="email"
          />

          {/* Password Input */}
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            error={errors.password}
            required
            autoComplete="new-password"
          />

          {/* Confirm Password Input */}
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            error={errors.confirmPassword}
            required
            autoComplete="new-password"
          />

          {/* Submit Button */}
          <div className="pt-2">
            <Button type="submit" loading={loading} disabled={loading}>
              Create Account
            </Button>
          </div>

          {/* Login Link */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600 dark:text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-accent hover:text-accent/80 transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>
        </form>
      </AuthCard>
    </AuthPageLayout>
  );
}
