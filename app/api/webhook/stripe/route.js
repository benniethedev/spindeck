import configFile from "@/config";
import { findCheckoutSession } from "@/libs/stripe";
import { createServiceClient } from "@/libs/pressbase/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Helper to find plan by priceId
const findPlanByPriceId = (priceId) => {
  return configFile.stripe.plans.find((p) => p.priceId === priceId);
};

// Helper to get or create user profile
async function getOrCreateUserProfile(pb, { email, userId, customerId }) {
  let profile = null;

  // Try to find by userId first
  if (userId) {
    const { data } = await pb
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (data) profile = data;
  }

  // Try to find by customerId
  if (!profile && customerId) {
    const { data } = await pb
      .from("profiles")
      .select("*")
      .eq("customer_id", customerId)
      .single();
    if (data) profile = data;
  }

  // Try to find by email
  if (!profile && email) {
    const { data } = await pb
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();
    if (data) profile = data;
  }

  // Create new user if not found
  if (!profile && email) {
    const { data } = await pb.auth.admin.createUser({
      email: email,
    });
    if (data?.user) {
      // Fetch the newly created profile
      const { data: newProfile } = await pb
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();
      profile = newProfile;
    }
  }

  return profile;
}

// This is where we receive Stripe webhook events
// It's used to update user data, send emails, etc.
// See more: https://shipfa.st/docs/features/payments
export async function POST(req) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  let event;

  // Create a PressBase service client using the service key
  const pb = createServiceClient();

  // Verify Stripe event is legitimate
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed. ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const eventType = event.type;

  try {
    switch (eventType) {
      // ═══════════════════════════════════════════════════════════════════════
      // CHECKOUT SESSION COMPLETED
      // First payment successful, subscription or one-time payment created
      // ═══════════════════════════════════════════════════════════════════════
      case "checkout.session.completed": {
        const stripeObject = event.data.object;
        const session = await findCheckoutSession(stripeObject.id);

        const customerId = session?.customer;
        const priceId = session?.line_items?.data[0]?.price.id;
        const userId = stripeObject.client_reference_id;
        const subscriptionId = stripeObject.subscription;
        const plan = findPlanByPriceId(priceId);

        if (!plan) {
          console.log(`No plan found for priceId: ${priceId}`);
          break;
        }

        // Get customer email from Stripe
        const customer = await stripe.customers.retrieve(customerId);
        const email = customer.email;

        // Get or create the user profile
        const profile = await getOrCreateUserProfile(pb, {
          email,
          userId,
          customerId,
        });

        if (!profile) {
          console.error("Could not find or create user profile");
          break;
        }

        // Update profile with Stripe data
        const updateData = {
          customer_id: customerId,
          price_id: priceId,
          has_access: true,
        };

        // Add subscription_id for recurring plans
        if (subscriptionId) {
          updateData.subscription_id = subscriptionId;
        }

        await pb.from("profiles").update(updateData).eq("id", profile.id);

        console.log(
          `✅ checkout.session.completed: User ${profile.id} subscribed to ${plan.name}`
        );
        break;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // CUSTOMER SUBSCRIPTION CREATED
      // A new subscription was created (may fire with or after checkout.session.completed)
      // ═══════════════════════════════════════════════════════════════════════
      case "customer.subscription.created": {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const subscriptionId = subscription.id;
        const priceId = subscription.items.data[0]?.price.id;
        const status = subscription.status;

        // Find profile by customer_id
        const { data: profile } = await pb
          .from("profiles")
          .select("*")
          .eq("customer_id", customerId)
          .single();

        if (!profile) {
          console.log(
            `customer.subscription.created: No profile found for customer ${customerId}`
          );
          break;
        }

        // Update profile with subscription details
        await pb
          .from("profiles")
          .update({
            subscription_id: subscriptionId,
            price_id: priceId,
            has_access: status === "active" || status === "trialing",
          })
          .eq("id", profile.id);

        console.log(
          `✅ customer.subscription.created: User ${profile.id} subscription ${subscriptionId} (${status})`
        );
        break;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // CUSTOMER SUBSCRIPTION UPDATED
      // Customer changed plan, payment method, or subscription status changed
      // ═══════════════════════════════════════════════════════════════════════
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const subscriptionId = subscription.id;
        const priceId = subscription.items.data[0]?.price.id;
        const status = subscription.status;
        const cancelAtPeriodEnd = subscription.cancel_at_period_end;

        // Find profile by customer_id
        const { data: profile } = await pb
          .from("profiles")
          .select("*")
          .eq("customer_id", customerId)
          .single();

        if (!profile) {
          console.log(
            `customer.subscription.updated: No profile found for customer ${customerId}`
          );
          break;
        }

        // Determine access based on subscription status
        const hasAccess =
          status === "active" ||
          status === "trialing" ||
          (status === "past_due" && !cancelAtPeriodEnd); // Grace period for past_due

        // Update profile with new subscription state
        const updateData = {
          subscription_id: subscriptionId,
          price_id: priceId,
          has_access: hasAccess,
        };

        // Track if user is canceling at period end
        if (cancelAtPeriodEnd) {
          updateData.cancel_at_period_end = true;
        } else {
          updateData.cancel_at_period_end = false;
        }

        await pb.from("profiles").update(updateData).eq("id", profile.id);

        const plan = findPlanByPriceId(priceId);
        console.log(
          `✅ customer.subscription.updated: User ${profile.id} -> ${plan?.name || priceId} (status: ${status}, cancel_at_end: ${cancelAtPeriodEnd})`
        );
        break;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // CUSTOMER SUBSCRIPTION DELETED
      // Subscription ended (canceled and billing period over, or immediate cancel)
      // ═══════════════════════════════════════════════════════════════════════
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        // Find profile by customer_id
        const { data: profile } = await pb
          .from("profiles")
          .select("*")
          .eq("customer_id", customerId)
          .single();

        if (!profile) {
          console.log(
            `customer.subscription.deleted: No profile found for customer ${customerId}`
          );
          break;
        }

        // Revoke access
        await pb
          .from("profiles")
          .update({
            has_access: false,
            subscription_id: null,
            cancel_at_period_end: false,
          })
          .eq("id", profile.id);

        console.log(
          `❌ customer.subscription.deleted: User ${profile.id} access revoked`
        );
        break;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // INVOICE PAID
      // Recurring payment successful
      // ═══════════════════════════════════════════════════════════════════════
      case "invoice.paid": {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        const priceId = invoice.lines.data[0]?.price?.id;
        const subscriptionId = invoice.subscription;

        // Find profile by customer_id
        const { data: profile } = await pb
          .from("profiles")
          .select("*")
          .eq("customer_id", customerId)
          .single();

        if (!profile) {
          console.log(
            `invoice.paid: No profile found for customer ${customerId}`
          );
          break;
        }

        // Grant/confirm access
        const updateData = {
          has_access: true,
        };

        // Update price_id if different (plan change)
        if (priceId && profile.price_id !== priceId) {
          updateData.price_id = priceId;
        }

        // Update subscription_id if present
        if (subscriptionId) {
          updateData.subscription_id = subscriptionId;
        }

        await pb.from("profiles").update(updateData).eq("id", profile.id);

        console.log(`✅ invoice.paid: User ${profile.id} payment successful`);
        break;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // INVOICE PAYMENT FAILED
      // Payment failed (card declined, insufficient funds, etc.)
      // ═══════════════════════════════════════════════════════════════════════
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        const attemptCount = invoice.attempt_count;
        const nextAttempt = invoice.next_payment_attempt;

        // Find profile by customer_id
        const { data: profile } = await pb
          .from("profiles")
          .select("*")
          .eq("customer_id", customerId)
          .single();

        if (!profile) {
          console.log(
            `invoice.payment_failed: No profile found for customer ${customerId}`
          );
          break;
        }

        // Log the failure - Stripe will retry automatically with Smart Retries
        // We don't immediately revoke access to give the customer time to fix payment
        // Access will be revoked when customer.subscription.deleted fires after all retries fail
        console.log(
          `⚠️ invoice.payment_failed: User ${profile.id} - attempt ${attemptCount}, next retry: ${nextAttempt ? new Date(nextAttempt * 1000).toISOString() : "none"}`
        );

        // Optional: Track payment failure status
        // You could update a field like `payment_failed: true` to show a warning banner
        // Or send a notification to the user to update their payment method

        break;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // CHECKOUT SESSION EXPIRED
      // User didn't complete checkout in time
      // ═══════════════════════════════════════════════════════════════════════
      case "checkout.session.expired": {
        const session = event.data.object;
        console.log(
          `⏰ checkout.session.expired: Session ${session.id} expired`
        );
        // Optional: Send abandoned cart email
        break;
      }

      default:
        // Unhandled event type - log for debugging
        console.log(`Unhandled event type: ${eventType}`);
    }
  } catch (e) {
    console.error(`Stripe webhook error (${eventType}):`, e.message);
  }

  // Always return 200 to acknowledge receipt
  return NextResponse.json({ received: true });
}
