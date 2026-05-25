/**
 * Stripe Checkout Session endpoint
 * Creates a Stripe Checkout session for the selected artist package.
 */
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-04-22.dahlia',
});

const pricing = {
  starter: { priceId: process.env.STRIPE_PRICE_STARTER || '', name: 'Starter', amount: 29, currency: 'usd' },
  professional: { priceId: process.env.STRIPE_PRICE_PROFESSIONAL || '', name: 'Professional', amount: 79, currency: 'usd' },
  enterprise: { priceId: process.env.STRIPE_PRICE_ENTERPRISE || '', name: 'Enterprise', amount: 199, currency: 'usd' },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { plan, email, name } = body as { plan?: string; email?: string; name?: string };

    if (!plan || !pricing[plan as keyof typeof pricing]) {
      return NextResponse.json(
        { error: 'Invalid or missing plan. Must be one of: starter, professional, enterprise.' },
        { status: 400 }
      );
    }

    const { priceId, name: planName, amount, currency } = pricing[plan as keyof typeof pricing];

    if (!priceId) {
      return NextResponse.json(
        { error: 'Stripe price ID not configured for plan: ' + planName },
        { status: 500 }
      );
    }

    // Build customer metadata
    const metadata: Record<string, string> = {
      plan,
      ...(email ? { email } : {}),
      ...(name ? { artist_name: name } : {}),
    };

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://spinrec.com'}/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://spinrec.com'}/payment-error?message=${encodeURIComponent('Payment was cancelled. You can try again anytime.')}`,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
