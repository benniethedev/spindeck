import { NextRequest, NextResponse } from 'next/server';

async function requireAdmin(req: NextRequest) {
  const session = req.cookies.get('admin_session');
  if (!session || !session.value || session.value.length < 2) {
    return { error: 'Unauthorized' as const };
  }
  return null;
}

export async function POST(req: NextRequest) {
  const err = await requireAdmin(req);
  if (err) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { subject, body: emailBody, trackIds, recipientType } = body as {
      subject: string;
      body: string;
      trackIds: string[];
      recipientType: 'all' | 'approved' | 'selected';
    };

    if (!subject || !emailBody) {
      return NextResponse.json(
        { error: 'Subject and body are required' },
        { status: 400 }
      );
    }

    // In production, integrate with email service (SendGrid, Resend, etc.)
    // For now, return success with the data
    const emailBlast = {
      id: `blast_${Date.now().toString(36)}`,
      subject,
      body: emailBody,
      trackIds,
      recipientType,
      sentAt: new Date().toISOString(),
      status: 'sent',
    };

    return NextResponse.json({
      success: true,
      emailBlast,
      message: 'Email blast sent successfully',
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const err = await requireAdmin(req);
  if (err) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // In production, fetch from database
  return NextResponse.json({ blasts: [] });
}
