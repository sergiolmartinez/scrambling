import React, { useState } from 'react';
import './Home.css'; // Import the CSS file for styling

interface HomeProps {
    startGame: (playerNames: string[]) => void;
}

const Home: React.FC<HomeProps> = ({ startGame }) => {
    const [playerNames, setPlayerNames] = useState<string[]>(['']);

    const handleNameChange = (index: number, value: string) => {
        const updatedNames = [...playerNames];
        updatedNames[index] = value;
        setPlayerNames(updatedNames);
    };

    const addPlayer = () => {
        setPlayerNames([...playerNames, '']);
    };

    const handleStartGame = () => {
        const filteredNames = playerNames.filter((name) => name.trim() !== '');
        startGame(filteredNames);
    };

    return (
        <div className="home-container">
            <h1>Enter Player Names</h1>
            <div className="player-inputs">
                {playerNames.map((name, index) => (
                    <div key={index} className="player-input">
                        <input
                            type="text"
                            placeholder={`Player ${index + 1}`}
                            value={name}
                            onChange={(e) => handleNameChange(index, e.target.value)}
                        />
                        {index === playerNames.length - 1 && (
                            <button onClick={addPlayer} className="add-player-button">
                                Add Player
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <button onClick={handleStartGame} className="start-game-button">
                Start Game
            </button>
        </div>
    );
};

export default Home;