type RankRowProps = {
  rankLabel: string;
  displayName: string;
  totalContributions: number;
  sharePercent: number;
  isLeader: boolean;
  isTied: boolean;
};

export function RankRow({
  rankLabel,
  displayName,
  totalContributions,
  sharePercent,
  isLeader,
  isTied,
}: RankRowProps): JSX.Element {
  return (
    <RankEntryRow
      rankLabel={rankLabel}
      displayName={displayName}
      totalContributions={totalContributions}
      sharePercent={sharePercent}
      isLeader={isLeader}
      isTied={isTied}
    />
  );
}
import { RankEntryRow } from '@/components/leaderboard/rank-entry-row';
