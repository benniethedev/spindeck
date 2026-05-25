"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import config from "@/config";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
      } else {
        toast.error(data.error || "Failed to send reset link");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black p-8 md:p-24" data-theme={config.colors.theme}>
      <div className="text-center mb-4">
        <Link href="/signin" className="btn btn-ghost btn-sm text-white">
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
          Back to Sign In
        </Link>
      </div>

      <div className="max-w-md mx-auto">
        {submitted ? (
          <div className="bg-spindeck-dark rounded-xl p-8 border border-gray-800 text-center">
            <div className="text-5xl mb-6">📧</div>
            <h1 className="text-2xl font-bold text-white mb-4">Check your email</h1>
            <p className="text-gray-400 mb-6">
              If an account exists with <span className="text-white">{email}</span>, you'll receive a password reset link shortly.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              The link expires in 1 hour. Check your spam folder if you don't see it.
            </p>
            <Link
              href="/signin"
              className="block w-full py-3 bg-spindeck-red hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center mb-2 text-white">
              Forgot your password?
            </h1>
            <p className="text-center text-gray-400 mb-8">
              No worries! Enter your email and we'll send you a reset link.
            </p>

            <div className="bg-spindeck-dark rounded-xl p-6 border border-gray-800">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-spindeck-red focus:ring-1 focus:ring-spindeck-red transition-colors"
                    placeholder="you@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-spindeck-red hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </div>
          </>
        )}

        <p className="text-center text-gray-400 mt-6">
          Remember your password?{" "}
          <Link href="/signin" className="text-spindeck-red hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
