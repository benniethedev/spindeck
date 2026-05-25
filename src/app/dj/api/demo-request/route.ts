import { NextRequest, NextResponse } from 'next/server';
import { createRecord, getRecord } from '@/lib/storeai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { trackId, djEmail, djName } = body;

    if (!trackId || !djEmail) {
      return NextResponse.json({ error: 'Track ID and DJ email are required' }, { status: 400 });
    }

    // Check if DJ has already requested this track
    const downloadKey = `demo:${djEmail.toLowerCase().trim()}:${trackId}`;
    try {
      const existingDownloads = await getRecord(downloadKey);
      if (existingDownloads) {
        return NextResponse.json({ error: 'You have already requested a download of this track', exists: true }, { status: 409 });
      }
    } catch {
      // No existing request - that is fine
    }

    // Create demo request record
    const demoRequest = {
      trackId,
      trackName: 'Unknown Track',
      artistName: 'Unknown Artist',
      djEmail: djEmail.toLowerCase().trim(),
      djName: djName || '',
      status: 'pending',
      downloadLink: '',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const requestKey = `demo:${djEmail.toLowerCase().trim()}:${trackId}:${Date.now().toString(36)}`;
    await createRecord(requestKey, demoRequest);

    return NextResponse.json({
      success: true,
      message: 'Demo request submitted. Check your email for the download link.',
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Demo request error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
