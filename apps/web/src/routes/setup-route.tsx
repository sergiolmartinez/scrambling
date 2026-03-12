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
import { FlagIcon, MapPinIcon, UsersIcon } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { ProgressChecklist } from '@/components/ui/progress-checklist';
import { StatusBadge } from '@/components/ui/status-badge';
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

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [editingPlayerId, setEditingPlayerId] = useState<number | null>(null);
  const [courseNotice, setCourseNotice] = useState<string | null>(null);

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
      setCourseNotice(null);
      await queryClient.invalidateQueries({ queryKey: ['round-aggregate', created.id] });
    },
    onError: () => setSetupError("Couldn't start your round. Please try again."),
  });

  const importCourse = useMutation({
    mutationFn: (externalId: string) => apiClient.importCourseToRound(roundId as number, externalId),
    onSuccess: async (_, externalId) => {
      setSetupError(null);
      setSelectedCourseId(null);
      const assignedCourse = courseSearch.data?.find((course) => course.external_id === externalId);
      setCourseNotice(assignedCourse ? `${assignedCourse.name} is ready for this round.` : 'Course selected.');
      courseSearchForm.reset({ query: '' });
      await queryClient.invalidateQueries({ queryKey: ['round-aggregate', roundId] });
    },
    onError: () => setSetupError("Couldn't add that course. Please try another one."),
  });

  const addPlayer = useMutation({
    mutationFn: (payload: PlayerFormValues) => apiClient.addPlayer(roundId as number, payload),
    onSuccess: async () => {
      setSetupError(null);
      playerForm.reset({ display_name: '', sort_order: nextSortOrder(roundAggregate.data?.players.length ?? 0) });
      await queryClient.invalidateQueries({ queryKey: ['round-aggregate', roundId] });
    },
    onError: () => setSetupError("Couldn't add that player. Please try again."),
  });

  const updatePlayer = useMutation({
    mutationFn: ({ playerId, payload }: { playerId: number; payload: PlayerFormValues }) =>
      apiClient.updatePlayer(roundId as number, playerId, payload),
    onSuccess: async () => {
      setSetupError(null);
      setEditingPlayerId(null);
      await queryClient.invalidateQueries({ queryKey: ['round-aggregate', roundId] });
    },
    onError: () => setSetupError("Couldn't save those player changes. Please try again."),
  });

  const deletePlayer = useMutation({
    mutationFn: (playerId: number) => apiClient.deletePlayer(roundId as number, playerId),
    onSuccess: async () => {
      setSetupError(null);
      await queryClient.invalidateQueries({ queryKey: ['round-aggregate', roundId] });
    },
    onError: () => setSetupError("Couldn't remove that player. Please try again."),
  });

  const searchQuery = courseSearchForm.watch('query');
  const courseSearch = useQuery({
    queryKey: ['courses-search', searchQuery],
    queryFn: () => apiClient.searchCourses(searchQuery),
    enabled: searchQuery.length >= 2,
  });
  const shouldShowCourseResults = searchQuery.length >= 2;

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
  const roundStatus = getRoundStatus(roundAggregate.data?.round.status, roundId);

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
    <div className='grid gap-5 lg:grid-cols-2'>
      <Card className='lg:col-span-2'>
        <CardTitle>
          <span className='inline-flex items-center gap-2'>
            <FlagIcon className='h-5 w-5 text-[var(--color-primary)]' />
            Start your round
          </span>
        </CardTitle>
        <CardDescription>Three quick steps: start the round, pick a course, and add your players.</CardDescription>

        <div className='mt-4 space-y-4'>
          <ProgressChecklist items={readinessItems} />
          <div className='flex flex-wrap items-center gap-2'>
            <StatusBadge tone={roundStatus.tone}>{roundStatus.label}</StatusBadge>
            <p className='text-sm text-[var(--color-text-muted)]'>{roundStatus.copy}</p>
          </div>

          {isLocked ? (
            <p className='rounded-md border border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] px-3 py-2 text-sm text-[var(--color-warning-text)]'>
              This round is complete and locked. Start a new round to make setup changes.
            </p>
          ) : null}

          <div className='flex flex-wrap gap-2 sm:gap-3'>
            <Button
              onClick={() => createRound.mutate()}
              type='button'
              variant={primaryAction === 'create' ? 'primary' : 'outline'}
              className='min-h-11 flex-1 sm:flex-none'
            >
              Start Round
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

          {setupError ? <ErrorState message={setupError} /> : null}
        </div>
      </Card>

      <Card>
        <CardTitle>
          <span className='inline-flex items-center gap-2'>
            <MapPinIcon className='h-5 w-5 text-[var(--color-primary)]' />
            Choose a course
          </span>
        </CardTitle>
        <CardDescription>
          Search by course name or city, then select one for this round.
        </CardDescription>

        <form className='mt-4 space-y-3' onSubmit={courseSearchForm.handleSubmit(() => undefined)}>
          <Input placeholder='Search courses or cities...' {...courseSearchForm.register('query')} />
          {courseSearchForm.formState.errors.query ? (
            <p className='text-sm text-rose-300'>{courseSearchForm.formState.errors.query.message}</p>
          ) : null}
          {!courseSearchForm.formState.errors.query && searchQuery.length < 2 ? (
            <p className='text-xs text-[var(--color-text-muted)]'>Type at least 2 characters to start searching.</p>
          ) : null}
        </form>

        <div className='mt-4 space-y-3'>
          {roundAggregate.data?.course ? <SelectedCourseBanner course={roundAggregate.data.course} /> : null}
          {courseNotice ? <StatusBadge tone='success'>{courseNotice}</StatusBadge> : null}
          {roundId === null ? (
            <StatusBadge tone='neutral'>Start a round before choosing a course.</StatusBadge>
          ) : null}

          {shouldShowCourseResults && courseSearch.isLoading ? (
            <div className='rounded-xl border border-[var(--color-info-border)] bg-[var(--color-info-bg)] px-3 py-2 text-sm text-[var(--color-info-text)]'>
              Searching courses...
            </div>
          ) : null}

          {shouldShowCourseResults && courseSearch.isError ? (
            <ErrorState message="Couldn't load courses right now. Try again in a moment." />
          ) : null}

          {shouldShowCourseResults && courseSearch.isSuccess && courseSearch.data.length === 0 ? (
            <EmptyState title='No matches yet' description='Try a different course name or city.' />
          ) : null}

          {courseSearch.data?.map((course, index) => (
            <CourseResultCard
              key={`${course.external_id}-${course.name}-${index}`}
              course={course}
              isAssigned={selectedCourseId === course.external_id}
              isAssigning={importCourse.isPending}
              disabled={roundId === null || isLocked}
              onAssign={() => {
                setSelectedCourseId(course.external_id);
                if (roundId !== null) {
                  importCourse.mutate(course.external_id);
                }
              }}
            />
          ))}
        </div>
      </Card>

      <Card>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <CardTitle>
            <span className='inline-flex items-center gap-2'>
              <UsersIcon className='h-5 w-5 text-[var(--color-primary)]' />
              Who is playing?
            </span>
          </CardTitle>
          <PlayersCountBadge count={players.length} max={4} />
        </div>
        <CardDescription>Add up to 4 players. The order here sets your leaderboard order.</CardDescription>

        <form
          className='mt-4 grid gap-3 sm:grid-cols-[1fr_auto]'
          onSubmit={playerForm.handleSubmit((values) => addPlayer.mutate(values))}
        >
          <Input placeholder='Add player name' {...playerForm.register('display_name')} />
          <input type='hidden' {...playerForm.register('sort_order', { valueAsNumber: true })} />
          <Button
            type='submit'
            variant='primary'
            className='min-h-11 sm:min-w-36'
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
          {roundId === null ? (
            <p className='text-sm text-[var(--color-text-muted)]'>Start a round before adding players.</p>
          ) : null}
        </div>

        {maxPlayersReached ? (
          <p className='mt-2 text-sm text-[var(--color-warning-text)]'>
            You have 4 players. Remove one to add someone else.
          </p>
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
      <div className='rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-3'>
        <div className='flex items-center justify-between gap-3'>
          <div className='min-w-0'>
            <p className='text-sm font-semibold text-[var(--color-text)]'>{player.display_name}</p>
            <p className='text-xs text-[var(--color-text-muted)]'>Player {player.sort_order}</p>
          </div>
          <span className='inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2 text-xs font-semibold text-[var(--color-text)]'>
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
      className='grid gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-3 md:grid-cols-[2fr_1fr_auto_auto]'
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

function getRoundStatus(
  status: 'draft' | 'active' | 'completed' | undefined,
  roundId: number | null,
): { label: string; tone: 'neutral' | 'info' | 'success' | 'warning'; copy: string } {
  if (roundId === null || status === undefined) {
    return {
      label: 'Not started',
      tone: 'neutral',
      copy: 'Tap Start Round to begin.',
    };
  }

  if (status === 'draft') {
    return {
      label: 'In setup',
      tone: 'info',
      copy: 'Choose a course and add players to get ready.',
    };
  }

  if (status === 'active') {
    return {
      label: 'Ready to score',
      tone: 'success',
      copy: 'Everything is set. Continue to scoring when ready.',
    };
  }

  return {
    label: 'Completed',
    tone: 'warning',
    copy: 'This round is finished and read-only.',
  };
}
