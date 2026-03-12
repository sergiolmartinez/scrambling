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
          ? 'border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] text-[var(--color-warning-text)]'
          : 'border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]'
      }`}
    >
      Players {count}/{max}
    </span>
  );
}
