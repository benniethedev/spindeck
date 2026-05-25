'use client';

<<<<<<< Updated upstream
import { useState } from 'react';
=======
import { useState, FormEvent } from 'react';
import Link from 'next/link';
>>>>>>> Stashed changes
import { useRouter } from 'next/navigation';
import { useArtistAuth, ArtistAuthProvider } from '../context/ArtistAuthContext';

<<<<<<< Updated upstream
function ArtistSignupContent() {
  const router = useRouter();
  const { signup, loading: authLoading } = useArtistAuth();
=======
const PLANS = [
  { id: 'starter' as const, name: 'Starter', price: '$29/mo', features: ['3 track submissions', 'Basic profile', 'Email support'] },
  { id: 'professional' as const, name: 'Professional', price: '$79/mo', features: ['Unlimited submissions', 'Featured profile', 'Priority support', 'Advanced analytics'], highlighted: true },
  { id: 'enterprise' as const, name: 'Enterprise', price: '$199/mo', features: ['Everything in Pro', 'Dedicated manager', 'Custom campaigns', 'Cross-platform promo'] },
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'plan'>('form');
>>>>>>> Stashed changes
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'professional' | 'enterprise' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

<<<<<<< Updated upstream
  async function handleSubmit(e: React.FormEvent) {
=======
  const handleAccountSubmit = async (e: FormEvent) => {
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======
      // Account created — now choose a plan
      localStorage.setItem('spin_user', JSON.stringify(data.user));
      localStorage.setItem('spin_token', `signup_${Date.now()}`);
      setStep('plan');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
>>>>>>> Stashed changes
  };
  const strength = getStrength();

  const handlePlanSelect = async (planId: 'starter' | 'professional' | 'enterprise') => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planId,
          email,
          name,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        setError(data.error || 'Failed to start checkout');
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('spin_user', JSON.stringify({
      id: `anon_${Date.now()}`,
      email,
      name,
      plan: null,
    }));
    localStorage.setItem('spin_token', `signup_${Date.now()}`);
    router.push('/artist/dashboard');
    router.refresh();
  };

  // Step 1: Account form
  if (step === 'form') {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center px-6 py-16">
        <a href="/artist" className="absolute top-6 left-6 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Artist Portal
        </a>

        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Spin<span className="text-violet-600">Rec</span>
            </Link>
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              Create your free artist account
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 shadow-sm">
            <form onSubmit={handleAccountSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Artist name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
                  placeholder="Your stage name"
                />
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Email address
                </label>
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Password
                </label>
                <input
                  id="signup-password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Confirm password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white dark:bg-zinc-950 px-3 text-zinc-400">or</span>
              </div>
            </div>

            {/* Direct Stripe signup */}
            <button
              onClick={() => {
                // Create a minimal account and go straight to plan selection
                localStorage.setItem('spin_user', JSON.stringify({
                  id: `guest_${Date.now()}`,
                  email: email || 'guest@spinrec.com',
                  name: name || 'Guest Artist',
                  plan: null,
                }));
                localStorage.setItem('spin_token', `stripe_${Date.now()}`);
                setStep('plan');
              }}
              className="w-full py-3.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.308 1.901-1.308 2.227 0 4.515.858 6.09 1.631l.89-5.529C18.252.975 15.697 0 12.165 0 9.667 0 7.589.698 6.104 1.995 4.56 3.38 3.757 5.545 3.757 8.17c0 4.535 2.61 6.193 6.413 7.555 2.424.886 3.228 1.521 3.228 2.47 0 .945-.799 1.482-2.165 1.482-1.782 0-4.572-.909-6.603-2.197l-.904 5.621c1.465.79 3.714 1.684 6.518 1.684 2.582 0 4.592-.656 6.031-1.908 1.629-1.393 2.464-3.376 2.464-5.83.002-4.463-2.62-6.24-6.303-7.594h.001z"/>
              </svg>
              Sign up with email
            </button>

            <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
              Already have an account?{' '}
              <a href="/artist/login" className="text-violet-600 dark:text-violet-400 font-semibold hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Plan selection (after account creation or guest signup)
  return (
<<<<<<< Updated upstream
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
=======
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center px-6 py-16">
      <a href="/artist" className="absolute top-6 left-6 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </a>

      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
            Choose Your Plan
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Select a package to get started with your artist promotion
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`rounded-2xl border p-5 cursor-pointer transition-all duration-200 ${
                selectedPlan === plan.id
                  ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/20 ring-2 ring-violet-500/20'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-violet-300 dark:hover:border-violet-700'
              } ${plan.highlighted ? 'relative' : ''}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold">
                  Popular
                </div>
              )}
              <h3 className="font-semibold text-zinc-900 dark:text-white">{plan.name}</h3>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">{plan.price}</p>
              <ul className="mt-3 space-y-1.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                    <svg className="w-3.5 h-3.5 text-violet-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => selectedPlan && handlePlanSelect(selectedPlan)}
            disabled={!selectedPlan || loading}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-base hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Redirecting...
              </span>
            ) : (
              `Continue with ${selectedPlan ? PLANS.find(p => p.id === selectedPlan)?.name : 'plan'}`
            )}
          </button>
          <button
            onClick={handleSkip}
            className="px-8 py-3.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold text-base hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
          >
            Skip for now
          </button>
        </div>

        {error && (
          <p className="mt-4 text-center text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <p className="mt-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
          Secure payments via Stripe · 30-day money-back guarantee · Cancel anytime
        </p>
>>>>>>> Stashed changes
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
