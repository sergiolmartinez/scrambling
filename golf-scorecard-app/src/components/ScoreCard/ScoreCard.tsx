import React from "react";
import { Player } from "../../types";
import ScoreRow from "./ScoreRow";
import HoleInfoCard from "../Hole";

// ScoreCard prop typing including strokes and courseInfo
export interface ScoreCardProps {
  players: Player[];
  currentHole: number;
  strokes: string[][][];
  shotTypes: string[][][];
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
  courseInfo: {
    name: string;
    totalHoles: number;
    par: number[];
    yardage: number[];
    teeColor: string;
  };
}

const ScoreCard: React.FC<ScoreCardProps> = ({
  players,
  currentHole,
  strokes,
  onStrokeChange,
  onAddStroke,
  shotTypes,
  onShotTypeChange,
  courseInfo,
}) => {
  return (
    <div className="scorecard w-full max-w-md mx-auto px-4 py-6">
      <HoleInfoCard number={currentHole + 1} />

      <table className="w-full mt-6">
        <thead>
          <tr>
            <th className="text-left">Player</th>
            <th className="text-left">Strokes</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, idx) => (
            <ScoreRow
              key={idx}
              player={player}
              playerIndex={idx}
              holeIndex={currentHole}
              strokes={strokes}
              onStrokeChange={onStrokeChange}
              onAddStroke={onAddStroke}
              shotTypes={shotTypes}
              onShotTypeChange={onShotTypeChange}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreCard;
