import { Player } from "../hooks/useGameState";

export function getPlayerTotalScore(player: Player): number {
  return player.scores.reduce((total, score) => total + score, 0);
}

export function getAllPlayerScores(players: Player[]): number[] {
  return players.map(getPlayerTotalScore);
}

export function getHoleAverages(players: Player[]): number[] {
  if (players.length === 0) return [];
  const totalHoles = players[0].scores.length;
  const sums = Array(totalHoles).fill(0);

  players.forEach((player) => {
    player.scores.forEach((score, idx) => {
      sums[idx] += score;
    });
  });

  return sums.map((sum) => parseFloat((sum / players.length).toFixed(2)));
}
