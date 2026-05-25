/**
 * POST /api/admin/auth - Admin login
 * DELETE /api/admin/auth - Admin logout
 * GET /api/admin/auth - Verify session
 */
import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'spinrec_admin_2025';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body as { password: string };

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid admin password' }, { status: 401 });
    }

    const token = `admin_${Date.now()}_${Math.random().toString(36).slice(2, 16)}`;

    const response = NextResponse.json({
      success: true,
      token,
      user: { role: 'admin' },
    });

    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400,
      path: '/admin',
    });

    return response;
  } catch (err) {
    console.error('Admin auth error:', err);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_session');
  return response;
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user: { role: 'admin' } });
}
