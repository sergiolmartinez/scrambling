import { Button } from '@/components/ui/button';

type CourseResultCardProps = {
  course: {
    id: number;
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
    <article className='rounded-xl border border-slate-700/70 bg-slate-900/55 p-3'>
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          <p className='truncate text-sm font-semibold text-slate-100'>{course.name}</p>
          <p className='text-xs text-slate-400'>
            {course.city ?? 'Unknown city'}, {course.state ?? 'Unknown state'}
          </p>
          <span className='mt-2 inline-flex rounded-full border border-cyan-300/40 bg-cyan-400/10 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-cyan-200'>
            {course.source}
          </span>
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
