import { Outlet } from 'react-router-dom';

import { NavItem } from '@/components/ui/nav-item';

const navItems = [
  { to: '/setup', label: 'Setup' },
  { to: '/scoring', label: 'Scoring' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/summary', label: 'Summary' },
];

export function AppLayout(): JSX.Element {
  return (
    <div className='min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100'>
      <header className='border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur'>
        <div className='mx-auto flex max-w-6xl items-center justify-between px-6 py-4'>
          <div>
            <h1 className='text-xl font-semibold tracking-tight'>Scrambling</h1>
            <p className='text-xs text-zinc-400'>MVP Web Shell</p>
          </div>
          <nav className='flex gap-2'>
            {navItems.map((item) => (
              <NavItem key={item.to} to={item.to}>
                {item.label}
              </NavItem>
            ))}
          </nav>
        </div>
      </header>

      <main className='mx-auto max-w-6xl px-6 py-8'>
        <Outlet />
      </main>
    </div>
  );
}
