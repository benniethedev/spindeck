/**
 * StatusBadge Component
 * Displays a colored status badge for submissions.
 * Maps: pending, approved, rejected, in_campaign
 */
'use client';

import { SubmissionStatus } from '@/types';

const STATUS_CONFIG: Record<SubmissionStatus, { label: string; color: string; bg: string; dotColor: string }> = {
  pending: {
    label: 'Pending',
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    dotColor: 'bg-amber-500',
  },
  approved: {
    label: 'Approved',
    color: 'text-green-700 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-950/40',
    dotColor: 'bg-green-500',
  },
  rejected: {
    label: 'Rejected',
    color: 'text-red-700 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/40',
    dotColor: 'bg-red-500',
  },
  in_campaign: {
    label: 'In Campaign',
    color: 'text-violet-700 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    dotColor: 'bg-violet-500',
  },
};

export default function StatusBadge({ status }: { status: SubmissionStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  );
}
