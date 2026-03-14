import type { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

type CardProps = PropsWithChildren<{ className?: string }>;

export function Card({ className, children }: CardProps): JSX.Element {
  return (
    <section
      className={cn(
        'rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[0_14px_40px_rgba(2,6,23,0.08)]',
        className,
      )}
    >
      {children}
    </section>
  );
}

export function CardTitle({ children }: PropsWithChildren): JSX.Element {
  return <h2 className='text-lg font-semibold tracking-tight text-[var(--color-text)]'>{children}</h2>;
}

export function CardDescription({ children }: PropsWithChildren): JSX.Element {
  return <p className='mt-1 text-sm text-[var(--color-text-muted)]'>{children}</p>;
}
