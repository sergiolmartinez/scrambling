type CompletionBannerProps = {
  status: string;
  completedAt: string | null;
};

export function CompletionBanner({ status, completedAt }: CompletionBannerProps): JSX.Element {
  const isCompleted = status === 'completed';
  const completionLabel = completedAt
    ? new Date(completedAt).toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : null;

  return (
    <div
      className={`rounded-xl border px-4 py-3 ${
        isCompleted
          ? 'border-emerald-300/40 bg-emerald-400/10'
          : 'border-amber-300/40 bg-amber-400/10'
      }`}
    >
      <p className='text-xs font-semibold uppercase tracking-wide text-slate-100'>
        {isCompleted ? 'Round Completed' : 'Round In Progress'}
      </p>
      <p className='text-sm text-slate-200'>
        {isCompleted
          ? completionLabel
            ? `Finalized on ${completionLabel}. This round is locked for edits.`
            : 'Finalized. This round is locked for edits.'
          : 'This round can still be updated from Scoring.'}
      </p>
    </div>
  );
}
