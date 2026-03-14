import { CheckCircleIcon, MapPinIcon } from '@/components/ui/icons';
import { StatusBadge } from '@/components/ui/status-badge';

type SelectedCourseBannerProps = {
  course: {
    name: string;
    city: string | null;
    state: string | null;
    source: string;
  };
};

export function SelectedCourseBanner({ course }: SelectedCourseBannerProps): JSX.Element {
  return (
    <div className='rounded-xl border border-[var(--color-success-border)] bg-[var(--color-success-bg)] px-4 py-3'>
      <p className='inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-success-text)]'>
        <CheckCircleIcon className='h-3.5 w-3.5' />
        Course selected
      </p>
      <p className='mt-1 text-base font-semibold text-[var(--color-text)]'>{course.name}</p>
      <p className='mt-1 inline-flex items-center gap-1 text-sm text-[var(--color-text-muted)]'>
        <MapPinIcon className='h-3.5 w-3.5' />
        {course.city ?? 'Unknown city'}, {course.state ?? 'Unknown state'} · {course.source}
      </p>
      <StatusBadge tone='success' className='mt-2 uppercase tracking-wide'>
        {formatSource(course.source)}
      </StatusBadge>
    </div>
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
