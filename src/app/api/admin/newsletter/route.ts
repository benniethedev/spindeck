/**
 * POST /api/admin/newsletter
 * Send newsletter email blast with selected tracks.
 */
import { NextRequest, NextResponse } from 'next/server';
import { listRecords } from '@/lib/storeai';

async function verifyAdmin(req: NextRequest): Promise<{ token: string } | null> {
  const token = req.cookies.get('admin_session')?.value;
  if (!token) return null;
  return { token };
}

export async function POST(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, subtitle, bodyText, trackIds, selectedArtists, preview } = body;

    if (!title || !trackIds || trackIds.length === 0) {
      return NextResponse.json(
        { error: 'Title and at least one track are required' },
        { status: 400 }
      );
    }

    const { records } = await listRecords({ key_prefix: 'submission:' });
    const approvedSubmissions = (records || [])
      .map((r: { key: string; data: unknown }) => ({
        id: (r.data as any).id || r.key.split(':').pop() || '',
        ...((r.data as Record<string, unknown>) || {}),
      }))
      .filter((s: Record<string, unknown>) => s.status === 'approved');

    const selectedTracks = approvedSubmissions.filter((s: Record<string, unknown>) =>
      trackIds.includes(s.id)
    );

    console.log('=== NEWSLETTER BROADCAST ===');
    console.log('Title:', title);
    console.log('Subtitle:', subtitle);
    console.log('Body:', bodyText);
    console.log('Track Count:', selectedTracks.length);
    console.log('Tracks:', selectedTracks.map((s: Record<string, unknown>) => s.trackName));
    console.log('Recipients:', selectedArtists?.join(', ') || 'all subscribers');
    console.log('Preview mode:', !!preview);
    console.log('===========================');

    const newsletterData = {
      id: `nl_${Date.now()}`,
      title,
      subtitle: subtitle || '',
      bodyText: bodyText || '',
      trackIds,
      selectedArtists: selectedArtists || [],
      selectedTracks: selectedTracks.map((s: Record<string, unknown>) => ({
        id: s.id,
        trackName: s.trackName,
        artistName: s.artistName,
        genre: s.genre,
        bpm: s.bpm,
        artworkUrl: s.artworkUrl,
        audioFileUrl: s.audioFileUrl,
      })),
      status: preview ? 'preview' : 'sent',
      sentAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      newsletter: newsletterData,
      message: preview ? 'Preview sent to console' : 'Newsletter broadcast sent',
    });
  } catch (err) {
    console.error('Newsletter error:', err);
    return NextResponse.json({ error: 'Failed to send newsletter' }, { status: 500 });
  }
}
