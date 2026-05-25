'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

type Mood = 'energy' | 'chill' | 'dark' | 'euphoric' | 'groovy' | 'all';
type SortBy = 'newest' | 'bpm-asc' | 'bpm-desc' | 'name';

interface Track {
  id: string;
  title: string;
  artist: string;
  artistAvatar: string;
  genre: string;
  bpm: number;
  isClean: boolean;
  mood: Mood;
  artworkColor: string;
  previewUrl: string;
  duration: number;
  plays: number;
  downloads: number;
  addedAt: string;
}

const GENRES = [
  'All', 'House', 'Tech House', 'Techno', 'Trance', 'Drum & Bass',
  'Dubstep', 'Trap', 'Hip-Hop', 'R&B', 'Lo-Fi', 'Afrobeats',
  'Afro House', 'Ambient', 'Electro', 'Indie', 'Pop',
];

const MOODS: { label: string; value: Mood }[] = [
  { label: 'All', value: 'all' },
  { label: 'High Energy', value: 'energy' },
  { label: 'Chill', value: 'chill' },
  { label: 'Dark', value: 'dark' },
  { label: 'Euphoric', value: 'euphoric' },
  { label: 'Groovy', value: 'groovy' },
];

const MOCK_TRACKS: Track[] = [
  { id: 't1', title: 'Midnight Groove', artist: 'Luna Wave', artistAvatar: 'LW', genre: 'Tech House', bpm: 126, isClean: true, mood: 'energy', artworkColor: 'from-violet-600 to-indigo-700', previewUrl: '', duration: 210, plays: 1240, downloads: 342, addedAt: '2026-05-20' },
  { id: 't2', title: 'Neon Dreams', artist: 'DJ Phoenix', artistAvatar: 'DP', genre: 'Techno', bpm: 132, isClean: false, mood: 'dark', artworkColor: 'from-red-600 to-orange-700', previewUrl: '', duration: 195, plays: 890, downloads: 210, addedAt: '2026-05-18' },
  { id: 't3', title: 'Sunrise Protocol', artist: 'Amara Sol', artistAvatar: 'AS', genre: 'Afro House', bpm: 122, isClean: true, mood: 'euphoric', artworkColor: 'from-amber-500 to-yellow-600', previewUrl: '', duration: 240, plays: 2100, downloads: 580, addedAt: '2026-05-22' },
  { id: 't4', title: 'Deep Current', artist: 'The Void', artistAvatar: 'TV', genre: 'Techno', bpm: 128, isClean: true, mood: 'dark', artworkColor: 'from-slate-700 to-gray-900', previewUrl: '', duration: 180, plays: 670, downloads: 145, addedAt: '2026-05-15' },
  { id: 't5', title: 'Cherry Blossom', artist: 'Echo Park', artistAvatar: 'EP', genre: 'Lo-Fi', bpm: 85, isClean: true, mood: 'chill', artworkColor: 'from-pink-400 to-rose-500', previewUrl: '', duration: 220, plays: 3400, downloads: 890, addedAt: '2026-05-21' },
  { id: 't6', title: 'Voltage', artist: 'Nyx Protocol', artistAvatar: 'NP', genre: 'House', bpm: 124, isClean: false, mood: 'groovy', artworkColor: 'from-emerald-500 to-teal-600', previewUrl: '', duration: 200, plays: 1560, downloads: 420, addedAt: '2026-05-19' },
  { id: 't7', title: 'Paradise Found', artist: 'Maya Rivers', artistAvatar: 'MR', genre: 'Afrobeats', bpm: 115, isClean: true, mood: 'euphoric', artworkColor: 'from-green-500 to-lime-600', previewUrl: '', duration: 190, plays: 1890, downloads: 510, addedAt: '2026-05-23' },
  { id: 't8', title: 'Afterdark', artist: 'Kai Storm', artistAvatar: 'KS', genre: 'Tech House', bpm: 128, isClean: false, mood: 'energy', artworkColor: 'from-purple-600 to-fuchsia-700', previewUrl: '', duration: 215, plays: 940, downloads: 260, addedAt: '2026-05-17' },
  { id: 't9', title: 'Floating', artist: 'Zen Garden', artistAvatar: 'ZG', genre: 'Ambient', bpm: 70, isClean: true, mood: 'chill', artworkColor: 'from-cyan-400 to-blue-500', previewUrl: '', duration: 300, plays: 4200, downloads: 1200, addedAt: '2026-05-24' },
  { id: 't10', title: 'Pressure', artist: 'DJ Phoenix', artistAvatar: 'DP', genre: 'Drum & Bass', bpm: 174, isClean: true, mood: 'energy', artworkColor: 'from-orange-500 to-red-600', previewUrl: '', duration: 175, plays: 1100, downloads: 310, addedAt: '2026-05-16' },
  { id: 't11', title: 'Velvet Touch', artist: 'Amara Sol', artistAvatar: 'AS', genre: 'R&B', bpm: 95, isClean: true, mood: 'groovy', artworkColor: 'from-fuchsia-500 to-pink-600', previewUrl: '', duration: 205, plays: 2750, downloads: 740, addedAt: '2026-05-22' },
  { id: 't12', title: 'Concrete Jungle', artist: 'The Void', artistAvatar: 'TV', genre: 'Industrial', bpm: 138, isClean: false, mood: 'dark', artworkColor: 'from-gray-600 to-zinc-900', previewUrl: '', duration: 190, plays: 560, downloads: 130, addedAt: '2026-05-14' },
];

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function AudioPreview({ track }: { track: Track }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const MAX_PREVIEW = 30;

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      setIsPlaying(true);
      setCurrentTime(0);
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= MAX_PREVIEW) {
            setIsPlaying(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return MAX_PREVIEW;
          }
          return prev + 0.5;
        });
      }, 500);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const progress = (currentTime / MAX_PREVIEW) * 100;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={togglePlay}
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all shadow-lg ${
          isPlaying
            ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white hover:from-violet-600 hover:to-indigo-700'
            : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100'
        }`}
        aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
      >
        {isPlaying ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
          </svg>
        )}
      </button>
      <div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden relative">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs text-zinc-400 dark:text-zinc-500 tabular-nums shrink-0 w-16 text-right">
        {formatTime(currentTime)} / {formatTime(MAX_PREVIEW)}
      </span>
    </div>
  );
}

function TrackCard({ track, onDemoRequest }: { track: Track; onDemoRequest: (track: Track) => void }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5 hover:border-violet-200 dark:hover:border-violet-800">
      <div className={`relative aspect-square bg-gradient-to-br ${track.artworkColor} overflow-hidden`}>
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}>
          <div className="text-white/60">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 3-2 3 2zm0 0v-8" />
            </svg>
          </div>
        </div>
        <img
          src={`https://placehold.co/400x400/1a1a2e/ffffff?text=${encodeURIComponent(track.artistAvatar)}`}
          alt={`${track.title} by ${track.artist}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
            track.isClean
              ? 'bg-green-500/90 text-white'
              : 'bg-amber-500/90 text-black'
          }`}>
            {track.isClean ? (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" />
              </svg>
            )}
            {track.isClean ? 'Clean' : 'Explicit'}
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-black/50 text-white backdrop-blur-sm">
            {track.genre}
          </span>
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
            <svg className="w-6 h-6 text-zinc-900 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-zinc-900 dark:text-white truncate text-sm">{track.title}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                {track.artistAvatar}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{track.artist}</p>
            </div>
          </div>
          <span className="text-xs text-zinc-400 dark:text-zinc-500 tabular-nums shrink-0">{track.bpm} BPM</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] text-zinc-500 dark:text-zinc-400 font-medium capitalize">{track.mood}</span>
        </div>
        <div className="mb-3">
          <AudioPreview track={track} />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {formatNumber(track.plays)}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {formatNumber(track.downloads)}
            </span>
          </div>
          <button
            onClick={() => onDemoRequest(track)}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md"
          >
            Request Demo
          </button>
        </div>
      </div>
    </div>
  );
}

function DJRegistrationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({
    stageName: '', realName: '', email: '', phone: '',
    djExperience: '', platforms: [] as string[], bio: '',
  });
  const [loading, setLoading] = useState(false);
  const PLATFORMS = ['Instagram', 'Twitter', 'SoundCloud', 'Mixcloud', 'YouTube', 'Spotify', 'TikTok'];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/dj/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setStep('success');
    } catch {
      setStep('success');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-zinc-950 shadow-2xl border border-zinc-200 dark:border-zinc-800">
        {step === 'form' ? (
          <>
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 pb-4 border-b border-zinc-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Join the DJ Pool</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Get access to thousands of curated tracks</p>
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" aria-label="Close">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="stageName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">DJ Stage Name *</label>
                  <input id="stageName" required type="text" value={formData.stageName} onChange={e => setFormData(p => ({ ...p, stageName: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all" placeholder="Your DJ name" />
                </div>
                <div>
                  <label htmlFor="realName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Real Name *</label>
                  <input id="realName" required type="text" value={formData.realName} onChange={e => setFormData(p => ({ ...p, realName: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all" placeholder="Your full name" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="djEmail" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Email *</label>
                  <input id="djEmail" required type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all" placeholder="you@example.com" />
                </div>
                <div>
                  <label htmlFor="djPhone" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Phone</label>
                  <input id="djPhone" type="tel" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all" placeholder="+1 (555) 000-0000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Years of DJ Experience *</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: '1-2 years', value: '1-2' },
                    { label: '3-5 years', value: '3-5' },
                    { label: '5-10 years', value: '5-10' },
                    { label: '10+ years', value: '10+' },
                  ].map(opt => (
                    <button key={opt.value} type="button" onClick={() => setFormData(p => ({ ...p, djExperience: opt.value }))} className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                      formData.djExperience === opt.value
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300'
                        : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-600'
                    }`}>{opt.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Music Platforms</label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map(platform => (
                    <button key={platform} type="button" onClick={() => setFormData(p => ({
                      ...p, platforms: p.platforms.includes(platform) ? p.platforms.filter(x => x !== platform) : [...p.platforms, platform],
                    }))} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      formData.platforms.includes(platform)
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300'
                        : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-600'
                    }`}>{platform}</button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Short Bio</label>
                <textarea id="bio" rows={3} value={formData.bio} onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all resize-none" placeholder="Tell us about your DJ style and experience..." />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button type="submit" disabled={loading} className="flex-1 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/25">
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
                <button type="button" onClick={onClose} className="px-6 py-3.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 font-semibold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">Cancel</button>
              </div>
            </form>
          </>
        ) : (
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Application Submitted!</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm mx-auto">Thanks for applying to the DJ pool. Our team will review your application and get back to you within 48 hours.</p>
            <button onClick={onClose} className="px-8 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/25">Back to Browse</button>
          </div>
        )}
      </div>
    </div>
  );
}

function DemoRequestModal({ isOpen, onClose, track }: { isOpen: boolean; onClose: () => void; track: Track | null }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');

  if (!isOpen || !track) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/dj/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackId: track.id, email, note }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-zinc-950 shadow-2xl border border-zinc-200 dark:border-zinc-800">
        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Demo Requested!</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">You will receive a download link for &quot;{track.title}&quot; via email shortly.</p>
            <button onClick={onClose} className="px-6 py-2.5 rounded-full bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white font-semibold text-sm hover:bg-zinc-800 transition-all">Close</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Request Demo</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{track.title} - {track.artist}</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" aria-label="Close">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="demoDjEmail" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">DJ Email *</label>
                  <input id="demoDjEmail" required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all" placeholder="you@dj.com" />
                </div>
                <div>
                  <label htmlFor="demoNote" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Note (optional)</label>
                  <textarea id="demoNote" rows={2} value={note} onChange={e => setNote(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all resize-none" placeholder="Why do you want this track?" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={loading} className="flex-1 py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-violet-500/25">
                    {loading ? 'Sending...' : 'Send Request'}
                  </button>
                  <button type="button" onClick={onClose} className="px-5 py-3 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 font-semibold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">Cancel</button>
                </div>
              </form>
              <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500 text-center">
                Must be a verified DJ to download full tracks.{' '}
                <button onClick={onClose} className="text-violet-600 dark:text-violet-400 hover:underline">Apply to join</button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function DJPoolPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedMood, setSelectedMood] = useState<Mood>('all');
  const [bpmRange, setBpmRange] = useState<[number, number]>([60, 200]);
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [isDjModalOpen, setIsDjModalOpen] = useState(false);
  const [demoTrack, setDemoTrack] = useState<Track | null>(null);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const filteredTracks = useCallback(() => {
    let tracks = [...MOCK_TRACKS];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      tracks = tracks.filter(t => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q) || t.genre.toLowerCase().includes(q));
    }
    if (selectedGenre !== 'All') tracks = tracks.filter(t => t.genre === selectedGenre);
    if (selectedMood !== 'all') tracks = tracks.filter(t => t.mood === selectedMood);
    tracks = tracks.filter(t => t.bpm >= bpmRange[0] && t.bpm <= bpmRange[1]);
    switch (sortBy) {
      case 'bpm-asc': tracks.sort((a, b) => a.bpm - b.bpm); break;
      case 'bpm-desc': tracks.sort((a, b) => b.bpm - a.bpm); break;
      case 'name': tracks.sort((a, b) => a.title.localeCompare(b.title)); break;
      default: tracks.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
    }
    return tracks;
  }, [searchQuery, selectedGenre, selectedMood, bpmRange, sortBy]);

  const tracks = filteredTracks();

  const handleDemoRequest = (track: Track) => { setDemoTrack(track); setIsDemoModalOpen(true); };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-50 via-white to-white dark:from-violet-950/20 dark:via-black dark:to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(124,58,237,0.12),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8 sm:pb-12">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              DJ Pool - Curated Tracks
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight mb-4">
              Discover Music for Your Next{' '}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Set</span>
            </h1>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              Browse thousands of tracks from independent artists. Preview, filter by genre, BPM amp; mood, and request full downloads.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search tracks, artists, or genres..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all shadow-sm text-base"
              />
            </div>
          </div>
        </div>
        <div className="relative">
          <svg className="w-full h-8 sm:h-12 text-white dark:text-black" viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,30 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* FILTERS - Sticky */}
      <section className="bg-white dark:bg-black border-b border-zinc-100 dark:border-zinc-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mr-1 shrink-0">Genre:</span>
              <div className="flex flex-wrap gap-1.5">
                {GENRES.map(genre => (
                  <button key={genre} onClick={() => setSelectedGenre(genre)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedGenre === genre ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}>{genre}</button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mr-1 shrink-0">Mood:</span>
              <div className="flex flex-wrap gap-1.5">
                {MOODS.map(mood => (
                  <button key={mood.value} onClick={() => setSelectedMood(mood.value)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                    selectedMood === mood.value ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}>{mood.label}</button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider shrink-0">BPM:</span>
                <div className="flex items-center gap-2">
                  <input type="range" min={60} max={200} value={bpmRange[0]} onChange={e => setBpmRange([+e.target.value, bpmRange[1]])} className="w-24 h-1.5 accent-violet-600" />
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 tabular-nums font-medium">{bpmRange[0]}</span>
                  <span className="text-zinc-300 dark:text-zinc-700">-</span>
                  <input type="range" min={60} max={200} value={bpmRange[1]} onChange={e => setBpmRange([bpmRange[0], +e.target.value])} className="w-24 h-1.5 accent-violet-600" />
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 tabular-nums font-medium">{bpmRange[1]}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0">Sort:</span>
                <select value={sortBy} onChange={e => setSortBy(e.target.value as SortBy)} className="text-xs bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1.5 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-violet-500">
                  <option value="newest">Newest First</option>
                  <option value="bpm-asc">BPM: Low - High</option>
                  <option value="bpm-desc">BPM: High - Low</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRACK GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-zinc-500 dark:text-zinc-400"><span className="font-semibold text-zinc-900 dark:text-white">{tracks.length}</span> tracks available</p>
          {(searchQuery || selectedGenre !== 'All' || selectedMood !== 'all') && (
            <button onClick={() => { setSearchQuery(''); setSelectedGenre('All'); setSelectedMood('all'); setBpmRange([60, 200]); }} className="text-xs text-violet-600 dark:text-violet-400 hover:underline font-medium">Clear filters</button>
          )}
        </div>
        {tracks.length === 0 ? (
          <div className="text-center py-24">
            <svg className="w-16 h-16 mx-auto text-zinc-300 dark:text-zinc-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">No tracks found</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Try adjusting your search or filters.</p>
            <button onClick={() => { setSearchQuery(''); setSelectedGenre('All'); setSelectedMood('all'); setBpmRange([60, 200]); }} className="px-5 py-2.5 rounded-full bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800 transition-all">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {tracks.map(track => (
              <TrackCard key={track.id} track={track} onDemoRequest={handleDemoRequest} />
            ))}
          </div>
        )}
      </section>

      {/* DJ CTA */}
      <section className="border-t border-zinc-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_60%)]" />
            <div className="relative px-6 py-14 sm:px-16 sm:py-20 text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4">Are You a DJ?</h2>
              <p className="text-base sm:text-lg text-violet-100 max-w-xl mx-auto mb-8 leading-relaxed">
                Join the SpinRec DJ pool to get early access to fresh tracks, exclusive drops, and a full library ready for your next set.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => setIsDjModalOpen(true)} className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-violet-700 font-semibold text-base hover:bg-zinc-100 transition-all shadow-lg">Apply to Join</button>
                <a href="/artist/login" className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-white/30 text-white font-semibold text-base hover:bg-white/10 transition-all">DJ Login</a>
              </div>
              <p className="mt-5 text-xs text-violet-200/60">Free for verified DJs - Approval within 48 hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <a href="/" className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Spin<span className="text-violet-600">Rec</span></a>
              <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">Connecting independent artists with top DJs worldwide.</p>
              <div className="flex gap-4 mt-5">
                <a href="#" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" aria-label="Instagram"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
                <a href="#" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" aria-label="Twitter"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                <a href="#" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" aria-label="YouTube"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">Platform</h3>
              <ul className="space-y-3 text-sm"><li><a href="/artist" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">For Artists</a></li><li><a href="/about" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">About</a></li><li><a href="/contact" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Contact</a></li></ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">Resources</h3>
              <ul className="space-y-3 text-sm"><li><a href="#" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Blog</a></li><li><a href="#" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">FAQ</a></li><li><a href="#" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Help Center</a></li></ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">Legal</h3>
              <ul className="space-y-3 text-sm"><li><a href="#" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Terms of Service</a></li><li><a href="#" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Privacy Policy</a></li><li><a href="#" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">DMCA</a></li></ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-zinc-400 dark:text-zinc-500">Copyright {new Date().getFullYear()} SpinRec. All rights reserved.</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">Made with care for independent artists</p>
          </div>
        </div>
      </footer>

      <DJRegistrationModal isOpen={isDjModalOpen} onClose={() => setIsDjModalOpen(false)} />
      <DemoRequestModal isOpen={isDemoModalOpen} onClose={() => { setIsDemoModalOpen(false); setDemoTrack(null); }} track={demoTrack} />
    </div>
  );
}
