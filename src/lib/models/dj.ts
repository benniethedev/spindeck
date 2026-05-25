/**
 * DJ model service
 *
 * Key convention: "dj:<uuid>"
 */
import {
  createRecord,
  getRecord,
  getRecordById,
  updateRecord,
  deleteRecord,
} from "../storeai";
import { DJ, DJ_KEY, Genre } from "../types/model";
import { listByType } from "./base";

export async function createDj(data: Omit<DJ, "id" | "createdAt" | "updatedAt">): Promise<DJ> {
  const now = new Date().toISOString();
  const record = await createRecord(DJ_KEY(data.slug), {
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  return { ...(record.data as Record<string, any>), id: record.id } as unknown as DJ;
}

export async function getDj(slug: string): Promise<DJ | null> {
  const record = await getRecord(DJ_KEY(slug));
  if (!record) return null;
  return { ...(record.data as Record<string, any>), id: record.id } as unknown as DJ;
}

export async function getDjById(id: string): Promise<DJ | null> {
  const record = await getRecordById(id);
  if (!record) return null;
  return { ...(record.data as Record<string, any>), id: record.id } as unknown as DJ;
}

export async function getDjByEmail(email: string): Promise<DJ | null> {
  const records = await listByType<{ id: string; key: string; data: Record<string, unknown> }>("dj");
  const match = records.find(r => {
    const d = r.data as Record<string, unknown>;
    return (d.email as string) === email;
  });
  if (!match) return null;
  return { ...match.data, id: match.id } as unknown as DJ;
}

export async function updateDj(slug: string, updates: Partial<DJ>): Promise<DJ> {
  const record = await getRecord(DJ_KEY(slug));
  if (!record) throw new Error(`DJ not found: ${slug}`);
  const updated = await updateRecord(record.id, {
    ...(record.data as Record<string, any>),
    ...updates,
    updatedAt: new Date().toISOString(),
  });
  return { ...(updated.data as Record<string, any>), id: updated.id } as unknown as DJ;
}

export async function deleteDj(slug: string): Promise<void> {
  const record = await getRecord(DJ_KEY(slug));
  if (!record) throw new Error(`DJ not found: ${slug}`);
  await deleteRecord(record.id);
}

export async function listDjByGenre(genre: Genre): Promise<DJ[]> {
  const records = await listByType<{ id: string; key: string; data: Record<string, unknown> }>("dj", { genre });
  return records.map(r => ({ ...(r.data as Record<string, any>), id: r.id } as unknown as DJ));
}

export async function listDjByCountry(country: string): Promise<DJ[]> {
  const records = await listByType<{ id: string; key: string; data: Record<string, unknown> }>("dj", { country });
  return records.map(r => ({ ...(r.data as Record<string, any>), id: r.id } as unknown as DJ));
}

export async function listOptedInDjs(genres?: Genre[]): Promise<DJ[]> {
  const records = await listByType<{ id: string; key: string; data: Record<string, unknown> }>("dj", { optedIn: "true" });
  if (!genres || genres.length === 0) {
    return records.map(r => ({ ...(r.data as Record<string, any>), id: r.id } as unknown as DJ));
  }
  return records
    .map(r => ({ ...(r.data as Record<string, any>), id: r.id } as unknown as DJ))
    .filter(d => d.subscribedGenres.some(g => genres.includes(g)));
}

export async function incrementDownloadCount(slug: string): Promise<DJ> {
  const dj = await getDj(slug);
  if (!dj) throw new Error(`DJ not found: ${slug}`);
  return updateDj(slug, {
    downloadCount: dj.downloadCount + 1,
    lastDownloadedAt: new Date().toISOString(),
  });
}
