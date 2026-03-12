import { MapPinIcon } from '@/components/ui/icons';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';

type CourseResultCardProps = {
  course: {
    external_id: string;
    name: string;
    city: string | null;
    state: string | null;
    source: string;
  };
  disabled: boolean;
  isAssigned: boolean;
  isAssigning: boolean;
  onAssign: () => void;
};

export function CourseResultCard({
  course,
  disabled,
  isAssigned,
  isAssigning,
  onAssign,
}: CourseResultCardProps): JSX.Element {
  return (
    <article className='rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3'>
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          <p className='truncate text-sm font-semibold text-[var(--color-text)]'>{course.name}</p>
          <p className='mt-1 inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)]'>
            <MapPinIcon className='h-3.5 w-3.5 shrink-0' />
            {course.city ?? 'City unknown'}, {course.state ?? 'State unknown'}
          </p>
          <StatusBadge tone='info' className='mt-2 uppercase tracking-wide'>
            {formatSource(course.source)}
          </StatusBadge>
        </div>
        <Button
          type='button'
          variant={isAssigned ? 'primary' : 'outline'}
          onClick={onAssign}
          disabled={disabled || isAssigning}
          className='min-h-10 min-w-24'
        >
          {isAssigned ? 'Assigned' : isAssigning ? 'Assigning...' : 'Assign'}
        </Button>
      </div>
    </article>
  );
}

function formatSource(source: string): string {
  if (source === 'golfcourseapi') {
    return 'Imported';
  }

  if (source === 'snapshot') {
    return 'Snapshot';
  }

  return 'Saved';
}
