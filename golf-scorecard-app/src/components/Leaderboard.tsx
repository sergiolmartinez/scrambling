import React, { useState } from "react";
import { Player } from "../types";
import { getAllPlayerScores, getHoleAverages } from "../utils/calculateScore";
import { notifyDiscord } from "../utils/notifyDiscord";

export interface LeaderboardProps {
  players: Player[];
  strokes: string[][][];
  shotTypes: string[][][];
  goToGame: () => void;
  onNewGame?: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  players,
  strokes,
  shotTypes,
  goToGame,
  onNewGame,
}) => {
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    const summary = players
      .map((p) => `${p.name}: ${p.scores.reduce((a, b) => a + b, 0)} strokes`)
      .join("\n");

    await notifyDiscord(`🏌 Leaderboard Results:\n\n${summary}`);
    setShared(true);
    setTimeout(() => setShared(false), 3000);
  };

  return (
    <div className="leaderboard px-4 py-6 max-w-md mx-auto">
      <h2 className="text-center text-xl font-semibold mb-4">
        🏆 Final Scores
      </h2>
      <ul className="space-y-2">
        {players.map((player, idx) => (
          <li key={idx} className="flex justify-between border-b pb-1">
            <span>{player.name}</span>
            <span>{player.scores.reduce((a, b) => a + b, 0)} strokes</span>
          </li>
        ))}
      </ul>

      <h3 className="mt-6 mb-2 font-medium">Hole Averages</h3>
      <ol className="list-decimal pl-5">
        {getHoleAverages(players).map((avg, idx) => (
          <li key={idx}>
            Hole {idx + 1}: {avg.toFixed(2)} avg
          </li>
        ))}
      </ol>

      <div className="flex flex-col sm:flex-row justify-between gap-2 mt-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleShare}
        >
          📤 Share to Discord
        </button>
        {onNewGame && (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={onNewGame}
          >
            🔄 Start New Game
          </button>
        )}
        <button
          className="bg-gray-300 text-black px-4 py-2 rounded"
          onClick={goToGame}
        >
          🔙 Back to Game
        </button>
      </div>

      {shared && (
        <div className="toast mt-4 text-green-600">✅ Shared to Discord!</div>
      )}
    </div>
  );
};

export default Leaderboard;
