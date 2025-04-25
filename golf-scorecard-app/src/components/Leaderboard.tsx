import React from 'react';

interface LeaderboardProps {
    players: string[];
    strokes: string[][];
    shotTypes: string[][];
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
    ]; // Exclude "Water Hazard"

    const calculateScores = () => {
        const scores: { [player: string]: { [shotType: string]: number } } = {};

        // Initialize scores for each player and shot type
        players.forEach((player) => {
            scores[player] = {};
            shotTypeOptions.forEach((shotType) => {
                scores[player][shotType] = 0;
            });
        });

        // Calculate scores based on strokes and shot types
        strokes.forEach((hole, holeIndex) => {
            hole.forEach((player, strokeIndex) => {
                const shotType = shotTypes[holeIndex]?.[strokeIndex];
                if (player && shotType && shotTypeOptions.includes(shotType)) {
                    scores[player][shotType] += 1; // Increment the score for the player and shot type
                }
            });
        });

        return scores;
    };

    const scores = calculateScores();

    // Find the player with the highest total score
    const getTotalScore = (player: string) =>
        shotTypeOptions.reduce((total, shotType) => total + scores[player][shotType], 0);

    const leader = players.reduce((prev, curr) =>
        getTotalScore(curr) > getTotalScore(prev) ? curr : prev
    );

    return (
        <div style={{ backgroundColor: '#e8f5e9', padding: '20px', borderRadius: '10px' }}>
            <h1 style={{ textAlign: 'center', color: '#388e3c', fontSize: '2.5rem' }}>
                🏌️‍♂️ Golf Leaderboard ⛳
            </h1>
            <table
                style={{
                    margin: '20px auto',
                    borderCollapse: 'collapse',
                    width: '90%',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '10px',
                    overflow: 'hidden',
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
            <button
                onClick={goToGame}
                style={{
                    display: 'block',
                    margin: '20px auto',
                    padding: '10px 20px',
                    backgroundColor: '#388e3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                }}
            >
                Back to Game
            </button>
        </div>
    );
};

export default Leaderboard;