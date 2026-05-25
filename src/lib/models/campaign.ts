/**
 * Campaign (Email Blast) model service
 *
 * Key convention: "campaign:<uuid>"
 *
 * Supports the email blast workflow:
 *  1. Admin drafts a campaign (status: draft)
 *  2. Admin schedules it (status: scheduled)
 *  3. System sends (status: sending → sent)
 *  4. Results tracked (opened, clicked, bounced counts)
 */
import {
  createRecord,
  getRecord,
  getRecordById,
  updateRecord,
  deleteRecord,
} from "../storeai";
import { Campaign, CAMPAIGN_KEY, Genre, Status } from "../types/model";
import { listByType } from "./base";

export async function createCampaign(data: Omit<Campaign, "id" | "createdAt" | "updatedAt">): Promise<Campaign> {
  const now = new Date().toISOString();
  const record = await createRecord(CAMPAIGN_KEY(data.name.toLowerCase().replace(/\s+/g, "-")), {
    ...data,
    status: data.status ?? "draft",
    createdAt: now,
    updatedAt: now,
  });
  return { ...(record.data as Record<string, any>), id: record.id } as unknown as Campaign;
}

export async function getCampaign(slug: string): Promise<Campaign | null> {
  const record = await getRecord(CAMPAIGN_KEY(slug));
  if (!record) return null;
  return { ...(record.data as Record<string, any>), id: record.id } as unknown as Campaign;
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
  const record = await getRecordById(id);
  if (!record) return null;
  return { ...(record.data as Record<string, any>), id: record.id } as unknown as Campaign;
}

export async function updateCampaign(slug: string, updates: Partial<Campaign>): Promise<Campaign> {
  const record = await getRecord(CAMPAIGN_KEY(slug));
  if (!record) throw new Error(`Campaign not found: ${slug}`);
  const updated = await updateRecord(record.id, {
    ...(record.data as Record<string, any>),
    ...updates,
    updatedAt: new Date().toISOString(),
  });
  return { ...(updated.data as Record<string, any>), id: updated.id } as unknown as Campaign;
}

export async function deleteCampaign(slug: string): Promise<void> {
  const record = await getRecord(CAMPAIGN_KEY(slug));
  if (!record) throw new Error(`Campaign not found: ${slug}`);
  await deleteRecord(record.id);
}

// ---- Campaign lifecycle helpers ----

export async function scheduleCampaign(
  slug: string,
  scheduledAt: string,
): Promise<Campaign> {
  return updateCampaign(slug, {
    status: "scheduled",
    scheduledAt,
  });
}

export async function markCampaignSent(
  slug: string,
  sentAt: string,
  totalRecipients: number,
): Promise<Campaign> {
  return updateCampaign(slug, {
    status: "sent",
    sentAt,
    totalRecipients,
    deliveredCount: totalRecipients,
  });
}

export async function updateCampaignMetrics(
  slug: string,
  metrics: {
    openedCount?: number;
    clickedCount?: number;
    bounceCount?: number;
  },
): Promise<Campaign> {
  const campaign = await getCampaign(slug);
  if (!campaign) throw new Error(`Campaign not found: ${slug}`);

  return updateCampaign(slug, {
    ...metrics,
  });
}

// ---- Query helpers ----

export async function getDraftCampaigns(): Promise<Campaign[]> {
  const records = await listByType<{ id: string; key: string; data: Record<string, unknown> }>("campaign", { status: "draft" });
  return records.map(r => ({ ...(r.data as Record<string, any>), id: r.id } as unknown as Campaign));
}

export async function getScheduledCampaigns(): Promise<Campaign[]> {
  const records = await listByType<{ id: string; key: string; data: Record<string, unknown> }>("campaign", { status: "scheduled" });
  return records.map(r => ({ ...(r.data as Record<string, any>), id: r.id } as unknown as Campaign));
}

export async function getRecentCampaigns(limit: number = 20): Promise<Campaign[]> {
  const records = await listByType<{ id: string; key: string; data: Record<string, unknown> }>("campaign");
  const campaigns = records.map(r => ({ ...(r.data as Record<string, any>), id: r.id } as unknown as Campaign));
  return campaigns.slice(0, limit);
}
