import re

path = '/home/benbond/Documents/spinrec/src/app/artist/submit/page.tsx'
with open(path, 'r') as f:
    content = f.read()

# Fix 1: Add file upload imports
old_imp = 'import { useRouter } from "next/navigation";'
new_imp = '''import { useRouter } from "next/navigation";
import { uploadAudioFile, uploadArtwork } from "@/lib/file-upload";'''
content = content.replace(old_imp, new_imp, 1)

# Fix 2: Add uploadProgress state
old_state = 'const [error, setError] = useState("");'
new_state = '''const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState("");'''
content = content.replace(old_state, new_state, 1)

# Fix 3: Replace handleSubmit implementation
old_handler = '''    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("trackName", trackName); fd.append("genre", genre); fd.append("bpm", bpm);
      if (key) fd.append("key", key);
      fd.append("rating", rating); fd.append("notes", notes);
      fd.append("links", JSON.stringify(links.filter(l => l.label && l.url)));
      fd.append("audioFile", audioFile);
      if (artworkFile) fd.append("artworkFile", artworkFile);
      const res = await fetch("/api/submissions", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed"); return; }
      setSuccess(true);
      setTimeout(() => router.push("/artist/dashboard"), 2000);
    } catch { setError("Network error"); }
    finally { setLoading(false); }'''

new_handler = '''    setLoading(true);
    setUploadProgress('Preparing upload...');
    try {
      setUploadProgress('Uploading audio (' + (audioFile!.size / 1024 / 1024).toFixed(1) + ' MB)...');
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
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
        body: JSON.stringify({
          trackName, genre, bpm: Number(bpm), key: key || undefined, rating, isClean: rating === 'clean',
          links: links.filter((l: any) => l.label && l.url), notes,
          audioFileId: audioResult.fileId, audioFileUrl: audioResult.url,
          artworkFileId: artworkResult?.fileId, artworkUrl: artworkResult?.url,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed'); return; }
      setSuccess(true);
      setTimeout(() => router.push('/artist/dashboard'), 2000);
    } catch (err) { setError((err as Error).message || 'Network error'); }
    finally { setLoading(false); }'''

content = content.replace(old_handler, new_handler)

# Fix 4: Add upload progress display in the JSX
old_jsx = '''            {error && (
              <div className="flex items-center gap-3 px-5 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-fade-in">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="text-sm text-red-400 font-medium">{error}</span>
              </div>
            )}'''

new_jsx = '''            {error && (
              <div className="flex items-center gap-3 px-5 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-fade-in">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="text-sm text-red-400 font-medium">{error}</span>
              </div>
            )}
            {uploadProgress && (
              <div className="flex items-center gap-3 px-5 py-4 bg-violet-500/10 border border-violet-500/20 rounded-2xl">
                <svg className="animate-spin w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                <span className="text-sm text-violet-300 font-medium">{uploadProgress}</span>
              </div>
            )}'''

content = content.replace(old_jsx, new_jsx)

with open(path, 'w') as f:
    f.write(content)
print('Updated submit/page.tsx successfully')
