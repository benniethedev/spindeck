/**
 * PATCH /api/submissions/[id] - Update a submission
 * DELETE /api/submissions/[id] - Delete a submission
 */
import { NextRequest, NextResponse } from 'next/server';
import { getRecordById, updateRecord, deleteRecord } from '@/lib/storeai';
import { SubmissionStatus } from '@/types';

async function getSession(req: NextRequest) {
  const token = req.cookies.get('spin_session')?.value;
  const authHeader = req.headers.get('authorization');
  const headerToken = authHeader?.replace('Bearer ', '');
  return token || headerToken || null;
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const params = await ctx.params;
    const session = await getSession(req);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { status, notes } = body as { status?: SubmissionStatus; notes?: string };

    if (!status && !notes) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const existing = await getRecordById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {
      ...(status ? { status } : {}),
      ...(notes ? { notes } : {}),
      updatedAt: new Date().toISOString(),
    };

    const updated = await updateRecord(id, updateData);

    const data = updated.data as Record<string, unknown>;
    return NextResponse.json({
      success: true,
      submission: {
        id: updated.id,
        key: updated.key,
        ...data,
      },
    });
  } catch (err) {
    console.error('Update submission error:', err);
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const params = await ctx.params;
    const { id } = params;

    // Verify admin authentication
    const token = req.cookies.get('admin_session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await getRecordById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    await deleteRecord(id);

    return NextResponse.json({ success: true, message: 'Submission deleted' });
  } catch (err) {
    console.error('Delete submission error:', err);
    return NextResponse.json(
      { error: 'Failed to delete submission' },
      { status: 500 }
    );
  }
}
