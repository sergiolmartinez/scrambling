import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ScoringRoute } from '@/routes/scoring-route';
import { useRoundSessionStore } from '@/store/round-session';

const mocks = vi.hoisted(() => ({
  getRoundAggregate: vi.fn(),
  getLeaderboard: vi.fn(),
  getHoleContributions: vi.fn(),
  upsertHoleScore: vi.fn(),
  addShotContributions: vi.fn(),
  deleteContribution: vi.fn(),
  completeRound: vi.fn(),
}));

vi.mock('@/lib/api', () => ({
  apiClient: {
    getRoundAggregate: mocks.getRoundAggregate,
    getLeaderboard: mocks.getLeaderboard,
    getHoleContributions: mocks.getHoleContributions,
    upsertHoleScore: mocks.upsertHoleScore,
    addShotContributions: mocks.addShotContributions,
    deleteContribution: mocks.deleteContribution,
    completeRound: mocks.completeRound,
  },
}));

function renderScoring(): void {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <ScoringRoute />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  useRoundSessionStore.setState({ roundId: 99 });

  mocks.getRoundAggregate.mockReset();
  mocks.getLeaderboard.mockReset();
  mocks.getHoleContributions.mockReset();
  mocks.upsertHoleScore.mockReset();
  mocks.addShotContributions.mockReset();
  mocks.deleteContribution.mockReset();
  mocks.completeRound.mockReset();

  mocks.getRoundAggregate.mockResolvedValue({
    round: { id: 99, status: 'active', course_id: 7, started_at: null, completed_at: null, notes: null },
    course: {
      id: 7,
      external_course_id: null,
      name: 'Blue Hills',
      city: null,
      state: null,
      country: null,
      total_holes: 3,
      source: 'manual',
    },
    players: [
      { id: 1, round_id: 99, display_name: 'Alice', sort_order: 1 },
      { id: 2, round_id: 99, display_name: 'Bob', sort_order: 2 },
    ],
    hole_scores: [],
    contributions: [],
  });
  mocks.getLeaderboard.mockResolvedValue([
    { round_player_id: 1, display_name: 'Alice', total_contributions: 1 },
    { round_player_id: 2, display_name: 'Bob', total_contributions: 0 },
  ]);
  mocks.getHoleContributions.mockResolvedValue([]);
  mocks.upsertHoleScore.mockResolvedValue({
    id: 1,
    round_id: 99,
    hole_number: 1,
    score: 4,
    par_snapshot: 4,
    completed: true,
  });
  mocks.addShotContributions.mockResolvedValue([]);
  mocks.deleteContribution.mockResolvedValue(undefined);
  mocks.completeRound.mockResolvedValue({
    id: 99,
    status: 'completed',
    course_id: 7,
    started_at: null,
    completed_at: '2026-03-07T00:00:00Z',
    notes: null,
  });
});

describe('ScoringRoute', () => {
  it('navigates between holes', async () => {
    renderScoring();

    await waitFor(() => expect(screen.getByText(/hole 1 of 3/i)).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /next hole/i }));

    await waitFor(() => expect(screen.getByText(/hole 2 of 3/i)).toBeInTheDocument());
    expect(mocks.getHoleContributions).toHaveBeenCalledWith(99, 2);
  });

  it('submits hole score upsert payload', async () => {
    renderScoring();

    await waitFor(() => expect(screen.getByText(/hole 1 of 3/i)).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText('Score'), { target: { value: '4' } });
    fireEvent.change(screen.getByPlaceholderText('Par snapshot'), { target: { value: '4' } });
    fireEvent.click(screen.getByRole('checkbox', { name: /mark hole as completed/i }));
    fireEvent.click(screen.getByRole('button', { name: /save hole score/i }));

    await waitFor(() =>
      expect(mocks.upsertHoleScore).toHaveBeenCalledWith(99, 1, {
        score: 4,
        par_snapshot: 4,
        completed: true,
      }),
    );
  });

  it('adds contribution for multiple players on one shot', async () => {
    renderScoring();

    await waitFor(() => expect(screen.getByText(/hole 1 of 3/i)).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText('Shot number'), { target: { value: '2' } });
    fireEvent.change(screen.getByPlaceholderText('Shot type (optional)'), {
      target: { value: 'drive' },
    });

    const aliceLabel = screen.getByText('Alice').closest('label');
    const bobLabel = screen.getByText('Bob').closest('label');
    const aliceCheckbox = aliceLabel?.querySelector('input[type="checkbox"]') as HTMLInputElement;
    const bobCheckbox = bobLabel?.querySelector('input[type="checkbox"]') as HTMLInputElement;

    fireEvent.click(aliceCheckbox);
    fireEvent.click(bobCheckbox);
    fireEvent.click(screen.getByRole('button', { name: /add contributions/i }));

    await waitFor(() =>
      expect(mocks.addShotContributions).toHaveBeenCalledWith(99, 1, {
        shot_number: 2,
        round_player_ids: [1, 2],
        shot_type: 'drive',
      }),
    );
  });

  it('deletes an individual contribution row', async () => {
    mocks.getHoleContributions.mockResolvedValueOnce([
      { id: 21, round_id: 99, hole_number: 1, shot_number: 3, round_player_id: 2, shot_type: 'putt' },
    ]);

    renderScoring();

    await waitFor(() => expect(screen.getByText(/shot 3/i)).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /remove/i }));

    await waitFor(() => expect(mocks.deleteContribution).toHaveBeenCalledWith(99, 1, 3, 2));
  });

  it('completes round from scoring', async () => {
    renderScoring();

    await waitFor(() => expect(screen.getByText(/hole 1 of 3/i)).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /complete round/i }));

    await waitFor(() => expect(mocks.completeRound).toHaveBeenCalledWith(99));
  });
});
