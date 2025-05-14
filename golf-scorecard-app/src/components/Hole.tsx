import React from 'react';

interface HoleProps {
    holeNumber: number; // Current hole number (1-based index)
    courseInfo: {
        name: string;
        par: number[];
    };
}

const Hole: React.FC<HoleProps> = ({ holeNumber, courseInfo }) => {
    const parForHole = courseInfo.par[holeNumber - 1]; // Get the par for the current hole

    return (
        <div className="hole-container">
            <h1>{courseInfo.name}</h1>
            <h2>Hole {holeNumber}</h2>
            <p>Par: {parForHole}</p>
        </div>
    );
};

export default Hole;