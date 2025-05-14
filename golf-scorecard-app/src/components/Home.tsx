import React, { useState } from 'react';
import './Home.css';

interface CourseInfo {
    name: string;
    par: number[];
}

interface HomeProps {
    startGame: (playerNames: string[], courseInfo: CourseInfo | null) => void;
}

const Home: React.FC<HomeProps> = ({ startGame }) => {
    const [playerNames, setPlayerNames] = useState<string[]>(['']);
    const [courseQuery, setCourseQuery] = useState('');
    const [courseResults, setCourseResults] = useState<CourseInfo[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<CourseInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleNameChange = (index: number, value: string) => {
        const updatedNames = [...playerNames];
        updatedNames[index] = value;
        setPlayerNames(updatedNames);
    };

    const addPlayer = () => {
        setPlayerNames([...playerNames, '']);
    };

    const handleCourseSearch = async () => {
        setLoading(true);
        setError(null);
        setCourseResults([]);
        setSelectedCourse(null);

        try {
            const response = await fetch(
                `https://api.golfcourseapi.com/v1/search?search_query=${encodeURIComponent(courseQuery)}`,
                {
                    headers: {
                        Authorization: `Key ${process.env.REACT_APP_GOLF_API_KEY}`,
                    },
                }
            );
            if (!response.ok) throw new Error('API error');
            const data = await response.json();

            // Map API response to CourseInfo[]
            const courses: CourseInfo[] = (data.courses || []).map((course: any) => ({
                name: course.course_name || course.club_name || 'Unknown Course',
                par: course.tees?.male?.[0]?.holes?.map((hole: any) => hole.par) || [],
            }));

            setCourseResults(courses);
        } catch (err) {
            setError('Failed to fetch courses. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleStartGame = () => {
        const filteredNames = playerNames.filter((name) => name.trim() !== '');
        startGame(filteredNames, selectedCourse);
    };

    return (
        <div className="home-container">
            <h1 style={{ textAlign: 'center', color: '#2380d7' }}>Enter Player Names</h1>
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

            {/* Golf course search section BELOW player inputs */}
            <div style={{ marginTop: 30, textAlign: 'center' }}>
                <h2 style={{ fontWeight: 'bold' }}>Select Golf Course</h2>
                <input
                    type="text"
                    placeholder="Enter course name"
                    value={courseQuery}
                    onChange={e => setCourseQuery(e.target.value)}
                    style={{ marginRight: 8 }}
                />
                <button onClick={handleCourseSearch} disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
                {error && <div className="error">{error}</div>}
                {courseResults.length > 0 && (
                    <ul style={{ listStyle: 'disc', margin: '16px 0', paddingLeft: 40, textAlign: 'left', display: 'inline-block' }}>
                        {courseResults.map((course, idx) => (
                            <li
                                key={idx}
                                className={selectedCourse?.name === course.name ? 'selected' : ''}
                                onClick={() => setSelectedCourse(course)}
                                style={{
                                    cursor: 'pointer',
                                    fontWeight: selectedCourse?.name === course.name ? 'bold' : 'normal',
                                    marginBottom: 4
                                }}
                            >
                                {course.name}
                            </li>
                        ))}
                    </ul>
                )}
                {selectedCourse && (
                    <div style={{ marginTop: 16 }}>
                        <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>
                            Selected Course: {selectedCourse.name}
                        </div>
                        <div>
                            Par for each hole: {selectedCourse.par.join(', ')}
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={handleStartGame}
                className="start-game-button"
                disabled={!selectedCourse}
                style={{ marginTop: 30 }}
            >
                Start Game
            </button>
        </div>
    );
};

export default Home;