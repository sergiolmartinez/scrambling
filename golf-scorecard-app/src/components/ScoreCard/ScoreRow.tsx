import React from "react";
import { Player } from "../../types";

export interface ScoreRowProps {
  player: Player;
  playerIndex: number;
  holeIndex: number;
  strokes: string[][][];
  onStrokeChange: (
    pIdx: number,
    hIdx: number,
    sIdx: number,
    value: string
  ) => void;
  onAddStroke: (pIdx: number, hIdx: number) => void;
  shotTypes: string[][][];
  onShotTypeChange: (
    pIdx: number,
    hIdx: number,
    sIdx: number,
    value: string
  ) => void;
}

const ScoreRow: React.FC<ScoreRowProps> = ({
  player,
  playerIndex,
  holeIndex,
  strokes,
  onStrokeChange,
  onAddStroke,
  shotTypes,
  onShotTypeChange,
}) => {
  const currentStrokes = strokes[playerIndex]?.[holeIndex] || [];

  return (
    <tr>
      <td className="font-semibold pr-2 align-top whitespace-nowrap">
        {player.name}
      </td>
      <td className="space-y-2">
        {currentStrokes.map((stroke: string, idx: number) => (
          <div key={idx} className="flex items-center space-x-2">
            <input
              className="border rounded px-2 py-1 w-16"
              value={stroke}
              onChange={(e) =>
                onStrokeChange(playerIndex, holeIndex, idx, e.target.value)
              }
            />
            <select
              className="border rounded px-1 py-1"
              value={shotTypes[playerIndex]?.[holeIndex]?.[idx] || ""}
              onChange={(e) =>
                onShotTypeChange(playerIndex, holeIndex, idx, e.target.value)
              }
            >
              <option value="">Type</option>
              <option value="drive">Drive</option>
              <option value="approach">Approach</option>
              <option value="putt">Putt</option>
              <option value="chip">Chip</option>
              <option value="penalty">Penalty</option>
            </select>
          </div>
        ))}
        <button
          className="mt-2 text-sm text-blue-600 hover:underline"
          onClick={() => onAddStroke(playerIndex, holeIndex)}
        >
          + Add Stroke
        </button>
      </td>
    </tr>
  );
};

export default ScoreRow;
