/**
 * Verify a Stripe Checkout session
 * Used after redirect from Stripe to confirm payment success
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
      customerId: session.customer,
      subscriptionId:
        typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription?.id,
      plan: session.metadata?.plan,
      customerEmail: session.customer_email,
      amountTotal: session.amount_total,
      currency: session.currency,
    };

    return NextResponse.json(data);
  } catch (err) {
    console.error('Failed to verify Stripe session:', err);
    return NextResponse.json(
      { error: 'Failed to verify session' },
      { status: 500 }
    );
  }
}
