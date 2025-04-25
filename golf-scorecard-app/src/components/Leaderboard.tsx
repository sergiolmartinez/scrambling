import React from 'react';

interface LeaderboardProps {
    players: string[];
    strokes: string[][];
    goToGame: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players, strokes, goToGame }) => {
    const calculateScores = () => {
        const scores: { [key: string]: number } = {};
        players.forEach((player) => {
            scores[player] = 0;
        });

        strokes.forEach((hole) => {
            hole.forEach((player) => {
                if (player) {
                    scores[player] += 1; // Add 1 point per stroke
                }
            });
        });

        return scores;
    };

    const scores = calculateScores();

    return (
        <div>
            <h1>Leaderboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(scores).map(([player, score]) => (
                        <tr key={player}>
                            <td>{player}</td>
                            <td>{score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={goToGame}>Back to Game</button>
        </div>
    );
};

export default Leaderboard;