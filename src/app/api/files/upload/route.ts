/**
 * File Upload API - Handles audio and artwork file uploads via StoreAI
 * Accepts multipart form data with files
 * Returns file keys/URLs for storing in submission records
 */
import { NextRequest, NextResponse } from 'next/server';

const STOREAI_BASE_URL = process.env.STOREAI_BASE_URL || 'https://db.netswagger.com';
const STOREAI_API_KEY = process.env.STOREAI_API_KEY || '';
const STOREAI_PROJECT_ID = process.env.STOREAI_PROJECT_ID || '';

function getHeaders(): Record<string, string> {
  return {
    'Authorization': `Bearer ${STOREAI_API_KEY}`,
    'X-Project-ID': STOREAI_PROJECT_ID,
  };
}

async function uploadFile(file: File, filename: string): Promise<{ url: string; fileId: string }> {
  // Step 1: Get pre-signed upload URL from StoreAI
  const initRes = await fetch(
    `${STOREAI_BASE_URL}/api/files/init?filename=${encodeURIComponent(filename)}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STOREAI_API_KEY}`,
        'X-Project-ID': STOREAI_PROJECT_ID,
      },
    }
  );

  if (!initRes.ok) {
    throw new Error(`Failed to init upload: ${initRes.status}`);
  }

  const initData = await initRes.json();
  const { uploadUrl, fileId } = initData as { uploadUrl: string; fileId: string };

  // Step 2: Upload file via multipart (StoreAI multipart upload)
  const formData = new FormData();
  formData.append('file', file, file.name);

  const uploadRes = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STOREAI_API_KEY}`,
      'X-Project-ID': STOREAI_PROJECT_ID,
    },
    body: formData,
  });

  if (!uploadRes.ok) {
    throw new Error(`Upload failed: ${uploadRes.status}`);
  }

  const uploadData = await uploadRes.json();
  return { url: uploadData.url || uploadUrl, fileId };
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audioFile') as File;
    const artworkFile = formData.get('artworkFile') as File;
    const artistId = formData.get('artistId') as string;
    const trackName = formData.get('trackName') as string;

    if (!artistId || !trackName) {
      return NextResponse.json(
        { error: 'Missing artistId or trackName' },
        { status: 400 }
      );
    }

    // Validate files
    const allowedAudio = ['audio/wav', 'audio/mpeg', 'audio/x-wav', 'audio/mp3'];
    const allowedArtwork = ['image/jpeg', 'image/png', 'image/webp'];

    const sanitizedTrackName = trackName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50) || 'track';

    const audioResult = audioFile ? await uploadFile(audioFile, `${artistId}/${sanitizedTrackName}-${Date.now()}.${audioFile.name.split('.').pop()}`) : null;
    const artworkResult = artworkFile ? await uploadFile(artworkFile, `${artistId}/${sanitizedTrackName}-artwork-${Date.now()}.${artworkFile.name.split('.').pop()}`) : null;

    return NextResponse.json({
      success: true,
      audioFileKey: audioResult?.fileId || null,
      audioUrl: audioResult?.url || null,
      artworkFileKey: artworkResult?.fileId || null,
      artworkUrl: artworkResult?.url || null,
    });
  } catch (err) {
    console.error('File upload error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
