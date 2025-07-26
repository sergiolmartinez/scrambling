import React from "react";
import { usePlayerInput } from "../hooks/usePlayerInput";

interface PlayerInputProps {
  onAddPlayer: (name: string) => void;
  onStartGame: () => void;
}

const PlayerInput: React.FC<PlayerInputProps> = ({
  onAddPlayer,
  onStartGame,
}) => {
  const { playerName, setPlayerName, handleAddPlayer } =
    usePlayerInput(onAddPlayer);

  return (
    <div className="player-input">
      <input
        type="text"
        placeholder="Enter player name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <button onClick={handleAddPlayer}>Add Player</button>
      <button onClick={onStartGame}>Start Game</button>
    </div>
  );
};

export default PlayerInput;
