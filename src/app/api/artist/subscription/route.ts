/**
 * GET /api/artist/subscription
 * Returns the current artist's subscription status from Stripe or StoreAI.
 */
import { NextRequest, NextResponse } from 'next/server';

function getSession(req: NextRequest) {
  const token = req.cookies.get('spin_session')?.value;
  const authHeader = req.headers.get('authorization');
  const headerToken = authHeader?.replace('Bearer ', '');
  return token || headerToken || null;
}

export async function GET(req: NextRequest) {
  try {
    const session = getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Try to get subscription from Stripe webhook data
    // For now, return a mock response that can be enhanced with real Stripe data
    // In production, this would query Stripe API or a subscription table
    return NextResponse.json({
      subscription: {
        status: 'trialing',
        plan: 'free',
        currentPeriodEnd: null,
        trialEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancellationDate: null,
        cancelAtPeriodEnd: false,
      },
    });
  } catch (err) {
    console.error('Subscription fetch error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
