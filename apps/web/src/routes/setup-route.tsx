import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { CourseResultCard } from '@/components/setup/course-result-card';
import { PlayersCountBadge } from '@/components/setup/players-count-badge';
import { SelectedCourseBanner } from '@/components/setup/selected-course-banner';
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
  const assignedCourseId = roundAggregate.data?.course?.id ?? null;
  const readinessItems = [
    { label: 'Round', complete: roundId !== null },
    { label: 'Course', complete: hasAssignedCourse },
    { label: 'Players', complete: players.length > 0 },
  ];
  const primaryAction = canContinueToScoring ? 'continue' : 'create';
  const roundStatusCopy = getRoundStatusCopy(roundAggregate.data?.round.status, roundId);

  useEffect(() => {
    const currentName = playerForm.getValues('display_name').trim();
    if (currentName.length > 0) {
      return;
    }

    playerForm.setValue('sort_order', nextSortOrder(players.length), {
      shouldValidate: false,
      shouldDirty: false,
      shouldTouch: false,
    });
  }, [playerForm, players.length]);

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
        <CardDescription>
          Search local and imported courses, then assign one to this round. Assignment is saved immediately.
        </CardDescription>

        <form className='mt-4 space-y-3' onSubmit={courseSearchForm.handleSubmit(() => undefined)}>
          <Input placeholder='Search by course or city...' {...courseSearchForm.register('query')} />
          {courseSearchForm.formState.errors.query ? (
            <p className='text-sm text-rose-300'>{courseSearchForm.formState.errors.query.message}</p>
          ) : null}
          {!courseSearchForm.formState.errors.query && searchQuery.length < 2 ? (
            <p className='text-xs text-slate-400'>Type at least 2 characters to search available courses.</p>
          ) : null}
        </form>

        <div className='mt-4 space-y-3'>
          {roundAggregate.data?.course ? <SelectedCourseBanner course={roundAggregate.data.course} /> : null}

          {courseSearch.isLoading ? (
            <div className='rounded-xl border border-sky-300/25 bg-sky-400/10 px-3 py-2 text-sm text-sky-100'>
              Searching courses...
            </div>
          ) : null}

          {courseSearch.isError ? <ErrorState message='Course search failed. Try a different query.' /> : null}

          {courseSearch.isSuccess && courseSearch.data.length === 0 ? (
            <EmptyState
              title='No courses found'
              description='Try a different search term or import additional courses first.'
            />
          ) : null}

          {courseSearch.data?.map((course) => (
            <CourseResultCard
              key={course.id}
              course={course}
              isAssigned={assignedCourseId === course.id}
              isAssigning={assignCourse.isPending && selectedCourseId === course.id}
              disabled={roundId === null || isLocked}
              onAssign={() => {
                setSelectedCourseId(course.id);
                if (roundId !== null) {
                  assignCourse.mutate(course.id);
                }
              }}
            />
          ))}
        </div>
      </Card>

      <Card className='lg:col-span-2'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <CardTitle>Players</CardTitle>
          <PlayersCountBadge count={players.length} max={4} />
        </div>
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
            className='min-h-11'
            disabled={roundId === null || isLocked || maxPlayersReached || addPlayer.isPending}
          >
            {addPlayer.isPending ? 'Adding...' : 'Add Player'}
          </Button>
        </form>

        <div className='mt-2 space-y-1'>
          {playerForm.formState.errors.display_name ? (
            <p className='text-sm text-rose-300'>{playerForm.formState.errors.display_name.message}</p>
          ) : null}
          {playerForm.formState.errors.sort_order ? (
            <p className='text-sm text-rose-300'>{playerForm.formState.errors.sort_order.message}</p>
          ) : null}
          {roundId === null ? <p className='text-sm text-slate-400'>Create a round before adding players.</p> : null}
        </div>

        {maxPlayersReached ? (
          <p className='mt-2 text-sm text-amber-200'>Maximum of 4 players reached. Remove a player before adding another.</p>
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
      <div className='rounded-md border border-slate-700/70 bg-slate-900/50 px-3 py-2'>
        <div className='flex items-center justify-between gap-3'>
          <div className='min-w-0'>
            <p className='text-sm font-semibold text-slate-100'>{player.display_name}</p>
            <p className='text-xs text-zinc-500'>Order: {player.sort_order}</p>
          </div>
          <span className='inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-slate-600/80 bg-slate-800/70 px-2 text-xs font-semibold text-slate-200'>
            {player.sort_order}
          </span>
        </div>
        <div className='mt-3 flex flex-wrap gap-2'>
          <Button onClick={() => setEditing(true)} type='button' variant='outline' disabled={isLocked} className='min-h-10 flex-1 sm:flex-none'>
            Edit
          </Button>
          <Button onClick={onDelete} type='button' variant='outline' disabled={isLocked} className='min-h-10 flex-1 sm:flex-none'>
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
      <Button type='submit' variant='primary' disabled={isLocked} className='min-h-10'>
        Save Changes
      </Button>
      <Button onClick={() => setEditing(false)} type='button' variant='outline' className='min-h-10'>
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
