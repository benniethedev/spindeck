'use client';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  className?: string;
}

const statusConfig: Record<string, { bg: string; text: string; border: string; label: string }> = {
  pending: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', label: 'Pending' },
  approved: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', label: 'Approved' },
  rejected: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', label: 'Rejected' },
  in_campaign: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20', label: 'In Campaign' },
  free: { bg: 'bg-zinc-500/10', text: 'text-zinc-400', border: 'border-zinc-500/20', label: 'Free' },
  starter: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', label: 'Starter' },
  professional: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20', label: 'Professional' },
  enterprise: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', label: 'Enterprise' },
};

export default function StatusBadge({ status, size = 'sm', className = '' }: StatusBadgeProps) {
  const config = statusConfig[status] || { bg: 'bg-zinc-500/10', text: 'text-zinc-400', border: 'border-zinc-500/20', label: status };
  const sizeClasses = size === 'md' ? 'px-3 py-1.5 text-xs' : 'px-2.5 py-1 text-[10px]';
  const label = config.label.replace(status.charAt(0).toUpperCase(), status.charAt(0).toUpperCase());

  return (
    <span className={`inline-flex items-center gap-1.5 ${sizeClasses} ${config.bg} ${config.text} border ${config.border} rounded-lg font-semibold uppercase tracking-wider ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.text.replace('text-', 'bg-')}`} />
      {label}
    </span>
  );
}
