/**
 * SubmissionsFilter Component
 * Provides filter buttons to filter submissions by status.
 */
'use client';

import { SubmissionStatus } from '@/types';

const ALL_FILTERS = [
  { value: 'all' as const, label: 'All' },
  { value: 'pending' as SubmissionStatus, label: 'Pending' },
  { value: 'approved' as SubmissionStatus, label: 'Approved' },
  { value: 'rejected' as SubmissionStatus, label: 'Rejected' },
  { value: 'in_campaign' as SubmissionStatus, label: 'In Campaign' },
];

interface SubmissionsFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function SubmissionsFilter({ activeFilter, onFilterChange }: SubmissionsFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-1">
      {ALL_FILTERS.map((f) => {
        const isActive = activeFilter === f.value;
        return (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              isActive
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
