import type { PropsWithChildren } from 'react';

type StickyActionBarProps = PropsWithChildren<{
  desktop?: boolean;
}>;

export function StickyActionBar({ children, desktop = false }: StickyActionBarProps): JSX.Element {
  const desktopClass = desktop ? '' : 'md:hidden';
  return (
    <>
      <div className={`h-20 ${desktopClass}`} />
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 px-4 pb-5 pt-3 backdrop-blur ${desktopClass}`}
      >
        <div className='mx-auto flex max-w-6xl items-center gap-2'>{children}</div>
      </div>
    </>
  );
}
