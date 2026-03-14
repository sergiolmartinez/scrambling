import type { PropsWithChildren } from 'react';
import { NavLink } from 'react-router-dom';

import { cn } from '@/lib/utils';

type NavItemProps = PropsWithChildren<{ to: string }>;

export function NavItem({ to, children }: NavItemProps): JSX.Element {
  return (
    <NavLink
      className={({ isActive }) =>
        cn(
          'inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
          isActive
            ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)]'
            : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]',
        )
      }
      to={to}
    >
      {children}
    </NavLink>
  );
}
