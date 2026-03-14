import { RankEntryRow } from '@/components/leaderboard/rank-entry-row';

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
  const rankLabels = getCompetitionRanks(entries);

  return (
    <ol className='mt-4 space-y-2'>
      {entries.map((entry, index) => {
        const sharePercent =
          totalContributions > 0 ? Math.round((entry.total_contributions / totalContributions) * 100) : 0;
        const rankLabel = rankLabels[index] ?? String(index + 1);
        const isLeader = index === 0;
        const isTied = entry.total_contributions === topScore && tiedLeadersCount > 1;

        return (
          <RankEntryRow
            key={entry.round_player_id}
            rankLabel={rankLabel}
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

function getCompetitionRanks(
  entries: Array<{ total_contributions: number }>,
): string[] {
  const rankLabels: string[] = [];
  let rank = 1;

  entries.forEach((entry, index) => {
    const previous = index > 0 ? entries[index - 1] : null;
    if (previous && entry.total_contributions < previous.total_contributions) {
      rank = index + 1;
    }
    rankLabels.push(String(rank));
  });

  return rankLabels;
}
