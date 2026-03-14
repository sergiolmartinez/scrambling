import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProtectedRoute, PublicOnlyRoute } from '@/app/auth-guard';

const authState = {
  isAuthenticated: false,
  isLoading: false,
};

vi.mock('@/app/auth-state', () => ({
  useAuth: () => ({
    user: authState.isAuthenticated ? { id: 1, display_name: 'Sergio' } : null,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    refreshSession: vi.fn(),
    clearSession: vi.fn(),
  }),
}));

describe('auth guards', () => {
  beforeEach(() => {
    authState.isAuthenticated = false;
    authState.isLoading = false;
  });

  it('redirects unauthenticated users to sign in', () => {
    render(
      <MemoryRouter initialEntries={['/setup']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path='/setup' element={<div>Setup Content</div>} />
          </Route>
          <Route path='/sign-in' element={<div>Sign In Screen</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/sign in screen/i)).toBeInTheDocument();
  });

  it('allows authenticated users to see protected routes', () => {
    authState.isAuthenticated = true;

    render(
      <MemoryRouter initialEntries={['/setup']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path='/setup' element={<div>Setup Content</div>} />
          </Route>
          <Route path='/sign-in' element={<div>Sign In Screen</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/setup content/i)).toBeInTheDocument();
  });

  it('redirects authenticated users away from public auth screens', () => {
    authState.isAuthenticated = true;

    render(
      <MemoryRouter initialEntries={['/sign-in']}>
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path='/sign-in' element={<div>Sign In Screen</div>} />
          </Route>
          <Route path='/setup' element={<div>Setup Content</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/setup content/i)).toBeInTheDocument();
  });
});
