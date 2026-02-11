"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import config from "@/config";
import RoleSelector from "@/components/RoleSelector";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    role: "artist",
    agreeTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.displayName) {
      newErrors.displayName = "Display name is required";
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          displayName: formData.displayName,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      toast.success("Account created! Please check your email to verify your account.");
      router.push("/signin?registered=true");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  return (
    <main className="min-h-screen bg-black p-8 md:p-24" data-theme={config.colors.theme}>
      <div className="text-center mb-4">
        <Link href="/" className="btn btn-ghost btn-sm text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>
          Home
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center mb-2 text-white">
          Create your {config.appName} account
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Join the premier music promotion platform
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Role Selection */}
          <div className="bg-spindeck-dark rounded-xl p-6 border border-gray-800">
            <RoleSelector
              selectedRole={formData.role}
              onRoleChange={(role) => setFormData((prev) => ({ ...prev, role }))}
            />
          </div>

          {/* Account Details */}
          <div className="bg-spindeck-dark rounded-xl p-6 border border-gray-800 space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Account Details</h3>

            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Display Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-800 border ${
                  errors.displayName ? "border-red-500" : "border-gray-600"
                } rounded-lg text-white focus:outline-none focus:border-spindeck-red focus:ring-1 focus:ring-spindeck-red transition-colors`}
                placeholder="Your artist or DJ name"
              />
              {errors.displayName && (
                <p className="text-red-500 text-sm mt-1">{errors.displayName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="email"
                className={`w-full px-4 py-3 bg-gray-800 border ${
                  errors.email ? "border-red-500" : "border-gray-600"
                } rounded-lg text-white focus:outline-none focus:border-spindeck-red focus:ring-1 focus:ring-spindeck-red transition-colors`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                autoComplete="new-password"
                className={`w-full px-4 py-3 bg-gray-800 border ${
                  errors.password ? "border-red-500" : "border-gray-600"
                } rounded-lg text-white focus:outline-none focus:border-spindeck-red focus:ring-1 focus:ring-spindeck-red transition-colors`}
                placeholder="At least 8 characters"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                autoComplete="new-password"
                className={`w-full px-4 py-3 bg-gray-800 border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-600"
                } rounded-lg text-white focus:outline-none focus:border-spindeck-red focus:ring-1 focus:ring-spindeck-red transition-colors`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="pt-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 text-spindeck-red bg-gray-800 border-gray-600 rounded focus:ring-spindeck-red focus:ring-2"
                />
                <span className="text-sm text-gray-300">
                  I agree to the{" "}
                  <Link href="/tos" className="text-spindeck-red hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy" className="text-spindeck-red hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-red-500 text-sm mt-1">{errors.agreeTerms}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-spindeck-red hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Sign In Link */}
          <p className="text-center text-gray-400">
            Already have an account?{" "}
            <Link href="/signin" className="text-spindeck-red hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
