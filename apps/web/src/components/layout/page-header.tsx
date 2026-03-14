import type { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

type PageHeaderProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  actions?: JSX.Element;
  className?: string;
}>;

export function PageHeader({ title, subtitle, actions, className, children }: PageHeaderProps): JSX.Element {
  return (
    <header className={cn('mb-4 flex flex-wrap items-start justify-between gap-3', className)}>
      <div>
        <h2 className='text-xl font-semibold tracking-tight text-[var(--color-text)]'>{title}</h2>
        {subtitle ? <p className='mt-1 text-sm text-[var(--color-text-muted)]'>{subtitle}</p> : null}
      </div>
      {actions ? <div className='flex items-center gap-2'>{actions}</div> : null}
      {children}
    </header>
  );
}
