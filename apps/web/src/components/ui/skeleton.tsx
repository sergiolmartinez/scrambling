export function Skeleton({ className }: { className?: string }): JSX.Element {
  return <div className={`animate-pulse rounded-md bg-[var(--color-surface-muted)] ${className ?? ''}`} />;
}
