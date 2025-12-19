"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthPageLayout from "@/components/Auth/AuthPageLayout";
import AuthVisualSection from "@/components/Auth/AuthVisualSection";
import AuthCard from "@/components/Auth/AuthCard";
import OAuthButtons from "@/components/Auth/OAuthButtons";
import Divider from "@/components/Auth/Divider";
import Input from "@/components/Auth/Input";
import Button from "@/components/Auth/Button";

/**
 * Login Page
 * Premium login screen with engaging two-column layout
 * Left: Visual storytelling | Right: Authentication form
 */
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Check for registration success message and auth errors
  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'invalid') {
      setServerError('Invalid email or password');
    } else if (error === 'unexpected') {
      setServerError('An unexpected error occurred');
    }
    
    if (searchParams.get("registered") === "true") {
      setSuccessMessage("Account created successfully! Please log in.");
    }
  }, [searchParams]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) setServerError("");
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");

    if (!validateForm()) return;

    setLoading(true);

    // ✅ OPTIMISTIC NAVIGATION - Start auth in background
    const authPromise = signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    // ✅ NAVIGATE IMMEDIATELY - Don't wait for auth!
    router.push("/dashboard");

    // Handle auth result in background
    authPromise.then((result) => {
      if (result?.error) {
        // If auth fails, redirect back to login with error
        router.push("/auth/login?error=invalid");
      }
    }).catch((error) => {
      console.error("Auth error:", error);
      router.push("/auth/login?error=unexpected");
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <AuthPageLayout visualSection={<AuthVisualSection type="login" />}>
      <AuthCard
        title="Welcome back"
        subtitle="Log in to continue your journey"
      >
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
            <p className="text-sm text-green-600 dark:text-green-400">
              {successMessage}
            </p>
          </div>
        )}

        {/* OAuth Buttons */}
        <OAuthButtons callbackUrl="/dashboard" />

        {/* Divider */}
        <Divider text="or continue with email" />

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
            autoComplete="current-password"
          />

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-sm font-medium text-accent hover:text-accent/80 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button type="submit" loading={loading} disabled={loading}>
              Log In
            </Button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600 dark:text-muted-foreground">
              New to FicLance?{" "}
              <Link
                href="/auth/signup"
                className="font-semibold text-accent hover:text-accent/80 transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </AuthCard>
    </AuthPageLayout>
  );
}
