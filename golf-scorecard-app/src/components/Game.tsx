import React, { useState } from 'react';

interface GameProps {
    players: string[];
}

const Game: React.FC<GameProps> = ({ players }) => {
    const [currentHole, setCurrentHole] = useState(1);
    const [strokes, setStrokes] = useState<string[][]>([[]]); // Tracks which player's ball was used for each stroke
    const [shotTypes, setShotTypes] = useState<string[][]>([[]]); // Tracks the shot type for each stroke

    const shotTypeOptions = [
        'Drive',
        'Par 3',
        'Hybrid',
        'Iron',
        'Approach',
        'Chip',
        'Putt',
        'Water Hazard',
    ];

    const addStroke = () => {
        const updatedStrokes = [...strokes];
        const updatedShotTypes = [...shotTypes];
        updatedStrokes[currentHole - 1].push(''); // Add a new stroke for the current hole
        updatedShotTypes[currentHole - 1].push(''); // Add a new shot type for the current hole
        setStrokes(updatedStrokes);
        setShotTypes(updatedShotTypes);
    };

    const markPlayerForStroke = (strokeIndex: number, playerName: string) => {
        const updatedStrokes = [...strokes];
        updatedStrokes[currentHole - 1][strokeIndex] = playerName; // Mark the player for the stroke
        setStrokes(updatedStrokes);
    };

    const selectShotType = (strokeIndex: number, shotType: string) => {
        const updatedShotTypes = [...shotTypes];
        updatedShotTypes[currentHole - 1][strokeIndex] = shotType; // Set the shot type for the stroke
        setShotTypes(updatedShotTypes);
    };

    const nextHole = () => {
        if (currentHole < 18) {
            setCurrentHole(currentHole + 1);
            if (!strokes[currentHole]) {
                setStrokes([...strokes, []]); // Initialize strokes for the next hole
                setShotTypes([...shotTypes, []]); // Initialize shot types for the next hole
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
            <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '90%' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ccc', padding: '10px' }}>Stroke</th>
                        <th style={{ border: '1px solid #ccc', padding: '10px' }}>Player</th>
                        <th style={{ border: '1px solid #ccc', padding: '10px' }}>Shot Type</th>
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
                                <select
                                    value={shotTypes[currentHole - 1][index] || ''}
                                    onChange={(e) => selectShotType(index, e.target.value)}
                                    style={{
                                        padding: '5px',
                                        fontSize: '14px',
                                        borderRadius: '5px',
                                        border: '1px solid #ccc',
                                    }}
                                >
                                    <option value="" disabled>
                                        Select Shot Type
                                    </option>
                                    {shotTypeOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
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