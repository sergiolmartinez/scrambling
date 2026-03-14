import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/app/auth-state';
import { NavItem } from '@/components/ui/nav-item';
import { StatusBadge } from '@/components/ui/status-badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { LogOutIcon } from '@/components/ui/icons';
import { apiClient } from '@/lib/api';

const navItems = [
  { to: '/setup', label: 'Setup', shortLabel: '1' },
  { to: '/scoring', label: 'Scoring', shortLabel: '2' },
  { to: '/leaderboard', label: 'Leaderboard', shortLabel: '3' },
  { to: '/summary', label: 'Summary', shortLabel: '4' },
];

const accountNavItems = [
  { to: '/profile', label: 'Profile' },
  { to: '/settings', label: 'Settings' },
];

export function AppLayout(): JSX.Element {
  const location = useLocation();
  const [isOnline, setIsOnline] = useState<boolean>(() => window.navigator.onLine);
  const { clearSession, user } = useAuth();

  useEffect(() => {
    const onOnline = (): void => setIsOnline(true);
    const onOffline = (): void => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  return (
    <div className='min-h-screen text-[var(--color-text)]'>
      <header className='sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur-xl'>
        <div className='mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6'>
          <div className='space-y-1'>
            <p className='text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]'>Scrambling</p>
            <h1 className='text-xl font-semibold tracking-tight text-[var(--color-text)]'>Round Control Center</h1>
            <p className='text-xs text-[var(--color-text-muted)]'>MVP flow: setup to final summary</p>
          </div>
          <div className='flex flex-wrap items-center gap-3'>
            {user ? <StatusBadge tone='neutral'>{user.display_name}</StatusBadge> : null}
            <ThemeToggle />
            <StatusBadge tone={isOnline ? 'success' : 'warning'}>{isOnline ? 'Online' : 'Offline'}</StatusBadge>
            <Button
              type='button'
              variant='outline'
              className='min-h-10 gap-1.5 px-3 text-xs sm:text-sm'
              onClick={async () => {
                try {
                  await apiClient.signOut();
                } finally {
                  clearSession();
                }
              }}
            >
              <LogOutIcon className='h-4 w-4' />
              Sign Out
            </Button>
          </div>
          <nav className='flex flex-wrap gap-2 md:ml-auto'>
            {navItems.map((item) => (
              <NavItem key={item.to} to={item.to}>
                <span className='mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-[var(--color-border)] text-[11px] font-semibold'>
                  {item.shortLabel}
                </span>
                {item.label}
              </NavItem>
            ))}
            {accountNavItems.map((item) => (
              <NavItem key={item.to} to={item.to}>
                {item.label}
              </NavItem>
            ))}
          </nav>
        </div>
        <div className='mx-auto max-w-6xl px-4 pb-4 md:px-6'>
          <div className='h-1.5 rounded-full bg-[var(--color-surface-muted)]'>
            <div
              className='h-full rounded-full bg-[var(--color-primary)] transition-all'
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
  if (pathname.startsWith('/profile') || pathname.startsWith('/settings')) {
    return 100;
  }

  const index = navItems.findIndex((item) => pathname.startsWith(item.to));
  if (index === -1) {
    return 25;
  }
  return ((index + 1) / navItems.length) * 100;
}
