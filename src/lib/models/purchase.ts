/**
 * Purchase model service
 *
 * Key convention: "purchase:<uuid>"
 *
 * Handles Stripe payment lifecycle: creation, confirmation, refund, cancellation.
 */
import {
  createRecord,
  getRecord,
  getRecordById,
  updateRecord,
  deleteRecord,
} from "../storeai";
import { Purchase, PURCHASE_KEY, PurchaseItem, Status } from "../types/model";
import { listByType } from "./base";

export async function createPurchase(data: Omit<Purchase, "id" | "createdAt" | "updatedAt">): Promise<Purchase> {
  const now = new Date().toISOString();
  const record = await createRecord(PURCHASE_KEY(data.stripePaymentId), {
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  return { ...(record.data as Record<string, any>), id: record.id } as unknown as Purchase;
}

export async function getPurchaseByStripeId(stripePaymentId: string): Promise<Purchase | null> {
  const record = await getRecord(PURCHASE_KEY(stripePaymentId));
  if (!record) return null;
  return { ...(record.data as Record<string, any>), id: record.id } as unknown as Purchase;
}

export async function getPurchaseById(id: string): Promise<Purchase | null> {
  const record = await getRecordById(id);
  if (!record) return null;
  return { ...(record.data as Record<string, any>), id: record.id } as unknown as Purchase;
}

export async function updatePurchase(id: string, updates: Partial<Purchase>): Promise<Purchase> {
  const record = await getRecordById(id);
  if (!record) throw new Error(`Purchase not found: ${id}`);
  const updated = await updateRecord(record.id, {
    ...(record.data as Record<string, any>),
    ...updates,
    updatedAt: new Date().toISOString(),
  });
  return { ...(updated.data as Record<string, any>), id: updated.id } as unknown as Purchase;
}

export async function deletePurchase(id: string): Promise<void> {
  const record = await getRecordById(id);
  if (!record) throw new Error(`Purchase not found: ${id}`);
  await deleteRecord(record.id);
}

// ---- Stripe webhook handler helper ----

export async function handleStripeEvent(
  stripePaymentId: string,
  event: "payment_succeeded" | "payment_failed" | "refunded" | "cancelled",
): Promise<Purchase> {
  const purchase = await getPurchaseByStripeId(stripePaymentId);
  if (!purchase) {
    throw new Error(`Purchase not found for Stripe event: ${stripePaymentId}`);
  }

  let status: Status = purchase.status;

  switch (event) {
    case "payment_succeeded":
      status = "completed";
      break;
    case "payment_failed":
      status = "cancelled";
      break;
    case "refunded":
      status = "refunded";
      break;
    case "cancelled":
      status = "cancelled";
      break;
  }

  return updatePurchase(purchase.id, { status });
}

// ---- Query helpers ----

export async function getPurchasesByRecipient(
  recipientId: string,
  recipientType: "dj" | "artist",
): Promise<Purchase[]> {
  const records = await listByType<{ id: string; key: string; data: Record<string, unknown> }>("purchase");
  return records
    .filter(r => {
      const d = r.data as Record<string, unknown>;
      return (d.recipientId as string) === recipientId && (d.recipientType as string) === recipientType;
    })
    .map(r => ({ ...(r.data as Record<string, any>), id: r.id } as unknown as Purchase));
}

export async function getPurchasesByStripeCustomer(
  stripeCustomerId: string,
): Promise<Purchase[]> {
  const records = await listByType<{ id: string; key: string; data: Record<string, unknown> }>("purchase");
  return records
    .filter(r => (r.data as Record<string, unknown>).stripeCustomerId === stripeCustomerId)
    .map(r => ({ ...(r.data as Record<string, any>), id: r.id } as unknown as Purchase));
}
