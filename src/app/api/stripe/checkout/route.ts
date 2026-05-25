/**
 * Stripe Checkout Session endpoint
 * Creates a Stripe Checkout session for the selected artist package.
 * Handles all 3 pricing tiers: Starter ($29), Professional ($79), Enterprise ($199)
 */
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';

function getStripe(): Stripe | null {
  if (!STRIPE_SECRET_KEY) {
    console.warn('[stripe] STRIPE_SECRET_KEY not configured — Stripe calls will fail silently');
    return null;
  }
  return new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia' });
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const pricing = {
  starter: {
    priceId: process.env.STRIPE_PRICE_STARTER || '',
    name: 'Starter',
    amount: 29,
    currency: 'usd' as const,
  },
  professional: {
    priceId: process.env.STRIPE_PRICE_PROFESSIONAL || '',
    name: 'Professional',
    amount: 79,
    currency: 'usd' as const,
  },
  enterprise: {
    priceId: process.env.STRIPE_PRICE_ENTERPRISE || '',
    name: 'Enterprise',
    amount: 199,
    currency: 'usd' as const,
  },
};

type PlanKey = keyof typeof pricing;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { plan, email, name, mode: reqMode } = body as {
      plan?: string;
      email?: string;
      name?: string;
      mode?: string;
    };

    const checkoutMode: 'payment' | 'subscription' =
      reqMode === 'payment' ? 'payment' : 'subscription';

    if (!plan || !(plan in pricing)) {
      return NextResponse.json(
        {
          error: `Invalid or missing plan. Must be one of: starter, professional, enterprise.`,
        },
        { status: 400 },
      );
    }

    const planKey = plan as PlanKey;
    const { priceId, name: planName, amount, currency } = pricing[planKey];

    // If no Stripe price ID configured, create one dynamically
    let effectivePriceId = priceId;
    if (!priceId) {
      try {
        const stripe = getStripe();
        if (!stripe) {
          throw new Error('Stripe not configured');
        }
        const product = await stripe.products.create({
          name: `SpinRec ${planName} Plan`,
          description: `${planName} plan for artist promotion on SpinRec`,
          metadata: { plan: planKey },
        });

        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: amount * 100,
          currency: currency,
          recurring: checkoutMode === 'subscription' ? { interval: 'month' } : undefined,
          metadata: { plan: planKey },
        });

        effectivePriceId = price.id;
        console.log(`Created dynamic Stripe price for ${planName}: ${effectivePriceId}`);
      } catch (createErr: unknown) {
        console.error('Failed to create dynamic Stripe price:', createErr);
        const err = createErr as Error;
        return NextResponse.json(
          { error: `Stripe price creation failed: ${err.message}` },
          { status: 500 },
        );
      }
    }

    if (checkoutMode === 'subscription' && !email) {
      return NextResponse.json(
        { error: 'Email is required for subscription checkout.' },
        { status: 400 },
      );
    }

    const metadata: Record<string, string> = {
      plan: planKey,
      priceId: effectivePriceId,
      checkout_mode: checkoutMode,
      plan_amount: String(amount),
      plan_currency: currency,
    };
    if (email) metadata.email = email;
    if (name) metadata.artist_name = name;

    const successUrl = `${BASE_URL}/welcome?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${BASE_URL}/payment-error?message=${encodeURIComponent('Payment was cancelled. You can try again anytime.')}`;

    const params: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      mode: checkoutMode,
      line_items: [
        {
          price: effectivePriceId,
          quantity: 1,
        },
      ],
      customer_email: email || undefined,
      metadata: metadata,
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_creation: checkoutMode === 'subscription' ? 'always' : undefined,
      allow_promotion_codes: planKey !== 'enterprise',
      billing_address_collection: 'required',
    };

    const stripe = getStripe();
    if (!stripe) throw new Error('Stripe not configured');

    const session = await stripe.checkout.sessions.create(params);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      plan: planKey,
      amount: amount,
    });
  } catch (err: unknown) {
    console.error('Stripe checkout error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to create checkout session: ' + message },
      { status: 500 },
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
