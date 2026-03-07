import type { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

type CardProps = PropsWithChildren<{ className?: string }>;

export function Card({ className, children }: CardProps): JSX.Element {
  return <section className={cn('rounded-xl border border-zinc-800 bg-zinc-900/70 p-5', className)}>{children}</section>;
}

export function CardTitle({ children }: PropsWithChildren): JSX.Element {
  return <h2 className='text-lg font-semibold tracking-tight'>{children}</h2>;
}

export function CardDescription({ children }: PropsWithChildren): JSX.Element {
  return <p className='mt-1 text-sm text-zinc-400'>{children}</p>;
}
