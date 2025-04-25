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

    return (
        <div>
            <h1>Leaderboard</h1>
            <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '90%' }}>
                <thead>
                    <tr>
                        <th>Player</th>
                        {shotTypeOptions.map((shotType) => (
                            <th key={shotType}>{shotType}</th>
                        ))}
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map((player) => (
                        <tr key={player}>
                            <td>{player}</td>
                            {shotTypeOptions.map((shotType) => (
                                <td key={shotType}>{scores[player][shotType]}</td>
                            ))}
                            <td>
                                {shotTypeOptions.reduce(
                                    (total, shotType) => total + scores[player][shotType],
                                    0
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button
                onClick={goToGame}
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
                Back to Game
            </button>
        </div>
    );
};

export default Leaderboard;