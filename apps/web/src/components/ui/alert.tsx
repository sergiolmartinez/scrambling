import type { PropsWithChildren } from 'react';

export function Alert({ children }: PropsWithChildren): JSX.Element {
  return <div className='rounded-md border border-rose-500/40 bg-rose-950/50 px-4 py-3 text-sm text-rose-200'>{children}</div>;
}
