import { CheckCircleIcon, TrophyIcon } from '@/components/ui/icons';
import { StatusBadge } from '@/components/ui/status-badge';

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
          ? 'border-[var(--color-success-border)] bg-[var(--color-success-bg)]'
          : 'border-[var(--color-warning-border)] bg-[var(--color-warning-bg)]'
      }`}
    >
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <p className='inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text)]'>
          {isCompleted ? <TrophyIcon className='h-4 w-4' /> : <CheckCircleIcon className='h-4 w-4' />}
          {isCompleted ? 'Round complete' : 'Round in progress'}
        </p>
        <StatusBadge tone={isCompleted ? 'success' : 'warning'}>
          {isCompleted ? 'Locked' : 'Editable'}
        </StatusBadge>
      </div>
      <p className='mt-1 text-sm text-[var(--color-text-muted)]'>
        {isCompleted
          ? completionLabel
            ? `Finalized on ${completionLabel}. This recap is final.`
            : 'Finalized. This recap is final.'
          : 'Scores can still change from the scoring screen.'}
      </p>
    </div>
  );
}
