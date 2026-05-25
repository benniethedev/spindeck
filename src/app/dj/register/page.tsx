"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/app/components/Navbar";
import { useDJ, DJProvider } from "@/app/dj/context/DJContext";
import { useRouter } from "next/navigation";

function DJRegisterPage() {
  const { user, isDJApproved, refreshDJStatus, isLoading } = useDJ();
  const router = useRouter();

  useEffect(() => {
    if (isDJApproved && !isLoading) {
      router.push("/dj");
    }
  }, [isDJApproved, isLoading, router]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <Navbar />
      <section className="pt-28 pb-16 sm:pt-32 sm:pb-20 bg-gradient-to-b from-violet-50/80 dark:from-violet-950/20 to-transparent">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3">
            Join the SpinRec <span className="gradient-text">DJ Network</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400">
            Free registration. Browse the pool, preview tracks, and request downloads.
          </p>
        </div>
      </section>
      <section className="flex-1 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {user && !isDJApproved && (
            <div className="mb-8 p-4 rounded-2xl bg-violet-50 dark:bg-violet-900/10 border border-violet-200 dark:border-violet-800 text-center">
              <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
                You already have an account. Check your approval status below.
              </p>
              <button
                onClick={async () => {
                  if (user?.email) {
                    const approved = await refreshDJStatus(user.email);
                    if (approved) router.push("/dj");
                  }
                }}
                className="text-sm font-semibold text-violet-600 dark:text-violet-400 hover:underline"
              >
                Check Approval Status
              </button>
            </div>
          )}
          <RegisterForm />
        </div>
      </section>
    </div>
  );
}

function RegisterForm() {
  const { login, refreshDJStatus } = useDJ();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [djName, setDjName] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [genre, setGenre] = useState("");
  const [venueType, setVenueType] = useState("");
  const [yearsDJing, setYearsDJing] = useState("");
  const [bio, setBio] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/dj/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ djName, email, instagram, genre, venueType, yearsDJing, bio }),
      });
      const data = await res.json();
      if (res.ok) {
        const loggedIn = await login(email, "temp_password");
        setStatus("success");
        if (loggedIn) {
          setTimeout(() => router.push("/dj"), 1500);
        }
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <svg className="w-10 h-10 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-3">Registration Submitted!</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-md mx-auto">
          Thank you for joining the SpinRec DJ network. We&apos;ll review your application and send a confirmation email within 48 hours.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/dj" className="gradient-bg text-white font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity inline-block">Browse DJ Pool</a>
          <a href="/dj/login" className="px-8 py-3 rounded-full text-sm font-semibold border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-violet-300 dark:hover:border-violet-700 transition-colors inline-block">DJ Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 sm:p-8">
      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 1 ? "gradient-bg text-white" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"}`}>
            {step > 1 ? "✓" : "1"}
          </div>
          <span className={`text-sm font-medium ${step >= 1 ? "text-zinc-900 dark:text-white" : "text-zinc-400"}`}>Your Info</span>
        </div>
        <div className={`w-12 h-0.5 ${step >= 2 ? "bg-violet-500" : "bg-zinc-200 dark:bg-zinc-800"}`} />
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 2 ? "gradient-bg text-white" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"}`}>2</div>
          <span className={`text-sm font-medium ${step >= 2 ? "text-zinc-900 dark:text-white" : "text-zinc-400"}`}>Verify</span>
        </div>
      </div>

      {status === "error" && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm text-center">
          Registration failed. Please try again.
        </div>
      )}

      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">DJ / Stage Name *</label>
            <input type="text" required value={djName} onChange={(e) => setDjName(e.target.value)} placeholder="e.g. DJ Phoenix" className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Email Address *</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@djmail.com" className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Instagram Handle (optional)</label>
            <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@djhandle" className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Primary Genre *</label>
            <select required value={genre} onChange={(e) => setGenre(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none">
              <option value="">Select genre</option>
              <option value="house">House</option>
              <option value="tech_house">Tech House</option>
              <option value="techno">Techno</option>
              <option value="drum_and_bass">Drum &amp; Bass</option>
              <option value="ambient">Ambient</option>
              <option value="lo_fi">Lo-Fi</option>
              <option value="hip_hop">Hip-Hop</option>
              <option value="rnb">R&amp;B</option>
              <option value="pop">Pop</option>
              <option value="afrobeats">Afrobeats</option>
              <option value="afro_house">Afro House</option>
              <option value="progressive_house">Progressive House</option>
              <option value="trance">Trance</option>
              <option value="dubstep">Dubstep</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="pt-2">
            <button type="submit" className="w-full gradient-bg text-white font-semibold py-3 rounded-full hover:opacity-90 transition-opacity">Continue</button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Where do you mainly play?</label>
            <select required value={venueType} onChange={(e) => setVenueType(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none">
              <option value="">Select type</option>
              <option value="club">Club Residency</option>
              <option value="wedding">Wedding / Events</option>
              <option value="radio">Radio DJ</option>
              <option value="mobile">Mobile DJ</option>
              <option value="producer">Producer / DJ</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Years DJing</label>
            <select value={yearsDJing} onChange={(e) => setYearsDJing(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none">
              <option value="">Select</option>
              <option value="beginner">Less than 1 year</option>
              <option value="1-3">1-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5-10">5-10 years</option>
              <option value="10+">10+ years</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Short Bio</label>
            <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about your DJ career and what you look for in tracks..." className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 rounded-full text-sm font-semibold border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-violet-300 dark:hover:border-violet-700 transition-colors">Back</button>
            <button type="submit" disabled={status === "loading"} className="flex-[2] gradient-bg text-white font-semibold py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50">
              {status === "loading" ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      )}

      <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400 text-center">
        Already a member?{" "}
        <a href="/dj/login" className="text-violet-600 dark:text-violet-400 font-semibold hover:underline">Sign in</a>
      </p>
    </div>
  );
}

export default function DJRegisterPageWrapper() {
  return (
    <DJProvider>
      <DJRegisterPage />
    </DJProvider>
  );
}
