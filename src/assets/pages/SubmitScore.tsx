import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../index.css';
interface LeaderboardEntry {
  name: string;
  score: number;
}

interface SubmitScoreProps {
  setLeaderboard: (leaderboard: {
    easy: LeaderboardEntry[];
    medium: LeaderboardEntry[];
    hard: LeaderboardEntry[];
  }) => void;
}

const SubmitScore: React.FC<SubmitScoreProps> = ({ setLeaderboard }) => {
  const location = useLocation();
  const { score, difficulty } = location.state || { score: 0, difficulty: 'easy' } as { score: number, difficulty: 'easy' | 'medium' | 'hard' };
  const [playerName, setPlayerName] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmitName = () => {
    const newEntry: LeaderboardEntry = { name: playerName, score };
    setLeaderboard((prev) => {
      const updatedLeaderboard = { ...prev };
      updatedLeaderboard[difficulty].push(newEntry);
      localStorage.setItem('leaderboard', JSON.stringify(updatedLeaderboard));
      return updatedLeaderboard;
    });
    navigate('/leaderboard');
  };

  return (
    <div>
      <h1>You did it! Well done!</h1>
      <p>Final score: {score}</p>
      <p>Enter your name:</p>
      <input
        type="text"
        placeholder="Enter your name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        className="name-input"
      />
      <button
        onClick={handleSubmitName}
      >
        Submit
      </button>
    </div>
  );
};

export default SubmitScore;