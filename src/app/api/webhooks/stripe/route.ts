/**
 * Stripe Webhook endpoint
 * Handles all relevant Stripe events:
 * - checkout.session.completed: payment success, auto-create Artist record in StoreAI DB
 * - invoice.payment_succeeded: recurring subscription payment succeeded
 * - invoice.payment_failed: recurring payment failed
 * - checkout.session.canceled: payment cancelled by user
 * - customer.subscription.created/updated/deleted: subscription lifecycle
 * - charge.dispute.created: payment dispute/fraud alert
 * - payment_intent.payment_failed: one-time payment failed
 * - payment_intent.succeeded: one-time payment succeeded
 * - checkout.session.expired: checkout session expired
 *
 * On success: auto-creates Artist record in StoreAI DB
 * On failure: logs failure for admin review
 */
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createRecord, updateRecord, getRecord } from '@/lib/storeai';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

function getStripe(): Stripe {
  if (!STRIPE_SECRET_KEY) {
    console.warn('[stripe] STRIPE_SECRET_KEY not configured — Stripe calls will fail silently');
    return new Stripe('sk_test_placeholder', { apiVersion: '2026-04-22.dahlia' }) as unknown as Stripe;
  }
  return new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia' });
}

type EventHandler = (event: Stripe.Event) => Promise<void>;

function extractPlan(event: Stripe.Event): string {
  const meta = (event.data.object as any).metadata || {};
  if (meta.plan) return meta.plan;
  const sub = event.data.object as Stripe.Subscription;
  if (sub && sub.items && sub.items.data) {
    const p = sub.items.data[0];
    if (p && (p as any).price && (p as any).price.metadata?.plan) return (p as any).price.metadata.plan;
  }
  return 'unknown';
}

