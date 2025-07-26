import { useState } from "react";

export function usePlayerInput(onAddPlayer: (name: string) => void) {
  const [playerName, setPlayerName] = useState("");

  const handleAddPlayer = () => {
    const trimmedName = playerName.trim();
    if (trimmedName) {
      onAddPlayer(trimmedName);
      setPlayerName("");
    }
  };

  return {
    playerName,
    setPlayerName,
    handleAddPlayer,
  };
}
