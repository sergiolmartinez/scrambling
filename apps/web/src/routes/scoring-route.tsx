import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { HoleHeader } from '@/components/scoring/hole-header';
import { SaveStatusBadge as LegacySaveStatusBadge } from '@/components/scoring/save-status-badge';
import { SHOT_TYPE_OPTIONS, ShotTypeSelect } from '@/components/scoring/shot-type-select';
import { StickyActionBar as LegacyStickyActionBar } from '@/components/scoring/sticky-action-bar';
import { EmptyState } from '@/components/state/empty-state';
import { ErrorState } from '@/components/state/error-state';
import { LoadingState } from '@/components/state/loading-state';
import { SaveStatusBadge, type SaveStatus } from '@/components/state/save-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { ChevronLeftIcon, ChevronRightIcon, TargetIcon } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
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

const PRIMARY_SHOT_TYPES = ['Drive', 'Approach', 'Chip', 'Putt', 'Gimme', 'Penalty'];

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
    onError: () => setScoreError("Couldn't save this hole. Try again."),
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
    onError: () => setContributionError("Couldn't save those contributions. Try again."),
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
    onError: () => setContributionError("Couldn't remove that contribution. Try again."),
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
    onError: () => setScoreError("Couldn't complete the round yet. Try again."),
  });

  if (roundId === null) {
    return <EmptyState title='No round yet' description='Start a round in Setup, then come back to score.' />;
  }

  if (aggregate.isPending || leaderboard.isPending) {
    return <LoadingState title='Scoring' />;
  }

  if (aggregate.isError) {
    return <ErrorState message="Couldn't load scoring details right now." />;
  }

  if (leaderboard.isError) {
    return <ErrorState message="Couldn't load the leaderboard right now." />;
  }

  if (aggregate.data.players.length === 0) {
    return <EmptyState title='No players yet' description='Add players in Setup before scoring.' />;
  }

  if (!aggregate.data.course) {
    return <EmptyState title='No course selected' description='Pick a course in Setup before scoring.' />;
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

  const selectedShotType = contributionForm.watch('shot_type') ?? '';
  const quickShotTypes = PRIMARY_SHOT_TYPES.filter((type) =>
    SHOT_TYPE_OPTIONS.includes(type as (typeof SHOT_TYPE_OPTIONS)[number]),
  );

  return (
    <div className='space-y-5 pb-4'>
      <Card>
        <HoleHeader
          currentHole={currentHole}
          totalHoles={totalHoles}
          courseName={aggregate.data.course.name}
          roundStatus={aggregate.data.round.status}
          holeCompleted={currentHoleScore?.completed ?? false}
          parSnapshot={currentHoleScore?.par_snapshot ?? null}
        />

        <div className='mt-4 flex flex-wrap items-center gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => setCurrentHole((value) => Math.max(1, value - 1))}
            disabled={currentHole <= 1}
            className='min-h-11'
          >
            <ChevronLeftIcon className='mr-1 h-4 w-4' />
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
            <ChevronRightIcon className='ml-1 h-4 w-4' />
          </Button>
          <SaveStatusBadge
            status={overallStatus}
            savedAt={Math.max(scoreSavedAt ?? 0, contributionSavedAt ?? 0) || null}
            errorMessage={scoreError ?? contributionError}
            idleLabel='Ready to score'
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
          <div className='rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2'>
            <p className='text-[var(--color-text-muted)]'>Running score</p>
            <p className='text-lg font-semibold text-[var(--color-text)]'>{holeScoreTotal}</p>
          </div>
          <div className='rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2'>
            <p className='text-[var(--color-text-muted)]'>Holes completed</p>
            <p className='text-lg font-semibold text-[var(--color-text)]'>
              {holesCompleted}/{totalHoles}
            </p>
          </div>
          <div className='rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2'>
            <p className='text-[var(--color-text-muted)]'>Contributions on this hole</p>
            <p className='text-lg font-semibold text-[var(--color-text)]'>{holeContributions.data?.length ?? 0}</p>
          </div>
        </div>
      </Card>

      <div className='grid gap-5 lg:grid-cols-[1.2fr_1fr]'>
        <div className='space-y-5'>
          <Card>
            <CardTitle>Hole Score</CardTitle>
            <CardDescription>Set score and par, then mark the hole complete.</CardDescription>

            <form
              className='mt-4 grid gap-3'
              onSubmit={scoreForm.handleSubmit((values) => upsertHoleScore.mutate(values))}
            >
              <div className='grid gap-3 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <label className='text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]'>Score</label>
                  <Input
                    type='number'
                    min={1}
                    max={20}
                    disabled={isLocked}
                    placeholder='Score'
                    {...scoreForm.register('score', { setValueAs: toNullableNumber })}
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]'>Par</label>
                  <Input
                    type='number'
                    min={1}
                    max={10}
                    disabled={isLocked}
                    placeholder='Par snapshot'
                    {...scoreForm.register('par_snapshot', { setValueAs: toNullableNumber })}
                  />
                </div>
              </div>

              <label className='col-span-full flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-3 text-sm text-[var(--color-text)]'>
                <input className='h-4 w-4' disabled={isLocked} type='checkbox' {...scoreForm.register('completed')} />
                Mark hole as completed
              </label>

              <div className='flex flex-wrap items-center gap-2'>
                <Button
                  type='submit'
                  variant='primary'
                  disabled={isLocked || upsertHoleScore.isPending}
                  className='min-h-11'
                >
                  {upsertHoleScore.isPending ? 'Saving...' : 'Save Hole Score'}
                </Button>
                <LegacySaveStatusBadge
                  isSaving={upsertHoleScore.isPending}
                  error={scoreError}
                  savedAt={scoreSavedAt}
                  idleLabel='No score changes yet'
                />
              </div>
            </form>

            {isLocked ? (
              <p className='mt-2 rounded-md border border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] px-3 py-2 text-sm text-[var(--color-warning-text)]'>
                This round is complete and locked.
              </p>
            ) : null}
          </Card>

          <Card>
            <CardTitle>
              <span className='inline-flex items-center gap-2'>
                <TargetIcon className='h-4 w-4 text-[var(--color-primary)]' />
                Shot Contributions
              </span>
            </CardTitle>
            <CardDescription>Pick a shot, choose players, and save.</CardDescription>

            <form
              className='mt-4 grid gap-4'
              onSubmit={contributionForm.handleSubmit((values) => addContributions.mutate(values))}
            >
              <div className='grid gap-3 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <label className='text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]'>Shot Number</label>
                  <Input
                    type='number'
                    min={1}
                    max={20}
                    disabled={isLocked}
                    placeholder='Shot number'
                    {...contributionForm.register('shot_number', { valueAsNumber: true })}
                  />
                </div>
                <ShotTypeSelect
                  value={selectedShotType}
                  disabled={isLocked}
                  onChange={(value) => contributionForm.setValue('shot_type', value, { shouldDirty: true })}
                />
              </div>

              <div className='space-y-2'>
                <p className='text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]'>Quick Shot Types</p>
                <div className='flex flex-wrap gap-2'>
                  {quickShotTypes.map((type) => {
                    const selected = selectedShotType === type;
                    return (
                      <button
                        key={type}
                        type='button'
                        onClick={() =>
                          contributionForm.setValue('shot_type', selected ? '' : type, {
                            shouldDirty: true,
                          })
                        }
                        disabled={isLocked}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                          selected
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)]'
                            : 'border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className='space-y-2'>
                <p className='text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]'>Who contributed?</p>
                <div className='grid gap-2 sm:grid-cols-2'>
                  {aggregate.data.players.map((player) => {
                    const selected = selectedPlayerIds.includes(player.id);
                    return (
                      <label
                        className={`flex min-h-11 cursor-pointer items-center justify-between rounded-xl border px-3 py-2 text-sm ${
                          selected
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/15 text-[var(--color-text)]'
                            : 'border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-text)]'
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
                {selectedPlayerIds.length === 0 ? (
                  <p className='text-xs text-[var(--color-text-muted)]'>Select at least one player.</p>
                ) : null}
              </div>

              <div className='flex flex-wrap items-center gap-2'>
                <Button
                  type='submit'
                  variant='primary'
                  className='min-h-11 sm:max-w-xs'
                  disabled={isLocked || addContributions.isPending || selectedPlayerIds.length === 0}
                >
                  {addContributions.isPending ? 'Saving...' : 'Add Contributions'}
                </Button>
                <LegacySaveStatusBadge
                  isSaving={addContributions.isPending || deleteContribution.isPending}
                  error={contributionError}
                  savedAt={contributionSavedAt}
                  idleLabel='No contribution changes yet'
                />
              </div>
            </form>

            <div className='mt-4 space-y-2'>
              {holeContributions.isPending ? (
                <StatusBadge tone='info'>Loading contributions...</StatusBadge>
              ) : null}
              {holeContributions.isError ? (
                <ErrorState message="Couldn't load contributions for this hole." />
              ) : null}
              {!holeContributions.isPending && !holeContributions.isError && groupedContributions.length === 0 ? (
                <EmptyState title='No contributions yet' description='Add a shot contribution to get started.' />
              ) : null}

              {groupedContributions.map((group) => (
                <div
                  className='rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2'
                  key={group.shotNumber}
                >
                  <p className='text-sm font-medium text-[var(--color-text)]'>Shot {group.shotNumber}</p>
                  <div className='mt-2 space-y-2'>
                    {group.rows.map((row) => (
                      <div className='flex items-center justify-between text-sm' key={row.id}>
                        <span className='text-[var(--color-text)]'>
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
        </div>

        <Card>
          <CardTitle>Leaderboard Snapshot</CardTitle>
          <CardDescription>Live totals while you score this round.</CardDescription>

          <ol className='mt-4 space-y-2'>
            {leaderboard.data.map((entry, index) => (
              <li
                className='flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm'
                key={entry.round_player_id}
              >
                <span className='text-[var(--color-text)]'>
                  #{index + 1} {entry.display_name}
                </span>
                <span className='font-semibold text-[var(--color-text)]'>{entry.total_contributions}</span>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <LegacyStickyActionBar>
        <Button
          type='button'
          variant='outline'
          onClick={() => setCurrentHole((value) => Math.max(1, value - 1))}
          disabled={currentHole <= 1}
          className='min-h-11 flex-1'
        >
          <ChevronLeftIcon className='mr-1 h-4 w-4' />
          Prev
        </Button>
        <StatusBadge tone='neutral' className='shrink-0'>
          Hole {currentHole}/{totalHoles}
        </StatusBadge>
        <Button
          type='button'
          variant='primary'
          onClick={() => setCurrentHole((value) => Math.min(totalHoles, value + 1))}
          disabled={currentHole >= totalHoles}
          className='min-h-11 flex-1'
        >
          Next
          <ChevronRightIcon className='ml-1 h-4 w-4' />
        </Button>
      </LegacyStickyActionBar>
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
