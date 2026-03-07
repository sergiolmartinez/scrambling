import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SetupRoute } from '@/routes/setup-route';
import { useRoundSessionStore } from '@/store/round-session';

const mocks = vi.hoisted(() => ({
  createRound: vi.fn(),
  searchCourses: vi.fn(),
  getRoundAggregate: vi.fn(),
  addPlayer: vi.fn(),
  updatePlayer: vi.fn(),
  deletePlayer: vi.fn(),
  assignCourse: vi.fn(),
}));

vi.mock('@/lib/api', () => ({
  apiClient: {
    createRound: mocks.createRound,
    searchCourses: mocks.searchCourses,
    getRoundAggregate: mocks.getRoundAggregate,
    addPlayer: mocks.addPlayer,
    updatePlayer: mocks.updatePlayer,
    deletePlayer: mocks.deletePlayer,
    assignCourse: mocks.assignCourse,
  },
}));

function renderSetup() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <SetupRoute />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  useRoundSessionStore.setState({ roundId: null });
  mocks.createRound.mockReset();
  mocks.searchCourses.mockReset();
  mocks.getRoundAggregate.mockReset();
  mocks.addPlayer.mockReset();
  mocks.updatePlayer.mockReset();
  mocks.deletePlayer.mockReset();
  mocks.assignCourse.mockReset();

  mocks.searchCourses.mockResolvedValue([]);
});

describe('SetupRoute', () => {
  it('creates round and stores ID in view', async () => {
    mocks.createRound.mockResolvedValueOnce({ id: 42 });
    mocks.getRoundAggregate.mockResolvedValue({
      round: { id: 42, status: 'draft', course_id: null, started_at: null, completed_at: null, notes: null },
      course: null,
      players: [],
      hole_scores: [],
      contributions: [],
    });

    renderSetup();
    fireEvent.click(screen.getByRole('button', { name: /create round/i }));

    await waitFor(() => {
      expect(screen.getByText(/current round id: 42/i)).toBeInTheDocument();
    });
  });

  it('disables add player when max 4 players already exist', async () => {
    useRoundSessionStore.setState({ roundId: 9 });
    mocks.getRoundAggregate.mockResolvedValue({
      round: { id: 9, status: 'draft', course_id: null, started_at: null, completed_at: null, notes: null },
      course: null,
      players: [
        { id: 1, round_id: 9, display_name: 'A', sort_order: 1 },
        { id: 2, round_id: 9, display_name: 'B', sort_order: 2 },
        { id: 3, round_id: 9, display_name: 'C', sort_order: 3 },
        { id: 4, round_id: 9, display_name: 'D', sort_order: 4 },
      ],
      hole_scores: [],
      contributions: [],
    });

    renderSetup();

    await waitFor(() => {
      expect(screen.getByText(/maximum of 4 players reached/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /add player/i })).toBeDisabled();
  });

  it('enables continue to scoring only when course and players are ready', async () => {
    useRoundSessionStore.setState({ roundId: 7 });
    mocks.getRoundAggregate.mockResolvedValue({
      round: { id: 7, status: 'active', course_id: 100, started_at: null, completed_at: null, notes: null },
      course: { id: 100, external_course_id: null, name: 'Pebble', city: null, state: null, country: null, total_holes: 18, source: 'manual' },
      players: [{ id: 1, round_id: 7, display_name: 'A', sort_order: 1 }],
      hole_scores: [],
      contributions: [],
    });

    renderSetup();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue to scoring/i })).toBeEnabled();
    });
  });

  it('shows locked message and disables setup mutations when round is completed', async () => {
    useRoundSessionStore.setState({ roundId: 11 });
    mocks.getRoundAggregate.mockResolvedValue({
      round: { id: 11, status: 'completed', course_id: 100, started_at: null, completed_at: null, notes: null },
      course: {
        id: 100,
        external_course_id: null,
        name: 'Pebble',
        city: null,
        state: null,
        country: null,
        total_holes: 18,
        source: 'manual',
      },
      players: [{ id: 1, round_id: 11, display_name: 'A', sort_order: 1 }],
      hole_scores: [],
      contributions: [],
    });

    renderSetup();

    await waitFor(() => {
      expect(screen.getByText(/completed and locked/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /add player/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /edit/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /remove/i })).toBeDisabled();
  });
});
