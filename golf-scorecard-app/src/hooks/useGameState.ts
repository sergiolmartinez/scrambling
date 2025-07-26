import { useState } from "react";

export interface Player {
  name: string;
  scores: number[];
}

export function useGameState(
  initialPlayers: Player[] = [],
  totalHoles: number = 9
) {
  const [players, setPlayers] = useState<Player[]>(
    initialPlayers.map((p) => ({ ...p, scores: Array(totalHoles).fill(0) }))
  );

  const updateScore = (
    playerIndex: number,
    holeIndex: number,
    score: number
  ) => {
    setPlayers((prevPlayers) => {
      const updated = [...prevPlayers];
      updated[playerIndex].scores[holeIndex] = score;
      return updated;
    });
  };

  const addPlayer = (name: string) => {
    setPlayers((prev) => [
      ...prev,
      { name, scores: Array(totalHoles).fill(0) },
    ]);
  };

  const resetGame = () => {
    setPlayers((prev) =>
      prev.map((p) => ({ ...p, scores: Array(totalHoles).fill(0) }))
    );
  };

  return {
    players,
    updateScore,
    addPlayer,
    resetGame,
  };
}
