import React, { useState } from 'react';

interface GameProps {
    players: string[];
}

const Game: React.FC<GameProps> = ({ players }) => {
    const [currentHole, setCurrentHole] = useState(1);
    const [strokes, setStrokes] = useState<string[][]>([[]]); // Tracks which player's ball was used for each stroke

    const addStroke = () => {
        const updatedStrokes = [...strokes];
        updatedStrokes[currentHole - 1].push(''); // Add a new stroke for the current hole
        setStrokes(updatedStrokes);
    };

    const markPlayerForStroke = (strokeIndex: number, playerName: string) => {
        const updatedStrokes = [...strokes];
        updatedStrokes[currentHole - 1][strokeIndex] = playerName; // Mark the player for the stroke
        setStrokes(updatedStrokes);
    };

    const nextHole = () => {
        if (currentHole < 18) {
            setCurrentHole(currentHole + 1);
            if (!strokes[currentHole]) {
                setStrokes([...strokes, []]); // Initialize strokes for the next hole
            }
        } else {
            alert('Game Over!');
        }
    };

    const previousHole = () => {
        if (currentHole > 1) {
            setCurrentHole(currentHole - 1);
        }
    };

    return (
        <div>
            <h1>Hole {currentHole}</h1>
            <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '80%' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ccc', padding: '10px' }}>Stroke</th>
                        <th style={{ border: '1px solid #ccc', padding: '10px' }}>Player</th>
                        <th style={{ border: '1px solid #ccc', padding: '10px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {strokes[currentHole - 1].map((player, index) => (
                        <tr key={index}>
                            <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                                Stroke {index + 1}
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                                {player || 'Unassigned'}
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                                {players.map((playerName) => (
                                    <button
                                        key={playerName}
                                        onClick={() => markPlayerForStroke(index, playerName)}
                                        style={{
                                            padding: '5px 10px',
                                            margin: '5px',
                                            backgroundColor: '#1976d2',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {playerName}
                                    </button>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button
                onClick={addStroke}
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Add Stroke
            </button>
            <div style={{ marginTop: '20px' }}>
                <button
                    onClick={previousHole}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginRight: '10px',
                    }}
                    disabled={currentHole === 1} // Disable "Back" button on the first hole
                >
                    Back
                </button>
                <button
                    onClick={nextHole}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    {currentHole < 18 ? 'Next Hole' : 'Finish Game'}
                </button>
            </div>
        </div>
    );
};

export default Game;