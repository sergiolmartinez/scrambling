import { useNavigate } from 'react-router-dom';

import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table';
import { CompletionBanner } from '@/components/summary/completion-banner';
import { SummaryStatGrid } from '@/components/summary/summary-stat-grid';
import { EmptyState } from '@/components/state/empty-state';
import { ErrorState } from '@/components/state/error-state';
import { LoadingState } from '@/components/state/loading-state';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { useSummaryQuery } from '@/lib/queries';
import { useRoundSessionStore } from '@/store/round-session';

export function SummaryRoute(): JSX.Element {
  const navigate = useNavigate();
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
  const totalHoles = summary.data.course?.total_holes ?? 18;
  const isCompleted = summary.data.round.status === 'completed';

  return (
    <div className='space-y-6'>
      <Card>
        <CardTitle>Round Summary</CardTitle>
        <CardDescription>Final recap for round {summary.data.round.id}.</CardDescription>

        <div className='mt-4 space-y-3'>
          <CompletionBanner status={summary.data.round.status} completedAt={summary.data.round.completed_at} />
          <SummaryStatGrid
            status={summary.data.round.status}
            courseName={summary.data.course?.name ?? 'Not assigned'}
            totalScore={totalScore}
            completedHoles={completedHoles}
            totalHoles={totalHoles}
          />
        </div>

        <div className='mt-4 flex flex-wrap gap-2'>
          <Button type='button' variant='outline' onClick={() => navigate('/leaderboard')} className='min-h-11'>
            View Leaderboard
          </Button>
          {!isCompleted ? (
            <Button type='button' variant='primary' onClick={() => navigate('/scoring')} className='min-h-11'>
              Return to Scoring
            </Button>
          ) : (
            <Button type='button' variant='primary' onClick={() => navigate('/setup')} className='min-h-11'>
              Start New Round
            </Button>
          )}
        </div>
      </Card>

      <Card>
        <CardTitle>Leaderboard Final</CardTitle>
        <CardDescription>Total contributions by player.</CardDescription>

        {summary.data.leaderboard.length === 0 ? (
          <EmptyState title='No contributions recorded' description='Score and contribution data will appear here.' />
        ) : (
          <LeaderboardTable entries={summary.data.leaderboard} />
        )}

        <p className='mt-3 text-sm text-zinc-400'>Total contributions recorded: {totalContributions}</p>
      </Card>

      <Card>
        <CardTitle>Hole Completion Summary</CardTitle>
        <CardDescription>Saved score records by hole number.</CardDescription>

        {sortedHoles.length === 0 ? (
          <EmptyState title='No hole scores yet' description='Hole scores appear once you save scoring data.' />
        ) : (
          <div className='mt-4 space-y-2'>
            {sortedHoles.map((hole) => (
              <div
                className='grid gap-2 rounded-md border border-zinc-800 bg-slate-900/35 px-3 py-2 text-sm sm:grid-cols-4'
                key={hole.id}
              >
                <span>Hole {hole.hole_number}</span>
                <span>Score: {hole.score ?? '-'}</span>
                <span>Par: {hole.par_snapshot ?? '-'}</span>
                <span
                  className={hole.completed ? 'text-emerald-200' : 'text-amber-200'}
                >
                  {hole.completed ? 'Completed' : 'In progress'}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <CardTitle>Players</CardTitle>
        <CardDescription>Round roster at completion.</CardDescription>
        {summary.data.players.length === 0 ? (
          <EmptyState title='No players recorded' description='Players were not found for this round summary.' />
        ) : (
          <ul className='mt-4 space-y-2'>
            {summary.data.players
              .slice()
              .sort((left, right) => left.sort_order - right.sort_order)
              .map((player) => (
                <li
                  className='flex items-center justify-between rounded-md border border-zinc-800 bg-slate-900/35 px-3 py-2 text-sm'
                  key={player.id}
                >
                  <span className='font-semibold text-slate-100'>{player.display_name}</span>
                  <span className='text-slate-300'>Order {player.sort_order}</span>
                </li>
              ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
