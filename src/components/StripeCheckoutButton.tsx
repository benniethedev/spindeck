'use client';

import { useState } from 'react';

interface StripeCheckoutButtonProps {
  plan: string;
  planName: string;
  className?: string;
}

export default function StripeCheckoutButton({ plan, planName, className }: StripeCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to start checkout. Please try again.');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={className || 'w-full py-2.5 rounded-full font-semibold text-white bg-violet-600 hover:bg-violet-700 transition-colors disabled:opacity-50'}
    >
      {loading ? 'Loading...' : `Get Started — ${planName}`}
    </button>
  );
}
