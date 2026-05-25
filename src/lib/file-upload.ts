/**
 * StoreAI multipart file upload client
 * Handles audio tracks and artwork uploads
 */

const BASE_URL = process.env.STOREAI_BASE_URL || 'https://db.netswagger.com';
const API_KEY = process.env.STOREAI_API_KEY || '';
const PROJECT_ID = process.env.STOREAI_PROJECT_ID || '';

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${API_KEY}`,
    'X-Project-ID': PROJECT_ID,
  };
  return headers;
}

interface UploadResult {
  fileId: string;
  filename: string;
  url: string;
  size: number;
}

/**
 * Upload a file via StoreAI multipart API
 * @param file - The file to upload (File or Buffer)
 * @param filename - Desired filename
 * @param contentType - MIME type of the file
 * @returns Upload result with fileId and URL
 */
export async function uploadFile(
  file: File | Blob,
  filename: string,
  contentType: string
): Promise<UploadResult> {
  const boundary = `SpinRecBoundary_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const headers = {
    ...getHeaders(),
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
  };

  // Build multipart body
  const parts: Buffer[] = [];

  // Metadata part
  const metadataStr = JSON.stringify({ filename, contentType, size: file.size });
  parts.push(Buffer.from(`\r\n--${boundary}\r\nContent-Disposition: form-data; name="metadata"\r\n\r\n${metadataStr}\r\n`));

  // File part
  let fileData: Buffer;
  if (file instanceof File) {
    fileData = Buffer.from(await file.arrayBuffer());
  } else {
    fileData = Buffer.from(await file.arrayBuffer());
  }
  parts.push(
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: ${contentType}\r\n\r\n`),
    fileData,
    Buffer.from(`\r\n--${boundary}--\r\n`)
  );

  const body = Buffer.concat(parts);

  const res = await fetch(`${BASE_URL}/api/files/upload`, {
    method: 'POST',
    headers: { ...headers, 'Content-Length': String(body.length) },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`File upload failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<UploadResult>;
}

/**
 * Upload an audio file for a submission
 */
export async function uploadAudioFile(file: File): Promise<UploadResult> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'mp3';
  const contentType = file.type || 'audio/mpeg';
  const validTypes = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp3', 'audio/ogg', 'audio/flac'];
  if (!validTypes.includes(contentType) && !['wav', 'mp3', 'ogg', 'flac'].includes(ext)) {
    throw new Error(`Audio file must be wav or mp3 (got ${file.type || ext})`);
  }
  return uploadFile(file, `audio_${Date.now()}.${ext}`, contentType);
}

/**
 * Upload artwork for a submission
 */
export async function uploadArtwork(file: File): Promise<UploadResult> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
  const contentType = file.type || 'image/png';
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(contentType) && !['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
    throw new Error(`Artwork must be jpg or png (got ${file.type || ext})`);
  }
  return uploadFile(file, `artwork_${Date.now()}.${ext}`, contentType);
}

/**
 * Get a public URL for a stored file
 */
export async function getFileUrl(fileId: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/files/${fileId}`, {
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to get file URL: ${res.status}`);
  }
  const data = await res.json();
  return data.url || data.fileUrl || `/files/${fileId}`;
}
