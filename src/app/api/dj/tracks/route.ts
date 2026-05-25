import { NextRequest, NextResponse } from 'next/server';
import { listRecords } from '@/lib/storeai';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const genre = searchParams.get('genre');
    const mood = searchParams.get('mood');
    const rating = searchParams.get('rating');
    const bpmRange = searchParams.get('bpm');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sort') || 'newest';

    const result = await listRecords({ limit: String(limit) });
    const allRecords: any[] = result.records || [];

    // Filter: only approved tracks
    let tracks = allRecords
      .filter((r: any) => {
        const d = r.data as Record<string, unknown>;
        if (!d?.trackName) return false;
        const status = d.status as string;
        return status === 'approved' || status === 'in_campaign';
      })
      .map((r: any) => ({
        id: r.id,
        key: r.key,
        data: r.data || {},
      }));

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      tracks = tracks.filter((t: any) => {
        const d = t.data as Record<string, unknown>;
        return (
          (d.trackName as string)?.toLowerCase().includes(q) ||
          (d.artistName as string)?.toLowerCase().includes(q) ||
          (d.genre as string)?.toLowerCase().includes(q)
        );
      });
    }

    // Genre filter
    if (genre && genre !== 'All') {
      const g = genre.toLowerCase();
      tracks = tracks.filter((t: any) => {
        const genreField = (t.data as Record<string, unknown>).genre as string;
        return genreField.toLowerCase().includes(g);
      });
    }

    // Mood filter
    if (mood && mood !== 'All') {
      tracks = tracks.filter((t: any) => {
        const trackMood = (t.data as Record<string, unknown>).mood as string;
        // If no mood stored, infer from BPM
        const bpm = (t.data as Record<string, unknown>).bpm as number;
        const inferredMood = bpm >= 128 ? 'Energetic' : bpm >= 120 ? 'Groovy' : bpm >= 100 ? 'Chill' : 'Relaxed';
        return trackMood?.toLowerCase() === mood.toLowerCase() || inferredMood === mood;
      });
    }

    // Rating filter
    if (rating && rating !== 'All') {
      tracks = tracks.filter((t: any) => {
        const d = t.data as Record<string, unknown>;
        const isClean = (d.isClean as boolean) ?? (d.rating as string) === 'clean';
        if (rating === 'Clean') return isClean;
        if (rating === 'Explicit') return !isClean;
        return true;
      });
    }

    // BPM filter
    if (bpmRange && bpmRange !== 'All') {
      tracks = tracks.filter((t: any) => {
        const bpm = (t.data as Record<string, unknown>).bpm as number;
        switch (bpmRange) {
          case '80-100': return bpm >= 80 && bpm <= 100;
          case '100-120': return bpm >= 100 && bpm <= 120;
          case '120+': return bpm >= 120;
          default: return true;
        }
      });
    }

    // Sort
    switch (sortBy) {
      case 'bpm-asc':
        tracks.sort((a: any, b: any) => (a.data.bpm || 0) - (b.data.bpm || 0));
        break;
      case 'bpm-desc':
        tracks.sort((a: any, b: any) => (b.data.bpm || 0) - (a.data.bpm || 0));
        break;
      case 'name':
        tracks.sort((a: any, b: any) =>
          (a.data.trackName as string)?.localeCompare(b.data.trackName as string) || 0
        );
        break;
      default:
        // newest
        tracks.sort((a: any, b: any) =>
          new Date(b.data.createdAt || 0).getTime() - new Date(a.data.createdAt || 0).getTime()
        );
    }

    return NextResponse.json({ tracks });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('DJ tracks API error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
