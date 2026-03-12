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
            ? 'border-cyan-300/70 bg-cyan-200/90 text-slate-900'
            : 'border-slate-700/70 text-slate-200 hover:border-sky-300/40 hover:bg-slate-900/75 hover:text-white',
        )
      }
      to={to}
    >
      {children}
    </NavLink>
  );
}
