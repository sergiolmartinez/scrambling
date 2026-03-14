import type { PropsWithChildren } from 'react';
import { useEffect, useMemo, useState } from 'react';

import { ThemeContext } from '@/app/theme-context';
import type { ResolvedTheme, ThemeContextValue, ThemeMode } from '@/app/theme-context';

const STORAGE_KEY = 'scrambling-theme-mode';
const mediaQuery = '(prefers-color-scheme: dark)';

export function ThemeProvider({ children }: PropsWithChildren): JSX.Element {
  const [mode, setMode] = useState<ThemeMode>(() => readStoredMode());
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => getSystemPrefersDark());

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return;
    }

    const media = window.matchMedia(mediaQuery);
    const onChange = (event: MediaQueryListEvent): void => setSystemPrefersDark(event.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const resolvedTheme: ResolvedTheme = mode === 'system' ? (systemPrefersDark ? 'dark' : 'light') : mode;

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }, [resolvedTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      resolvedTheme,
      setMode,
    }),
    [mode, resolvedTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function readStoredMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'system';
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'system';
}

function getSystemPrefersDark(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia(mediaQuery).matches;
}
