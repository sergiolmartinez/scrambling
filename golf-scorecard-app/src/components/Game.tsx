import React from "react";
import ScoreCard from "./ScoreCard/ScoreCard";
import Leaderboard from "./Leaderboard";
import Hole from "./Hole";
import { Player } from "../types";

interface GameProps {
  players: Player[];
  strokes: string[][][];
  shotTypes: string[][][];
  currentHole: number;
  setCurrentHole: (hole: number) => void;
  courseInfo: {
    name: string;
    totalHoles: number;
    par: number[];
    yardage: number[];
    teeColor: string;
  };
  goToLeaderboard: () => void;
  onStrokeChange: (
    pIdx: number,
    hIdx: number,
    sIdx: number,
    value: string
  ) => void;
  onAddStroke: (pIdx: number, hIdx: number) => void;
  onShotTypeChange: (
    pIdx: number,
    hIdx: number,
    sIdx: number,
    value: string
  ) => void;
}

const Game: React.FC<GameProps> = ({
  players,
  strokes,
  shotTypes,
  currentHole,
  setCurrentHole,
  courseInfo,
  goToLeaderboard,
  onStrokeChange,
  onAddStroke,
  onShotTypeChange,
}) => {
  return (
    <div className="game-container px-4 py-6 w-full max-w-3xl mx-auto">
      <Hole number={currentHole + 1} />

      <ScoreCard
        players={players}
        currentHole={currentHole}
        strokes={strokes}
        onStrokeChange={onStrokeChange}
        onAddStroke={onAddStroke}
        shotTypes={shotTypes}
        onShotTypeChange={onShotTypeChange}
        courseInfo={courseInfo}
      />

      <div className="fixed bottom-4 inset-x-0 flex justify-center gap-3 px-4">
        <button
          className="bg-gray-300 px-4 py-2 rounded-md"
          onClick={() => setCurrentHole(Math.max(0, currentHole - 1))}
        >
          ⬅ Prev
        </button>
        {currentHole < courseInfo.totalHoles - 1 ? (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={() => setCurrentHole(currentHole + 1)}
          >
            Next ➡
          </button>
        ) : (
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-md"
            onClick={goToLeaderboard}
          >
            View Leaderboard
          </button>
        )}
      </div>
    </div>
  );
};

export default Game;
