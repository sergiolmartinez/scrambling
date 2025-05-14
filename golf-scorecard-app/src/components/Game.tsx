import React from 'react';

interface GameProps {
    players: string[];
    strokes: string[][][]; // Tracks selected players for each stroke
    setStrokes: React.Dispatch<React.SetStateAction<string[][][]>>;
    shotTypes: string[][][]; // Tracks shot types for each stroke
    setShotTypes: React.Dispatch<React.SetStateAction<string[][][]>>;
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
        'Gimme', // Added Gimme as a shot type option
        'Water Hazard',
    ];

    // Calculate the cumulative strokes across all holes
    const totalStrokes = shotTypes.reduce((total, hole) => {
        return (
            total +
            hole.reduce((holeTotal, stroke) => {
                // Count only strokes where a shot type is selected
                return holeTotal + (stroke[0] ? 1 : 0);
            }, 0)
        );
    }, 0);

    const addStroke = () => {
        const updatedStrokes = [...strokes];
        const updatedShotTypes = [...shotTypes];

        if (!updatedStrokes[currentHole - 1]) {
            updatedStrokes[currentHole - 1] = [];
        }
        if (!updatedShotTypes[currentHole - 1]) {
            updatedShotTypes[currentHole - 1] = [];
        }

        updatedStrokes[currentHole - 1].push([]); // Add a new stroke for the current hole
        updatedShotTypes[currentHole - 1].push([]); // Add a new shot type for the current hole

        setStrokes(updatedStrokes);
        setShotTypes(updatedShotTypes);
    };

    const removeStroke = (strokeIndex: number) => {
        const updatedStrokes = [...strokes];
        const updatedShotTypes = [...shotTypes];

        if (updatedStrokes[currentHole - 1]) {
            updatedStrokes[currentHole - 1].splice(strokeIndex, 1); // Remove the stroke
        }
        if (updatedShotTypes[currentHole - 1]) {
            updatedShotTypes[currentHole - 1].splice(strokeIndex, 1); // Remove the shot type
        }

        setStrokes(updatedStrokes);
        setShotTypes(updatedShotTypes);
    };

    const togglePlayerForStroke = (strokeIndex: number, playerName: string) => {
        const updatedStrokes = [...strokes];
        const currentStrokePlayers = updatedStrokes[currentHole - 1][strokeIndex] || [];

        if (currentStrokePlayers.includes(playerName)) {
            // Remove the player if already selected
            updatedStrokes[currentHole - 1][strokeIndex] = currentStrokePlayers.filter(
                (name) => name !== playerName
            );
        } else {
            // Add the player if not already selected
            updatedStrokes[currentHole - 1][strokeIndex] = [...currentStrokePlayers, playerName];
        }

        setStrokes(updatedStrokes);
    };

    const selectShotType = (strokeIndex: number, shotType: string) => {
        const updatedShotTypes = [...shotTypes];
        const currentPlayers = strokes[currentHole - 1][strokeIndex] || [];

        if (shotType === 'Gimme' || shotType === 'Water Hazard') {
            // Allow "Gimme" and "Water Hazard" to be selected without players
            updatedShotTypes[currentHole - 1][strokeIndex] = [shotType];
        } else {
            // Assign the shot type to each selected player for this stroke
            updatedShotTypes[currentHole - 1][strokeIndex] = currentPlayers.map(() => shotType);
        }

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
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
                Hole {currentHole} - Total Strokes: {totalStrokes}
            </h1>
            <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
                <table
                    style={{
                        margin: '0 auto',
                        borderCollapse: 'collapse',
                        width: '100%',
                        maxWidth: '100%',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <thead>
                        <tr style={{ backgroundColor: '#1976d2', color: 'white' }}>
                            <th style={{ padding: '10px', textAlign: 'left', whiteSpace: 'nowrap' }}>Stroke</th>
                            <th style={{ padding: '10px', textAlign: 'left', whiteSpace: 'nowrap' }}>Player</th>
                            <th style={{ padding: '10px', textAlign: 'left', whiteSpace: 'nowrap' }}>Shot Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {strokes[currentHole - 1]?.map((strokePlayers, index) => (
                            <tr key={index}>
                                <td style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap' }}>
                                    Stroke {index + 1}{' '}
                                    <span
                                        onClick={() => removeStroke(index)}
                                        style={{
                                            cursor: 'pointer',
                                            color: 'red',
                                            marginLeft: '10px',
                                            fontSize: '1.2rem',
                                        }}
                                        title="Remove Stroke"
                                    >
                                        🗑️
                                    </span>
                                </td>
                                <td style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        {players.map((playerName) => (
                                            <button
                                                key={playerName}
                                                onClick={() => togglePlayerForStroke(index, playerName)}
                                                style={{
                                                    padding: '10px',
                                                    backgroundColor: strokePlayers?.includes(playerName)
                                                        ? '#1976d2'
                                                        : '#ccc',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {playerName}
                                            </button>
                                        ))}
                                    </div>
                                </td>
                                <td style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap' }}>
                                    <select
                                        value={shotTypes[currentHole - 1]?.[index]?.[0] || ''}
                                        onChange={(e) => selectShotType(index, e.target.value)}
                                        style={{
                                            padding: '5px',
                                            fontSize: '14px',
                                            borderRadius: '5px',
                                            border: '1px solid #ccc',
                                            maxWidth: '150px',
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={{ textAlign: 'center' }}>
                <button
                    onClick={addStroke}
                    style={{
                        padding: '10px 20px',
                        margin: '10px',
                        backgroundColor: '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Add Stroke
                </button>
                <button
                    onClick={previousHole}
                    disabled={currentHole === 1}
                    style={{
                        padding: '10px 20px',
                        margin: '10px',
                        backgroundColor: currentHole === 1 ? '#ccc' : '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: currentHole === 1 ? 'not-allowed' : 'pointer',
                    }}
                >
                    Back
                </button>
                <button
                    onClick={nextHole}
                    style={{
                        padding: '10px 20px',
                        margin: '10px',
                        backgroundColor: '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    {currentHole < 18 ? 'Next Hole' : 'Finish Game'}
                </button>
                <button
                    onClick={goToLeaderboard}
                    style={{
                        padding: '10px 20px',
                        margin: '10px',
                        backgroundColor: '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Leaderboard
                </button>
            </div>
        </div>
    );
};

export default Game;