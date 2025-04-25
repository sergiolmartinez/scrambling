import React, { useState } from 'react';
import Home from './components/Home';
import Game from './components/Game';
import './App.css';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<'home' | 'game'>('home');
    const [players, setPlayers] = useState<string[]>([]);

    const startGame = (playerNames: string[]) => {
        setPlayers(playerNames);
        setCurrentPage('game');
    };

    return (
        <div className="App">
            {currentPage === 'home' ? (
                <Home startGame={startGame} />
            ) : (
                <Game players={players} />
            )}
        </div>
    );
};

export default App;