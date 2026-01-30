# Stripe Production Setup - SpinRec

## Overview

This guide walks through setting up SpinRec with production Stripe keys for live payments.

## Prerequisites

- [ ] Stripe account activated for live payments
- [ ] Production domain deployed (e.g., spinrec.com)
- [ ] Access to Vercel (or your hosting provider) environment variables

## Step 1: Create Products in Stripe Dashboard (Live Mode)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. **Switch to Live mode** (toggle in top-right, should say "Live" not "Test")
3. Navigate to **Products** → **Add product**

Create each product with the following pricing:

| Product | Price | Billing |
|---------|-------|---------|
| **Basic** | $29.99/month | Recurring |
| **Silver** | $200/month | Recurring |
| **Gold** | $800/month | Recurring |
| **Platinum** | $2000/month | Recurring |
| **Mixtape** | $200 one-time | One-time |
| **Newsletter** | $200 one-time | One-time |

4. After creating each product, copy the **Price ID** (starts with `price_`)

## Step 2: Update config.js with Production Price IDs

Edit `config.js` and replace the placeholder production price IDs:

```javascript
// Example - replace with YOUR actual price IDs from Stripe Dashboard
priceId:
  process.env.NODE_ENV === "development"
    ? "price_1Sv5P52RSmrbs0ADrAupJ0zy"  // Keep test ID as-is
    : "price_1ABC123...",                 // ← Your live price ID here
```

**Price IDs to update:**
- [ ] Basic: `price_spindeck_basic_prod` → your live price ID
- [ ] Silver: `price_spindeck_silver_prod` → your live price ID
- [ ] Gold: `price_spindeck_gold_prod` → your live price ID
- [ ] Platinum: `price_spindeck_platinum_prod` → your live price ID
- [ ] Mixtape: `price_spindeck_mixtape_prod` → your live price ID
- [ ] Newsletter: `price_spindeck_newsletter_prod` → your live price ID

## Step 3: Set Production Environment Variables

In Vercel (or your hosting provider), add these environment variables:

```env
# Live Stripe keys (from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Production webhook secret (from Step 4)
STRIPE_WEBHOOK_SECRET=whsec_...
```

⚠️ **NEVER** commit live keys to git. Only set them in your hosting provider's environment.

## Step 4: Configure Production Webhook

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Ensure you're in **Live mode**
3. Click **Add endpoint**
4. Enter URL: `https://spinrec.com/api/webhook/stripe`
5. Select events:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
6. Click **Add endpoint**
7. Copy the **Signing secret** and add to Vercel as `STRIPE_WEBHOOK_SECRET`

## Step 5: Test Production Setup

1. Deploy your changes
2. Make a small test purchase with a real card
3. Verify in Stripe Dashboard that the payment went through
4. Check that the user profile was updated in your database
5. Refund the test payment if needed

## Checklist Before Going Live

- [ ] All 6 products created in Stripe (live mode)
- [ ] Price IDs updated in config.js
- [ ] Live API keys set in production environment
- [ ] Production webhook configured and tested
- [ ] Test purchase completed successfully
- [ ] Welcome email received after purchase

## Troubleshooting

### Payments failing in production but work in test

- Verify you're using `sk_live_` not `sk_test_` keys
- Confirm the price IDs are from live mode (not test mode)

### Webhook not receiving events

- Check Stripe Dashboard → Webhooks → click your endpoint → see failed events
- Verify webhook URL is correct (https, correct domain)
- Ensure `STRIPE_WEBHOOK_SECRET` matches the live webhook's signing secret

### Users not getting access after payment

- Check webhook logs in Stripe Dashboard
- Verify webhook endpoint returns 200 status
- Check application logs for errors
