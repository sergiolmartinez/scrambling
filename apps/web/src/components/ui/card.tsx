import type { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

type CardProps = PropsWithChildren<{ className?: string }>;

export function Card({ className, children }: CardProps): JSX.Element {
  return (
    <section
      className={cn(
        'rounded-2xl border border-slate-700/70 bg-gradient-to-b from-slate-900/85 to-slate-950/70 p-5 shadow-[0_14px_40px_rgba(2,6,23,0.5)]',
        className,
      )}
    >
      {children}
    </section>
  );
}

export function CardTitle({ children }: PropsWithChildren): JSX.Element {
  return <h2 className='text-lg font-semibold tracking-tight text-slate-100'>{children}</h2>;
}

export function CardDescription({ children }: PropsWithChildren): JSX.Element {
  return <p className='mt-1 text-sm text-slate-400'>{children}</p>;
}
