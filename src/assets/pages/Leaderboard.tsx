import React from 'react';
import { Link } from 'react-router-dom';
import '../../index.css';
import './Game.css';
interface LeaderboardEntry {
  name: string;
  score: number;
}

interface LeaderboardProps {
  leaderboard: {
    easy: LeaderboardEntry[];
    medium: LeaderboardEntry[];
    hard: LeaderboardEntry[];
  };
}

const Leaderboard: React.FC<LeaderboardProps> = ({ leaderboard }) => {

    const sortedEasy = [...leaderboard.easy]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
    const sortedMedium = [...leaderboard.medium]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
    const sortedHard = [...leaderboard.hard]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return (
    <div>
      <h1>Leaderboard</h1>
      <h2>Easy</h2>
      <ul>
        {sortedEasy.length === 0 ? <li>No entries yet</li> : null}
        {sortedEasy.map((entry, index) => (
          <li key={index}>
            {index + 1}. {entry.name}: {entry.score}{' points'}
            {/* No entries -> 'No entries yet' */}
          </li>
        ))}
      </ul>
      <h2>Medium</h2>
      <ul>
        {sortedMedium.length === 0 ? <li>No entries yet</li> : null}
        {sortedMedium.map((entry, index) => (
          <li key={index}>
            {index + 1}. {entry.name}: {entry.score}
          </li>
        ))}
      </ul>
      <h2>Hard</h2>
      <ul>
        {sortedHard.length === 0 ? <li>No entries yet</li> : null}
        {sortedHard.map((entry, index) => (
          <li key={index}>
            {index + 1}. {entry.name}: {entry.score}
          </li>
        ))}
      </ul>
      <p>
        <button>
      <Link to="/Game">
        Try again?
      </Link>
      </button>
      </p>
    </div>
  );
};

export default Leaderboard;