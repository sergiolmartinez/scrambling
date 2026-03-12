type RankRowProps = {
  rank: number;
  displayName: string;
  totalContributions: number;
  sharePercent: number;
  isLeader: boolean;
  isTied: boolean;
};

export function RankRow({
  rank,
  displayName,
  totalContributions,
  sharePercent,
  isLeader,
  isTied,
}: RankRowProps): JSX.Element {
  return (
    <li
      className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm ${
        isLeader
          ? 'border-emerald-300/40 bg-emerald-400/10'
          : 'border-zinc-800 bg-slate-900/35'
      }`}
    >
      <div className='flex min-w-0 items-center gap-3'>
        <span
          className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full border px-2 text-xs font-semibold ${
            isLeader
              ? 'border-emerald-300/50 bg-emerald-500/20 text-emerald-100'
              : 'border-slate-600/80 bg-slate-800/70 text-slate-200'
          }`}
        >
          #{rank}
        </span>
        <span className='truncate text-sm font-semibold text-slate-100'>
          {displayName}
          {isLeader ? ' · Leader' : ''}
          {isTied ? ' · Tied' : ''}
        </span>
      </div>
      <span className='text-sm font-semibold text-slate-100'>
        {totalContributions} ({sharePercent}%)
      </span>
    </li>
  );
}
