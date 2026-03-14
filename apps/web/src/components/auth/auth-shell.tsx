import type { PropsWithChildren } from 'react';

import { Card } from '@/components/ui/card';

type AuthShellProps = PropsWithChildren<{
  title: string;
  description: string;
}>;

export function AuthShell({ title, description, children }: AuthShellProps): JSX.Element {
  return (
    <div className='mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-md items-center py-8'>
      <Card className='w-full space-y-4'>
        <div className='space-y-1'>
          <p className='text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]'>
            Scrambling
          </p>
          <h1 className='text-2xl font-semibold tracking-tight text-[var(--color-text)]'>{title}</h1>
          <p className='text-sm text-[var(--color-text-muted)]'>{description}</p>
        </div>
        {children}
      </Card>
    </div>
  );
}
