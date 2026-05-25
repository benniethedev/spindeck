import { NextRequest, NextResponse } from 'next/server';
import { listRecords, getRecord, createRecord, updateRecord, deleteRecord } from '@/lib/storeai';

async function requireAdmin(req: NextRequest) {
  const session = req.cookies.get('admin_session');
  if (!session || !session.value || session.value.length < 2) {
    return { error: 'Unauthorized' as const };
  }
  return null;
}

export async function GET(req: NextRequest) {
  const err = await requireAdmin(req);
  if (err) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // 'artist' or 'dj'
    let query: Record<string, string> = { limit: '100' };

    if (type && type !== 'all') {
      query['data.type'] = type;
    }

    const result = await listRecords(query);
    const users = (result.records || []).map((r: any) => ({
      id: r.id,
      key: r.key,
      data: r.data || {},
    }));

    return NextResponse.json({ users });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const err = await requireAdmin(req);
  if (err) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { data } = body as { data: Record<string, unknown> };

    if (!data) {
      return NextResponse.json({ error: 'Data is required' }, { status: 400 });
    }

    const key = `user:${Date.now().toString(36)}`;
    const result = await createRecord(key, data);
    return NextResponse.json({ success: true, user: result });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const err = await requireAdmin(req);
  if (err) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { id, data } = body as { id: string; data: Record<string, unknown> };

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const result = await updateRecord(id, data);
    return NextResponse.json({ success: true, user: result });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const err = await requireAdmin(req);
  if (err) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await deleteRecord(id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
