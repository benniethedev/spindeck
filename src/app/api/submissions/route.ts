/**
 * Submissions API - CRUD for artist submissions
 * POST /api/submissions - List submissions for a user
 * POST /api/submissions/create - Create a new submission
 * POST /api/submissions/update - Update submission status
 */
import { NextRequest, NextResponse } from 'next/server';
import { listRecords, getRecord, getRecordById, createRecord, updateRecord, deleteRecord } from '@/lib/storeai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, artistId, submissionId } = body as { action?: string; artistId?: string; submissionId?: string };

    switch (action) {
      case 'list': {
        if (!artistId) {
          return NextResponse.json({ error: 'Missing artistId' }, { status: 400 });
        }
        const result = await listRecords({ prefix: `submission:${artistId}:` });
        return NextResponse.json({ submissions: result.records });
      }

      case 'create': {
        const {
          artistId: aid,
          trackName,
          genre,
          bpm,
          isClean,
          links,
          notes,
          audioFileKey,
          artworkFileKey,
        } = body as {
          artistId: string;
          trackName: string;
          genre: string;
          bpm: number;
          isClean: boolean;
          links: Record<string, string>;
          notes: string;
          audioFileKey?: string | null;
          artworkFileKey?: string | null;
        };

        if (!aid || !trackName || !genre || !bpm) {
          return NextResponse.json(
            { error: 'Missing required fields: artistId, trackName, genre, bpm' },
            { status: 400 }
          );
        }

        const now = new Date().toISOString();
        const id = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const key = `submission:${aid}:${id}`;

        const submission = {
          id,
          key,
          artistId: aid,
          trackName,
          genre,
          bpm,
          isClean,
          links: links || {},
          notes: notes || '',
          audioFileKey: audioFileKey || null,
          audioFileName: audioFileKey ? (links?.audio_file_name || null) : null,
          artworkFileKey: artworkFileKey || null,
          artworkFileName: artworkFileKey ? (links?.artwork_file_name || null) : null,
          status: 'pending' as const,
          statusHistory: [
            { status: 'pending', timestamp: now, note: 'Submission created' },
          ],
          campaignIds: [],
          createdAt: now,
          updatedAt: now,
        };

        const created = await createRecord(key, submission);
        return NextResponse.json({ success: true, submission: created.data });
      }

      case 'update': {
        const { status, note } = body as { status?: string; note?: string };
        if (!submissionId) {
          return NextResponse.json({ error: 'Missing submissionId' }, { status: 400 });
        }

        const existing = await getRecordById(submissionId);
        if (!existing) {
          return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
        }

        const statusMap: Record<string, 'pending' | 'approved' | 'rejected' | 'in_campaign'> = {
          pending: 'pending',
          approved: 'approved',
          rejected: 'rejected',
          in_campaign: 'in_campaign',
        };

        const newStatus = statusMap[status as string];
        if (!newStatus) {
          return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const updatedData = {
          ...(existing.data as Record<string, unknown>),
          status: newStatus,
          statusHistory: [
            ...((existing.data as Record<string, unknown>).statusHistory as Array<{ status: string; timestamp: string; note?: string }> || []),
            { status: newStatus, timestamp: new Date().toISOString(), note: note || `Status changed to ${newStatus}` },
          ],
          updatedAt: new Date().toISOString(),
        };

        const updated = await updateRecord(existing.id, updatedData);
        return NextResponse.json({ success: true, submission: updated.data });
      }

      default:
        // Default: list all submissions
        const result = await listRecords({ prefix: 'submission:' });
        return NextResponse.json({ submissions: result.records });
    }
  } catch (err) {
    console.error('Submissions API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const artistId = url.searchParams.get('artistId');

    if (!artistId) {
      return NextResponse.json({ submissions: [] });
    }

    const result = await listRecords({ prefix: `submission:${artistId}:` });
    return NextResponse.json({ submissions: result.records });
  } catch (err) {
    console.error('Submissions GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
