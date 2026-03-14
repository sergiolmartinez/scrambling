import { StatusBadge } from '@/components/ui/status-badge';

type HoleHeaderProps = {
  currentHole: number;
  totalHoles: number;
  courseName: string;
  roundStatus: string;
  holeCompleted: boolean;
  parSnapshot: number | null;
};

export function HoleHeader({
  currentHole,
  totalHoles,
  courseName,
  roundStatus,
  holeCompleted,
  parSnapshot,
}: HoleHeaderProps): JSX.Element {
  return (
    <div className='space-y-3'>
      <p className='text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]'>Live scoring</p>
      <div className='space-y-1'>
        <h2 className='text-3xl font-semibold tracking-tight text-[var(--color-text)]'>
          Hole {currentHole} of {totalHoles}
        </h2>
        <p className='text-sm text-[var(--color-text-muted)]'>{courseName}</p>
      </div>
      <div className='flex flex-wrap gap-2 text-xs'>
        <StatusBadge tone='neutral'>Round {toDisplayRoundStatus(roundStatus)}</StatusBadge>
        <StatusBadge tone={holeCompleted ? 'success' : 'warning'}>
          {holeCompleted ? 'Completed' : 'In progress'}
        </StatusBadge>
        <StatusBadge tone='info'>Par {parSnapshot ?? 'Not set'}</StatusBadge>
      </div>
    </div>
  );
}

function toDisplayRoundStatus(status: string): string {
  if (status === 'active') {
    return 'Active';
  }

  if (status === 'completed') {
    return 'Completed';
  }

  return 'Setup';
}
