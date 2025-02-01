import './App.css';
import Game from './assets/pages/Game';
import Welcomescreen from './assets/pages/Welcomescreen';
import Leaderboard from './assets/pages/Leaderboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SubmitScore from './assets/pages/SubmitScore';

type Leaderboard = {
  easy: LeaderboardEntry[];
  medium: LeaderboardEntry[];
  hard: LeaderboardEntry[];
};

type LeaderboardEntry = {
  name: string;
  score: number;
};

function App() {
  const [leaderboard, setLeaderboard] = useState<Leaderboard>({easy: [], medium: [], hard: []});

  useEffect(() => {
    const storedLeaderboard = localStorage.getItem('leaderboard');
    if (storedLeaderboard) {
      setLeaderboard(JSON.parse(storedLeaderboard));
    }
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcomescreen />} />
        <Route path="/game" element={<Game setLeaderboard={setLeaderboard}  />} />
        <Route path="/submit-score" element={<SubmitScore setLeaderboard={setLeaderboard} />} />
        <Route path="/leaderboard" 
        element={<Leaderboard leaderboard={leaderboard} />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;