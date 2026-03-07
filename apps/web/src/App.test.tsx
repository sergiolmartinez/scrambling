import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { AppLayout } from '@/app/layout';

describe('AppLayout', () => {
  it('renders shell navigation labels', () => {
    const client = new QueryClient();

    render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={['/setup']}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path='/setup' element={<div>Setup Page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText(/scrambling/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /setup/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /scoring/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /leaderboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /summary/i })).toBeInTheDocument();
  });
});
