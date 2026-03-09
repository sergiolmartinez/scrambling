import { Outlet, useLocation } from 'react-router-dom';

import { NavItem } from '@/components/ui/nav-item';

const navItems = [
  { to: '/setup', label: 'Setup', shortLabel: '1' },
  { to: '/scoring', label: 'Scoring', shortLabel: '2' },
  { to: '/leaderboard', label: 'Leaderboard', shortLabel: '3' },
  { to: '/summary', label: 'Summary', shortLabel: '4' },
];

export function AppLayout(): JSX.Element {
  const location = useLocation();

  return (
    <div className='min-h-screen text-zinc-100'>
      <header className='sticky top-0 z-30 border-b border-sky-900/40 bg-slate-950/75 backdrop-blur-xl'>
        <div className='mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6'>
          <div className='space-y-1'>
            <p className='text-xs font-semibold uppercase tracking-[0.14em] text-sky-300/80'>Scrambling</p>
            <h1 className='text-xl font-semibold tracking-tight text-slate-100'>Round Control Center</h1>
            <p className='text-xs text-slate-400'>MVP flow: setup to final summary</p>
          </div>
          <nav className='flex flex-wrap gap-2'>
            {navItems.map((item) => (
              <NavItem key={item.to} to={item.to}>
                <span className='mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-600/70 text-[11px] font-semibold text-slate-200'>
                  {item.shortLabel}
                </span>
                {item.label}
              </NavItem>
            ))}
          </nav>
        </div>
        <div className='mx-auto max-w-6xl px-4 pb-4 md:px-6'>
          <div className='h-1.5 rounded-full bg-slate-800/80'>
            <div
              className='h-full rounded-full bg-gradient-to-r from-sky-300 to-cyan-400 transition-all'
              style={{ width: `${progressWidth(location.pathname)}%` }}
            />
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-6xl px-4 py-8 md:px-6'>
        <Outlet />
      </main>
    </div>
  );
}

function progressWidth(pathname: string): number {
  const index = navItems.findIndex((item) => pathname.startsWith(item.to));
  if (index === -1) {
    return 25;
  }
  return ((index + 1) / navItems.length) * 100;
}
