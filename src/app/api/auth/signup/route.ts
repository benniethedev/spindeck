/**
 * POST /api/auth/signup
 * Creates a new artist account.
 * If email exists in Stripe, syncs customer data.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createRecord } from '@/lib/storeai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, password } = body as { email: string; name: string; password: string };

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if artist already exists
    const { listRecords } = await import('@/lib/storeai');
    const { records } = await listRecords({ key_prefix: 'artist:' });
    
    if (records?.some((r: { key: string; data: unknown }) => {
      const data = r.data as Record<string, unknown>;
      return data.email === email;
    })) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const newId = `art_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const displayName = name || email.split('@')[0];

    const result = await createRecord(`artist:${email}`, {
      id: newId,
      email,
      name: displayName,
      plan: 'free' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      user: {
        id: result.id,
        email,
        name: displayName,
        plan: 'free' as const,
      },
      message: 'Account created successfully',
    });
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json(
      { error: 'Signup failed. Please try again.' },
      { status: 500 }
    );
  }
}
