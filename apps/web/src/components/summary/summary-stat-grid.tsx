type SummaryStatGridProps = {
  status: string;
  courseName: string;
  totalScore: number;
  completedHoles: number;
  totalHoles: number;
};

export function SummaryStatGrid({
  status,
  courseName,
  totalScore,
  completedHoles,
  totalHoles,
}: SummaryStatGridProps): JSX.Element {
  return (
    <div className='mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4'>
      <div className='rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2'>
        <p className='text-[var(--color-text-muted)]'>Round status</p>
        <p className='font-semibold text-[var(--color-text)] capitalize'>{status}</p>
      </div>
      <div className='rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2'>
        <p className='text-[var(--color-text-muted)]'>Course</p>
        <p className='font-semibold text-[var(--color-text)]'>{courseName}</p>
      </div>
      <div className='rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2'>
        <p className='text-[var(--color-text-muted)]'>Total score</p>
        <p className='font-semibold text-[var(--color-text)]'>{totalScore}</p>
      </div>
      <div className='rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2'>
        <p className='text-[var(--color-text-muted)]'>Completed holes</p>
        <p className='font-semibold text-[var(--color-text)]'>
          {completedHoles}/{totalHoles}
        </p>
      </div>
    </div>
  );
}
