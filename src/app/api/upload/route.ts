/**
 * POST /api/upload
 * Handles file uploads for submissions.
 * Accepts multipart/form-data with audio and artwork files.
 */
import { NextRequest, NextResponse } from 'next/server';
import { uploadAudioFile, uploadArtwork } from '@/lib/file-upload';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File | null;
    const artworkFile = formData.get('artwork') as File | null;
    const type = formData.get('type') as string | null;

    let result;

    if (type === 'audio' || audioFile) {
      const file = audioFile || formData.get('file') as File;
      if (!file) {
        return NextResponse.json(
          { error: 'No audio file provided' },
          { status: 400 }
        );
      }
      result = await uploadAudioFile(file);
    } else if (artworkFile || type === 'artwork') {
      const file = artworkFile || formData.get('file') as File;
      if (!file) {
        return NextResponse.json(
          { error: 'No artwork file provided' },
          { status: 400 }
        );
      }
      result = await uploadArtwork(file);
    } else {
      // Try to determine from filename
      const file = formData.get('file') as File;
      if (!file) {
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 }
        );
      }
      
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const isAudio = ['wav', 'mp3', 'ogg', 'flac', 'm4a'].includes(ext);
      
      result = isAudio
        ? await uploadAudioFile(file)
        : await uploadArtwork(file);
    }

    return NextResponse.json({
      success: true,
      fileId: result.fileId,
      filename: result.filename,
      url: result.url,
      size: result.size,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    console.error('Upload error:', err);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
