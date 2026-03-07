import { render, screen } from '@testing-library/react';
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

  it('renders ordered totals and completed-round message', () => {
    render(<LeaderboardRoute />);

    expect(screen.getByText(/round is completed; leaderboard is final/i)).toBeInTheDocument();
    expect(screen.getByText(/#1 Bob/i)).toBeInTheDocument();
    expect(screen.getByText(/#2 Alice/i)).toBeInTheDocument();
    expect(screen.getByText(/total contributions/i)).toBeInTheDocument();
  });
});
