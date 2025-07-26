import React, { useEffect, useState } from "react";

interface HoleProps {
  number: number;
}

interface HoleData {
  par: number;
  yardage: number;
  handicap?: number;
}

const HoleInfoCard: React.FC<HoleProps> = ({ number }) => {
  const [holeData, setHoleData] = useState<HoleData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHoleData = async () => {
      try {
        const apiKey = process.env.REACT_APP_GOLF_API_KEY;
        const response = await fetch(
          `https://golf-leaderboard-api.com/api/holes/${number}`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch hole data");

        const data = await response.json();
        setHoleData(data);
      } catch (err) {
        setError("Unable to load hole information.");
      }
    };

    fetchHoleData();
  }, [number]);

  if (error) return <div className="hole-info-error">{error}</div>;
  if (!holeData)
    return <div className="hole-info-loading">Loading hole info...</div>;

  return (
    <div className="hole-info">
      <h4>Hole {number}</h4>
      <ul>
        <li>Par: {holeData.par}</li>
        <li>Yardage: {holeData.yardage} yds</li>
        {holeData.handicap !== undefined && (
          <li>Handicap: {holeData.handicap}</li>
        )}
      </ul>
    </div>
  );
};

export default HoleInfoCard;
