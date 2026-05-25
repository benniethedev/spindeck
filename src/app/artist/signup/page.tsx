/**
 * Artist Signup Page
 * Creates a new Stripe customer or direct account
 */
'use client';

import { useState, FormEvent } from 'react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      setMessage({ type: 'success', text: 'Account created! Redirecting to dashboard...' });
      setTimeout(() => {
        window.location.href = '/artist/dashboard';
      }, 1000);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Spin<span className="text-violet-600">Rec</span>
          </a>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Create your artist account</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 bg-white dark:bg-zinc-950 shadow-sm">
          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm ${
              message.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Artist / Stage Name</label>
              <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                placeholder="Your artist name" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Email Address</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                placeholder="you@example.com" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-violet-500/25">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
          Already have an account?{' '}<a href="/artist/login" className="underline hover:text-zinc-600 dark:hover:text-zinc-300">Log in</a>
        </p>
      </div>
    </div>
  );
}
