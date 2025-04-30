import React from 'react';

interface LeaderboardProps {
    players: string[];
    strokes: string[][][]; // Tracks selected players for each stroke
    shotTypes: string[][][]; // Tracks shot types for each stroke
    goToGame: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players, strokes, shotTypes, goToGame }) => {
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

    const calculateScores = () => {
        const scores: { [player: string]: { [shotType: string]: number } } = {};

        // Initialize scores for each player and shot type
        players.forEach((player) => {
            scores[player] = {};
            shotTypeOptions.forEach((shotType) => {
                scores[player][shotType] = 0;
            });
        });

        // Iterate over strokes and shotTypes to calculate scores
        strokes.forEach((hole, holeIndex) => {
            hole.forEach((strokePlayers, strokeIndex) => {
                strokePlayers.forEach((player) => {
                    const shotType = shotTypes[holeIndex]?.[strokeIndex]?.[0]; // Get the shot type for this stroke
                    if (player && shotType && shotTypeOptions.includes(shotType)) {
                        scores[player][shotType] += 1; // Increment the score for the player and shot type
                    }
                });
            });
        });

        return scores;
    };

    const scores = calculateScores();

    const getTotalScore = (player: string) =>
        shotTypeOptions.reduce((total, shotType) => total + scores[player][shotType], 0);

    const leader = players.reduce((prev, curr) =>
        getTotalScore(curr) > getTotalScore(prev) ? curr : prev
    );

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                minHeight: '100vh', // Center vertically
                backgroundColor: '#e8f5e9', // Shaded green background
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: '1200px', // Center the content within a max width
                    backgroundColor: '#ffffff', // White background for the table
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    padding: '20px',
                }}
            >
                <h1 style={{ textAlign: 'center', color: '#388e3c', fontSize: '2.5rem', marginBottom: '20px' }}>
                    🏌️‍♂️ Leaderboard ⛳
                </h1>
                <div
                    className="table-container"
                    style={{
                        overflowX: 'auto',
                        WebkitOverflowScrolling: 'touch',
                        marginBottom: '20px',
                    }}
                >
                    <table
                        style={{
                            minWidth: '600px',
                            borderCollapse: 'collapse',
                            width: '100%',
                            backgroundColor: '#ffffff',
                        }}
                    >
                        <thead>
                            <tr style={{ backgroundColor: '#388e3c', color: 'white' }}>
                                <th style={{ padding: '10px', border: '1px solid #ccc' }}>Player</th>
                                {shotTypeOptions.map((shotType) => (
                                    <th key={shotType} style={{ padding: '10px', border: '1px solid #ccc' }}>
                                        {shotType}
                                    </th>
                                ))}
                                <th style={{ padding: '10px', border: '1px solid #ccc' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map((player) => (
                                <tr
                                    key={player}
                                    style={{
                                        backgroundColor: player === leader ? '#c8e6c9' : 'white',
                                        fontWeight: player === leader ? 'bold' : 'normal',
                                    }}
                                >
                                    <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                                        {player} {player === leader && '🏆'}
                                    </td>
                                    {shotTypeOptions.map((shotType) => (
                                        <td
                                            key={shotType}
                                            style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}
                                        >
                                            {scores[player][shotType]}
                                        </td>
                                    ))}
                                    <td
                                        style={{
                                            padding: '10px',
                                            border: '1px solid #ccc',
                                            textAlign: 'center',
                                            backgroundColor: '#f1f8e9',
                                        }}
                                    >
                                        {getTotalScore(player)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button
                    onClick={goToGame}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#388e3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        marginTop: '20px',
                        display: 'block',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}
                >
                    Back to Game
                </button>
            </div>
        </div>
    );
};

export default Leaderboard;