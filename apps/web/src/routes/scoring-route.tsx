import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { HoleHeader } from '@/components/scoring/hole-header';
import { EmptyState } from '@/components/state/empty-state';
import { ErrorState } from '@/components/state/error-state';
import { LoadingState } from '@/components/state/loading-state';
import { SaveStatusBadge, type SaveStatus } from '@/components/state/save-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { StickyActionBar } from '@/components/ui/sticky-action-bar';
import { apiClient } from '@/lib/api';
import { useLeaderboardQuery, useRoundAggregateQuery } from '@/lib/queries';
import { useRoundSessionStore } from '@/store/round-session';

const holeScoreSchema = z.object({
  score: z.number().int().min(1).max(20).nullable(),
  par_snapshot: z.number().int().min(1).max(10).nullable(),
  completed: z.boolean(),
});

const contributionSchema = z.object({
  shot_number: z.number().int().min(1).max(20),
  shot_type: z.string().max(64).optional(),
});

type HoleScoreFormValues = z.infer<typeof holeScoreSchema>;
type ContributionFormValues = z.infer<typeof contributionSchema>;
type HoleContribution = Awaited<ReturnType<typeof apiClient.getHoleContributions>>[number];

export function ScoringRoute(): JSX.Element {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const roundId = useRoundSessionStore((state) => state.roundId);
  const aggregate = useRoundAggregateQuery();
  const leaderboard = useLeaderboardQuery();

  const [currentHole, setCurrentHole] = useState(1);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([]);
  const [scoreError, setScoreError] = useState<string | null>(null);
  const [contributionError, setContributionError] = useState<string | null>(null);
  const [scoreSavedAt, setScoreSavedAt] = useState<number | null>(null);
  const [contributionSavedAt, setContributionSavedAt] = useState<number | null>(null);
  const [savedHoleState, setSavedHoleState] = useState<Record<number, HoleScoreFormValues>>({});

  const totalHoles = aggregate.data?.course?.total_holes ?? 18;

  useEffect(() => {
    if (currentHole > totalHoles) {
      setCurrentHole(totalHoles);
    }
  }, [currentHole, totalHoles]);

  useEffect(() => {
    setSavedHoleState({});
  }, [roundId]);

  const holeContributions = useQuery({
    queryKey: ['hole-contributions', roundId, currentHole],
    queryFn: () => apiClient.getHoleContributions(roundId as number, currentHole),
    enabled: roundId !== null,
  });

  const currentHoleScore = useMemo(
    () => aggregate.data?.hole_scores.find((score) => score.hole_number === currentHole) ?? null,
    [aggregate.data?.hole_scores, currentHole],
  );

  const scoreForm = useForm<HoleScoreFormValues>({
    resolver: zodResolver(holeScoreSchema),
    defaultValues: { score: null, par_snapshot: null, completed: false },
  });

  useEffect(() => {
    const localSaved = savedHoleState[currentHole];
    scoreForm.reset({
      score: localSaved?.score ?? currentHoleScore?.score ?? null,
      par_snapshot: localSaved?.par_snapshot ?? currentHoleScore?.par_snapshot ?? null,
      completed: localSaved?.completed ?? currentHoleScore?.completed ?? false,
    });
  }, [currentHole, currentHoleScore, savedHoleState, scoreForm]);

  const contributionForm = useForm<ContributionFormValues>({
    resolver: zodResolver(contributionSchema),
    defaultValues: { shot_number: 1, shot_type: '' },
  });

  const upsertHoleScore = useMutation({
    mutationFn: (payload: HoleScoreFormValues) => {
      const normalized = {
        score: payload.score,
        par_snapshot: payload.par_snapshot,
        completed: payload.completed,
      };
      return apiClient.upsertHoleScore(roundId as number, currentHole, normalized);
    },
    onSuccess: async (saved) => {
      setScoreError(null);
      setScoreSavedAt(Date.now());
      setSavedHoleState((previous) => ({
        ...previous,
        [currentHole]: {
          score: saved.score ?? null,
          par_snapshot: saved.par_snapshot ?? null,
          completed: saved.completed,
        },
      }));
      await queryClient.invalidateQueries({ queryKey: ['round-aggregate', roundId] });
    },
    onError: (error: Error) => setScoreError(error.message),
  });

  const addContributions = useMutation({
    mutationFn: (payload: ContributionFormValues) =>
      apiClient.addShotContributions(roundId as number, currentHole, {
        shot_number: payload.shot_number,
        round_player_ids: selectedPlayerIds,
        shot_type: payload.shot_type ? payload.shot_type : null,
      }),
    onSuccess: async () => {
      setContributionError(null);
      setContributionSavedAt(Date.now());
      setSelectedPlayerIds([]);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['round-aggregate', roundId] }),
        queryClient.invalidateQueries({ queryKey: ['hole-contributions', roundId, currentHole] }),
        queryClient.invalidateQueries({ queryKey: ['leaderboard', roundId] }),
      ]);
    },
    onError: (error: Error) => setContributionError(error.message),
  });

  const deleteContribution = useMutation({
    mutationFn: (payload: { shotNumber: number; playerId: number }) =>
      apiClient.deleteContribution(roundId as number, currentHole, payload.shotNumber, payload.playerId),
    onSuccess: async () => {
      setContributionError(null);
      setContributionSavedAt(Date.now());
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['round-aggregate', roundId] }),
        queryClient.invalidateQueries({ queryKey: ['hole-contributions', roundId, currentHole] }),
        queryClient.invalidateQueries({ queryKey: ['leaderboard', roundId] }),
      ]);
    },
    onError: (error: Error) => setContributionError(error.message),
  });

  const completeRound = useMutation({
    mutationFn: () => apiClient.completeRound(roundId as number),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['round-aggregate', roundId] }),
        queryClient.invalidateQueries({ queryKey: ['leaderboard', roundId] }),
        queryClient.invalidateQueries({ queryKey: ['summary', roundId] }),
      ]);
      navigate('/summary');
    },
    onError: (error: Error) => setScoreError(error.message),
  });

  if (roundId === null) {
    return <EmptyState title='No active round' description='Create a round in Setup before scoring.' />;
  }

  if (aggregate.isPending || leaderboard.isPending) {
    return <LoadingState title='Scoring' />;
  }

  if (aggregate.isError) {
    return <ErrorState message='Failed to load round aggregate for scoring.' />;
  }

  if (leaderboard.isError) {
    return <ErrorState message='Failed to load leaderboard data for scoring.' />;
  }

  if (aggregate.data.players.length === 0) {
    return <EmptyState title='No players' description='Add players in Setup before scoring.' />;
  }

  if (!aggregate.data.course) {
    return <EmptyState title='No course assigned' description='Assign a course in Setup before scoring.' />;
  }

  const playerMap = new Map(aggregate.data.players.map((player) => [player.id, player.display_name]));
  const holeScoreTotal = aggregate.data.hole_scores.reduce((sum, score) => sum + (score.score ?? 0), 0);
  const holesCompleted = aggregate.data.hole_scores.filter((score) => score.completed).length;
  const groupedContributions = groupContributionsByShot(holeContributions.data ?? []);
  const isLocked = aggregate.data.round.status === 'completed';
  const isSyncing =
    upsertHoleScore.isPending ||
    addContributions.isPending ||
    deleteContribution.isPending ||
    holeContributions.isFetching;
  const online = window.navigator.onLine;

  const overallStatus: SaveStatus = !online
    ? 'offline'
    : scoreError || contributionError
      ? 'error'
      : isSyncing
        ? 'syncing'
        : scoreSavedAt || contributionSavedAt
          ? 'saved'
          : 'idle';

  const scoreStatus: SaveStatus = !online
    ? 'offline'
    : scoreError
      ? 'error'
      : upsertHoleScore.isPending
        ? 'saving'
        : scoreSavedAt
          ? 'saved'
          : 'idle';

  const contributionStatus: SaveStatus = !online
    ? 'offline'
    : contributionError
      ? 'error'
      : addContributions.isPending || deleteContribution.isPending
        ? 'saving'
        : contributionSavedAt
          ? 'saved'
          : 'idle';

  return (
    <div className='space-y-6'>
      <Card>
        <HoleHeader
          currentHole={currentHole}
          totalHoles={totalHoles}
          courseName={aggregate.data.course.name}
          roundStatus={aggregate.data.round.status}
          holeCompleted={currentHoleScore?.completed ?? false}
          parSnapshot={currentHoleScore?.par_snapshot ?? null}
        />

        <div className='mt-4 flex flex-wrap items-center gap-2 sm:gap-3'>
          <Button
            type='button'
            variant='outline'
            onClick={() => setCurrentHole((value) => Math.max(1, value - 1))}
            disabled={currentHole <= 1}
            className='min-h-11'
          >
            Previous Hole
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => setCurrentHole((value) => Math.min(totalHoles, value + 1))}
            disabled={currentHole >= totalHoles}
            className='min-h-11'
          >
            Next Hole
          </Button>
          <SaveStatusBadge
            status={overallStatus}
            savedAt={Math.max(scoreSavedAt ?? 0, contributionSavedAt ?? 0) || null}
            errorMessage={scoreError ?? contributionError}
            idleLabel='Waiting for changes'
          />
          <Button
            type='button'
            variant='primary'
            onClick={() => completeRound.mutate()}
            disabled={isLocked || completeRound.isPending}
            className='min-h-11 sm:ml-auto'
          >
            {completeRound.isPending ? 'Completing...' : 'Complete Round'}
          </Button>
        </div>

        <div className='mt-4 grid gap-3 text-sm sm:grid-cols-3'>
          <div className='rounded-md border border-slate-700/70 bg-slate-900/40 px-3 py-2'>
            <p className='text-slate-400'>Running score</p>
            <p className='text-lg font-semibold'>{holeScoreTotal}</p>
          </div>
          <div className='rounded-md border border-slate-700/70 bg-slate-900/40 px-3 py-2'>
            <p className='text-slate-400'>Holes completed</p>
            <p className='text-lg font-semibold'>
              {holesCompleted}/{totalHoles}
            </p>
          </div>
          <div className='rounded-md border border-slate-700/70 bg-slate-900/40 px-3 py-2'>
            <p className='text-slate-400'>Contributions on hole</p>
            <p className='text-lg font-semibold'>{holeContributions.data?.length ?? 0}</p>
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle>Hole {currentHole} Score</CardTitle>
        <CardDescription>Capture score and hole completion for the current hole.</CardDescription>

        <form
          className='mt-4 grid gap-3'
          onSubmit={scoreForm.handleSubmit((values) => upsertHoleScore.mutate(values))}
        >
          <div className='grid gap-3 sm:grid-cols-2'>
            <Input
              type='number'
              min={1}
              max={20}
              disabled={isLocked}
              placeholder='Score'
              {...scoreForm.register('score', { setValueAs: toNullableNumber })}
            />
            <Input
              type='number'
              min={1}
              max={10}
              disabled={isLocked}
              placeholder='Par snapshot'
              {...scoreForm.register('par_snapshot', { setValueAs: toNullableNumber })}
            />
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            <Button type='submit' variant='primary' disabled={isLocked || upsertHoleScore.isPending} className='min-h-11'>
              {upsertHoleScore.isPending ? 'Saving...' : 'Save Hole Score'}
            </Button>
            <SaveStatusBadge
              status={scoreStatus}
              errorMessage={scoreError}
              savedAt={scoreSavedAt}
              idleLabel='No score changes yet'
            />
          </div>

          <label className='col-span-full flex items-center gap-2 text-sm text-zinc-300'>
            <input className='h-4 w-4' disabled={isLocked} type='checkbox' {...scoreForm.register('completed')} />
            Mark hole as completed
          </label>
        </form>

        {isLocked ? (
          <p className='mt-2 rounded-md border border-slate-700/70 bg-slate-900/40 px-3 py-2 text-sm text-zinc-400'>
            Round is completed and locked for edits.
          </p>
        ) : null}
        {scoreError ? <p className='mt-2 rounded-md border border-rose-300/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-200'>{scoreError}</p> : null}
      </Card>

      <Card>
        <CardTitle>Shot Contributions</CardTitle>
        <CardDescription>Select one or more players who contributed to a shot.</CardDescription>

        <form
          className='mt-4 grid gap-3'
          onSubmit={contributionForm.handleSubmit((values) => addContributions.mutate(values))}
        >
          <div className='grid gap-3 sm:grid-cols-2'>
            <Input
              type='number'
              min={1}
              max={20}
              disabled={isLocked}
              placeholder='Shot number'
              {...contributionForm.register('shot_number', { valueAsNumber: true })}
            />
            <Input disabled={isLocked} placeholder='Shot type (optional)' {...contributionForm.register('shot_type')} />
          </div>

          <div className='grid gap-2 sm:grid-cols-2'>
            {aggregate.data.players.map((player) => {
              const selected = selectedPlayerIds.includes(player.id);
              return (
                <label
                  className={`flex cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-sm ${
                    selected
                      ? 'border-cyan-300/50 bg-cyan-400/10 text-cyan-100'
                      : 'border-zinc-800 bg-slate-900/35'
                  }`}
                  key={player.id}
                >
                  <span>{player.display_name}</span>
                  <input
                    type='checkbox'
                    checked={selected}
                    disabled={isLocked}
                    onChange={(event) => {
                      setSelectedPlayerIds((previous) =>
                        event.target.checked
                          ? [...previous, player.id]
                          : previous.filter((id) => id !== player.id),
                      );
                    }}
                  />
                </label>
              );
            })}
          </div>

          <Button
            type='submit'
            variant='primary'
            className='min-h-11 sm:max-w-xs'
            disabled={isLocked || addContributions.isPending || selectedPlayerIds.length === 0}
          >
            {addContributions.isPending ? 'Saving Contributions...' : 'Add Contributions'}
          </Button>
          <SaveStatusBadge
            status={contributionStatus}
            errorMessage={contributionError}
            savedAt={contributionSavedAt}
            idleLabel='No contribution changes yet'
          />
        </form>

        {contributionError ? (
          <p className='mt-2 rounded-md border border-rose-300/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-200'>
            {contributionError}
          </p>
        ) : null}

        <div className='mt-4 space-y-2'>
          {holeContributions.isPending ? (
            <div className='rounded-md border border-sky-300/30 bg-sky-400/10 px-3 py-2 text-sm text-sky-100'>
              Loading contributions...
            </div>
          ) : null}
          {holeContributions.isError ? (
            <ErrorState message='Failed to load contributions for this hole.' />
          ) : null}
          {!holeContributions.isPending && !holeContributions.isError && groupedContributions.length === 0 ? (
            <EmptyState title='No contributions yet' description='Add a shot contribution to start tracking.' />
          ) : null}

          {groupedContributions.map((group) => (
            <div className='rounded-md border border-zinc-800 bg-slate-900/35 px-3 py-2' key={group.shotNumber}>
              <p className='text-sm font-medium'>Shot {group.shotNumber}</p>
              <div className='mt-2 space-y-2'>
                {group.rows.map((row) => (
                  <div className='flex items-center justify-between text-sm' key={row.id}>
                    <span>
                      {playerMap.get(row.round_player_id) ?? `Player ${row.round_player_id}`}
                      {row.shot_type ? ` (${row.shot_type})` : ''}
                    </span>
                    <Button
                      type='button'
                      variant='outline'
                      disabled={isLocked || deleteContribution.isPending}
                      onClick={() =>
                        deleteContribution.mutate({
                          shotNumber: row.shot_number,
                          playerId: row.round_player_id,
                        })
                      }
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle>Leaderboard Snapshot</CardTitle>
        <CardDescription>Latest contribution totals while scoring.</CardDescription>

        <ol className='mt-4 space-y-2'>
          {leaderboard.data.map((entry, index) => (
            <li
              className='flex items-center justify-between rounded-md border border-zinc-800 px-3 py-2 text-sm'
              key={entry.round_player_id}
            >
              <span>
                #{index + 1} {entry.display_name}
              </span>
              <span className='font-semibold'>{entry.total_contributions}</span>
            </li>
          ))}
        </ol>
      </Card>

      <StickyActionBar>
        <Button
          type='button'
          variant='outline'
          onClick={() => setCurrentHole((value) => Math.max(1, value - 1))}
          disabled={currentHole <= 1}
          className='min-h-11 flex-1'
        >
          Prev
        </Button>
        <Button
          type='button'
          variant='primary'
          onClick={() => setCurrentHole((value) => Math.min(totalHoles, value + 1))}
          disabled={currentHole >= totalHoles}
          className='min-h-11 flex-1'
        >
          Next
        </Button>
      </StickyActionBar>
    </div>
  );
}

function toNullableNumber(value: string): number | null {
  if (value === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function groupContributionsByShot(
  contributions: HoleContribution[],
): Array<{ shotNumber: number; rows: HoleContribution[] }> {
  const map = new Map<number, HoleContribution[]>();
  for (const contribution of contributions) {
    const existing = map.get(contribution.shot_number) ?? [];
    existing.push(contribution);
    map.set(contribution.shot_number, existing);
  }

  return Array.from(map.entries())
    .sort((left, right) => left[0] - right[0])
    .map(([shotNumber, rows]) => ({ shotNumber, rows }));
}
