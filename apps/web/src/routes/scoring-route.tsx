import { EmptyState } from '@/components/state/empty-state';
import { ErrorState } from '@/components/state/error-state';
import { LoadingState } from '@/components/state/loading-state';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { useRoundAggregateQuery } from '@/lib/queries';
import { useRoundSessionStore } from '@/store/round-session';

export function ScoringRoute(): JSX.Element {
  const roundId = useRoundSessionStore((state) => state.roundId);
  const aggregate = useRoundAggregateQuery();

  if (roundId === null) {
    return <EmptyState title='No active round' description='Create a round in Setup before scoring.' />;
  }

  if (aggregate.isPending) {
    return <LoadingState title='Scoring' />;
  }

  if (aggregate.isError) {
    return <ErrorState message='Failed to load round aggregate for scoring.' />;
  }

  return (
    <Card>
      <CardTitle>Scoring Shell</CardTitle>
      <CardDescription>Route module scaffold for hole-by-hole scoring.</CardDescription>

      <div className='mt-4 space-y-2 text-sm'>
        <p>Round ID: {aggregate.data.round.id}</p>
        <p>Status: {aggregate.data.round.status}</p>
        <p>Players: {aggregate.data.players.length}</p>
        <p>Saved hole scores: {aggregate.data.hole_scores.length}</p>
      </div>
    </Card>
  );
}
