import { EmptyState } from '@/components/state/empty-state';
import { ErrorState } from '@/components/state/error-state';
import { LoadingState } from '@/components/state/loading-state';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { useLeaderboardQuery } from '@/lib/queries';
import { useRoundSessionStore } from '@/store/round-session';

export function LeaderboardRoute(): JSX.Element {
  const roundId = useRoundSessionStore((state) => state.roundId);
  const leaderboard = useLeaderboardQuery();

  if (roundId === null) {
    return <EmptyState title='No active round' description='Create a round in Setup before viewing leaderboard.' />;
  }

  if (leaderboard.isPending) {
    return <LoadingState title='Leaderboard' />;
  }

  if (leaderboard.isError) {
    return <ErrorState message='Failed to load leaderboard data.' />;
  }

  if (leaderboard.data.length === 0) {
    return <EmptyState title='No contributions yet' description='Record shot contributions in Scoring first.' />;
  }

  return (
    <Card>
      <CardTitle>Leaderboard</CardTitle>
      <CardDescription>Live contribution totals by player.</CardDescription>

      <ol className='mt-4 space-y-2'>
        {leaderboard.data.map((entry, index) => (
          <li className='flex items-center justify-between rounded-md border border-zinc-800 px-3 py-2' key={entry.round_player_id}>
            <span className='text-sm'>
              #{index + 1} {entry.display_name}
            </span>
            <span className='text-sm font-semibold'>{entry.total_contributions}</span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
