/**
 * POST /api/auth/login
 * Authenticates an artist and returns a session token.
 * In production, this would verify against Stripe customer data or a user DB.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createRecord, listRecords, getRecord } from '@/lib/storeai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Search for existing artist in StoreAI
    const { records } = await listRecords({ key_prefix: 'artist:' });
    
    let artist = records?.find((r: { key: string; data: unknown }) => {
      const data = r.data as Record<string, unknown>;
      return data.email === email;
    }) as { id: string; key: string; data: Record<string, unknown> } | undefined;

    if (!artist) {
      // Auto-signup: create artist if not found (SSO-like behavior)
      const newId = `art_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const name = email.split('@')[0];
      const displayName = name.charAt(0).toUpperCase() + name.slice(1);
      
      const result = await createRecord(`artist:${email}`, {
        id: newId,
        email,
        name: displayName,
        plan: 'free' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      artist = {
        id: result.id,
        key: result.key,
        data: result.data as Record<string, unknown>,
      };
    }

    const data = artist.data as Record<string, unknown>;

    // Return session (in production, set httpOnly cookie)
    return NextResponse.json({
      success: true,
      user: {
        id: (data.id as string) || artist.id,
        email: data.email as string,
        name: (data.name as string) || email.split('@')[0],
        plan: (data.plan as string) || 'free',
      },
      token: `spin_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`,
    });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
