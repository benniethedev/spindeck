/**
 * StoreAI (Spindeck) client library
 * Schemaless JSON store - uses key convention "type:uuid"
 */

const BASE_URL = process.env.STOREAI_BASE_URL || 'https://db.netswagger.com';
const API_KEY = process.env.STOREAI_API_KEY || '';
const PROJECT_ID = process.env.STOREAI_PROJECT_ID || '';

function getHeaders(): Record<string, string> {
  return {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'X-Project-ID': PROJECT_ID,
  };
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const opts: RequestInit = {
    method,
    headers: getHeaders(),
  };
  if (body && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`StoreAI ${method} ${path} failed: ${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function createRecord(key: string, data: Record<string, unknown>) {
  return request<{ id: string; key: string; data: unknown }>(
    'POST',
    '/api/records',
    { key, data }
  );
}

export async function getRecord(key: string) {
  return request<{ id: string; key: string; data: unknown }>(
    'GET',
    `/api/records?key=${encodeURIComponent(key)}`
  );
}

export async function getRecordById(id: string) {
  return request<{ id: string; key: string; data: unknown }>(
    'GET',
    `/api/records/${id}`
  );
}

export async function updateRecord(id: string, data: Record<string, unknown>) {
  return request<{ id: string; key: string; data: unknown }>(
    'PATCH',
    `/api/records/${id}`,
    { data }
  );
}

export async function deleteRecord(id: string) {
  return request<{ success: boolean }>(
    'DELETE',
    `/api/records/${id}`
  );
}

export async function listRecords(params?: Record<string, string>) {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return request<{ records: Array<{ id: string; key: string; data: unknown }> }>(
    'GET',
    `/api/records${query}`
  );
}

export async function getFileUrl(filename: string) {
  return request<{ url: string; fileId: string }>(
    'GET',
    `/api/files/${filename}`
  );
}
