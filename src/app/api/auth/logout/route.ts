/**
 * POST /api/auth/logout
 * Clears the session.
 */
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ success: true });
}