const handlers: Record<string, EventHandler> = {
  'checkout.session.completed': async (event) => {
    const session = event.data.object as Stripe.Checkout.Session;
    const plan = extractPlan(event);
    console.log('[webhook] checkout.session.completed:', session.id, 'plan:', plan);
    await handlePaymentSuccess(session);
  },
  'invoice.payment_succeeded': async (event) => {
    const invoice = event.data.object as Stripe.Invoice;
    const plan = extractPlan(event);
    console.log('[webhook] invoice.payment_succeeded:', invoice.id, 'plan:', plan);
  },
  'invoice.payment_failed': async (event) => {
    const invoice = event.data.object as Stripe.Invoice;
    const plan = extractPlan(event);
    const email = (invoice as any).customer_email || '';
    console.error('[webhook] invoice.payment_failed:', invoice.id, 'plan:', plan, 'email:', email);
    const failureKey = 'payment_failure:' + invoice.id;
    try {
      await createRecord(failureKey, {
        id: invoice.id,
        type: 'payment_failed',
        plan,
        email,
        stripeInvoiceId: invoice.id,
        stripeSubscriptionId: String((invoice as any).subscription || ''),
        failureReason: String((invoice as any).collection_behavior || 'unknown'),
        occurredAt: new Date().toISOString(),
      });
      console.log('[webhook] Logged payment failure:', failureKey);
    } catch (err) {
      console.error('[webhook] Failed to log payment failure:', err);
    }
  },
  'checkout.session.canceled': async (event) => {
    const session = event.data.object as Stripe.Checkout.Session;
    const plan = extractPlan(event);
    console.log('[webhook] checkout.session.canceled:', session.id, 'plan:', plan);
  },
  'payment_intent.payment_failed': async (event) => {
    const pi = event.data.object as Stripe.PaymentIntent;
    const plan = extractPlan(event);
    console.error('[webhook] payment_intent.payment_failed:', pi.id, 'plan:', plan, 'error:', (pi as any).last_payment_error?.message);
    const failureKey = 'payment_intent_failure:' + pi.id;
    try {
      await createRecord(failureKey, {
        id: pi.id,
        type: 'payment_intent_failed',
        plan,
        email: String((pi as any).customer_email || ''),
        stripePaymentIntentId: pi.id,
        failureReason: String((pi as any).last_payment_error?.message || 'unknown'),
        occurredAt: new Date().toISOString(),
      });
    } catch (err) { console.error('Failed to log payment_intent failure:', err); }
  },
  'customer.subscription.created': async (event) => {
    const sub = event.data.object as Stripe.Subscription;
    const plan = extractPlan(event);
    console.log('[webhook] customer.subscription.created:', sub.id, 'status:', sub.status, 'plan:', plan);
  },
  'customer.subscription.updated': async (event) => {
    const sub = event.data.object as Stripe.Subscription;
    const plan = extractPlan(event);
    const customerId = typeof sub.customer === 'string' ? sub.customer : '';
    console.log('[webhook] customer.subscription.updated:', sub.id, 'status:', sub.status, 'plan:', plan);
    if (customerId) {
      const artistKey = 'artist:' + customerId;
      try {
        const existing = await getRecord(artistKey);
        if (existing) {
          await updateRecord(existing.id, {
            status: sub.status === 'active' ? 'active' : 'past_due',
            subscriptionStatus: sub.status,
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (err) { console.error('Failed to update artist on subscription update:', err); }
    }
  },
  'customer.subscription.deleted': async (event) => {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = typeof sub.customer === 'string' ? sub.customer : '';
    console.warn('[webhook] customer.subscription.deleted:', sub.id, 'customer:', customerId);
    if (customerId) {
      const artistKey = 'artist:' + customerId;
      try {
        const existing = await getRecord(artistKey);
        if (existing) {
          await updateRecord(existing.id, {
            status: 'cancelled',
            stripeSubscriptionId: '',
            subscriptionStatus: 'canceled',
            isActive: false,
            subscriptionCancelledAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (err) { console.error('Failed to update artist on subscription deletion:', err); }
    }
  },
  'charge.dispute.created': async (event) => {
    const dispute = event.data.object as Stripe.Dispute;
    console.error('[webhook] charge.dispute.created:', dispute.id, 'reason:', dispute.reason);
    const failureKey = 'dispute:' + dispute.id;
    try {
      await createRecord(failureKey, {
        id: dispute.id,
        type: 'charge_dispute',
        reason: dispute.reason,
        status: dispute.status,
        amount: dispute.amount,
        currency: dispute.currency,
        occurredAt: new Date().toISOString(),
      });
    } catch (err) { console.error('Failed to log dispute:', err); }
  },
  'payment_intent.succeeded': async (event) => {
    const pi = event.data.object as Stripe.PaymentIntent;
    console.log('[webhook] payment_intent.succeeded:', pi.id);
  },
  'checkout.session.expired': async (event) => {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('[webhook] checkout.session.expired:', session.id);
  },
};

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature') as string;
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }
  const handler = handlers[event.type];
  if (handler) {
    try { await handler(event); } catch (err) { console.error('[webhook] Handler error:', event.type, err); }
  } else {
    console.log('[webhook] Unhandled event:', event.type);
  }
  return NextResponse.json({ received: true });
}

/**
 * Handle successful payment: auto-create Artist record in StoreAI DB
 */
async function handlePaymentSuccess(session: Stripe.Checkout.Session) {
  try {
    const sessionId = session.id;
    const customer = session.customer;
    const metadata = session.metadata || {};
    const subscription = session.subscription;
    const plan = metadata.plan || 'starter';
    const email = metadata.email || session.customer_email || '';
    const artistName = metadata.artist_name || '';
    let subDetails: Stripe.Subscription | undefined;
    if (subscription && typeof subscription === 'string') {
      subDetails = await getStripe().subscriptions.retrieve(subscription);
    } else if (subscription && typeof subscription === 'object') {
      subDetails = subscription as Stripe.Subscription;
    }
    const customerEmail = (subDetails as any)?.customer_email || email;
    const stripeCustomerId = typeof customer === 'string' ? customer : sessionId;
    const artistKey = 'artist:' + stripeCustomerId;
    let existingArtist: any = null;
    try { existingArtist = await getRecord(artistKey); } catch (_) {}
    const artistData: Record<string, unknown> = {
      id: stripeCustomerId,
      name: artistName || customerEmail,
      email: customerEmail,
      plan: plan,
      status: 'active',
      stripeCustomerId: stripeCustomerId,
      stripeSubscriptionId: subDetails ? subDetails.id : '',
      stripePriceId: subDetails ? String((subDetails as any)?.items?.data?.[0]?.price?.id || '') : '',
      subscriptionStatus: subDetails ? subDetails.status : 'active',
      subscriptionCurrentPeriodEnd: subDetails && (subDetails as any)?.current_period_end
        ? new Date((subDetails as any).current_period_end * 1000).toISOString() : '',
      createdAt: existingArtist?.data?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      submissionCount: existingArtist?.data?.submissionCount || 0,
      isActive: true,
      source: 'stripe_checkout',
      sessionId: sessionId,
    };
    let result;
    if (existingArtist) {
      result = await updateRecord(existingArtist.id, artistData);
      console.log('[success] Artist updated:', result.key, 'plan:', plan);
    } else {
      result = await createRecord(artistKey, artistData);
      console.log('[success] Artist created:', result.key, 'plan:', plan);
    }
    const eventKey = 'subscription:' + sessionId;
    const eventRecord = {
      id: sessionId,
      type: 'payment_success',
      plan,
      stripeSessionId: sessionId,
      stripeSubscriptionId: subDetails ? subDetails.id : '',
      stripeCustomerId: stripeCustomerId,
      customerEmail: customerEmail,
      occurredAt: new Date().toISOString(),
    };
    await createRecord(eventKey, eventRecord);
  } catch (err) {
    console.error('[success] Error handling payment success:', err);
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
