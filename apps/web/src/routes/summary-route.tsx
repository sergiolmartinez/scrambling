import { EmptyState } from '@/components/state/empty-state';
import { ErrorState } from '@/components/state/error-state';
import { LoadingState } from '@/components/state/loading-state';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { useSummaryQuery } from '@/lib/queries';
import { useRoundSessionStore } from '@/store/round-session';

export function SummaryRoute(): JSX.Element {
  const roundId = useRoundSessionStore((state) => state.roundId);
  const summary = useSummaryQuery();

  if (roundId === null) {
    return <EmptyState title='No active round' description='Create a round in Setup before viewing summary.' />;
  }

  if (summary.isPending) {
    return <LoadingState title='Summary' />;
  }

  if (summary.isError) {
    return <ErrorState message='Failed to load round summary.' />;
  }

  const totalScore = summary.data.hole_scores.reduce((sum, hole) => sum + (hole.score ?? 0), 0);
  const completedHoles = summary.data.hole_scores.filter((hole) => hole.completed).length;
  const totalContributions = summary.data.leaderboard.reduce(
    (sum, entry) => sum + entry.total_contributions,
    0,
  );
  const sortedHoles = [...summary.data.hole_scores].sort((left, right) => left.hole_number - right.hole_number);

  return (
    <div className='space-y-6'>
      <Card>
        <CardTitle>Round Summary</CardTitle>
        <CardDescription>Completion-oriented summary payload from API.</CardDescription>

        <div className='mt-4 grid gap-3 text-sm md:grid-cols-4'>
          <div className='rounded-md border border-zinc-800 px-3 py-2'>
            <p className='text-zinc-400'>Round status</p>
            <p className='font-semibold capitalize'>{summary.data.round.status}</p>
          </div>
          <div className='rounded-md border border-zinc-800 px-3 py-2'>
            <p className='text-zinc-400'>Course</p>
            <p className='font-semibold'>{summary.data.course?.name ?? 'Not assigned'}</p>
          </div>
          <div className='rounded-md border border-zinc-800 px-3 py-2'>
            <p className='text-zinc-400'>Total score</p>
            <p className='font-semibold'>{totalScore}</p>
          </div>
          <div className='rounded-md border border-zinc-800 px-3 py-2'>
            <p className='text-zinc-400'>Completed holes</p>
            <p className='font-semibold'>{completedHoles}</p>
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle>Leaderboard Final</CardTitle>
        <CardDescription>Total contributions by player.</CardDescription>

        {summary.data.leaderboard.length === 0 ? (
          <EmptyState title='No contributions recorded' description='Score and contribution data will appear here.' />
        ) : (
          <ol className='mt-4 space-y-2'>
            {summary.data.leaderboard.map((entry, index) => (
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
        )}

        <p className='mt-3 text-sm text-zinc-400'>Total contributions recorded: {totalContributions}</p>
      </Card>

      <Card>
        <CardTitle>Hole Results</CardTitle>
        <CardDescription>Saved score records by hole number.</CardDescription>

        {sortedHoles.length === 0 ? (
          <EmptyState title='No hole scores yet' description='Hole scores appear once you save scoring data.' />
        ) : (
          <div className='mt-4 space-y-2'>
            {sortedHoles.map((hole) => (
              <div
                className='grid grid-cols-4 gap-2 rounded-md border border-zinc-800 px-3 py-2 text-sm'
                key={hole.id}
              >
                <span>Hole {hole.hole_number}</span>
                <span>Score: {hole.score ?? '-'}</span>
                <span>Par: {hole.par_snapshot ?? '-'}</span>
                <span>{hole.completed ? 'Completed' : 'In progress'}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
