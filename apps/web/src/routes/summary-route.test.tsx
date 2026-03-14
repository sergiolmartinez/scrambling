import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SummaryRoute } from '@/routes/summary-route';
import { useRoundSessionStore } from '@/store/round-session';

const mocks = vi.hoisted(() => ({
  useSummaryQuery: vi.fn(),
}));

vi.mock('@/lib/queries', () => ({
  useSummaryQuery: mocks.useSummaryQuery,
}));

describe('SummaryRoute', () => {
  beforeEach(() => {
    useRoundSessionStore.setState({ roundId: 12 });

    mocks.useSummaryQuery.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        round: { id: 12, status: 'completed' },
        course: { id: 1, name: 'Pebble Beach' },
        players: [],
        hole_scores: [
          { id: 1, hole_number: 1, score: 4, par_snapshot: 4, completed: true },
          { id: 2, hole_number: 2, score: 5, par_snapshot: 4, completed: true },
        ],
        leaderboard: [
          { round_player_id: 3, display_name: 'Taylor', total_contributions: 6 },
          { round_player_id: 4, display_name: 'Jordan', total_contributions: 2 },
        ],
      },
    });
  });

  it('renders summary stats, leaderboard, and hole results', () => {
    render(
      <MemoryRouter>
        <SummaryRoute />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /round summary/i })).toBeInTheDocument();
    expect(screen.getByText(/round complete/i)).toBeInTheDocument();
    expect(screen.getByText(/pebble beach/i)).toBeInTheDocument();
    expect(screen.getByText(/total score/i)).toBeInTheDocument();
    expect(screen.getAllByText(/leader/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/hole 1/i)).toBeInTheDocument();
    expect(screen.getByText(/hole 2/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start new round/i })).toBeInTheDocument();
  });

  it('renders polished recap and locked summary context', () => {
    render(
      <MemoryRouter>
        <SummaryRoute />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /round summary/i })).toBeInTheDocument();
    expect(screen.getByText(/round complete/i)).toBeInTheDocument();
    expect(screen.getByText(/summary locked/i)).toBeInTheDocument();
    expect(screen.getByText(/pebble beach/i)).toBeInTheDocument();
    expect(screen.getByText(/final leaderboard snapshot/i)).toBeInTheDocument();
    expect(screen.getByText(/hole 1/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start new round/i })).toBeInTheDocument();
  });
});
