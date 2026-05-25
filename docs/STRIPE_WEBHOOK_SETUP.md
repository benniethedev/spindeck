# Stripe Webhook Setup - SpinDeck

## Overview

SpinDeck uses Stripe webhooks to handle subscription lifecycle events. The webhook endpoint receives events for checkout completion, subscription changes, and payment status updates.

## Webhook Endpoint

**Production URL:** `https://spindeck.com/api/webhook/stripe`  
**Local Development:** `http://localhost:3000/api/webhook/stripe`

## Required Environment Variables

```env
STRIPE_SECRET_KEY=sk_test_...      # or sk_live_... for production
STRIPE_WEBHOOK_SECRET=whsec_...    # From Stripe Dashboard or CLI
```

## Handled Events

The webhook handler processes these Stripe events:

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Create/update user, grant access, send welcome email |
| `customer.subscription.created` | Link subscription to user profile |
| `customer.subscription.updated` | Update plan, handle cancellation scheduling |
| `customer.subscription.deleted` | Revoke access |
| `invoice.paid` | Confirm access on recurring payments |
| `invoice.payment_failed` | Log failure (access revoked on subscription deletion) |
| `checkout.session.expired` | Log abandoned checkout |

## Stripe Dashboard Configuration

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Enter your webhook URL: `https://your-domain.com/api/webhook/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add it to your `.env.local` as `STRIPE_WEBHOOK_SECRET`

## Local Development with Stripe CLI

### Install Stripe CLI

```bash
brew install stripe/stripe-cli/stripe
```

### Login to Stripe

```bash
stripe login
```

### Forward webhooks to localhost

```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

This will output a webhook signing secret like:
```
Ready! Your webhook signing secret is whsec_xxxxx (^C to quit)
```

Copy this secret to your `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### Test webhook events

In another terminal, trigger test events:

```bash
# Test checkout completion
stripe trigger checkout.session.completed

# Test subscription update
stripe trigger customer.subscription.updated

# Test payment failure
stripe trigger invoice.payment_failed
```

## Vercel Deployment

When deploying to Vercel:

1. Add `STRIPE_WEBHOOK_SECRET` to your Vercel environment variables
2. Use the **production** webhook signing secret from Stripe Dashboard (not the CLI one)
3. Ensure the webhook URL in Stripe Dashboard points to your production domain

## Troubleshooting

### Webhook signature verification failed

- Ensure `STRIPE_WEBHOOK_SECRET` matches the signing secret from Stripe Dashboard
- For local dev, use the secret from `stripe listen` output
- Check that you're using the correct secret for test vs live mode

### Events not arriving

- Verify the endpoint URL is correct in Stripe Dashboard
- Check the webhook logs in Stripe Dashboard → Developers → Webhooks
- Ensure your server is accessible from the internet (for production)

### 400 errors

- Usually indicates signature verification failure
- Check logs for specific error message
- Verify environment variable is set correctly

## File Location

Webhook handler: `app/api/webhook/stripe/route.js`
