/**
 * GET /api/admin/submissions
 * Returns ALL submissions (admin only).
 * Also supports PATCH for bulk status updates.
 */
import { NextRequest, NextResponse } from 'next/server';
import { listRecords, updateRecord } from '@/lib/storeai';
import { SubmissionStatus, SubmissionGenre, ContentRating } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { records } = await listRecords({ key_prefix: 'submission:' });

    if (!records || records.length === 0) {
      return NextResponse.json({ submissions: [] });
    }

    const submissions = records
      .map((r: { id: string; key: string; data: unknown }) => {
        const data = r.data as Record<string, unknown>;
        return {
          id: (data.id as string) || r.id,
          key: (data.key as string) || r.key,
          artistId: (data.artistId as string) || '',
          artistName: (data.artistName as string) || 'Unknown',
          trackName: (data.trackName as string) || '',
          genre: (data.genre as SubmissionGenre) || 'other',
          bpm: (data.bpm as number) || 0,
          rating: (data.rating as ContentRating) || 'clean',
          isClean: (data.rating as string) !== 'explicit',
          status: (data.status as SubmissionStatus) || 'pending',
          audioFileUrl: (data.audioFileUrl as string) || undefined,
          artworkUrl: (data.artworkUrl as string) || undefined,
          links: (data.links as Array<{ label: string; url: string }>) || [],
          notes: (data.notes as string) || '',
          createdAt: (data.createdAt as string) || new Date().toISOString(),
          updatedAt: (data.updatedAt as string) || new Date().toISOString(),
        };
      })
      .sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    return NextResponse.json({ submissions });
  } catch (err) {
    console.error('List admin submissions error:', err);
    return NextResponse.json(
      { error: 'Failed to list submissions' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { ids, status, notes } = body as {
      ids?: string[];
      status?: SubmissionStatus;
      notes?: string;
    };

    if (!ids || ids.length === 0 || !status) {
      return NextResponse.json(
        { error: 'IDs and status are required' },
        { status: 400 }
      );
    }

    const results: Array<{ id: string; success: boolean; error?: string }> = [];

    for (const id of ids) {
      try {
        const updateData: Record<string, unknown> = {
          status,
          ...(notes ? { notes } : {}),
          updatedAt: new Date().toISOString(),
        };
        await updateRecord(id, updateData);
        results.push({ id, success: true });
      } catch (err) {
        results.push({ id, success: false, error: String(err) });
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (err) {
    console.error('Bulk update submissions error:', err);
    return NextResponse.json(
      { error: 'Failed to update submissions' },
      { status: 500 }
    );
  }
}
