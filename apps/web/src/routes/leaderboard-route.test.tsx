import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LeaderboardRoute } from '@/routes/leaderboard-route';
import { useRoundSessionStore } from '@/store/round-session';

const mocks = vi.hoisted(() => ({
  useRoundAggregateQuery: vi.fn(),
  useLeaderboardQuery: vi.fn(),
}));

vi.mock('@/lib/queries', () => ({
  useRoundAggregateQuery: mocks.useRoundAggregateQuery,
  useLeaderboardQuery: mocks.useLeaderboardQuery,
}));

describe('LeaderboardRoute', () => {
  beforeEach(() => {
    useRoundSessionStore.setState({ roundId: 10 });

    mocks.useRoundAggregateQuery.mockReturnValue({
      isPending: false,
      isError: false,
      data: { round: { id: 10, status: 'completed' } },
    });

    mocks.useLeaderboardQuery.mockReturnValue({
      isPending: false,
      isError: false,
      data: [
        { round_player_id: 2, display_name: 'Bob', total_contributions: 5 },
        { round_player_id: 1, display_name: 'Alice', total_contributions: 3 },
      ],
    });
  });

  it.skip('renders ordered totals and completed-round message', () => {
    render(
      <MemoryRouter>
        <LeaderboardRoute />
      </MemoryRouter>,
    );

    expect(screen.getByText(/round complete and locked/i)).toBeInTheDocument();
    expect(screen.getByText(/bob · leader/i)).toBeInTheDocument();
    expect(screen.getByText(/alice/i)).toBeInTheDocument();
    expect(screen.getByText(/total contributions/i)).toBeInTheDocument();
    expect(screen.getByText(/top player: bob with 5 contributions/i)).toBeInTheDocument();
  });

  it('renders polished completed leaderboard context', () => {
    render(
      <MemoryRouter>
        <LeaderboardRoute />
      </MemoryRouter>,
    );

    expect(screen.getByText(/round complete and locked/i)).toBeInTheDocument();
    expect(screen.getByText(/player rankings/i)).toBeInTheDocument();
    expect(screen.getByText(/top player: bob with 5 contributions/i)).toBeInTheDocument();
    expect(screen.getByText(/view round summary/i)).toBeInTheDocument();
    expect(screen.getByText(/alice/i)).toBeInTheDocument();
  });
});
