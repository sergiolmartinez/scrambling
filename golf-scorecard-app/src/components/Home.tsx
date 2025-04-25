import React, { useState } from 'react';

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
        <div>
            <h1>Enter Player Names</h1>
            {playerNames.map((name, index) => (
                <input
                    key={index}
                    type="text"
                    placeholder={`Player ${index + 1}`}
                    value={name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                />
            ))}
            <button onClick={addPlayer}>Add Player</button>
            <button onClick={handleStartGame}>Start Game</button>
        </div>
    );
};

export default Home;