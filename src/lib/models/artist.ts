/**
 * Artist model service
 *
 * Key convention: "artist:<uuid>"
 */
import {
  createRecord,
  getRecord,
  getRecordById,
  updateRecord,
  deleteRecord,
  listRecords,
} from "../storeai";
import { Artist, ARTIST_KEY, Genre } from "../types/model";
import { listByType } from "./base";

export async function createArtist(data: Omit<Artist, "id" | "createdAt" | "updatedAt">): Promise<Artist> {
  const now = new Date().toISOString();
  const record = await createRecord(ARTIST_KEY(data.slug), {
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  return { ...record.data, id: record.id } as unknown as Artist;
}

export async function getArtist(slug: string): Promise<Artist | null> {
  const record = await getRecord(ARTIST_KEY(slug));
  if (!record) return null;
  return { ...record.data, id: record.id } as unknown as Artist;
}

export async function getArtistById(id: string): Promise<Artist | null> {
  const record = await getRecordById(id);
  if (!record) return null;
  return { ...record.data, id: record.id } as unknown as Artist;
}

export async function updateArtist(slug: string, updates: Partial<Artist>): Promise<Artist> {
  const record = await getRecord(ARTIST_KEY(slug));
  if (!record) throw new Error(`Artist not found: ${slug}`);
  const updated = await updateRecord(record.id, {
    ...record.data,
    ...updates,
    updatedAt: new Date().toISOString(),
  });
  return { ...updated.data, id: updated.id } as unknown as Artist;
}

export async function deleteArtist(slug: string): Promise<void> {
  const record = await getRecord(ARTIST_KEY(slug));
  if (!record) throw new Error(`Artist not found: ${slug}`);
  await deleteRecord(record.id);
}

export async function listArtists(genre?: Genre): Promise<Artist[]> {
  const params: Record<string, string> = {};
  if (genre) params.genre = genre;
  const records = await listByType<{ id: string; key: string; data: Record<string, unknown> }>("artist", params);
  return records.map(r => ({ ...r.data, id: r.id } as unknown as Artist));
}

export async function listActiveArtists(): Promise<Artist[]> {
  const records = await listByType<{ id: string; key: string; data: Record<string, unknown> }>("artist", { status: "active" });
  return records.map(r => ({ ...r.data, id: r.id } as unknown as Artist));
}
