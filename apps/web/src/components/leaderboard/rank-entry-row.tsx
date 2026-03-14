type RankEntryRowProps = {
  rankLabel: string;
  displayName: string;
  totalContributions: number;
  sharePercent: number;
  isLeader: boolean;
  isTied: boolean;
};

export function RankEntryRow({
  rankLabel,
  displayName,
  totalContributions,
  sharePercent,
  isLeader,
  isTied,
}: RankEntryRowProps): JSX.Element {
  return (
    <li
      className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm ${
        isLeader
          ? 'border-[var(--color-success-border)] bg-[var(--color-success-bg)]'
          : 'border-[var(--color-border)] bg-[var(--color-surface-muted)]'
      }`}
    >
      <div className='flex min-w-0 items-center gap-3'>
        <span
          className={`inline-flex h-7 min-w-8 items-center justify-center rounded-full border px-2 text-xs font-semibold ${
            isLeader
              ? 'border-[var(--color-success-border)] bg-[var(--color-success-bg)] text-[var(--color-success-text)]'
              : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)]'
          }`}
        >
          #{rankLabel}
        </span>
        <span className='truncate text-sm font-semibold text-[var(--color-text)]'>{displayName}</span>
      </div>
      <div className='flex items-center gap-2 text-sm'>
        {isLeader ? (
          <span className='rounded-full border border-[var(--color-success-border)] bg-[var(--color-success-bg)] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-success-text)]'>
            Leader
          </span>
        ) : null}
        {isTied ? (
          <span className='rounded-full border border-[var(--color-info-border)] bg-[var(--color-info-bg)] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-info-text)]'>
            Tied
          </span>
        ) : null}
        <span className='font-semibold text-[var(--color-text)]'>
          {totalContributions} ({sharePercent}%)
        </span>
      </div>
    </li>
  );
}
