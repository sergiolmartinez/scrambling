import React from "react";

interface ScoreCellProps {
  score: number;
  onChange: (score: number) => void;
}

const ScoreCell: React.FC<ScoreCellProps> = ({ score, onChange }) => {
  return (
    <td>
      <input
        type="number"
        value={score}
        min={0}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </td>
  );
};

export default ScoreCell;
