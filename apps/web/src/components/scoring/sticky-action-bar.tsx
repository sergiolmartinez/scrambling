import type { PropsWithChildren } from 'react';

type StickyActionBarProps = PropsWithChildren;

export function StickyActionBar({ children }: StickyActionBarProps): JSX.Element {
  return (
    <>
      <div className='h-20 md:hidden' />
      <div className='fixed inset-x-0 bottom-0 z-40 border-t border-slate-700/70 bg-slate-950/95 px-4 pb-5 pt-3 backdrop-blur md:hidden'>
        <div className='mx-auto flex max-w-6xl items-center gap-2'>{children}</div>
      </div>
    </>
  );
}
