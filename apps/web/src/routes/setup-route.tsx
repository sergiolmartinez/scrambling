import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { EmptyState } from '@/components/state/empty-state';
import { ErrorState } from '@/components/state/error-state';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ProgressChecklist } from '@/components/ui/progress-checklist';
import { apiClient } from '@/lib/api';
import { useRoundSessionStore } from '@/store/round-session';

const courseSearchSchema = z.object({
  query: z.string().min(2, 'Enter at least 2 characters.'),
});

const playerFormSchema = z.object({
  display_name: z.string().min(1, 'Player name is required.').max(120),
  sort_order: z.number().int().min(1).max(4),
});

type CourseSearchForm = z.infer<typeof courseSearchSchema>;
type PlayerFormValues = z.infer<typeof playerFormSchema>;

export function SetupRoute(): JSX.Element {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const roundId = useRoundSessionStore((state) => state.roundId);
  const setRoundId = useRoundSessionStore((state) => state.setRoundId);

  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [editingPlayerId, setEditingPlayerId] = useState<number | null>(null);

  const courseSearchForm = useForm<CourseSearchForm>({
    resolver: zodResolver(courseSearchSchema),
    defaultValues: { query: '' },
  });

  const playerForm = useForm<PlayerFormValues>({
    resolver: zodResolver(playerFormSchema),
    defaultValues: {
      display_name: '',
      sort_order: 1,
    },
  });

  const roundAggregate = useQuery({
    queryKey: ['round-aggregate', roundId],
    queryFn: () => apiClient.getRoundAggregate(roundId as number),
    enabled: roundId !== null,
  });

  const createRound = useMutation({
    mutationFn: () => apiClient.createRound(),
    onSuccess: async (created) => {
      setRoundId(created.id);
      setSetupError(null);
      await queryClient.invalidateQueries({ queryKey: ['round-aggregate', created.id] });
    },
    onError: (error: Error) => setSetupError(error.message),
  });

  const assignCourse = useMutation({
    mutationFn: (courseId: number) => apiClient.assignCourse(roundId as number, courseId),
    onSuccess: async () => {
      setSetupError(null);
      await queryClient.invalidateQueries({ queryKey: ['round-aggregate', roundId] });
    },
    onError: (error: Error) => setSetupError(error.message),
  });

  const addPlayer = useMutation({
    mutationFn: (payload: PlayerFormValues) => apiClient.addPlayer(roundId as number, payload),
    onSuccess: async () => {
      setSetupError(null);
      playerForm.reset({ display_name: '', sort_order: nextSortOrder(roundAggregate.data?.players.length ?? 0) });
      await queryClient.invalidateQueries({ queryKey: ['round-aggregate', roundId] });
    },
    onError: (error: Error) => setSetupError(error.message),
  });

  const updatePlayer = useMutation({
    mutationFn: ({ playerId, payload }: { playerId: number; payload: PlayerFormValues }) =>
      apiClient.updatePlayer(roundId as number, playerId, payload),
    onSuccess: async () => {
      setSetupError(null);
      setEditingPlayerId(null);
      await queryClient.invalidateQueries({ queryKey: ['round-aggregate', roundId] });
    },
    onError: (error: Error) => setSetupError(error.message),
  });

  const deletePlayer = useMutation({
    mutationFn: (playerId: number) => apiClient.deletePlayer(roundId as number, playerId),
    onSuccess: async () => {
      setSetupError(null);
      await queryClient.invalidateQueries({ queryKey: ['round-aggregate', roundId] });
    },
    onError: (error: Error) => setSetupError(error.message),
  });

  const searchQuery = courseSearchForm.watch('query');
  const courseSearch = useQuery({
    queryKey: ['courses-search', searchQuery],
    queryFn: () => apiClient.searchCourses(searchQuery),
    enabled: searchQuery.length >= 2,
  });

  const players = roundAggregate.data?.players ?? [];
  const maxPlayersReached = players.length >= 4;
  const hasAssignedCourse = Boolean(roundAggregate.data?.course);
  const canContinueToScoring = Boolean(roundId && hasAssignedCourse && players.length > 0);
  const isLocked = roundAggregate.data?.round.status === 'completed';
  const readinessItems = [
    { label: 'Round', complete: roundId !== null },
    { label: 'Course', complete: hasAssignedCourse },
    { label: 'Players', complete: players.length > 0 },
  ];
  const primaryAction = canContinueToScoring ? 'continue' : 'create';
  const roundStatusCopy = getRoundStatusCopy(roundAggregate.data?.round.status, roundId);

  return (
    <div className='grid gap-6 lg:grid-cols-2'>
      <Card>
        <CardTitle>Start a round in 3 steps</CardTitle>
        <CardDescription>Create the round, pick a course, then add players to begin scoring.</CardDescription>

        <div className='mt-3 space-y-3'>
          <ProgressChecklist items={readinessItems} />

          <p className='text-sm text-slate-300'>{roundStatusCopy}</p>
          {isLocked ? (
            <p className='rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-200'>
              This round is completed and locked. Create a new round to edit setup.
            </p>
          ) : null}

          <div className='flex flex-wrap gap-2 sm:gap-3'>
            <Button
              onClick={() => createRound.mutate()}
              type='button'
              variant={primaryAction === 'create' ? 'primary' : 'outline'}
              className='min-h-11 flex-1 sm:flex-none'
            >
              Create Round
            </Button>
            <Button
              onClick={() => navigate('/scoring')}
              type='button'
              variant={primaryAction === 'continue' ? 'primary' : 'outline'}
              disabled={!canContinueToScoring}
              className='min-h-11 flex-1 sm:flex-none'
            >
              Continue to Scoring
            </Button>
          </div>

          {roundId !== null ? (
            <p className='text-xs text-zinc-400'>Current round ID: {roundId}</p>
          ) : (
            <p className='text-xs text-zinc-500'>No round selected yet.</p>
          )}

          {setupError ? <ErrorState message={setupError} /> : null}
        </div>
      </Card>

      <Card>
        <CardTitle>Course Search</CardTitle>
        <CardDescription>Search local + imported courses and assign one to the active round.</CardDescription>

        <form className='mt-4 space-y-3' onSubmit={courseSearchForm.handleSubmit(() => undefined)}>
          <Input placeholder='Search courses...' {...courseSearchForm.register('query')} />
          {courseSearchForm.formState.errors.query ? (
            <p className='text-sm text-rose-300'>{courseSearchForm.formState.errors.query.message}</p>
          ) : null}
        </form>

        <div className='mt-4 space-y-2'>
          {courseSearch.isError ? <ErrorState message='Course search failed.' /> : null}
          {courseSearch.isSuccess && courseSearch.data.length === 0 ? (
            <EmptyState
              title='No courses found'
              description='Try another query, or create course records via API first.'
            />
          ) : null}

          {courseSearch.data?.map((course) => (
            <div
              className='rounded-md border border-slate-700/70 bg-slate-900/50 px-3 py-2 text-sm'
              key={course.id}
            >
              <div className='flex items-center justify-between gap-2'>
                <div>
                  <p className='font-medium'>{course.name}</p>
                  <p className='text-zinc-400'>
                    {course.city ?? 'Unknown city'}, {course.state ?? 'Unknown state'}
                  </p>
                </div>
                <Button
                  type='button'
                  variant={selectedCourseId === course.id ? 'primary' : 'outline'}
                  onClick={() => {
                    setSelectedCourseId(course.id);
                    if (roundId !== null) {
                      assignCourse.mutate(course.id);
                    }
                  }}
                  disabled={roundId === null || isLocked || assignCourse.isPending}
                >
                  {selectedCourseId === course.id ? 'Selected' : 'Assign'}
                </Button>
              </div>
            </div>
          ))}

          {roundAggregate.data?.course ? (
            <p className='text-sm text-cyan-300'>Assigned course: {roundAggregate.data.course.name}</p>
          ) : null}
        </div>
      </Card>

      <Card className='lg:col-span-2'>
        <CardTitle>Players</CardTitle>
        <CardDescription>Add, edit, or remove players before scoring. Player order drives leaderboard display.</CardDescription>

        <form
          className='mt-4 grid gap-3 md:grid-cols-[2fr_1fr_auto]'
          onSubmit={playerForm.handleSubmit((values) => addPlayer.mutate(values))}
        >
          <Input placeholder='Player name' {...playerForm.register('display_name')} />
          <Input
            min={1}
            max={4}
            type='number'
            {...playerForm.register('sort_order', { valueAsNumber: true })}
          />
          <Button
            type='submit'
            variant='primary'
            disabled={roundId === null || isLocked || maxPlayersReached || addPlayer.isPending}
          >
            Add Player
          </Button>
        </form>

        {playerForm.formState.errors.display_name ? (
          <p className='mt-2 text-sm text-rose-300'>{playerForm.formState.errors.display_name.message}</p>
        ) : null}

        {maxPlayersReached ? (
          <p className='mt-2 text-sm text-zinc-400'>Maximum of 4 players reached.</p>
        ) : null}

        <div className='mt-4 space-y-2'>
          {players.length === 0 ? (
            <EmptyState title='No players yet' description='Add at least one player to continue.' />
          ) : null}

          {players.map((player) => (
            <PlayerRow
              key={player.id}
              onDelete={() => deletePlayer.mutate(player.id)}
              onEdit={(payload) => updatePlayer.mutate({ playerId: player.id, payload })}
              player={player}
              isLocked={isLocked}
              editing={editingPlayerId === player.id}
              setEditing={(isEditing) => setEditingPlayerId(isEditing ? player.id : null)}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

type PlayerRowProps = {
  player: { id: number; display_name: string; sort_order: number };
  isLocked: boolean;
  editing: boolean;
  setEditing: (editing: boolean) => void;
  onEdit: (payload: PlayerFormValues) => void;
  onDelete: () => void;
};

function PlayerRow({ player, isLocked, editing, setEditing, onEdit, onDelete }: PlayerRowProps): JSX.Element {
  const editForm = useForm<PlayerFormValues>({
    resolver: zodResolver(playerFormSchema),
    defaultValues: {
      display_name: player.display_name,
      sort_order: player.sort_order,
    },
  });

  if (!editing) {
    return (
      <div className='flex items-center justify-between gap-2 rounded-md border border-slate-700/70 bg-slate-900/50 px-3 py-2'>
        <div>
          <p className='text-sm font-medium'>{player.display_name}</p>
          <p className='text-xs text-zinc-500'>Sort order: {player.sort_order}</p>
        </div>
        <div className='flex gap-2'>
          <Button onClick={() => setEditing(true)} type='button' variant='outline' disabled={isLocked}>
            Edit
          </Button>
          <Button onClick={onDelete} type='button' variant='outline' disabled={isLocked}>
            Remove
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      className='grid gap-2 rounded-md border border-slate-700/70 bg-slate-900/50 px-3 py-2 md:grid-cols-[2fr_1fr_auto_auto]'
      onSubmit={editForm.handleSubmit((payload) => onEdit(payload))}
    >
      <Input {...editForm.register('display_name')} />
      <Input
        min={1}
        max={4}
        type='number'
        {...editForm.register('sort_order', { valueAsNumber: true })}
      />
      <Button type='submit' variant='primary' disabled={isLocked}>
        Save
      </Button>
      <Button onClick={() => setEditing(false)} type='button' variant='outline'>
        Cancel
      </Button>
    </form>
  );
}

function nextSortOrder(currentPlayerCount: number): number {
  return Math.min(4, Math.max(1, currentPlayerCount + 1));
}

function getRoundStatusCopy(
  status: 'draft' | 'active' | 'completed' | undefined,
  roundId: number | null,
): string {
  if (roundId === null || status === undefined) {
    return 'No round yet. Start by creating a new round.';
  }

  if (status === 'draft') {
    return 'Round status: Draft. Continue setup by assigning a course and adding players.';
  }

  if (status === 'active') {
    return 'Round status: Active. Setup is ready for scoring.';
  }

  return 'Round status: Completed. This round is read-only.';
}
