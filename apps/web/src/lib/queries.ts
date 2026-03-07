import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api';
import { useRoundSessionStore } from '@/store/round-session';

export function useRoundAggregateQuery() {
  const roundId = useRoundSessionStore((state) => state.roundId);

  return useQuery({
    queryKey: ['round-aggregate', roundId],
    queryFn: () => apiClient.getRoundAggregate(roundId as number),
    enabled: roundId !== null,
  });
}

export function useLeaderboardQuery() {
  const roundId = useRoundSessionStore((state) => state.roundId);

  return useQuery({
    queryKey: ['leaderboard', roundId],
    queryFn: () => apiClient.getLeaderboard(roundId as number),
    enabled: roundId !== null,
  });
}

export function useSummaryQuery() {
  const roundId = useRoundSessionStore((state) => state.roundId);

  return useQuery({
    queryKey: ['summary', roundId],
    queryFn: () => apiClient.getSummary(roundId as number),
    enabled: roundId !== null,
  });
}
