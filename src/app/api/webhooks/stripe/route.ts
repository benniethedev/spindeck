/**
 * Stripe Webhook endpoint
 * Handles Stripe events: checkout.session.completed, invoice.payment_failed, checkout.session.canceled
 * On success: auto-creates Artist record in StoreAI DB
 * On failure: returns 400 for verification errors; payment failures logged for downstream handling
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

const handlers: Record<string, EventHandler> = {
  'checkout.session.completed': async (event) => {
    const session = event.data.object as Stripe.Checkout.Session;
    await handlePaymentSuccess(session);
  },
  'checkout.session.canceled': async (event) => {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('Checkout session canceled:', session.id, 'metadata:', session.metadata);
  },
  'invoice.payment_failed': async (event) => {
    const invoice = event.data.object as any;
    const subId = typeof invoice.subscription === 'string'
      ? invoice.subscription
      : invoice.subscription && (invoice.subscription as any).id;

    if (subId) {
      try {
        const sub = await stripe.subscriptions.retrieve(subId);
        const plan = (sub as any).metadata && (sub as any).metadata.plan ? (sub as any).metadata.plan : 'unknown';
        const email = (sub as any).customer_email ? (sub as any).customer_email : '';
        console.error('Payment failed for invoice:', invoice.id, 'plan:', plan, 'email:', email);

        const failureKey = 'payment_failure:' + invoice.id;
        await createRecord(failureKey, {
          id: invoice.id,
          type: 'payment_failed',
          plan: plan,
          email: email,
          stripeInvoiceId: invoice.id,
          stripeSubscriptionId: subId,
          failureReason: invoice.collection_behavior || '',
          occurredAt: new Date().toISOString(),
        });
      } catch (subErr) {
        console.error('Could not retrieve subscription for failed payment:', subErr);
      }
    }
  },
  'payment_intent.succeeded': async (event) => {
    const pi = event.data.object as Stripe.PaymentIntent;
    console.log('PaymentIntent succeeded:', pi.id, 'for customer:', pi.customer);
  },
  'checkout.session.expired': async (event) => {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('Checkout session expired:', session.id);
  },
  'customer.subscription.created': async (event) => {
    const sub = event.data.object as Stripe.Subscription;
    console.log('Subscription created:', sub.id, 'status:', sub.status, 'customer:', sub.customer);
  },
  'customer.subscription.updated': async (event) => {
    const sub = event.data.object as Stripe.Subscription;
    console.log('Subscription updated:', sub.id, 'status:', sub.status);
  },
  'customer.subscription.deleted': async (event) => {
    const sub = event.data.object as Stripe.Subscription;
    console.warn('Subscription deleted:', sub.id, 'customer:', sub.customer);
    const customerId = typeof sub.customer === 'string' ? sub.customer : '';
    if (customerId) {
      try {
        const artistKey = 'artist:' + customerId;
        const existing = await getRecord(artistKey);
        if (existing) {
          await updateRecord(existing.id, {
            status: 'cancelled',
            stripeSubscriptionId: '',
            isActive: false,
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (updateErr) {
        console.warn('Could not update artist record on subscription deletion:', updateErr);
      }
    }
  },
};

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  const eventType = event.type;
  const handler = handlers[eventType];

  if (handler) {
    await handler(event);
  } else {
    console.log('Unhandled event type: ' + eventType);
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
    const metadata = session.metadata;
    const subscription = session.subscription;

    const plan = metadata && metadata.plan ? metadata.plan : 'starter';
    const email = metadata && metadata.email ? metadata.email : '';
    const artistName = metadata && metadata.artist_name ? metadata.artist_name : '';

    let subDetails: Stripe.Subscription | undefined;
    if (subscription && typeof subscription === 'string') {
      subDetails = await stripe.subscriptions.retrieve(subscription);
    } else if (subscription && typeof subscription === 'object') {
      subDetails = subscription as Stripe.Subscription;
    }

    const customerEmail =
      (subDetails as any).customer_email ||
      session.customer_email ||
      email;

    const stripeCustomerId =
      (typeof customer === 'string' && customer) ||
      (typeof session.customer === 'string' && session.customer) ||
      sessionId;

    const artistKey = 'artist:' + stripeCustomerId;
    let existingArtist: any = null;
    try {
      existingArtist = await getRecord(artistKey);
    } catch (_) {
      // Record does not exist yet
    }

    const artistData: Record<string, unknown> = {
      id: stripeCustomerId,
      name: artistName,
      email: customerEmail,
      plan: plan,
      status: 'active',
      stripeCustomerId: stripeCustomerId,
      stripeSubscriptionId: subDetails ? subDetails.id : '',
      stripePriceId: subDetails ? (subDetails as any).items?.data?.[0]?.price?.id : '',
      subscriptionStatus: subDetails ? subDetails.status : 'active',
      subscriptionCurrentPeriodEnd: subDetails && (subDetails as any).current_period_end
        ? new Date((subDetails as any).current_period_end * 1000).toISOString()
        : '',
      createdAt: existingArtist && (existingArtist.data as any).createdAt ? (existingArtist.data as any).createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      submissionCount: existingArtist && (existingArtist.data as any).submissionCount ? (existingArtist.data as any).submissionCount : 0,
      isActive: true,
    };

    let result;
    if (existingArtist) {
      result = await updateRecord(existingArtist.id, artistData);
      console.log('Artist record updated in DB: ' + result.key + ' for plan: ' + plan);
    } else {
      result = await createRecord(artistKey, artistData);
      console.log('Artist record created in DB: ' + result.key + ' for plan: ' + plan);
    }

    const eventKey = 'subscription:' + sessionId;
    const eventRecord = {
      id: sessionId,
      type: 'payment_success',
      plan: plan,
      stripeSessionId: sessionId,
      stripeSubscriptionId: subDetails ? subDetails.id : '',
      stripeCustomerId: stripeCustomerId,
      customerEmail: customerEmail,
      occurredAt: new Date().toISOString(),
    };
    await createRecord(eventKey, eventRecord);

    console.log('Successfully handled payment_success for plan: ' + plan + ', session: ' + sessionId + ', artist: ' + artistKey);
  } catch (err) {
    console.error('Error handling payment success:', err);
  }
}
