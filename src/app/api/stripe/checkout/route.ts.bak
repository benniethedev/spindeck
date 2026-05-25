/**
 * Stripe Checkout Session endpoint
 * Creates a Stripe Checkout session for the selected artist package.
 */
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-04-22.dahlia',
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://spinrec.com';

const pricing = {
  starter: { priceId: process.env.STRIPE_PRICE_STARTER || '', name: 'Starter', amount: 29, currency: 'usd' },
  professional: { priceId: process.env.STRIPE_PRICE_PROFESSIONAL || '', name: 'Professional', amount: 79, currency: 'usd' },
  enterprise: { priceId: process.env.STRIPE_PRICE_ENTERPRISE || '', name: 'Enterprise', amount: 199, currency: 'usd' },
};

type PlanKey = 'starter' | 'professional' | 'enterprise';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { plan, email, name, mode: reqMode } = body as { plan?: string; email?: string; name?: string; mode?: string };

    const checkoutMode = (reqMode === 'payment' ? 'payment' : 'subscription') as 'payment' | 'subscription';

    if (!plan || !(plan in pricing)) {
      return NextResponse.json(
        { error: 'Invalid or missing plan. Must be one of: starter, professional, enterprise.' },
        { status: 400 }
      );
    }

    const { priceId, name: planName } = pricing[plan as PlanKey];

    if (!priceId) {
      return NextResponse.json(
        { error: 'Stripe price ID not configured for plan: ' + planName + '. Please set STRIPE_PRICE_' + plan.toUpperCase() + ' in .env.local.' },
        { status: 500 }
      );
    }

    if (checkoutMode === 'subscription' && !email) {
      return NextResponse.json(
        { error: 'Email is required for subscription checkout.' },
        { status: 400 }
      );
    }

    const metadata: Record<string, string> = {
      plan: plan,
    };
    if (email) metadata.email = email;
    if (name) metadata.artist_name = name;
    metadata.priceId = priceId;
    metadata.checkout_mode = checkoutMode;

    const successUrl = BASE_URL + '/welcome?session_id={CHECKOUT_SESSION_ID}';
    const cancelUrl = BASE_URL + '/payment-error?message=' + encodeURIComponent('Payment was cancelled. You can try again anytime.');

    const params: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      mode: checkoutMode,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: metadata,
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_creation: checkoutMode === 'subscription' ? 'always' : undefined,
    };

    const session = await stripe.checkout.sessions.create(params);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
