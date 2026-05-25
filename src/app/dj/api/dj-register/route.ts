import { NextRequest, NextResponse } from 'next/server';
import { createRecord, listRecords } from '@/lib/storeai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { djName, platform, bio, email, userId } = body;

    if (!djName || !email) {
      return NextResponse.json({ error: 'DJ name and email are required' }, { status: 400 });
    }

    // Check if DJ profile already exists
    const existing = await listRecords();
    const profiles: any[] = (existing.records || [])
      .filter((r: any) => (r.data as any)?.role === 'dj');

    const emailLower = email.toLowerCase().trim();
    const alreadyExists = profiles.some(
      (p: any) => String((p.data as Record<string, unknown>).email || "").toLowerCase() === emailLower
    );

    if (alreadyExists) {
      return NextResponse.json({ error: 'A DJ profile with this email already exists' }, { status: 409 });
    }

    // Create DJ profile record
    const djKey = `dj:${Date.now().toString(36)}:${emailLower}`;
    const djProfile = {
      djName,
      platform: platform || '',
      bio: bio || '',
      email: emailLower,
      userId: userId || '',
      role: 'dj',
      verified: false,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await createRecord(djKey, djProfile);

    return NextResponse.json({ success: true, message: 'DJ profile created successfully' });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('DJ registration error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await listRecords();
    const profiles = (result.records || [])
      .filter((r: any) => (r.data as any)?.role === 'dj')
      .map((r: any) => ({
        id: r.id,
        key: r.key,
        djName: (r.data as Record<string, unknown>).djName as string,
        email: (r.data as Record<string, unknown>).email as string,
        platform: (r.data as Record<string, unknown>).platform as string,
        verified: (r.data as Record<string, unknown>).verified as boolean,
        createdAt: (r.data as Record<string, unknown>).createdAt as string,
      }));

    return NextResponse.json({ djs: profiles });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
