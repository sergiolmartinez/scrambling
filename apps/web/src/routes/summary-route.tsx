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

  return (
    <Card>
      <CardTitle>Round Summary</CardTitle>
      <CardDescription>Completion-oriented summary payload from API.</CardDescription>

      <div className='mt-4 space-y-2 text-sm'>
        <p>Round status: {summary.data.round.status}</p>
        <p>Course: {summary.data.course?.name ?? 'Not assigned'}</p>
        <p>Total players: {summary.data.players.length}</p>
        <p>Hole score records: {summary.data.hole_scores.length}</p>
      </div>
    </Card>
  );
}
