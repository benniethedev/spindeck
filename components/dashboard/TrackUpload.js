"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createClient } from "@/libs/pressbase/client";
import Link from "next/link";
import toast from "react-hot-toast";

const genres = [
  "Hip-Hop", "R&B", "Pop", "Electronic", "House", "Techno", "Trap", "Drill",
  "Afrobeat", "Reggae", "Dancehall", "Latin", "Rock", "Alternative", "Indie",
  "Jazz", "Soul", "Funk", "Country", "Folk", "Classical", "Other"
];

const keys = [
  "C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B"
];

// BPM detection using Web Audio API
async function detectBPM(audioFile) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const arrayBuffer = e.target.result;
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // Get audio data from first channel
        const channelData = audioBuffer.getChannelData(0);
        const sampleRate = audioBuffer.sampleRate;
        
        // Downsample to reduce processing
        const samples = [];
        const downsampleFactor = Math.floor(sampleRate / 200); // ~200 samples per second
        for (let i = 0; i < channelData.length; i += downsampleFactor) {
          samples.push(Math.abs(channelData[i]));
        }
        
        // Find peaks (local maxima above threshold)
        const threshold = samples.reduce((a, b) => a + b) / samples.length * 1.5;
        const peaks = [];
        for (let i = 1; i < samples.length - 1; i++) {
          if (samples[i] > threshold && samples[i] > samples[i - 1] && samples[i] > samples[i + 1]) {
            peaks.push(i);
          }
        }
        
        // Calculate intervals between peaks
        const intervals = [];
        for (let i = 1; i < Math.min(peaks.length, 100); i++) {
          intervals.push(peaks[i] - peaks[i - 1]);
        }
        
        if (intervals.length === 0) {
          resolve(null);
          return;
        }
        
        // Find most common interval (mode)
        const intervalCounts = {};
        intervals.forEach(interval => {
          const rounded = Math.round(interval / 5) * 5; // Round to nearest 5
          intervalCounts[rounded] = (intervalCounts[rounded] || 0) + 1;
        });
        
        const mostCommonInterval = parseInt(Object.entries(intervalCounts)
          .sort((a, b) => b[1] - a[1])[0][0]);
        
        // Convert to BPM (samples per beat * samples per second = beats per minute)
        const samplesPerSecond = 200; // Our downsampled rate
        const bpm = Math.round((60 * samplesPerSecond) / mostCommonInterval);
        
        // Clamp to reasonable range and handle common doubles/halves
        let finalBpm = bpm;
        while (finalBpm < 60) finalBpm *= 2;
        while (finalBpm > 180) finalBpm /= 2;
        
        audioContext.close();
        resolve(Math.round(finalBpm));
      } catch (err) {
        console.error("BPM detection error:", err);
        resolve(null);
      }
    };
    reader.onerror = () => resolve(null);
    reader.readAsArrayBuffer(audioFile);
  });
}

// Extract ID3 metadata from audio file
async function extractMetadata(file) {
  try {
    const { parseBlob } = await import("music-metadata");
    const metadata = await parseBlob(file);
    
    return {
      title: metadata.common?.title || null,
      artist: metadata.common?.artist || null,
      album: metadata.common?.album || null,
      genre: metadata.common?.genre?.[0] || null,
      year: metadata.common?.year || null,
      bpm: metadata.common?.bpm || null,
      key: metadata.common?.key || null,
      duration: metadata.format?.duration ? Math.floor(metadata.format.duration) : null,
      picture: metadata.common?.picture?.[0] || null, // Embedded artwork
    };
  } catch (err) {
    console.error("Metadata extraction error:", err);
    return null;
  }
}

// Upload progress steps
const UPLOAD_STEPS = [
  { id: "analyze", label: "Analyzing audio file...", progress: 10 },
  { id: "metadata", label: "Extracting metadata...", progress: 20 },
  { id: "bpm", label: "Detecting BPM...", progress: 35 },
  { id: "uploadAudio", label: "Uploading audio...", progress: 60 },
  { id: "uploadArtwork", label: "Uploading artwork...", progress: 80 },
  { id: "save", label: "Saving track info...", progress: 95 },
  { id: "complete", label: "Complete!", progress: 100 },
];

