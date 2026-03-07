export function Skeleton({ className }: { className?: string }): JSX.Element {
  return <div className={`animate-pulse rounded-md bg-zinc-800 ${className ?? ''}`} />;
}
