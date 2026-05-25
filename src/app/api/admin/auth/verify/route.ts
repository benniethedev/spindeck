/**
 * GET /api/admin/auth/verify
 * Verify current admin session.
 */
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  // In production, validate token against session store
  return NextResponse.json({ authenticated: true, user: { role: 'admin' } });
}
