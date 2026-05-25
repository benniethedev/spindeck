/**
 * GET /api/artists
 * Returns all artists (admin only).
 */
import { NextRequest, NextResponse } from 'next/server';
import { listRecords } from '@/lib/storeai';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { records } = await listRecords({ key_prefix: 'artist:' });

    if (!records || records.length === 0) {
      return NextResponse.json({ artists: [] });
    }

    const artists = records.map((r: { id: string; key: string; data: unknown }) => {
      const data = r.data as Record<string, unknown>;
      return {
        id: (data.id as string) || r.id,
        key: (data.key as string) || r.key,
        email: (data.email as string) || '',
        name: (data.name as string) || '',
        plan: (data.plan as string) || 'free',
        createdAt: (data.createdAt as string) || new Date().toISOString(),
        updatedAt: (data.updatedAt as string) || new Date().toISOString(),
      };
    });

    artists.sort((a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ artists });
  } catch (err) {
    console.error('List artists error:', err);
    return NextResponse.json(
      { error: 'Failed to list artists' },
      { status: 500 }
    );
  }
}
