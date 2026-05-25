/**
 * Base model helpers shared across all entity services.
 */
import {
  createRecord as _createRecord,
  getRecord as _getRecord,
  getRecordById as _getRecordById,
  updateRecord as _updateRecord,
  deleteRecord as _deleteRecord,
  listRecords as _listRecords,
} from "../storeai";

/**
 * Get the key prefix for an entity type.
 */
export function keyPrefix(type: string): (id: string) => string {
  return (id: string) => `${type}:${id}`;
}

/**
 * Filter records by a specific key prefix (type).
 * StoreAI supports filtering via `key` query param — we append the prefix.
 */
export async function listByType<T extends { id: string; key: string; data: Record<string, unknown> }>(
  type: string,
  extraParams?: Record<string, string>,
): Promise<T[]> {
  const result = await _listRecords({
    ...extraParams,
    key: type,
  });
  return (result.records ?? []) as T[];
}
