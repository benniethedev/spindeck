/**
 * Verify a Stripe Checkout session
 * Used after redirect from Stripe to confirm payment success.
 * 
 * GET /api/stripe/verify?session_id=cs_xxx
 * 
 * Returns:
 * {
 *   sessionId: string,
 *   status: 'paid' | 'unpaid' | 'no_payment_required',
 *   mode: 'payment' | 'subscription',
 *   customerId: string,
 *   subscriptionId: string | null,
 *   plan: string | null,
 *   customerEmail: string | null,
 *   amountTotal: number | null,
 *   currency: string | null
 * }
 */
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-04-22.dahlia',
});

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    });

    const data = {
      sessionId: session.id,
      status: session.payment_status,
      mode: session.mode,
      customerId: typeof session.customer === 'string' ? session.customer : String(session.customer),
      subscriptionId:
        typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription?.id ?? null,
      plan: session.metadata?.plan ?? null,
      customerEmail: session.customer_email ?? null,
      amountTotal: session.amount_total ?? null,
      currency: session.currency ?? null,
    };

    return NextResponse.json(data);
  } catch (err) {
    console.error('Failed to verify Stripe session:', err);
    return NextResponse.json(
      { error: 'Failed to verify session' },
      { status: 500 },
    );
  }
}
