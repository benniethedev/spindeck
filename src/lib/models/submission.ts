/**
 * Submission model definitions
 * Maps to StoreAI records with key convention "submission:<id>"
 * Status flow: pending -> approved -> rejected -> in_campaign
 */

export type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'in_campaign';

export interface Submission {
  id: string;
  key: string;
  artistId: string;
  trackName: string;
  genre: string;
  bpm: number;
  isClean: boolean;
  links: Record<string, string>;
  notes: string;
  audioFileKey: string | null;
  audioFileName: string | null;
  artworkFileKey: string | null;
  artworkFileName: string | null;
  status: SubmissionStatus;
  statusHistory: Array<{ status: SubmissionStatus; timestamp: string; note?: string }>;
  campaignIds: string[];
  createdAt: string;
  updatedAt: string;
}

export const SUBMISSION_STATUSES: SubmissionStatus[] = ['pending', 'approved', 'rejected', 'in_campaign'];

export function createSubmissionRecord(
  artistId: string,
  trackName: string,
  genre: string,
  bpm: number,
  isClean: boolean,
  links: Record<string, string>,
  notes: string,
  audioFileKey?: string | null,
  artworkFileKey?: string | null
): Omit<Submission, 'id' | 'key' | 'status' | 'statusHistory' | 'campaignIds' | 'createdAt' | 'updatedAt'> {
  const now = new Date().toISOString();
  return {
    artistId,
    trackName,
    genre,
    bpm,
    isClean,
    links,
    notes,
    audioFileKey: audioFileKey || null,
    audioFileName: (audioFileKey && links?.audio_file_name) || null,
    artworkFileKey: artworkFileKey || null,
    artworkFileName: (artworkFileKey && links?.artwork_file_name) || null,
  };
}

export function getStatusBadge(status: SubmissionStatus): { label: string; color: string; bg: string } {
  switch (status) {
    case 'pending':
      return { label: 'Pending Review', color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-100 dark:bg-amber-900/40' };
    case 'approved':
      return { label: 'Approved', color: 'text-green-700 dark:text-green-300', bg: 'bg-green-100 dark:bg-green-900/40' };
    case 'rejected':
      return { label: 'Rejected', color: 'text-red-700 dark:text-red-300', bg: 'bg-red-100 dark:bg-red-900/40' };
    case 'in_campaign':
      return { label: 'In Campaign', color: 'text-violet-700 dark:text-violet-300', bg: 'bg-violet-100 dark:bg-violet-900/40' };
    default:
      return { label: status, color: 'text-zinc-600', bg: 'bg-zinc-100 dark:bg-zinc-800' };
  }
}
