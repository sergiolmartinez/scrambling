import { useNavigate } from 'react-router-dom';

import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table';
import { EmptyState } from '@/components/state/empty-state';
import { ErrorState } from '@/components/state/error-state';
import { LoadingState } from '@/components/state/loading-state';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { TrophyIcon } from '@/components/ui/icons';
import { StatusBadge } from '@/components/ui/status-badge';
import { useLeaderboardQuery, useRoundAggregateQuery } from '@/lib/queries';
import { useRoundSessionStore } from '@/store/round-session';

export function LeaderboardRoute(): JSX.Element {
  const navigate = useNavigate();
  const roundId = useRoundSessionStore((state) => state.roundId);
  const aggregate = useRoundAggregateQuery();
  const leaderboard = useLeaderboardQuery();

  if (roundId === null) {
    return <EmptyState title='No round yet' description='Start a round in Setup before viewing the leaderboard.' />;
  }

  if (leaderboard.isPending || aggregate.isPending) {
    return <LoadingState title='Leaderboard' />;
  }

  if (leaderboard.isError || aggregate.isError) {
    return <ErrorState message="Couldn't load the leaderboard right now." />;
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
    <div className='space-y-5'>
      <Card>
        <CardTitle>
          <span className='inline-flex items-center gap-2'>
            <TrophyIcon className='h-5 w-5 text-[var(--color-primary)]' />
            Leaderboard
          </span>
        </CardTitle>
        <CardDescription>Live ranking by total contributions.</CardDescription>

        <div className='mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4'>
          <div className='rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2'>
            <p className='text-[var(--color-text-muted)]'>Round status</p>
            <p className='font-semibold text-[var(--color-text)] capitalize'>{aggregate.data.round.status}</p>
          </div>
          <div className='rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2'>
            <p className='text-[var(--color-text-muted)]'>Players ranked</p>
            <p className='font-semibold text-[var(--color-text)]'>{leaderboard.data.length}</p>
          </div>
          <div className='rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2'>
            <p className='text-[var(--color-text-muted)]'>Total contributions</p>
            <p className='font-semibold text-[var(--color-text)]'>{totalContributions}</p>
          </div>
          <div className='rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2'>
            <p className='text-[var(--color-text-muted)]'>Last updated</p>
            <p className='font-semibold text-[var(--color-text)]'>Just now</p>
          </div>
        </div>

        <div className='mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-3 text-sm'>
          <p className='font-semibold text-[var(--color-text)]'>
            {tiedLeaders.length > 1
              ? `Tie for first: ${tiedLeaders.map((entry) => entry.display_name).join(' and ')} (${topScore} each).`
              : `Top player: ${leader?.display_name ?? 'N/A'} with ${topScore} contributions.`}
          </p>
          {tiedLeaders.length > 1 ? (
            <p className='mt-1 text-xs text-[var(--color-text-muted)]'>
              Tied players share the same rank and appear grouped at the top.
            </p>
          ) : null}
        </div>

        <div className='mt-3 flex flex-wrap items-center gap-2'>
          <StatusBadge tone={isCompleted ? 'success' : 'info'}>
            {isCompleted ? 'Final leaderboard' : 'Updates live while scoring'}
          </StatusBadge>
          <p className='text-sm text-[var(--color-text-muted)]'>
            {isCompleted ? 'Round complete and locked.' : 'Return to scoring to keep updating totals.'}
          </p>
        </div>

        <div className='mt-4 flex flex-wrap gap-2'>
          {!isCompleted ? (
            <Button type='button' variant='primary' onClick={() => navigate('/scoring')} className='min-h-11'>
              Continue Scoring
            </Button>
          ) : null}
          <Button type='button' variant='outline' onClick={() => navigate('/summary')} className='min-h-11'>
            View Round Summary
          </Button>
        </div>
      </Card>

      <Card>
        <CardTitle>Player Rankings</CardTitle>
        <CardDescription>Higher contribution totals rank first.</CardDescription>
        <LeaderboardTable entries={leaderboard.data} />
      </Card>
    </div>
  );
}
