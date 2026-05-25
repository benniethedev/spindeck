/**
 * Stripe Webhook endpoint
 * Handles all relevant Stripe events with secure signature verification.
 * 
 * Events handled:
 * - checkout.session.completed: payment success → auto-create Artist record
 * - invoice.payment_succeeded: recurring subscription payment succeeded
 * - invoice.payment_failed: recurring payment failed → log for admin review
 * - checkout.session.canceled: payment cancelled by user
 * - payment_intent.payment_failed: one-time payment failed → log for admin review
 * - customer.subscription.created/updated/deleted: subscription lifecycle
 * - charge.dispute.created: payment dispute/fraud alert
 * - payment_intent.succeeded: one-time payment succeeded
 * - checkout.session.expired: checkout session expired
 *
 * On success: auto-creates Artist record in StoreAI DB
 * On failure: logs failure for admin review
 * 
 * SECURITY: Webhook signature verified before processing any events
 */
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createRecord, updateRecord, getRecord } from '@/lib/storeai';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-04-22.dahlia',
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

type EventHandler = (event: Stripe.Event) => Promise<void>;

/**
 * Extract the plan name from a Stripe event's metadata.
 * Checks session metadata, price metadata, and subscription items.
 */
function extractPlan(event: Stripe.Event): string {
  const meta = (event.data.object as any).metadata || {};
  if (meta.plan) return meta.plan;

  // Check price metadata for subscription items
  const sub = event.data.object as Stripe.Subscription;
  if (sub && sub.items && sub.items.data) {
    const price = sub.items.data[0]?.price;
    if (price && (price as any).metadata?.plan) return (price as any).metadata.plan;
  }
  return 'unknown';
}

/**
 * Log a payment failure to the StoreAI DB for admin review.
 */
async function logPaymentFailure(
  eventId: string,
  plan: string,
  email: string,
  details: Record<string, string>,
) {
  const failureKey = `payment_failure:${eventId}`;
  try {
    await createRecord(failureKey, {
      id: eventId,
      type: 'payment_failed',
      plan,
      email,
      ...details,
      occurredAt: new Date().toISOString(),
    });
    console.log(`[webhook] Logged payment failure: ${failureKey}`);
  } catch (err) {
    console.error('[webhook] Failed to log payment failure:', err);
  }
}

