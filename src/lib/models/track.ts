/**
 * Track (Submission) model service
 *
 * Key convention: "track:<uuid>"
 *
 * Supports the core user flow:
 *  1. Artist submits track (status: pending)
 *  2. Admin reviews → approves or rejects
 *  3. Approved tracks become available to DJs for download
 */
import {
  createRecord,
  getRecord,
  getRecordById,
  updateRecord,
  deleteRecord,
} from "../storeai";
import { Track, TRACK_KEY, Genre, Status } from "../types/model";
import { listByType } from "./base";

export async function createTrack(data: Omit<Track, "id" | "createdAt" | "updatedAt">): Promise<Track> {
  const now = new Date().toISOString();
  const record = await createRecord(TRACK_KEY(data.slug), {
    ...data,
    status: data.status ?? "pending",
    createdAt: now,
    updatedAt: now,
  });
  return { ...(record.data as Record<string, any>), id: record.id } as unknown as Track;
}

export async function getTrack(slug: string): Promise<Track | null> {
  const record = await getRecord(TRACK_KEY(slug));
  if (!record) return null;
  return { ...(record.data as Record<string, any>), id: record.id } as unknown as Track;
}

export async function getTrackById(id: string): Promise<Track | null> {
  const record = await getRecordById(id);
  if (!record) return null;
  return { ...(record.data as Record<string, any>), id: record.id } as unknown as Track;
}

export async function updateTrack(slug: string, updates: Partial<Track>): Promise<Track> {
  const record = await getRecord(TRACK_KEY(slug));
  if (!record) throw new Error(`Track not found: ${slug}`);
  const updated = await updateRecord(record.id, {
    ...(record.data as Record<string, any>),
    ...updates,
    updatedAt: new Date().toISOString(),
  });
  return { ...(updated.data as Record<string, any>), id: updated.id } as unknown as Track;
}

export async function deleteTrack(slug: string): Promise<void> {
  const record = await getRecord(TRACK_KEY(slug));
  if (!record) throw new Error(`Track not found: ${slug}`);
  await deleteRecord(record.id);
}

// ---- Approval workflow helpers ----

export async function approveTrack(
  slug: string,
  reviewedBy: string,
): Promise<Track> {
  return updateTrack(slug, {
    status: "approved",
    availableToDJs: true,
    reviewedBy,
    reviewedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
  });
}

export async function rejectTrack(
  slug: string,
  reviewedBy: string,
  reason: string,
): Promise<Track> {
  return updateTrack(slug, {
    status: "rejected",
    reviewedBy,
    reviewedAt: new Date().toISOString(),
    rejectionReason: reason,
  });
}

// ---- Query helpers ----

export async function getPendingTracks(): Promise<Track[]> {
  const records = await listByType<{ id: string; key: string; data: Record<string, unknown> }>("track", { status: "pending" });
  return records.map(r => ({ ...(r.data as Record<string, any>), id: r.id } as unknown as Track));
}

export async function getApprovedTracks(genres?: Genre[], limit?: number): Promise<Track[]> {
  const records = await listByType<{ id: string; key: string; data: Record<string, unknown> }>("track", {
    status: "approved",
  });
  let tracks = records.map(r => ({ ...(r.data as Record<string, any>), id: r.id } as unknown as Track));
  if (genres && genres.length > 0) {
    tracks = tracks.filter(t => t.genre.some(g => genres.includes(g)));
  }
  if (limit) tracks = tracks.slice(0, limit);
  return tracks;
}

export async function getArtistTracks(artistId: string): Promise<Track[]> {
  const records = await listByType<{ id: string; key: string; data: Record<string, unknown> }>("track");
  return records
    .filter(r => (r.data as Record<string, unknown>).artistId === artistId)
    .map(r => ({ ...(r.data as Record<string, any>), id: r.id } as unknown as Track));
}

export async function getAvailableTracks(genres?: Genre[]): Promise<Track[]> {
  return getApprovedTracks(genres);
}

export async function getTrackByArtistAndSlug(
  artistId: string,
  slug: string,
): Promise<Track | null> {
  const records = await listByType<{ id: string; key: string; data: Record<string, unknown> }>("track");
  for (const r of records) {
    const d = r.data as Record<string, unknown>;
    if ((d.artistId as string) === artistId && (r.key as string) === `track:${slug}`) {
      return { ...(r.data as Record<string, any>), id: r.id } as unknown as Track;
    }
  }
  return null;
}
