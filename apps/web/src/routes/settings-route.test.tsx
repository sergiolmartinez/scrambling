import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SettingsRoute } from '@/routes/settings-route';

const mocks = vi.hoisted(() => ({
  updateCurrentUser: vi.fn(),
  signOut: vi.fn(),
  refreshSession: vi.fn(),
  clearSession: vi.fn(),
}));

vi.mock('@/lib/api', () => ({
  apiClient: {
    updateCurrentUser: mocks.updateCurrentUser,
    signOut: mocks.signOut,
  },
}));

vi.mock('@/app/auth-state', () => ({
  useAuth: () => ({
    user: {
      id: 1,
      display_name: 'Sergio',
      email: 'sergio@example.com',
      created_at: '2026-03-01T00:00:00Z',
      updated_at: '2026-03-01T00:00:00Z',
    },
    clearSession: mocks.clearSession,
    refreshSession: mocks.refreshSession,
  }),
}));

vi.mock('@/app/theme-context', () => ({
  useTheme: () => ({
    mode: 'dark',
    resolvedTheme: 'dark',
    setMode: vi.fn(),
  }),
}));

function renderSettings(): void {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <SettingsRoute />
    </QueryClientProvider>,
  );
}

describe('SettingsRoute', () => {
  it('updates display name', async () => {
    mocks.updateCurrentUser.mockResolvedValue({
      id: 1,
      display_name: 'Sergio M',
      email: 'sergio@example.com',
      created_at: '2026-03-01T00:00:00Z',
      updated_at: '2026-03-01T00:00:00Z',
    });
    mocks.refreshSession.mockResolvedValue(null);

    renderSettings();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Sergio M' } });
    fireEvent.click(screen.getByRole('button', { name: /^save$/i }));

    await waitFor(() =>
      expect(mocks.updateCurrentUser).toHaveBeenCalledWith({ display_name: 'Sergio M' }),
    );
  });
});
