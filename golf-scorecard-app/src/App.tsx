import React, { useState } from 'react';
import ScoreCard from './components/ScoreCard';
import PlayerInput from './components/PlayerInput';
import './styles/App.css';

const App: React.FC = () => {
    const [players, setPlayers] = useState<{ name: string; score: number }[]>([]);

    const addPlayer = (name: string, score: number) => {
        setPlayers([...players, { name, score }]);
    };

    return (
        <div className="App">
            <h1>Golf Scorecard</h1>
            <PlayerInput addPlayer={addPlayer} />
            <ScoreCard players={players} />
        </div>
    );
};

export default App;