export default function TrackUpload({ userId, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    artist_name: "",
    genre: "",
    bpm: "",
    key: "",
    type: "single",
    metadata: {}
  });
  const [audioFile, setAudioFile] = useState(null);
  const [artworkFile, setArtworkFile] = useState(null);
  const [artworkPreview, setArtworkPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audioDragActive, setAudioDragActive] = useState(false);
  const [artworkDragActive, setArtworkDragActive] = useState(false);
  const [extractedMetadata, setExtractedMetadata] = useState(null);
  const [uploadLimits, setUploadLimits] = useState(null);
  const [loadingLimits, setLoadingLimits] = useState(true);
  
  const audioInputRef = useRef(null);
  const artworkInputRef = useRef(null);
  const pb = createClient();

  // Fetch upload limits on mount
  useEffect(() => {
    const fetchLimits = async () => {
      try {
        const response = await fetch("/api/upload");
        if (response.ok) {
          const data = await response.json();
          setUploadLimits(data);
        }
      } catch (error) {
        console.error("Failed to fetch upload limits:", error);
      } finally {
        setLoadingLimits(false);
      }
    };
    fetchLimits();
  }, []);

  // Genre mapping from common ID3 genres to our list
  const mapGenre = (genreStr) => {
    if (!genreStr) return "";
    const lower = genreStr.toLowerCase();
    const genreMap = {
      "hip-hop": "Hip-Hop", "hip hop": "Hip-Hop", "rap": "Hip-Hop",
      "r&b": "R&B", "rnb": "R&B", "rhythm and blues": "R&B",
      "pop": "Pop", "dance": "Electronic", "edm": "Electronic",
      "house": "House", "techno": "Techno", "trap": "Trap",
      "afrobeat": "Afrobeat", "afrobeats": "Afrobeat",
      "reggae": "Reggae", "dancehall": "Dancehall",
      "latin": "Latin", "reggaeton": "Latin",
      "rock": "Rock", "alternative": "Alternative", "indie": "Indie",
      "jazz": "Jazz", "soul": "Soul", "funk": "Funk",
      "country": "Country", "folk": "Folk", "classical": "Classical",
    };
    
    for (const [key, value] of Object.entries(genreMap)) {
      if (lower.includes(key)) return value;
    }
    return genres.includes(genreStr) ? genreStr : "";
  };

  // Handle audio file selection
  const handleAudioFile = useCallback(async (file) => {
    if (!file) return;
    
    if (!file.type.startsWith("audio/") && !file.name.match(/\.(mp3|wav|flac|m4a|aac|ogg)$/i)) {
      toast.error("Please select a valid audio file (MP3, WAV, FLAC, M4A)");
      return;
    }

    setAudioFile(file);
    setIsAnalyzing(true);
    
    // Extract filename as fallback title
    const filenameTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    
    try {
      // Extract metadata
      const metadata = await extractMetadata(file);
      setExtractedMetadata(metadata);
      
      // Auto-fill form with extracted metadata
      setFormData(prev => ({
        ...prev,
        title: metadata?.title || filenameTitle || prev.title,
        artist_name: metadata?.artist || prev.artist_name,
        genre: mapGenre(metadata?.genre) || prev.genre,
        bpm: metadata?.bpm?.toString() || prev.bpm,
        key: metadata?.key || prev.key,
      }));
      
      // If embedded artwork exists and no artwork uploaded yet
      if (metadata?.picture && !artworkFile) {
        const blob = new Blob([metadata.picture.data], { type: metadata.picture.format });
        const artworkUrl = URL.createObjectURL(blob);
        setArtworkPreview(artworkUrl);
        // Convert to File for upload
        const embeddedArtwork = new File([blob], "embedded-artwork.jpg", { type: metadata.picture.format });
        setArtworkFile(embeddedArtwork);
        toast.success("Found embedded artwork!");
      }
      
      // Detect BPM if not in metadata
      if (!metadata?.bpm) {
        toast.loading("Detecting BPM...", { id: "bpm-detect" });
        const detectedBpm = await detectBPM(file);
        toast.dismiss("bpm-detect");
        
        if (detectedBpm) {
          setFormData(prev => ({ ...prev, bpm: detectedBpm.toString() }));
          toast.success(`Detected BPM: ${detectedBpm}`);
        }
      }
      
      if (metadata?.title || metadata?.artist) {
        toast.success("Metadata extracted from file!");
      }
    } catch (error) {
      console.error("Error processing audio:", error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [artworkFile]);

  // Handle artwork file selection
  const handleArtworkFile = useCallback((file) => {
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    
    setArtworkFile(file);
    const previewUrl = URL.createObjectURL(file);
    setArtworkPreview(previewUrl);
  }, []);

  // Drag and drop handlers for audio
  const handleAudioDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setAudioDragActive(true);
    } else if (e.type === "dragleave") {
      setAudioDragActive(false);
    }
  }, []);

  const handleAudioDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setAudioDragActive(false);
    
    if (e.dataTransfer.files?.[0]) {
      handleAudioFile(e.dataTransfer.files[0]);
    }
  }, [handleAudioFile]);

  // Drag and drop handlers for artwork
  const handleArtworkDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setArtworkDragActive(true);
    } else if (e.type === "dragleave") {
      setArtworkDragActive(false);
    }
  }, []);

  const handleArtworkDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setArtworkDragActive(false);
    
    if (e.dataTransfer.files?.[0]) {
      handleArtworkFile(e.dataTransfer.files[0]);
    }
  }, [handleArtworkFile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const uploadFile = async (file, folder) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await pb.storage
      .from("tracks")
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = pb.storage
      .from("tracks")
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const setStep = (stepId) => {
    const step = UPLOAD_STEPS.find(s => s.id === stepId);
    if (step) {
      setCurrentStep(step);
      setUploadProgress(step.progress);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!audioFile) {
      toast.error("Please select an audio file");
      return;
    }

    if (!formData.title || !formData.artist_name || !formData.genre) {
      toast.error("Please fill in all required fields");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Step 1: Analyze
      setStep("analyze");
      await new Promise(r => setTimeout(r, 300));

      // Step 2: Get duration
      setStep("metadata");
      const audioElement = document.createElement("audio");
      audioElement.src = URL.createObjectURL(audioFile);
      
      const duration = await new Promise((resolve) => {
        audioElement.addEventListener("loadedmetadata", () => {
          resolve(Math.floor(audioElement.duration));
        });
        audioElement.addEventListener("error", () => resolve(0));
      });

      // Step 3: BPM (already done during analysis, just show step)
      setStep("bpm");
      await new Promise(r => setTimeout(r, 200));

      // Step 4: Upload audio file
      setStep("uploadAudio");
      const audioUrl = await uploadFile(audioFile, "audio");

      // Step 5: Upload artwork if provided
      setStep("uploadArtwork");
      let artworkUrl = null;
      if (artworkFile) {
        artworkUrl = await uploadFile(artworkFile, "artwork");
      }
      await new Promise(r => setTimeout(r, 200));

      // Step 6: Save track to database
      setStep("save");
      const { data: track, error } = await pb
        .from("tracks")
        .insert({
          user_id: userId,
          title: formData.title,
          artist_name: formData.artist_name,
          audio_url: audioUrl,
          artwork_url: artworkUrl,
          type: formData.type,
          genre: formData.genre,
          bpm: formData.bpm ? parseInt(formData.bpm) : null,
          key: formData.key || null,
          duration: duration,
          file_size: audioFile.size,
          status: "pending",
          metadata: {
            upload_date: new Date().toISOString(),
            original_filename: audioFile.name,
            file_type: audioFile.type,
            extracted: extractedMetadata ? {
              album: extractedMetadata.album,
              year: extractedMetadata.year,
            } : null,
          }
        })
        .select()
        .single();

      if (error) throw error;

      setStep("complete");
      toast.success("Track uploaded successfully! It's now pending approval.");
      
      // Reset form
      setFormData({
        title: "",
        artist_name: "",
        genre: "",
        bpm: "",
        key: "",
        type: "single",
        metadata: {}
      });
      setAudioFile(null);
      setArtworkFile(null);
      setArtworkPreview(null);
      setExtractedMetadata(null);

      // Call success callback after a brief delay
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1000);

    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      setCurrentStep(null);
      setUploadProgress(0);
    }
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (artworkPreview) {
        URL.revokeObjectURL(artworkPreview);
      }
    };
  }, [artworkPreview]);

  const clearAudio = () => {
    setAudioFile(null);
    setExtractedMetadata(null);
    if (audioInputRef.current) {
      audioInputRef.current.value = "";
    }
  };

  const clearArtwork = () => {
    setArtworkFile(null);
    if (artworkPreview) {
      URL.revokeObjectURL(artworkPreview);
    }
    setArtworkPreview(null);
    if (artworkInputRef.current) {
      artworkInputRef.current.value = "";
    }
  };

  // Check if user has reached upload limit
  const hasReachedLimit = uploadLimits && !uploadLimits.unlimited && uploadLimits.remaining <= 0;
  const isFreePlan = uploadLimits && uploadLimits.limit === 0;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Upload New Track</h2>

      {/* Upload Limits Banner */}
      {!loadingLimits && uploadLimits && (
        <div className={`mb-6 rounded-lg p-4 border ${
          hasReachedLimit 
            ? "bg-red-500/10 border-red-500/30" 
            : isFreePlan
              ? "bg-yellow-500/10 border-yellow-500/30"
              : "bg-spindeck-dark border-gray-700"
        }`}>
          {hasReachedLimit || isFreePlan ? (
            <div className="flex items-start gap-4">
              <div className="text-3xl">{isFreePlan ? "🔒" : "⚠️"}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">
                  {isFreePlan ? "Subscription Required" : "Monthly Limit Reached"}
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  {isFreePlan 
                    ? "You need a subscription plan to upload tracks to the DJ pool."
                    : `You've used all ${uploadLimits.limit} of your monthly track uploads.`
                  }
                </p>
                <Link 
                  href="/pricing" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-spindeck-red hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Upgrade Your Plan
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <p className="text-sm text-gray-400">Monthly uploads</p>
                  <p className="font-semibold text-white">
                    {uploadLimits.unlimited 
                      ? "Unlimited" 
                      : `${uploadLimits.current} / ${uploadLimits.limit} used`
                    }
                  </p>
                </div>
              </div>
              {!uploadLimits.unlimited && (
                <div className="text-right">
                  <p className="text-sm text-gray-400">Remaining</p>
                  <p className="font-semibold text-green-400">{uploadLimits.remaining} tracks</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Audio File Upload - Drag & Drop */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Audio File <span className="text-red-500">*</span>
            </label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                audioDragActive 
                  ? "border-spindeck-red bg-spindeck-red/10 scale-[1.02]" 
                  : audioFile 
                    ? "border-green-500 bg-green-500/5"
                    : "border-gray-600 hover:border-spindeck-red hover:bg-gray-800/50"
              }`}
              onDragEnter={handleAudioDrag}
              onDragLeave={handleAudioDrag}
              onDragOver={handleAudioDrag}
              onDrop={handleAudioDrop}
            >
              <input
                ref={audioInputRef}
                type="file"
                accept="audio/*,.mp3,.wav,.flac,.m4a,.aac,.ogg"
                onChange={(e) => handleAudioFile(e.target.files[0])}
                className="hidden"
                id="audio-upload"
              />
              <label htmlFor="audio-upload" className="cursor-pointer block">
                {isAnalyzing ? (
                  <div className="py-4">
                    <div className="animate-spin text-4xl mb-3">⏳</div>
                    <p className="text-spindeck-red font-medium">Analyzing audio file...</p>
                    <p className="text-sm text-spindeck-gray mt-1">Extracting metadata and detecting BPM</p>
                  </div>
                ) : audioFile ? (
                  <div className="py-2">
                    <div className="text-4xl mb-3">✅</div>
                    <p className="text-green-400 font-semibold text-lg">{audioFile.name}</p>
                    <p className="text-sm text-spindeck-gray mt-1">
                      {(audioFile.size / (1024 * 1024)).toFixed(2)} MB • {audioFile.type || "audio file"}
                    </p>
                    {extractedMetadata && (
                      <div className="mt-3 inline-flex items-center gap-2 text-xs bg-gray-800 rounded-full px-3 py-1">
                        <span className="text-green-400">✓ Metadata extracted</span>
                        {extractedMetadata.bpm && <span>• BPM: {extractedMetadata.bpm}</span>}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-4">
                    <div className="text-5xl mb-3">🎵</div>
                    <p className="text-white font-medium text-lg mb-1">
                      Drag & drop your audio file here
                    </p>
                    <p className="text-spindeck-gray text-sm">
                      or <span className="text-spindeck-red underline">click to browse</span>
                    </p>
                    <p className="text-xs text-spindeck-gray mt-3">
                      MP3, WAV, FLAC, M4A supported • Max 100MB
                    </p>
                  </div>
                )}
              </label>
              
              {audioFile && !isAnalyzing && (
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); clearAudio(); }}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Artwork Upload - Drag & Drop with Preview */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Artwork {artworkPreview && <span className="text-green-400 text-xs ml-2">✓ Ready</span>}
            </label>
            <div className="flex gap-4">
              {/* Drop zone */}
              <div
                className={`flex-1 border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                  artworkDragActive 
                    ? "border-spindeck-red bg-spindeck-red/10 scale-[1.02]" 
                    : artworkFile 
                      ? "border-green-500 bg-green-500/5"
                      : "border-gray-600 hover:border-spindeck-red hover:bg-gray-800/50"
                }`}
                onDragEnter={handleArtworkDrag}
                onDragLeave={handleArtworkDrag}
                onDragOver={handleArtworkDrag}
                onDrop={handleArtworkDrop}
              >
                <input
                  ref={artworkInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleArtworkFile(e.target.files[0])}
                  className="hidden"
                  id="artwork-upload"
                />
                <label htmlFor="artwork-upload" className="cursor-pointer block">
                  {artworkFile ? (
                    <div>
                      <div className="text-3xl mb-2">✅</div>
                      <p className="text-green-400 font-medium">{artworkFile.name}</p>
                      <p className="text-xs text-spindeck-gray mt-1">
                        {(artworkFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-4xl mb-2">🖼️</div>
                      <p className="text-white mb-1">Drag & drop artwork</p>
                      <p className="text-xs text-spindeck-gray">
                        JPG, PNG • Recommended: 1000×1000px
                      </p>
                    </div>
                  )}
                </label>
                
                {artworkFile && (
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); clearArtwork(); }}
                    className="mt-2 text-xs text-red-400 hover:text-red-300"
                  >
                    Remove artwork
                  </button>
                )}
              </div>
              
              {/* Preview */}
              {artworkPreview && (
                <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-700 flex-shrink-0">
                  <img 
                    src={artworkPreview} 
                    alt="Artwork preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Track Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Track Title <span className="text-red-500">*</span>
                {extractedMetadata?.title && (
                  <span className="text-xs text-green-400 ml-2">Auto-filled</span>
                )}
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-spindeck-red focus:ring-1 focus:ring-spindeck-red transition-colors"
                placeholder="Enter track title"
                required
              />
            </div>

            {/* Artist Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Artist Name <span className="text-red-500">*</span>
                {extractedMetadata?.artist && (
                  <span className="text-xs text-green-400 ml-2">Auto-filled</span>
                )}
              </label>
              <input
                type="text"
                name="artist_name"
                value={formData.artist_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-spindeck-red focus:ring-1 focus:ring-spindeck-red transition-colors"
                placeholder="Enter artist name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Genre */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Genre <span className="text-red-500">*</span>
              </label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-spindeck-red focus:ring-1 focus:ring-spindeck-red transition-colors"
                required
              >
                <option value="">Select genre</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            {/* BPM */}
            <div>
              <label className="block text-sm font-medium mb-2">
                BPM
                {formData.bpm && extractedMetadata?.bpm && (
                  <span className="text-xs text-blue-400 ml-2">Detected</span>
                )}
              </label>
              <input
                type="number"
                name="bpm"
                value={formData.bpm}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-spindeck-red focus:ring-1 focus:ring-spindeck-red transition-colors"
                placeholder="e.g. 120"
                min="60"
                max="200"
              />
            </div>

            {/* Key */}
            <div>
              <label className="block text-sm font-medium mb-2">Key</label>
              <select
                name="key"
                value={formData.key}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-spindeck-red focus:ring-1 focus:ring-spindeck-red transition-colors"
              >
                <option value="">Select key</option>
                {keys.map(key => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>

            {/* Track Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-spindeck-red focus:ring-1 focus:ring-spindeck-red transition-colors"
              >
                <option value="single">Single</option>
                <option value="mixtape">Mixtape</option>
                <option value="video">Video</option>
              </select>
            </div>
          </div>

          {/* Upload Progress */}
          {uploading && currentStep && (
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">{currentStep.label}</span>
                <span className="text-spindeck-red font-mono">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-spindeck-red to-red-400 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              
              {/* Step indicators */}
              <div className="mt-4 flex flex-wrap gap-2">
                {UPLOAD_STEPS.slice(0, -1).map((step) => {
                  const isComplete = uploadProgress > step.progress;
                  const isCurrent = currentStep.id === step.id;
                  return (
                    <div
                      key={step.id}
                      className={`text-xs px-2 py-1 rounded-full transition-colors ${
                        isComplete 
                          ? "bg-green-500/20 text-green-400"
                          : isCurrent
                            ? "bg-spindeck-red/20 text-spindeck-red animate-pulse"
                            : "bg-gray-700 text-gray-500"
                      }`}
                    >
                      {isComplete ? "✓" : isCurrent ? "●" : "○"} {step.label.replace("...", "")}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-800">
            <p className="text-sm text-spindeck-gray">
              {hasReachedLimit || isFreePlan ? (
                <span className="text-red-400">Upgrade to upload tracks</span>
              ) : audioFile ? (
                <span>Ready to upload <strong>{audioFile.name}</strong></span>
              ) : (
                "Select an audio file to continue"
              )}
            </p>
            <button
              type="submit"
              disabled={uploading || !audioFile || isAnalyzing || hasReachedLimit || isFreePlan}
              className="px-8 py-3 bg-spindeck-red hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : isAnalyzing ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : hasReachedLimit || isFreePlan ? (
                <>
                  <span>🔒</span>
                  Upgrade to Upload
                </>
              ) : (
                <>
                  <span>⬆️</span>
                  Upload Track
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
