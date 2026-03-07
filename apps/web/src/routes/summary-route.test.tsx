import { render, screen } from '@testing-library/react';
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
    render(<SummaryRoute />);

    expect(screen.getByText(/round summary/i)).toBeInTheDocument();
    expect(screen.getByText(/pebble beach/i)).toBeInTheDocument();
    expect(screen.getByText(/total score/i)).toBeInTheDocument();
    expect(screen.getByText(/#1 Taylor/i)).toBeInTheDocument();
    expect(screen.getByText(/hole 1/i)).toBeInTheDocument();
    expect(screen.getByText(/hole 2/i)).toBeInTheDocument();
  });
});
