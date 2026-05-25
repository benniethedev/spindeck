"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import { useDJ, DJProvider } from "@/app/dj/context/DJContext";
import { useRouter } from "next/navigation";

function DJLoginPage() {
  const { login, refreshDJStatus } = useDJ();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    const ok = await login(email, password);
    if (ok) {
      setStatus("success");
      const approved = await refreshDJStatus(email);
      if (approved) {
        setTimeout(() => router.push("/dj"), 1500);
      } else {
        setTimeout(() => router.push("/dj"), 1500);
      }
    } else {
      setStatus("error");
      setErrorMsg("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <Navbar />
      <section className="pt-28 pb-16 sm:pt-32 sm:pb-20 bg-gradient-to-b from-violet-50/80 dark:from-violet-950/20 to-transparent">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3">
            DJ <span className="gradient-text">Login</span>
          </h1>
          <p className="text-base text-zinc-500 dark:text-zinc-400">
            Access the full DJ pool and download tracks.
          </p>
        </div>
      </section>
      <section className="flex-1 pb-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 sm:p-8">
            {status === "success" ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Welcome back!</h3>
                <p className="text-zinc-500 dark:text-zinc-400">Redirecting to DJ pool...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMsg && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm text-center">
                    {errorMsg}
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Email</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@djmail.com" className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Password</label>
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full gradient-bg text-white font-semibold py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {status === "loading" ? "Signing in..." : "Sign In"}
                </button>
              </form>
            )}
            <div className="mt-6 text-center">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Don&apos;t have an account?{" "}
                <a href="/dj/register" className="text-violet-600 dark:text-violet-400 font-semibold hover:underline">Register as DJ</a>
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                <a href="/" className="text-violet-600 dark:text-violet-400 font-semibold hover:underline">← Back to home</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function DJLoginPageWrapper() {
  return (
    <DJProvider>
      <DJLoginPage />
    </DJProvider>
  );
}
