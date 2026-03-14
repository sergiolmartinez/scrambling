import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ProfileRoute } from '@/routes/profile-route';

vi.mock('@/app/auth-state', () => ({
  useAuth: () => ({
    user: {
      id: 1,
      display_name: 'Sergio Martinez',
      email: 'sergio@example.com',
      created_at: '2026-03-01T00:00:00Z',
      updated_at: '2026-03-01T00:00:00Z',
    },
  }),
}));

describe('ProfileRoute', () => {
  it('renders account profile fields', () => {
    render(<ProfileRoute />);

    expect(screen.getByRole('heading', { name: /^profile$/i })).toBeInTheDocument();
    expect(screen.getByText(/sergio martinez/i)).toBeInTheDocument();
    expect(screen.getByText(/sergio@example.com/i)).toBeInTheDocument();
  });
});