const handlers: Record<string, EventHandler> = {
  'checkout.session.completed': async (event) => {
    const session = event.data.object as Stripe.Checkout.Session;
    const plan = extractPlan(event);
    console.log(`[webhook] checkout.session.completed: ${session.id} plan=${plan} status=${session.payment_status}`);
    
    if (session.payment_status === 'paid') {
      await handlePaymentSuccess(session);
    }
  },

  'invoice.payment_succeeded': async (event) => {
    const invoice = event.data.object as Stripe.Invoice;
    const plan = extractPlan(event);
    console.log(`[webhook] invoice.payment_succeeded: ${invoice.id} plan=${plan}`);
  },

  'invoice.payment_failed': async (event) => {
    const invoice = event.data.object as Stripe.Invoice;
    const plan = extractPlan(event);
    const email = String((invoice as any).customer_email || '');
    const reason = String((invoice as any).last_payment_error?.message || 'unknown');
    
    console.error(`[webhook] invoice.payment_failed: ${invoice.id} plan=${plan} email=${email} reason=${reason}`);
    await logPaymentFailure(invoice.id, plan, email, {
      stripeInvoiceId: invoice.id,
      stripeSubscriptionId: String((invoice as any).subscription || ''),
      failureReason: reason,
    });
  },

  'checkout.session.canceled': async (event) => {
    const session = event.data.object as Stripe.Checkout.Session;
    const plan = extractPlan(event);
    console.log(`[webhook] checkout.session.canceled: ${session.id} plan=${plan}`);
    
    // Store cancellation event for tracking
    await createRecord(`cancel:${session.id}`, {
      id: session.id,
      type: 'checkout_canceled',
      plan,
      customerEmail: session.customer_email || '',
      reason: String((session as any).cancellation_details?.reason || 'user'),
      occurredAt: new Date().toISOString(),
    });
  },

  'payment_intent.payment_failed': async (event) => {
    const pi = event.data.object as Stripe.PaymentIntent;
    const plan = extractPlan(event);
    const email = String((pi as any).customer_email || '');
    const reason = String((pi as any).last_payment_error?.message || 'unknown');
    
    console.error(`[webhook] payment_intent.payment_failed: ${pi.id} plan=${plan} email=${email} reason=${reason}`);
    await logPaymentFailure(pi.id, plan, email, {
      stripePaymentIntentId: pi.id,
      failureReason: reason,
    });
  },

  'customer.subscription.created': async (event) => {
    const sub = event.data.object as Stripe.Subscription;
    const plan = extractPlan(event);
    console.log(`[webhook] customer.subscription.created: ${sub.id} status=${sub.status} plan=${plan}`);
  },

  'customer.subscription.updated': async (event) => {
    const sub = event.data.object as Stripe.Subscription;
    const plan = extractPlan(event);
    const customerId = typeof sub.customer === 'string' ? sub.customer : '';
    
    console.log(`[webhook] customer.subscription.updated: ${sub.id} status=${sub.status} plan=${plan}`);
    
    if (customerId) {
      const artistKey = `artist:${customerId}`;
      try {
        const existing = await getRecord(artistKey);
        if (existing) {
          await updateRecord(existing.id, {
            status: sub.status === 'active' ? 'active' : 'past_due',
            subscriptionStatus: sub.status,
            updatedAt: new Date().toISOString(),
          });
          console.log(`[webhook] Artist record updated for ${artistKey}`);
        }
      } catch (err) {
        console.error('[webhook] Failed to update artist on subscription update:', err);
      }
    }
  },

  'customer.subscription.deleted': async (event) => {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = typeof sub.customer === 'string' ? sub.customer : '';
    
    console.warn(`[webhook] customer.subscription.deleted: ${sub.id} customer=${customerId}`);
    
    if (customerId) {
      const artistKey = `artist:${customerId}`;
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
          console.log(`[webhook] Artist record marked cancelled for ${artistKey}`);
        }
      } catch (err) {
        console.error('[webhook] Failed to update artist on subscription deletion:', err);
      }
    }
  },

  'charge.dispute.created': async (event) => {
    const dispute = event.data.object as Stripe.Dispute;
    console.error(`[webhook] charge.dispute.created: ${dispute.id} reason=${dispute.reason} status=${dispute.status}`);
    
    await createRecord(`dispute:${dispute.id}`, {
      id: dispute.id,
      type: 'charge_dispute',
      reason: dispute.reason,
      status: dispute.status,
      amount: String(dispute.amount),
      currency: dispute.currency,
      stripeChargeId: dispute.charge,
      occurredAt: new Date().toISOString(),
    });
  },

  'payment_intent.succeeded': async (event) => {
    const pi = event.data.object as Stripe.PaymentIntent;
    console.log(`[webhook] payment_intent.succeeded: ${pi.id} amount=${pi.amount}`);
  },

  'checkout.session.expired': async (event) => {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log(`[webhook] checkout.session.expired: ${session.id}`);
  },
};

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature') as string;

  // Verify webhook signature to prevent spoofing
  let event: Stripe.Event;
  try {
    if (!WEBHOOK_SECRET) {
      console.error('[webhook] STRIPE_WEBHOOK_SECRET not configured');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  const handler = handlers[event.type];
  if (handler) {
    try {
      await handler(event);
    } catch (err) {
      console.error(`[webhook] Handler error for ${event.type}:`, err);
    }
  } else {
    console.log(`[webhook] Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

/**
 * Handle successful payment: auto-create Artist record in StoreAI DB
 * Called when checkout.session.completed event fires with payment_status=paid
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

    // Retrieve subscription details if applicable
    let subDetails: Stripe.Subscription | undefined;
    if (subscription && typeof subscription === 'string') {
      subDetails = await stripe.subscriptions.retrieve(subscription);
    } else if (subscription && typeof subscription === 'object') {
      subDetails = subscription as Stripe.Subscription;
    }

    const customerEmail = (subDetails as any)?.customer_email || email;
    const stripeCustomerId = typeof customer === 'string' ? customer : sessionId;
    const artistKey = `artist:${stripeCustomerId}`;

    // Check if artist already exists (may happen on retry)
    let existingArtist: any = null;
    try {
      existingArtist = await getRecord(artistKey);
    } catch (_) {
      // Record doesn't exist yet — that's fine
    }

    const subscriptionId = subDetails ? subDetails.id : '';
    const priceId = subDetails
      ? String((subDetails as any)?.items?.data?.[0]?.price?.id || '')
      : (metadata.priceId || '');
    const periodEnd = subDetails && (subDetails as any)?.current_period_end
      ? new Date((subDetails as any).current_period_end * 1000).toISOString()
      : '';

    const artistData: Record<string, unknown> = {
      id: stripeCustomerId,
      name: artistName || customerEmail,
      email: customerEmail,
      plan,
      status: 'active',
      stripeCustomerId,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: priceId,
      subscriptionStatus: subDetails ? subDetails.status : 'active',
      subscriptionCurrentPeriodEnd: periodEnd,
      createdAt: existingArtist?.data?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      submissionCount: existingArtist?.data?.submissionCount || 0,
      isActive: true,
      source: 'stripe_checkout',
      sessionId,
      paymentStatus: session.payment_status,
    };

    let result;
    if (existingArtist) {
      result = await updateRecord(existingArtist.id, artistData);
      console.log(`[success] Artist updated: ${result.key} plan=${plan}`);
    } else {
      result = await createRecord(artistKey, artistData);
      console.log(`[success] Artist created: ${result.key} plan=${plan}`);
    }

    // Log the successful event
    await createRecord(`subscription:${sessionId}`, {
      id: sessionId,
      type: 'payment_success',
      plan,
      stripeSessionId: sessionId,
      stripeSubscriptionId: subscriptionId,
      stripeCustomerId: stripeCustomerId,
      customerEmail,
      occurredAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[success] Error handling payment success:', err);
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
