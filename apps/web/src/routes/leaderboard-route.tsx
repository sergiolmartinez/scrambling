import { useNavigate } from 'react-router-dom';

import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table';
import { EmptyState } from '@/components/state/empty-state';
import { ErrorState } from '@/components/state/error-state';
import { LoadingState } from '@/components/state/loading-state';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { useLeaderboardQuery, useRoundAggregateQuery } from '@/lib/queries';
import { useRoundSessionStore } from '@/store/round-session';

export function LeaderboardRoute(): JSX.Element {
  const navigate = useNavigate();
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
  const leader = leaderboard.data[0];
  const topScore = leader?.total_contributions ?? 0;
  const tiedLeaders = leaderboard.data.filter((entry) => entry.total_contributions === topScore);

  if (leaderboard.data.length === 0) {
    return <EmptyState title='No contributions yet' description='Record shot contributions in Scoring first.' />;
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardTitle>Leaderboard</CardTitle>
        <CardDescription>Ordered contribution totals for round {aggregate.data.round.id}.</CardDescription>

        <div className='mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4'>
          <div className='rounded-md border border-zinc-800 bg-slate-900/35 px-3 py-2'>
            <p className='text-zinc-400'>Round status</p>
            <p className='font-semibold capitalize'>{aggregate.data.round.status}</p>
          </div>
          <div className='rounded-md border border-zinc-800 bg-slate-900/35 px-3 py-2'>
            <p className='text-zinc-400'>Players ranked</p>
            <p className='font-semibold'>{leaderboard.data.length}</p>
          </div>
          <div className='rounded-md border border-zinc-800 bg-slate-900/35 px-3 py-2'>
            <p className='text-zinc-400'>Total contributions</p>
            <p className='font-semibold'>{totalContributions}</p>
          </div>
          <div className='rounded-md border border-zinc-800 bg-slate-900/35 px-3 py-2'>
            <p className='text-zinc-400'>Last updated</p>
            <p className='font-semibold'>Just now</p>
          </div>
        </div>

        <div className='mt-3 rounded-md border border-slate-700/70 bg-slate-900/35 px-3 py-2 text-sm'>
          <p className='text-slate-200'>
            {tiedLeaders.length > 1
              ? `Tie for first between ${tiedLeaders.map((entry) => entry.display_name).join(', ')} at ${topScore} contributions.`
              : `Top player: ${leader?.display_name ?? 'N/A'} with ${topScore} contributions.`}
          </p>
        </div>

        {isCompleted ? (
          <p className='mt-3 text-sm text-amber-300'>Round is completed; leaderboard is final.</p>
        ) : (
          <p className='mt-3 text-sm text-zinc-400'>Round is still active; totals update as scores are entered.</p>
        )}

        {!isCompleted ? (
          <div className='mt-4'>
            <Button type='button' variant='primary' onClick={() => navigate('/scoring')} className='min-h-11'>
              Return to Scoring
            </Button>
          </div>
        ) : null}
      </Card>

      <Card>
        <CardTitle>Player Totals</CardTitle>
        <CardDescription>Higher contributions rank first.</CardDescription>
        <LeaderboardTable entries={leaderboard.data} />
      </Card>
    </div>
  );
}
