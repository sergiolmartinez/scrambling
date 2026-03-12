import { RankRow } from '@/components/leaderboard/rank-row';

type LeaderboardTableProps = {
  entries: Array<{
    round_player_id: number;
    display_name: string;
    total_contributions: number;
  }>;
};

export function LeaderboardTable({ entries }: LeaderboardTableProps): JSX.Element {
  const totalContributions = entries.reduce((sum, entry) => sum + entry.total_contributions, 0);
  const topScore = entries[0]?.total_contributions ?? 0;
  const tiedLeadersCount = entries.filter((entry) => entry.total_contributions === topScore).length;

  return (
    <ol className='mt-4 space-y-2'>
      {entries.map((entry, index) => {
        const sharePercent =
          totalContributions > 0 ? Math.round((entry.total_contributions / totalContributions) * 100) : 0;
        const rank = index + 1;
        const isLeader = index === 0;
        const isTied = entry.total_contributions === topScore && tiedLeadersCount > 1;

        return (
          <RankRow
            key={entry.round_player_id}
            rank={rank}
            displayName={entry.display_name}
            totalContributions={entry.total_contributions}
            sharePercent={sharePercent}
            isLeader={isLeader}
            isTied={isTied}
          />
        );
      })}
    </ol>
  );
}
