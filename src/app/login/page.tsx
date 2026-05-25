"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Store session in localStorage for client-side auth
      localStorage.setItem("spin_token", data.token);
      localStorage.setItem("spin_user", JSON.stringify(data.user));

      router.push("/artist/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Quick demo login
  function handleDemoLogin() {
    localStorage.setItem("spin_token", "demo_token");
    localStorage.setItem("spin_user", JSON.stringify({
      id: "art_demo",
      email: "artist@spinrec.com",
      name: "Demo Artist",
      plan: "free" as const,
    }));
    router.push("/artist/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-50 via-white to-white dark:from-violet-950/20 dark:via-black dark:to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(124,58,237,0.08),transparent)]" />

      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Spin<span className="gradient-text">Rec</span>
          </a>
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            Sign in to your artist account
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 shadow-xl shadow-zinc-900/5 dark:shadow-black/20">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full font-semibold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/25 transition-all duration-200"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-200 dark:border-zinc-800" /></div>
              <div className="relative flex justify-center"><span className="bg-white dark:bg-zinc-950 px-3 text-xs text-zinc-400">or</span></div>
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-3 rounded-full font-semibold text-sm border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
            >
              Try Demo Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700">
              Sign up free
            </a>
          </p>
        </div>

        <a href="/" className="block text-center mt-6 text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
          Back to home
        </a>
      </div>
    </div>
  );
}
