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
    <div className='rounded-xl border border-emerald-300/40 bg-emerald-400/10 px-3 py-2'>
      <p className='text-xs font-semibold uppercase tracking-wide text-emerald-200'>Course assigned</p>
      <p className='text-sm font-semibold text-emerald-100'>{course.name}</p>
      <p className='text-xs text-emerald-200/90'>
        {course.city ?? 'Unknown city'}, {course.state ?? 'Unknown state'} · {course.source}
      </p>
    </div>
  );
}
