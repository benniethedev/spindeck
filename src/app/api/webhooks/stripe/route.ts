/**
 * Stripe Webhook endpoint
 * Handles Stripe events: checkout.session.completed, payment_intent.succeeded,
 * invoice.payment_failed, checkout.session.expired
 * On success: auto-creates Artist record in StoreAI DB
 * On failure: logs error for downstream handling
 */
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createRecord } from '@/lib/storeai';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-04-22.dahlia',
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

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

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handlePaymentSuccess(session);
      break;
    }

    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent;
      console.log('Payment succeeded:', pi.id, 'for customer:', pi.customer);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      console.error('Payment failed for invoice:', invoice.id, 'customer:', invoice.customer);
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Checkout session expired:', session.id);
      break;
    }

    case 'customer.subscription.created': {
      const sub = event.data.object as Stripe.Subscription;
      console.log('Subscription created:', sub.id, 'status:', sub.status);
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      console.warn('Subscription deleted:', sub.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

/**
 * Handle successful payment: auto-create Artist record in StoreAI DB
 */
async function handlePaymentSuccess(session: Stripe.Checkout.Session) {
  try {
    const { id: sessionId, customer, metadata, subscription } = session;

    const plan = metadata?.plan || 'starter';
    const email = (metadata?.email as string) || '';
    const artistName = (metadata?.artist_name as string) || '';

    // Fetch full subscription details
    let subDetails: Stripe.Subscription | undefined;
    if (subscription && typeof subscription === 'string') {
      subDetails = await stripe.subscriptions.retrieve(subscription);
    } else if (subscription && typeof subscription === 'object') {
      subDetails = subscription as Stripe.Subscription;
    }

    // Get customer email from subscription or session
    const customerEmail =
      ((subDetails as any)?.customer_email as string) ||
      (session.customer_email as string) ||
      email;
    const customerId = customer || sessionId;

    // Create Artist record in StoreAI
    const artistKey = `artist:${customerId}`;
    const artistData = {
      id: customerId,
      name: artistName,
      email: customerEmail,
      plan: plan,
      status: 'active',
      stripeCustomerId: customerId,
      stripeSubscriptionId: subDetails?.id || '',
      stripePriceId: subDetails?.items?.data[0]?.price?.id || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      submissionCount: 0,
      isActive: true,
    };

    const created = await createRecord(artistKey, artistData);
    console.log('Artist record created in DB:', created.key, 'for plan:', plan);

    // If customer already exists, update their record
    if (customer && typeof customer === 'string' && customer.startsWith('cus_')) {
      try {
        await fetch(
          `${process.env.STOREAI_BASE_URL || 'https://db.netswagger.com'}/api/records?key=${encodeURIComponent(`artist:${customer}`)}`,
          {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${process.env.STOREAI_API_KEY || ''}`,
              'Content-Type': 'application/json',
              'X-Project-ID': process.env.STOREAI_PROJECT_ID || '',
            },
            body: JSON.stringify({
              data: {
                ...artistData,
                updatedAt: new Date().toISOString(),
                stripeSubscriptionId: subDetails?.id || '',
                status: 'active',
              },
            }),
          }
        );
      } catch (updateErr) {
        console.warn('Failed to update existing customer record:', updateErr);
      }
    }

    // Track subscription event in StoreAI
    const eventKey = `subscription:${sessionId}`;
    const eventRecord = {
      id: sessionId,
      type: 'payment_success',
      plan: plan,
      stripeSessionId: sessionId,
      stripeSubscriptionId: subDetails?.id || '',
      customerEmail: customerEmail,
      occurredAt: new Date().toISOString(),
    };
    await createRecord(eventKey, eventRecord);

    console.log(`Successfully handled payment_success for plan: ${plan}, session: ${sessionId}`);
  } catch (err) {
    console.error('Error handling payment success:', err);
  }
}
