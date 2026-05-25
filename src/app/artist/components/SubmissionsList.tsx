/**
 * SubmissionsList Component
 * Displays a list of submissions with status badges, artwork, and progress tracking.
 * Supports filtering, sorting, and empty states.
 * Clickable rows that navigate to submission detail pages.
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Submission, SubmissionStatus } from '@/types';
import StatusBadge from './StatusBadge';

interface SubmissionsListProps {
  submissions: Submission[];
  loading: boolean;
  onRefresh: () => void;
  filterStatus?: SubmissionStatus | 'all';
}

export default function SubmissionsList({
  submissions,
  loading,
  onRefresh,
  filterStatus = 'all',
}: SubmissionsListProps) {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filtered = submissions.filter((s) =>
    filterStatus === 'all' ? true : s.status === filterStatus
  );

  const handleClick = (id: string) => {
    router.push(`/artist/submissions/${id}`);
  };

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          {filterStatus === 'all'
            ? 'All Submissions'
            : `${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Submissions`}
        </h2>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {filtered.length} {filtered.length === 1 ? 'submission' : 'submissions'}
        </span>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="p-12 text-center">
          <div className="inline-block w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">Loading submissions...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 3-2 3 2zm0 0v-8" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
            {filterStatus === 'all' ? 'No submissions yet' : 'No submissions found'}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm mx-auto">
            {filterStatus === 'all'
              ? 'Submit your first track to start getting your music in front of DJs worldwide.'
              : `No submissions are currently in this status.`}
          </p>
          {filterStatus === 'all' && (
            <a
              href="/artist/submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/20 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Submit Your First Track
            </a>
          )}
        </div>
      ) : (
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {filtered.map((sub) => {
            const statusIdx = getStatusIndex(sub.status);
            const isHovered = hoveredId === sub.id;
            return (
              <div
                key={sub.id}
                className="px-6 py-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                onClick={() => handleClick(sub.id)}
                onMouseEnter={() => setHoveredId(sub.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  {/* Artwork + Track info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden">
                      {sub.artworkUrl ? (
                        <img src={sub.artworkUrl} alt={sub.trackName} className="w-full h-full object-cover" />
                      ) : (
                        sub.trackName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-zinc-900 dark:text-white truncate">
                        {sub.trackName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                        <span className="capitalize">{sub.genre.replace('_', ' ')}</span>
                        <span className="text-zinc-300 dark:text-zinc-600">·</span>
                        <span>{sub.bpm} BPM</span>
                        <span className="text-zinc-300 dark:text-zinc-600">·</span>
                        <span className={sub.isClean ? 'text-green-500' : 'text-amber-500'}>
                          {sub.isClean ? 'Clean' : 'Explicit'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status + Date */}
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={sub.status} />
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0">
                      {new Date(sub.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 ml-16 sm:ml-20">
                  <div className="h-1 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        sub.status === 'pending'
                          ? 'bg-amber-500 w-1/4'
                          : sub.status === 'approved'
                          ? 'bg-green-500 w-2/4'
                          : sub.status === 'rejected'
                          ? 'bg-red-500 w-1/4'
                          : 'bg-violet-500 w-full'
                      }`}
                    />
                  </div>
                  <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                    Step {statusIdx + 1} of 4
                  </p>
                </div>

                {/* Quick actions on hover */}
                {isHovered && sub.audioFileUrl && (
                  <div className="mt-3 ml-16 sm:ml-20 flex items-center gap-3">
                    {sub.notes && (
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 truncate max-w-xs">
                        {sub.notes}
                      </span>
                    )}
                    {sub.links && sub.links.length > 0 && (
                      <div className="flex items-center gap-2">
                        {sub.links.slice(0, 3).map((link, i) => (
                          <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 font-medium"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getStatusIndex(status: SubmissionStatus) {
  const flow: SubmissionStatus[] = ['pending', 'approved', 'rejected', 'in_campaign'];
  return flow.indexOf(status);
}
