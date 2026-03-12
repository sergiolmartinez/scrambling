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
      <div className='rounded-md border border-zinc-800 bg-slate-900/35 px-3 py-2'>
        <p className='text-zinc-400'>Round status</p>
        <p className='font-semibold capitalize'>{status}</p>
      </div>
      <div className='rounded-md border border-zinc-800 bg-slate-900/35 px-3 py-2'>
        <p className='text-zinc-400'>Course</p>
        <p className='font-semibold'>{courseName}</p>
      </div>
      <div className='rounded-md border border-zinc-800 bg-slate-900/35 px-3 py-2'>
        <p className='text-zinc-400'>Total score</p>
        <p className='font-semibold'>{totalScore}</p>
      </div>
      <div className='rounded-md border border-zinc-800 bg-slate-900/35 px-3 py-2'>
        <p className='text-zinc-400'>Completed holes</p>
        <p className='font-semibold'>
          {completedHoles}/{totalHoles}
        </p>
      </div>
    </div>
  );
}
