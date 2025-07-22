"use client";

import { useState } from "react";
import { createClient } from "@/libs/supabase/client";
import toast from "react-hot-toast";

const genres = [
  "Hip-Hop", "R&B", "Pop", "Electronic", "House", "Techno", "Trap", "Drill",
  "Afrobeat", "Reggae", "Dancehall", "Latin", "Rock", "Alternative", "Indie",
  "Jazz", "Soul", "Funk", "Country", "Folk", "Classical", "Other"
];

const keys = [
  "C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B"
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
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const supabase = createClient();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (fileType === "audio") {
      if (file && file.type.startsWith("audio/")) {
        setAudioFile(file);
      } else {
        toast.error("Please select a valid audio file");
      }
    } else if (fileType === "artwork") {
      if (file && file.type.startsWith("image/")) {
        setArtworkFile(file);
      } else {
        toast.error("Please select a valid image file");
      }
    }
  };

  const uploadFile = async (file, folder) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from("tracks")
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("tracks")
      .getPublicUrl(filePath);

    return publicUrl;
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
      // Upload audio file
      setUploadProgress(25);
      const audioUrl = await uploadFile(audioFile, "audio");

      // Upload artwork if provided
      setUploadProgress(50);
      let artworkUrl = null;
      if (artworkFile) {
        artworkUrl = await uploadFile(artworkFile, "artwork");
      }

      // Get audio file info
      setUploadProgress(75);
      const audioElement = document.createElement("audio");
      audioElement.src = URL.createObjectURL(audioFile);
      
      const duration = await new Promise((resolve) => {
        audioElement.addEventListener("loadedmetadata", () => {
          resolve(Math.floor(audioElement.duration));
        });
      });

      // Save track to database
      setUploadProgress(90);
      const { data: track, error } = await supabase
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
          }
        })
        .select()
        .single();

      if (error) throw error;

      setUploadProgress(100);
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

      // Call success callback
      if (onSuccess) onSuccess();

    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Upload New Track</h2>
      
      <div className="bg-spindeck-dark rounded-lg p-6 border border-gray-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Audio File Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Audio File <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-spindeck-red transition-colors">
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => handleFileChange(e, "audio")}
                className="hidden"
                id="audio-upload"
              />
              <label htmlFor="audio-upload" className="cursor-pointer">
                <div className="text-4xl mb-2">🎵</div>
                {audioFile ? (
                  <div>
                    <p className="text-spindeck-red font-medium">{audioFile.name}</p>
                    <p className="text-sm text-spindeck-gray">
                      {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-white mb-1">Click to upload audio file</p>
                    <p className="text-sm text-spindeck-gray">MP3, WAV, FLAC supported</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Artwork Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Artwork (Optional)</label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-spindeck-red transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "artwork")}
                className="hidden"
                id="artwork-upload"
              />
              <label htmlFor="artwork-upload" className="cursor-pointer">
                <div className="text-4xl mb-2">🖼️</div>
                {artworkFile ? (
                  <div>
                    <p className="text-spindeck-red font-medium">{artworkFile.name}</p>
                    <p className="text-sm text-spindeck-gray">
                      {(artworkFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-white mb-1">Click to upload artwork</p>
                    <p className="text-sm text-spindeck-gray">JPG, PNG supported (recommended: 1000x1000px)</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Track Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Track Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-spindeck-red"
                placeholder="Enter track title"
                required
              />
            </div>

            {/* Artist Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Artist Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="artist_name"
                value={formData.artist_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-spindeck-red"
                placeholder="Enter artist name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Genre */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Genre <span className="text-red-500">*</span>
              </label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-spindeck-red"
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
              <label className="block text-sm font-medium mb-2">BPM</label>
              <input
                type="number"
                name="bpm"
                value={formData.bpm}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-spindeck-red"
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
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-spindeck-red"
              >
                <option value="">Select key</option>
                {keys.map(key => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Track Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Track Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-spindeck-red"
            >
              <option value="single">Single</option>
              <option value="mixtape">Mixtape</option>
              <option value="video">Video</option>
            </select>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-spindeck-red h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-3 bg-spindeck-red hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {uploading ? "Uploading..." : "Upload Track"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}