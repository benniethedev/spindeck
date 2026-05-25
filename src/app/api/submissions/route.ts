/**
 * GET /api/submissions
 * Returns all submissions for the current artist.
 * 
 * POST /api/submissions
 * Creates a new submission.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createRecord, listRecords, updateRecord } from '@/lib/storeai';
import { SubmissionStatus, SubmissionGenre, ContentRating } from '@/types';

async function getSession(req: NextRequest) {
  // Read session from cookie or header
  const token = req.cookies.get('spin_session')?.value;
  const authHeader = req.headers.get('authorization');
  const headerToken = authHeader?.replace('Bearer ', '');
  const tokenValue = token || headerToken;
  
  if (!tokenValue) return null;
  
  // Validate token and return user
  return {
    id: `art_${Date.now()}`, // In production, decode JWT
    email: 'demo@spinrec.com',
    name: 'Demo Artist',
  };
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { records } = await listRecords({ key_prefix: `submission:${session.id}:` });

    if (!records || records.length === 0) {
      return NextResponse.json({ submissions: [] });
    }

    const submissions = records.map((r: { id: string; key: string; data: unknown }) => {
      const data = r.data as Record<string, unknown>;
      return {
        id: (data.id as string) || r.id,
        key: (data.key as string) || r.key,
        artistId: (data.artistId as string) || session.id,
        artistName: (data.artistName as string) || session.name,
        trackName: (data.trackName as string) || '',
        genre: (data.genre as SubmissionGenre) || 'other',
        bpm: (data.bpm as number) || 0,
        rating: (data.rating as ContentRating) || 'clean',
        isClean: data.rating !== 'explicit',
        status: (data.status as SubmissionStatus) || 'pending',
        audioFileUrl: (data.audioFileUrl as string) || undefined,
        artworkUrl: (data.artworkUrl as string) || undefined,
        links: (data.links as any[]) || [],
        notes: (data.notes as string) || '',
        createdAt: (data.createdAt as string) || new Date().toISOString(),
        updatedAt: (data.updatedAt as string) || new Date().toISOString(),
      };
    });

    // Sort by newest first
    submissions.sort((a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ submissions });
  } catch (err) {
    console.error('List submissions error:', err);
    return NextResponse.json(
      { error: 'Failed to list submissions' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      trackName,
      genre,
      bpm,
      key,
      rating,
      isClean,
      links,
      notes,
      audioFileId,
      artworkFileId,
      audioFileUrl,
      artworkUrl,
    } = body as {
      trackName: string;
      genre: SubmissionGenre;
      bpm: number;
      key: string;
      rating: ContentRating;
      isClean: boolean;
      links: Array<{ label: string; url: string }>;
      notes: string;
      audioFileId?: string;
      artworkFileId?: string;
      audioFileUrl?: string;
      artworkUrl?: string;
    };

    if (!trackName || !genre || !bpm || !rating) {
      return NextResponse.json(
        { error: 'Track name, genre, BPM, and rating are required' },
        { status: 400 }
      );
    }

    const subId = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const subKey = `submission:${session.id}:${subId}`;

    const record = await createRecord(subKey, {
      id: subId,
      recordKey: subKey,
      artistId: session.id,
      artistName: session.name,
      trackName,
      genre,
      bpm,
      key,
      rating,
      isClean: isClean ?? rating === 'clean',
      status: 'pending' as SubmissionStatus,
      audioFileId,
      artworkFileId,
      audioFileUrl: audioFileUrl || (audioFileId ? `/files/${audioFileId}` : undefined),
      artworkUrl: artworkUrl || (artworkFileId ? `/files/${artworkFileId}` : undefined),
      links: links || [],
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      submission: {
        id: record.id,
        key: record.key,
        artistId: session.id,
        artistName: session.name,
        trackName,
        genre,
        bpm,
        musicalKey: key,
        rating,
        isClean: isClean ?? rating === 'clean',
        status: 'pending' as SubmissionStatus,
        audioFileUrl: audioFileUrl || (audioFileId ? `/files/${audioFileId}` : undefined),
        artworkUrl: artworkUrl || (artworkFileId ? `/files/${artworkFileId}` : undefined),
        links: links || [],
        notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('Create submission error:', err);
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    );
  }
}
