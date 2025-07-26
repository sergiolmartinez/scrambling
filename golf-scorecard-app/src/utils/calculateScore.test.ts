import {
  getPlayerTotalScore,
  getAllPlayerScores,
  getHoleAverages,
} from "./calculateScore";
import { Player } from "../hooks/useGameState";

describe("calculateScore utils", () => {
  const players: Player[] = [
    { name: "Alice", scores: [3, 4, 5] },
    { name: "Bob", scores: [4, 4, 4] },
    { name: "Charlie", scores: [5, 3, 2] },
  ];

  test("getPlayerTotalScore returns correct sum", () => {
    expect(getPlayerTotalScore(players[0])).toBe(12);
    expect(getPlayerTotalScore(players[1])).toBe(12);
    expect(getPlayerTotalScore(players[2])).toBe(10);
  });

  test("getAllPlayerScores returns total scores for all players", () => {
    expect(getAllPlayerScores(players)).toEqual([12, 12, 10]);
  });

  test("getHoleAverages returns correct per-hole averages", () => {
    expect(getHoleAverages(players)).toEqual([4, 3.67, 3.67]);
  });

  test("getHoleAverages handles empty player list", () => {
    expect(getHoleAverages([])).toEqual([]);
  });
});
