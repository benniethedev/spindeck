/**
 * PATCH /api/admin/artists/[id] - Update artist
 * DELETE /api/admin/artists/[id] - Delete artist
 */
import { NextRequest, NextResponse } from 'next/server';
import { getRecordById, updateRecord, deleteRecord } from '@/lib/storeai';

async function verifyAdmin(req: NextRequest): Promise<{ token: string } | null> {
  const token = req.cookies.get('admin_session')?.value;
  if (!token) return null;
  return { token };
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await verifyAdmin(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = await ctx.params;
    const { id } = params;
    const body = await req.json();

    const existing = await getRecordById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {
      ...(body.name ? { name: body.name } : {}),
      ...(body.email ? { email: body.email } : {}),
      ...(body.plan ? { plan: body.plan } : {}),
      updatedAt: new Date().toISOString(),
    };

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const updated = await updateRecord(id, updateData);
    const data = updated.data as Record<string, unknown>;

    return NextResponse.json({
      success: true,
      artist: {
        id: updated.id,
        key: updated.key,
        ...data,
      },
    });
  } catch (err) {
    console.error('Update artist error:', err);
    return NextResponse.json({ error: 'Failed to update artist' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await verifyAdmin(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = await ctx.params;
    const { id } = params;

    const existing = await getRecordById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    await deleteRecord(id);

    return NextResponse.json({ success: true, message: 'Artist deleted' });
  } catch (err) {
    console.error('Delete artist error:', err);
    return NextResponse.json({ error: 'Failed to delete artist' }, { status: 500 });
  }
}
