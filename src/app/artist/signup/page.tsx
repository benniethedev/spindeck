'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useArtistAuth, ArtistAuthProvider } from '../context/ArtistAuthContext';

// Prevent static prerendering - requires context provider
export const dynamic = 'force-dynamic';

function ArtistSignupContent() {
  const router = useRouter();
  const { signup, loading: authLoading } = useArtistAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Artist name is required'); return; }
    if (!email.trim()) { setError('Email is required'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }

    setLoading(true);

    const result = await signup(name, email, password);

    if (!result.success) {
      setError(result.error || 'Signup failed');
      setLoading(false);
      return;
    }

    setSuccess(true);

    setTimeout(() => {
      router.push('/artist/dashboard');
      router.refresh();
    }, 1500);
  }

  const getStrength = (): { label: string; color: string; width: string } => {
    if (password.length === 0) return { label: '', color: '', width: 'w-0' };
    if (password.length < 6) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/4' };
    if (password.length < 8) return { label: 'Fair', color: 'bg-amber-500', width: 'w-2/4' };
    if (password.length < 12) return { label: 'Good', color: 'bg-green-500', width: 'w-3/4' };
    return { label: 'Strong', color: 'bg-green-500', width: 'w-full' };
  };
  const strength = getStrength();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-50 via-white to-white dark:from-violet-950/20 dark:via-black dark:to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(124,58,237,0.08),transparent)]" />

      <div className="relative w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <a href="/artist" className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Spin<span className="text-violet-600 dark:text-violet-400">Rec</span>
          </a>
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            Create your artist account
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 shadow-xl shadow-zinc-900/5 dark:shadow-black/20">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Account Created!</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Redirecting to your dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Artist / Stage Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
                  placeholder="Your artist name"
                />
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Email
                </label>
                <input
                  id="signup-email"
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
                {password && (
                  <div className="mt-2">
                    <div className="h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                      <div className={`h-full rounded-full ${strength.color} ${strength.width} transition-all duration-300`} />
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">
                      {strength.label && `${strength.label} password`}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
                  placeholder="••••••••"
                />
                {confirmPassword && confirmPassword !== password && (
                  <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                )}
                {confirmPassword && confirmPassword === password && (
                  <p className="mt-1 text-xs text-green-500">Passwords match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || authLoading}
                className="w-full py-3.5 rounded-full font-semibold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/25 transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </span>
                ) : 'Create Account'}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Already have an account?{' '}
            <a href="/artist/login" className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700">
              Sign in
            </a>
          </p>
        </div>

        <a href="/artist" className="block text-center mt-6 text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
          Back to Artist Portal
        </a>
      </div>
    </div>
  );
}

export default function ArtistSignupPage() {
  return (
    <ArtistAuthProvider>
      <ArtistSignupContent />
    </ArtistAuthProvider>
  );
}
