import type { PropsWithChildren } from 'react';

export function Alert({ children }: PropsWithChildren): JSX.Element {
  return (
    <div className='rounded-md border border-[var(--color-danger-border)] bg-[var(--color-danger-bg)] px-4 py-3 text-sm text-[var(--color-danger-text)]'>
      {children}
    </div>
  );
}
