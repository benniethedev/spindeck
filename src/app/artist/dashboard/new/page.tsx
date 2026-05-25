/**
 * New Submission Form
 */
'use client';

import { useState, useRef } from "react";

const GENRES = [
  "House", "Tech House", "Techno", "Trance", "Drum & Bass",
  "Dubstep", "Trap", "Hip-Hop", "R&B", "Pop",
  "Lo-Fi", "Afrobeats", "Afro House", "Ambient", "Electro",
  "Indie", "Rock", "Reggaeton", "Latin", "K-Pop",
];

interface PlatformLink {
  platform: string;
  url: string;
}

export default function NewSubmissionPage() {
  const [trackName, setTrackName] = useState("");
  const [genre, setGenre] = useState("");
  const [bpm, setBpm] = useState("");
  const [isClean, setIsClean] = useState(true);
  const [platformLinks, setPlatformLinks] = useState<PlatformLink[]>([
    { platform: "spotify", url: "" },
    { platform: "soundcloud", url: "" },
    { platform: "youtube", url: "" },
  ]);
  const [notes, setNotes] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [artworkPreview, setArtworkPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioInputRef = useRef<HTMLInputElement>(null);
  const artworkInputRef = useRef<HTMLInputElement>(null);

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["audio/wav", "audio/mpeg", "audio/x-wav", "audio/mp3"];
      if (!validTypes.includes(file.type) && !file.name.match(/\.wav$/i) && !file.name.match(/\.mp3$/i)) {
        setError("Please upload a WAV or MP3 file");
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError("File too large. Max 100MB");
        return;
      }
      setAudioFile(file);
      setAudioPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleArtworkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
        setError("Please upload a JPG, PNG, or WebP image");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("Artwork too large. Max 10MB");
        return;
      }
      setArtworkFile(file);
      setArtworkPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleAddLink = () => {
    const platforms = ["spotify", "soundcloud", "youtube", "apple_music", "deezer", "tidal", "bandcamp", "other"];
    const used = new Set(platformLinks.map(l => l.platform));
    const available = platforms.find(p => !used.has(p));
    if (available) {
      setPlatformLinks([...platformLinks, { platform: available, url: "" }]);
    }
  };

  const handleRemoveLink = (index: number) => {
    setPlatformLinks(platformLinks.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index: number, url: string) => {
    const updated = [...platformLinks];
    updated[index] = { ...updated[index], url };
    setPlatformLinks(updated);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("artistId", "demo-artist-001");
      formData.append("trackName", trackName);
      if (audioFile) formData.append("audioFile", audioFile);
      if (artworkFile) formData.append("artworkFile", artworkFile);
      let audioFileKey = null;
      let artworkFileKey = null;
      let audioUrl = null;
      let artworkUrl = null;
      if (audioFile || artworkFile) {
        const uploadRes = await fetch("/api/files/upload", { method: "POST", body: formData });
        if (!uploadRes.ok) { const ed = await uploadRes.json(); throw new Error(ed.error || "File upload failed"); }
        const uploadData = await uploadRes.json();
        audioFileKey = uploadData.audioFileKey;
        artworkFileKey = uploadData.artworkFileKey;
        audioUrl = uploadData.audioUrl;
        artworkUrl = uploadData.artworkUrl;
      }
      const links: Record<string, string> = {};
      platformLinks.forEach(pl => {
        if (pl.url.trim()) links[pl.platform] = pl.url.trim();
      });
      if (audioUrl) links["audio_file"] = audioUrl;
      if (artworkUrl) links["artwork_file"] = artworkUrl;
      const submissionRes = await fetch("/api/submissions", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", artistId: "demo-artist-001", trackName, genre, bpm: parseInt(bpm) || 0, isClean, links, notes, audioFileKey, artworkFileKey }),
      });
      if (!submissionRes.ok) { const ed = await submissionRes.json(); throw new Error(ed.error || "Submission failed"); }
      setSuccess(true);
    } catch (err) { setError(err instanceof Error ? err.message : "Submission failed"); }
    finally { setSubmitting(false); }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-12 bg-white dark:bg-zinc-950">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">Submission Submitted!</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
              Your track <strong>{trackName}</strong> is now pending review.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/artist/dashboard" className="px-6 py-3 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all">View Dashboard</a>
              <a href="/artist/dashboard/new" className="px-6 py-3 rounded-full border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">Submit Another</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/" className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Spin<span className="text-violet-600">Rec</span>
            </a>
            <div className="hidden sm:flex items-center gap-1 text-sm">
              <a href="/artist/dashboard" className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Dashboard</a>
              <span className="text-zinc-300 dark:text-zinc-700">/</span>
              <span className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium">New Submission</span>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map(s => (
              <button key={s} onClick={() => setStep(s as 1 | 2 | 3)} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step > s ? 'bg-violet-600 text-white' : step === s ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-300 dark:border-violet-700' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600'
                }`}>
                  {step > s ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  ) : s}
                </div>
                <span className={`text-sm font-medium ${step === s ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-zinc-500'}`}>
                  {s === 1 ? "Details" : s === 2 ? "Files" : "Review"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 text-sm flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            {error}
          </div>
        )}

        {/* Step 1: Track Details */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="trackName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Track Name *</label>
              <input id="trackName" type="text" value={trackName} onChange={e => setTrackName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all" placeholder="Enter track name" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="genre" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Genre *</label>
                <select id="genre" value={genre} onChange={e => setGenre(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all">
                  <option value="">Select genre</option>
                  {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="bpm" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">BPM</label>
                <input id="bpm" type="number" value={bpm} onChange={e => setBpm(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all" placeholder="e.g. 128" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Clean Version</span>
              <button type="button" onClick={() => setIsClean(!isClean)} className={`relative w-11 h-6 rounded-full transition-colors ${isClean ? 'bg-violet-600' : 'bg-zinc-300 dark:bg-zinc-700'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${isClean ? 'translate-x-5' : ''}`} />
              </button>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button onClick={() => setStep(2)} disabled={!trackName || !genre} className="px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all">Next: Files</button>
            </div>
          </div>
        )}

        {/* Step 2: Files */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 p-8 text-center hover:border-violet-400 dark:hover:border-violet-600 transition-colors">
              <svg className="w-10 h-10 mx-auto text-zinc-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">Upload your audio file</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-4">WAV or MP3, max 100MB</p>
              <button type="button" onClick={() => audioInputRef.current?.click()} className="px-5 py-2.5 rounded-full bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all">Choose File</button>
              <input ref={audioInputRef} type="file" accept="audio/wav,audio/mpeg,audio/mp3,.wav,.mp3" className="hidden" onChange={handleAudioUpload} />
              {audioPreview && <p className="mt-3 text-sm text-green-600 dark:text-green-400">✓ {audioFile?.name}</p>}
            </div>
            <div className="rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 p-8 text-center hover:border-violet-400 dark:hover:border-violet-600 transition-colors">
              <svg className="w-10 h-10 mx-auto text-zinc-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">Upload your artwork</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-4">JPG, PNG, or WebP, min 1400x1400px, max 10MB</p>
              <button type="button" onClick={() => artworkInputRef.current?.click()} className="px-5 py-2.5 rounded-full bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all">Choose File</button>
              <input ref={artworkInputRef} type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" className="hidden" onChange={handleArtworkUpload} />
              {artworkPreview && <p className="mt-3 text-sm text-green-600 dark:text-green-400">✓ {artworkFile?.name}</p>}
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="px-6 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 font-semibold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">Back</button>
              <button onClick={() => setStep(3)} disabled={!audioFile} className="px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all">Next: Review</button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 bg-zinc-50 dark:bg-zinc-900/50">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Track Details</h3>
              <dl className="grid sm:grid-cols-2 gap-4 text-sm">
                <div><dt className="text-zinc-500 dark:text-zinc-400">Track Name</dt><dd className="font-medium text-zinc-900 dark:text-white">{trackName}</dd></div>
                <div><dt className="text-zinc-500 dark:text-zinc-400">Genre</dt><dd className="font-medium text-zinc-900 dark:text-white">{genre}</dd></div>
                <div><dt className="text-zinc-500 dark:text-zinc-400">BPM</dt><dd className="font-medium text-zinc-900 dark:text-white">{bpm || 'N/A'}</dd></div>
                <div><dt className="text-zinc-500 dark:text-zinc-400">Clean</dt><dd className="font-medium text-zinc-900 dark:text-white">{isClean ? 'Yes' : 'No'}</dd></div>
              </dl>
            </div>
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 bg-zinc-50 dark:bg-zinc-900/50">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Files</h3>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                {audioFile && <p>Audio: {audioFile.name}</p>}
                {artworkFile && <p>Artwork: {artworkFile.name}</p>}
                {!audioFile && !artworkFile && <p className="text-zinc-400">No files uploaded</p>}
              </div>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="px-6 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 font-semibold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">Back</button>
              <button onClick={handleSubmit} disabled={submitting} className="px-8 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm disabled:opacity-50 transition-all shadow-lg shadow-violet-500/25">{submitting ? 'Submitting...' : 'Submit Track'}</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
