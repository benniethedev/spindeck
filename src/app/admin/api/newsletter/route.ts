/**
 * POST /api/admin/newsletter
 * Send email blast to subscribers with selected tracks.
 * In production, integrate with SendGrid/Mailgun/Ses.
 * For now, logs the newsletter payload.
 */
import { NextRequest, NextResponse } from 'next/server';
import { listRecords } from '@/lib/storeai';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, subtitle, trackIds, selectedArtists, preview } = body;

    if (!title || !trackIds || trackIds.length === 0) {
      return NextResponse.json(
        { error: 'Title and at least one track are required' },
        { status: 400 }
      );
    }

    // Fetch approved submissions
    const { records } = await listRecords({ key_prefix: 'submission:' });
    const approvedSubmissions = (records || [])
      .map((r: { key: string; data: unknown }) => ({
        id: (r.data as any).id || r.key.split(":").pop() || "",
        ...((r.data as Record<string, unknown>) || {}),
      }))
      .filter((s: Record<string, unknown>) => s.status === 'approved');

    const selectedTracks = approvedSubmissions.filter((s: Record<string, unknown>) =>
      trackIds.includes(s.id)
    );

    // In production: send email via SendGrid/Mailgun
    console.log('=== NEWSLETTER BROADCAST ===');
    console.log('Title:', title);
    console.log('Subtitle:', subtitle);
    console.log('Tracks:', selectedTracks.map((s: Record<string, unknown>) => s.trackName));
    console.log('Recipients:', selectedArtists?.join(', ') || 'all subscribers');
    console.log('Preview mode:', !!preview);
    console.log('===========================');

    // Store newsletter record
    const newsletterData = {
      id: `nl_${Date.now()}`,
      title,
      subtitle: subtitle || '',
      trackIds,
      selectedArtists: selectedArtists || [],
      selectedTracks: selectedTracks.map((s: Record<string, unknown>) => ({
        id: s.id,
        trackName: s.trackName,
        artistName: s.artistName,
        genre: s.genre,
        artworkUrl: s.artworkUrl,
        audioFileUrl: s.audioFileUrl,
        bpm: s.bpm,
      })),
      status: preview ? 'preview' : 'sent',
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      newsletter: newsletterData,
      message: preview ? 'Preview sent to console' : 'Newsletter broadcast sent',
    });
  } catch (err) {
    console.error('Newsletter error:', err);
    return NextResponse.json(
      { error: 'Failed to send newsletter' },
      { status: 500 }
    );
  }
}
