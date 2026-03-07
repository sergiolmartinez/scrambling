import { EmptyState } from '@/components/state/empty-state';
import { ErrorState } from '@/components/state/error-state';
import { LoadingState } from '@/components/state/loading-state';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { useLeaderboardQuery, useRoundAggregateQuery } from '@/lib/queries';
import { useRoundSessionStore } from '@/store/round-session';

export function LeaderboardRoute(): JSX.Element {
  const roundId = useRoundSessionStore((state) => state.roundId);
  const aggregate = useRoundAggregateQuery();
  const leaderboard = useLeaderboardQuery();

  if (roundId === null) {
    return <EmptyState title='No active round' description='Create a round in Setup before viewing leaderboard.' />;
  }

  if (leaderboard.isPending || aggregate.isPending) {
    return <LoadingState title='Leaderboard' />;
  }

  if (leaderboard.isError || aggregate.isError) {
    return <ErrorState message='Failed to load leaderboard data.' />;
  }

  const totalContributions = leaderboard.data.reduce((sum, entry) => sum + entry.total_contributions, 0);
  const isCompleted = aggregate.data.round.status === 'completed';

  if (leaderboard.data.length === 0) {
    return <EmptyState title='No contributions yet' description='Record shot contributions in Scoring first.' />;
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardTitle>Leaderboard</CardTitle>
        <CardDescription>Ordered contribution totals for round {aggregate.data.round.id}.</CardDescription>

        <div className='mt-4 grid gap-3 text-sm md:grid-cols-3'>
          <div className='rounded-md border border-zinc-800 px-3 py-2'>
            <p className='text-zinc-400'>Round status</p>
            <p className='font-semibold capitalize'>{aggregate.data.round.status}</p>
          </div>
          <div className='rounded-md border border-zinc-800 px-3 py-2'>
            <p className='text-zinc-400'>Players ranked</p>
            <p className='font-semibold'>{leaderboard.data.length}</p>
          </div>
          <div className='rounded-md border border-zinc-800 px-3 py-2'>
            <p className='text-zinc-400'>Total contributions</p>
            <p className='font-semibold'>{totalContributions}</p>
          </div>
        </div>

        {isCompleted ? (
          <p className='mt-3 text-sm text-amber-300'>Round is completed; leaderboard is final.</p>
        ) : (
          <p className='mt-3 text-sm text-zinc-400'>Round is still active; totals update as scores are entered.</p>
        )}
      </Card>

      <Card>
        <CardTitle>Player Totals</CardTitle>
        <CardDescription>Higher contributions rank first.</CardDescription>

        <ol className='mt-4 space-y-2'>
          {leaderboard.data.map((entry, index) => {
            const percentage =
              totalContributions > 0 ? Math.round((entry.total_contributions / totalContributions) * 100) : 0;
            return (
              <li
                className='flex items-center justify-between rounded-md border border-zinc-800 px-3 py-2'
                key={entry.round_player_id}
              >
                <span className='text-sm'>
                  #{index + 1} {entry.display_name}
                </span>
                <span className='text-sm font-semibold'>
                  {entry.total_contributions} ({percentage}%)
                </span>
              </li>
            );
          })}
        </ol>
      </Card>
    </div>
  );
}
