type PlayersCountBadgeProps = {
  count: number;
  max: number;
};

export function PlayersCountBadge({ count, max }: PlayersCountBadgeProps): JSX.Element {
  const isFull = count >= max;

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
        isFull
          ? 'border-amber-300/40 bg-amber-400/10 text-amber-200'
          : 'border-slate-600/70 bg-slate-900/60 text-slate-300'
      }`}
    >
      Players: {count}/{max}
    </span>
  );
}
