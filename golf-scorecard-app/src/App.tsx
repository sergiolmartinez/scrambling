import React, { useState } from "react";
import Home from "./components/Home";
import Game from "./components/Game";
import Leaderboard from "./components/Leaderboard";
import { Player } from "./types";

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [strokes, setStrokes] = useState<string[][][]>([]);
  const [shotTypes, setShotTypes] = useState<string[][][]>([]);
  const [currentHole, setCurrentHole] = useState(0);
  const [courseInfo, setCourseInfo] = useState<{
    name: string;
    totalHoles: number;
    par: number[];
    yardage: number[];
    teeColor: string;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState("home");

  const startGame = (
    playerNames: string[],
    selectedCourseInfo: {
      name: string;
      totalHoles: number;
      par: number[];
      yardage: number[];
      teeColor: string;
    } | null
  ) => {
    if (!selectedCourseInfo) return;

    const initializedPlayers: Player[] = playerNames.map((name) => ({
      name,
      scores: Array(selectedCourseInfo.totalHoles).fill(0),
    }));

    const holeCount = selectedCourseInfo.totalHoles;
    const strokesInit = playerNames.map(() =>
      Array.from({ length: holeCount }, () => [])
    );
    const shotTypesInit = playerNames.map(() =>
      Array.from({ length: holeCount }, () => [])
    );

    setPlayers(initializedPlayers);
    setStrokes(strokesInit);
    setShotTypes(shotTypesInit);
    setCourseInfo(selectedCourseInfo);
    setCurrentHole(0);
    setCurrentPage("game");
  };

  const handleStrokeChange = (
    pIdx: number,
    hIdx: number,
    sIdx: number,
    value: string
  ) => {
    const updated = [...strokes];
    updated[pIdx][hIdx][sIdx] = value;
    setStrokes(updated);
  };

  const handleAddStroke = (pIdx: number, hIdx: number) => {
    const updated = [...strokes];
    updated[pIdx][hIdx].push("");
    setStrokes(updated);
  };

  const handleShotTypeChange = (
    pIdx: number,
    hIdx: number,
    sIdx: number,
    value: string
  ) => {
    const updated = [...shotTypes];
    updated[pIdx][hIdx][sIdx] = value;
    setShotTypes(updated);
  };

  return (
    <div className="App">
      {currentPage === "home" && <Home startGame={startGame} />}
      {currentPage === "game" && courseInfo && (
        <Game
          players={players}
          strokes={strokes}
          shotTypes={shotTypes}
          currentHole={currentHole}
          setCurrentHole={setCurrentHole}
          goToLeaderboard={() => setCurrentPage("leaderboard")}
          courseInfo={courseInfo}
          onStrokeChange={handleStrokeChange}
          onAddStroke={handleAddStroke}
          onShotTypeChange={handleShotTypeChange}
        />
      )}
      {currentPage === "leaderboard" && (
        <Leaderboard
          players={players}
          strokes={strokes}
          shotTypes={shotTypes}
          goToGame={() => setCurrentPage("game")}
          onNewGame={() => setCurrentPage("home")}
        />
      )}
    </div>
  );
};

export default App;
