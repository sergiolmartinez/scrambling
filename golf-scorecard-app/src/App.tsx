import React, { useState } from 'react';
import Home from './components/Home';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';
import './App.css';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<'home' | 'game' | 'leaderboard'>('home');
    const [players, setPlayers] = useState<string[]>([]);
    const [strokes, setStrokes] = useState<string[][][]>([]); // 3D array for strokes
    const [shotTypes, setShotTypes] = useState<string[][][]>([]); // 3D array for shot types
    const [currentHole, setCurrentHole] = useState(1); // Tracks the current hole

    const startGame = (playerNames: string[]) => {
        setPlayers(playerNames);

        // Initialize strokes and shotTypes arrays for 18 holes, players, and strokes per hole
        const initialStrokes = Array.from({ length: 18 }, () =>
            Array.from({ length: playerNames.length }, () => [])
        );
        const initialShotTypes = Array.from({ length: 18 }, () =>
            Array.from({ length: playerNames.length }, () => [])
        );

        setStrokes(initialStrokes);
        setShotTypes(initialShotTypes);
        setCurrentHole(1); // Start at hole 1
        setCurrentPage('game');
    };

    return (
        <div className="App">
            {currentPage === 'home' && <Home startGame={startGame} />}
            {currentPage === 'game' && (
                <Game
                    players={players}
                    strokes={strokes}
                    setStrokes={setStrokes}
                    shotTypes={shotTypes}
                    setShotTypes={setShotTypes}
                    currentHole={currentHole}
                    setCurrentHole={setCurrentHole}
                    goToLeaderboard={() => setCurrentPage('leaderboard')}
                />
            )}
            {currentPage === 'leaderboard' && (
                <Leaderboard
                    players={players}
                    strokes={strokes}
                    shotTypes={shotTypes}
                    goToGame={() => setCurrentPage('game')}
                />
            )}
        </div>
    );
};

export default App;