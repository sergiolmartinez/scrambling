import React from 'react';

interface GameProps {
    players: string[];
    strokes: string[][];
    setStrokes: React.Dispatch<React.SetStateAction<string[][]>>;
    shotTypes: string[][];
    setShotTypes: React.Dispatch<React.SetStateAction<string[][]>>;
    currentHole: number;
    setCurrentHole: React.Dispatch<React.SetStateAction<number>>;
    goToLeaderboard: () => void;
}

const Game: React.FC<GameProps> = ({
    players,
    strokes,
    setStrokes,
    shotTypes,
    setShotTypes,
    currentHole,
    setCurrentHole,
    goToLeaderboard,
}) => {
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

        if (!updatedStrokes[currentHole - 1]) {
            updatedStrokes[currentHole - 1] = [];
        }
        if (!updatedShotTypes[currentHole - 1]) {
            updatedShotTypes[currentHole - 1] = [];
        }

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

            // Initialize strokes and shot types for the next hole if not already present
            if (!strokes[currentHole]) {
                setStrokes([...strokes, []]);
            }
            if (!shotTypes[currentHole]) {
                setShotTypes([...shotTypes, []]);
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
                        <th>Stroke</th>
                        <th>Player</th>
                        <th>Shot Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {strokes[currentHole - 1]?.map((player, index) => (
                        <tr key={index}>
                            <td>Stroke {index + 1}</td>
                            <td>{player || 'Unassigned'}</td>
                            <td>
                                <select
                                    value={shotTypes[currentHole - 1]?.[index] || ''}
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
                            <td>
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
            <button onClick={addStroke}>Add Stroke</button>
            <button onClick={previousHole} disabled={currentHole === 1}>
                Back
            </button>
            <button onClick={nextHole}>{currentHole < 18 ? 'Next Hole' : 'Finish Game'}</button>
            <button onClick={goToLeaderboard}>Leaderboard</button>
        </div>
    );
};

export default Game;