/**
 * SubmissionForm Component
 * Full submission form with:
 * - Track name, genre, BPM, musical key
 * - Clean/explicit content rating toggle
 * - Audio file upload (wav/mp3) via StoreAi multipart API
 * - Artwork upload (jpg/png) via StoreAi multipart API
 * - External links (Spotify, Apple Music, YouTube, etc.)
 * - Notes/description
 * - File upload progress tracking
 *
 * Extracted from /artist/submit/page.tsx for reuse.
 */
'use client';

import { useState, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { uploadAudioFile, uploadArtwork } from '@/lib/file-upload';

const GENRES = [
  'house', 'tech_house', 'techno', 'drum_and_bass',
  'ambient', 'lo_fi', 'hip_hop', 'rnb', 'pop',
  'afrobeats', 'afro_house', 'progressive_house', 'trance',
  'dubstep', 'industrial', 'other',
] as const;

const LINK_TYPES = [
  'spotify', 'apple_music', 'youtube', 'soundcloud',
  'bandcamp', 'website', 'other',
] as const;

const MUSICAL_KEYS = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#',
  'G', 'G#', 'A', 'A#', 'B',
] as const;

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ');
}

interface SubmissionFormProps {
  initialTrackName?: string;
  initialGenre?: string;
  initialBpm?: string;
  initialKey?: string;
  initialRating?: 'clean' | 'explicit';
  initialNotes?: string;
  initialAudioFile?: File | null;
  initialArtworkFile?: File | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function SubmissionForm({
  initialTrackName = '',
  initialGenre = '',
  initialBpm = '',
  initialKey = '',
  initialRating = 'clean',
  initialNotes = '',
  onSuccess,
  onCancel,
}: SubmissionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');
  const [success, setSuccess] = useState(false);
  const [trackName, setTrackName] = useState(initialTrackName);
  const [genre, setGenre] = useState(initialGenre);
  const [bpm, setBpm] = useState(initialBpm);
  const [key, setKey] = useState(initialKey);
  const [rating, setRating] = useState<'clean' | 'explicit'>(initialRating);
  const [notes, setNotes] = useState(initialNotes);
  const [links, setLinks] = useState<{ label: string; url: string }[]>([{ label: '', url: '' }]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [audioDrag, setAudioDrag] = useState(false);
  const [artDrag, setArtDrag] = useState(false);
  const audioRef = useRef<HTMLInputElement>(null);
  const artRef = useRef<HTMLInputElement>(null);

  const addLink = () => setLinks([...links, { label: '', url: '' }]);
  const removeLink = (i: number) => setLinks(links.filter((_, j) => j !== i));
  const updateLink = (i: number, field: string, val: string) => {
    const n = [...links];
    n[i] = { ...n[i], [field]: val };
    setLinks(n);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!trackName.trim()) { setError('Track name required'); return; }
    if (!genre) { setError('Genre required'); return; }
    if (!bpm) { setError('BPM required'); return; }
    if (!audioFile) { setError('Audio file required'); return; }

    setLoading(true);
    setUploadProgress('Preparing upload...');

    try {
      setUploadProgress(`Uploading audio (${(audioFile!.size / 1024 / 1024).toFixed(1)} MB)...`);
      const audioResult = await uploadAudioFile(audioFile!);

      let artworkResult = null;
      if (artworkFile) {
        setUploadProgress('Uploading artwork...');
        artworkResult = await uploadArtwork(artworkFile);
      }

      setUploadProgress('Creating submission...');
      const token = localStorage.getItem('spin_token');

      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          trackName,
          genre,
          bpm: Number(bpm),
          key: key || undefined,
          rating,
          isClean: rating === 'clean',
          links: links.filter((l) => l.label && l.url),
          notes,
          audioFileId: audioResult.fileId,
          audioFileUrl: audioResult.url,
          artworkFileId: artworkResult?.fileId,
          artworkUrl: artworkResult?.url,
        }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Submission failed'); return; }

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        router.push('/artist/dashboard');
      }, 2000);
    } catch (err) {
      setError((err as Error).message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className="text-center py-16 bg-zinc-950/50 border border-zinc-800/50 rounded-2xl">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-zinc-100 mb-2">Submission Received!</h3>
        <p className="text-zinc-500 mb-6">Your track is in our review queue.</p>
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-800/50 text-zinc-400 text-sm">
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Redirecting...
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 px-5 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
          <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-red-400 font-medium">{error}</span>
        </div>
      )}

      {/* Upload progress */}
      {uploadProgress && (
        <div className="flex items-center gap-3 px-5 py-4 bg-violet-500/10 border border-violet-500/20 rounded-2xl">
          <svg className="animate-spin w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm text-violet-300 font-medium">{uploadProgress}</span>
        </div>
      )}

      {/* Track Details */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Track Details</h3>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Track Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={trackName}
            onChange={(e) => setTrackName(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all"
            placeholder="e.g., Midnight Groove"
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Genre <span className="text-red-400">*</span>
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all appearance-none"
              required
            >
              <option value="">Select genre</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>{capitalize(g)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              BPM <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={bpm}
              onChange={(e) => setBpm(e.target.value)}
              min="60"
              max="200"
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all"
              placeholder="128"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Musical Key</label>
            <select
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all appearance-none"
            >
              <option value="">Select key</option>
              {MUSICAL_KEYS.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-3">Content Rating</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setRating('clean')}
              className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                rating === 'clean'
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                  : 'border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600'
              }`}
            >
              Clean
            </button>
            <button
              type="button"
              onClick={() => setRating('explicit')}
              className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                rating === 'explicit'
                  ? 'border-red-500/50 bg-red-500/10 text-red-400'
                  : 'border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600'
              }`}
            >
              Explicit
            </button>
          </div>
        </div>
      </div>

      {/* Audio File */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 mb-5">Audio File</h3>
        <div
          onDragOver={(e) => { e.preventDefault(); setAudioDrag(true); }}
          onDragLeave={() => setAudioDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setAudioDrag(false);
            const file = e.dataTransfer.files?.[0];
            if (file?.type.startsWith('audio/')) {
              setAudioFile(file);
              setError('');
            }
          }}
          onClick={() => audioRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            audioDrag
              ? 'border-violet-500/50 bg-violet-500/5'
              : audioFile
              ? 'border-emerald-500/30 bg-emerald-500/5'
              : 'border-zinc-700 hover:border-zinc-600 bg-zinc-900/30'
          }`}
        >
          <input
            ref={audioRef}
            type="file"
            accept="audio/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setAudioFile(e.target.files[0]);
                setError('');
              }
            }}
            className="hidden"
          />
          {audioFile ? (
            <div>
              <p className="text-sm font-medium text-zinc-200">{audioFile.name}</p>
              <p className="text-xs text-zinc-500 mt-1">{(audioFile.size / (1024 * 1024)).toFixed(1)} MB</p>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setAudioFile(null); }}
                className="mt-3 text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Remove
              </button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-zinc-400">
                <span className="text-violet-400 font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-zinc-600 mt-1">MP3, WAV, FLAC up to 200MB</p>
            </div>
          )}
        </div>
      </div>

      {/* Artwork */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 mb-5">Artwork (Optional)</h3>
        <div
          onDragOver={(e) => { e.preventDefault(); setArtDrag(true); }}
          onDragLeave={() => setArtDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setArtDrag(false);
            const file = e.dataTransfer.files?.[0];
            if (file?.type.startsWith('image/')) {
              setArtworkFile(file);
              setError('');
            }
          }}
          onClick={() => artRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            artDrag
              ? 'border-violet-500/50 bg-violet-500/5'
              : artworkFile
              ? 'border-emerald-500/30 bg-emerald-500/5'
              : 'border-zinc-700 hover:border-zinc-600 bg-zinc-900/30'
          }`}
        >
          <input
            ref={artRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setArtworkFile(e.target.files[0]);
                setError('');
              }
            }}
            className="hidden"
          />
          {artworkFile ? (
            <div>
              <p className="text-sm font-medium text-zinc-200">{artworkFile.name}</p>
              <p className="text-xs text-zinc-500 mt-1">{(artworkFile.size / (1024 * 1024)).toFixed(1)} MB</p>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setArtworkFile(null); }}
                className="mt-3 text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Remove
              </button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-zinc-400">
                <span className="text-violet-400 font-medium">Click to upload</span> artwork
              </p>
              <p className="text-xs text-zinc-600 mt-1">JPG, PNG, WebP recommended</p>
            </div>
          )}
        </div>
      </div>

      {/* External Links */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">External Links</h3>
          <button
            type="button"
            onClick={addLink}
            className="text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors"
          >
            + Add Link
          </button>
        </div>
        <div className="space-y-3">
          {links.map((link, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <select
                value={link.label}
                onChange={(e) => updateLink(idx, 'label', e.target.value)}
                className="w-36 px-3 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 appearance-none"
              >
                <option value="">Platform</option>
                {LINK_TYPES.map((t) => (
                  <option key={t} value={t}>{capitalize(t)}</option>
                ))}
              </select>
              <input
                type="text"
                value={link.url}
                onChange={(e) => updateLink(idx, 'url', e.target.value)}
                className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all"
                placeholder="Add link..."
              />
              {links.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLink(idx)}
                  className="p-3 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-zinc-700 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 mb-5">Description</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all resize-none"
          rows={5}
          placeholder="Tell us about this release..."
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t border-zinc-800/50">
        <button
          type="button"
          onClick={onCancel || (() => router.push('/artist/dashboard'))}
          className="px-8 py-3 rounded-xl text-sm font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-10 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submitting...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Submit for Review
            </>
          )}
        </button>
      </div>
    </form>
  );
}
