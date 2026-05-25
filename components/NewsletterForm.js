"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function NewsletterForm({ source = "website", buttonText = "Subscribe" }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/email/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.resubscribed) {
        toast.success("Welcome back! You've been re-subscribed.");
      } else if (data.message?.includes("Already")) {
        toast.success("You're already subscribed!");
      } else {
        toast.success("Thanks for subscribing!");
      }

      setEmail("");
    } catch (error) {
      toast.error(error.message || "Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="Enter your email"
        className="flex-1 px-4 py-3 rounded-lg bg-base-100 border border-base-300 focus:outline-none focus:border-primary"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 bg-primary text-primary-content rounded-lg font-semibold hover:bg-primary-focus transition-colors disabled:opacity-50"
      >
        {loading ? "..." : buttonText}
      </button>
    </form>
  );
}
