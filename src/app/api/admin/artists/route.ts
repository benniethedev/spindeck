/**
 * GET /api/admin/artists - List all artists (admin)
 * POST /api/admin/artists - Create new artist (admin)
 */
import { NextRequest, NextResponse } from 'next/server';
import { listRecords, createRecord } from '@/lib/storeai';

async function verifyAdmin(req: NextRequest): Promise<{ token: string } | null> {
  const token = req.cookies.get('admin_session')?.value;
  if (!token) return null;
  return { token };
}

export async function GET(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
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

    return NextResponse.json({ artists });
  } catch (err) {
    console.error('List admin artists error:', err);
    return NextResponse.json({ error: 'Failed to list artists' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, email, plan } = body as {
      name?: string;
      email?: string;
      plan?: string;
    };

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const artistId = `art_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const artistKey = `artist:${artistId}`;

    const record = await createRecord(artistKey, {
      id: artistId,
      name: name || 'Unknown',
      email,
      plan: plan || 'free',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      artist: {
        id: record.id,
        key: record.key,
        name: name || 'Unknown',
        email,
        plan: plan || 'free',
      },
    });
  } catch (err) {
    console.error('Create artist error:', err);
    return NextResponse.json({ error: 'Failed to create artist' }, { status: 500 });
  }
}
