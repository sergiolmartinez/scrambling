import React, { useState } from 'react';
import Home from './components/Home';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';
import './App.css';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<'home' | 'game' | 'leaderboard'>('home');
    const [players, setPlayers] = useState<string[]>([]);
    const [strokes, setStrokes] = useState<string[][]>([[]]); // Tracks strokes for all holes
    const [shotTypes, setShotTypes] = useState<string[][]>([[]]); // Tracks shot types for all holes
    const [currentHole, setCurrentHole] = useState(1); // Tracks the current hole

    const startGame = (playerNames: string[]) => {
        setPlayers(playerNames);
        setStrokes([[]]); // Reset strokes for a new game
        setShotTypes([[]]); // Reset shot types for a new game
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
                    shotTypes={shotTypes} // Pass shotTypes to Leaderboard
                    goToGame={() => setCurrentPage('game')}
                />
            )}
        </div>
    );
};

export default App;