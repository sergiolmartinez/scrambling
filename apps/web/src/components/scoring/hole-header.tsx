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
    <div className='space-y-2'>
      <p className='text-xs font-semibold uppercase tracking-wide text-sky-300/80'>Live Scoring</p>
      <h2 className='text-2xl font-semibold text-slate-100'>
        Hole {currentHole} of {totalHoles}
      </h2>
      <p className='text-sm text-slate-300'>{courseName}</p>
      <div className='flex flex-wrap gap-2 text-xs'>
        <span className='rounded-full border border-slate-600/70 bg-slate-900/60 px-2.5 py-1 text-slate-200'>
          Round: {roundStatus}
        </span>
        <span
          className={`rounded-full border px-2.5 py-1 ${
            holeCompleted
              ? 'border-emerald-300/40 bg-emerald-400/10 text-emerald-200'
              : 'border-amber-300/40 bg-amber-400/10 text-amber-200'
          }`}
        >
          {holeCompleted ? 'Hole completed' : 'Hole in progress'}
        </span>
        <span className='rounded-full border border-cyan-300/40 bg-cyan-400/10 px-2.5 py-1 text-cyan-200'>
          Par: {parSnapshot ?? 'Not set'}
        </span>
      </div>
    </div>
  );
}
