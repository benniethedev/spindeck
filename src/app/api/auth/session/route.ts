/**
 * GET /api/auth/session
 * Returns the current logged-in artist session.
 * Uses server-side session stored in localStorage (client) / cookies (server).
 * For simplicity in this demo, we use a client-side stored JWT-like token.
 */
import { NextResponse } from 'next/server';

export async function GET() {
  // In production this would check a cookie or session store
  // For now, return a placeholder that the client-side will populate
  return NextResponse.json({ authenticated: false, user: null });
}
