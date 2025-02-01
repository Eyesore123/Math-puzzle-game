import React, { useState, useEffect } from 'react';
import './Game.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

interface Puzzle {
  numbers: number[];
  operators: string[];
  result: number;
}

interface GameState {
  puzzle: Puzzle;
  movesTaken: number;
  score: number;
  bestScore: number;
  gameStarted: boolean;
  questionsAnswered: number;
  gameOver: boolean;
}

interface LeaderboardEntry {
  name: string;
  score: number;
}

interface GameProps {
  setLeaderboard: (leaderboard: {
    easy: LeaderboardEntry[];
    medium: LeaderboardEntry[];
    hard: LeaderboardEntry[];
  }) => void;
}

const Game: React.FC<GameProps> = ({ setLeaderboard }) => {
  const [currentGame, setCurrentGame] = useState<GameState>({
    puzzle: {
      numbers: [],
      operators: [],
      result: 0,
    },
    movesTaken: 0,
    score: 0,
    bestScore: 0,
    gameStarted: false,
    questionsAnswered: 0,
    gameOver: false
  });

  const [userAnswer, setUserAnswer] = useState<string>('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | ''>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('');


  const generatePuzzle = (difficulty: 'easy' | 'medium' | 'hard'): Puzzle => {
    let numbers: number[] = [];
    let operators: string[] = [];
    const availableOperators = ['+', '-', '*', '/'];
  
    const getRandomInt = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;
  
    switch (difficulty) {
      case 'easy':
    
        numbers = [getRandomInt(10, 99), getRandomInt(10, 99)];
        operators = [availableOperators[getRandomInt(0, 1)]]; // Only + or -
        break;
      case 'medium':
       
        numbers = [
          getRandomInt(10, 99),
          getRandomInt(1, 4) * 2, 
          getRandomInt(1, 4) * 2,
          getRandomInt(1, 4) * 2, 
        ];
        operators = [
          availableOperators[getRandomInt(2, 2)],
          availableOperators[getRandomInt(0, 1)],
          availableOperators[getRandomInt(3, 4)]
        ];
        break;
      case 'hard':
       
        numbers = [
          getRandomInt(10, 99),
          getRandomInt(1, 9),
          getRandomInt(1, 9),
          getRandomInt(1, 9),
          getRandomInt(1, 4) * 2,
          getRandomInt(10, 99) * 2, 
        ];
        operators = [
          availableOperators[getRandomInt(2, 2)],
          availableOperators[getRandomInt(0, 1)],
          availableOperators[getRandomInt(0, 1)], 
          availableOperators[getRandomInt(2, 3)],
          availableOperators[getRandomInt(0, 1)],
        ];
        break;
      default:
        throw new Error(`Invalid difficulty level: ${difficulty}`);
    }
  
    // Create the expression string
    const expression = numbers.reduce(
      (acc, num, idx) => (idx === 0 ? `${num}` : `${acc} ${operators[idx - 1]} ${num}`),
      ''
    );
  
    const result = Math.round(eval(expression) * 10) / 10; // Round to 1 decimal place
  
    return {
      numbers,
      operators,
      result,
    };
  };
  
  
  const initializeGame = (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(selectedDifficulty);
    const newPuzzle = generatePuzzle(selectedDifficulty);
    setCurrentGame({
      puzzle: newPuzzle,
      movesTaken: 0,
      score: 0,
      bestScore: currentGame.bestScore,
      gameStarted: true,
      questionsAnswered: 0,
      gameOver: false
    });
  };

// Event listerer for Enter key press

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleAnswerSubmit();
    }
  };

  const handleAnswerSubmit = () => {
    const correctAnswer = currentGame.puzzle.result;
    // Normalize the commas to decimal points
      const normalizedAnswer = userAnswer.replace(',', '.');
    const isCorrect = parseFloat(normalizedAnswer) === correctAnswer;

      // Declare variables for score keeping track of the number of questions answered

      setCurrentGame((prev) => {
        const newQuestionsAnswered = prev.questionsAnswered + 1;
        const newGameOver = newQuestionsAnswered >= 10;
      
        return {
  
          ...prev,
          movesTaken: prev.movesTaken + 1,
          score: prev.score + (isCorrect ? 10 : -5),
          bestScore: Math.max(prev.bestScore, prev.score + (isCorrect ? 10 : -5)),
          questionsAnswered: newQuestionsAnswered,
          gameOver: newGameOver,
        };
      });
    if (isCorrect) {
      setFeedbackMessage('Correct!');
      if(!currentGame.gameOver){
        if (difficulty !== '') {
          const newPuzzle = generatePuzzle(difficulty);
          setCurrentGame((prev) => ({
            ...prev,
            puzzle: newPuzzle,
          }));
          setUserAnswer('');
        }
      }
    } else {
      setFeedbackMessage('Incorrect, try again.');
    }
  };

  const handleStartGame = () => {
    setFeedbackMessage('');
    setUserAnswer('');
    setCurrentGame((prev) => ({
      ...prev,
      gameStarted: false,
    }));
  };


  const navigate = useNavigate();

  // Player gets sent to Leaderboard page after game is over

  useEffect(() => {
    if (currentGame.gameOver) {
        const leaderboard = {
            easy: [],
            medium: [],
            hard: [],
        };
        setLeaderboard(leaderboard);
        navigate('/submit-score', { state: { score: currentGame.score, difficulty } });
    }
}, [currentGame.gameOver, currentGame.score, difficulty, navigate, setLeaderboard]);


  return (
    <div>
      <h1>Math Puzzle Game</h1>
      {!currentGame.gameStarted ? (
        <div className='game-container'>
          <p>Select a difficulty level to start the game:</p>
          <button style={{color: 'green'}} onClick={() => initializeGame('easy')}>Start Game (Easy)</button>
          <button style={{color: 'orange'}} onClick={() => initializeGame('medium')}>Start Game (Medium)</button>
          <button style={{color: 'red'}} onClick={() => initializeGame('hard')}>Start Game (Hard)</button>
          <p>Or check out the leaderboard and see how others did!</p>
            <button>
            <Link to="/leaderboard">
          Leaderboard
            </Link>
            </button>
        </div>
      ) : (
        <>
          <div>
            <h2>{feedbackMessage}</h2>
            <h2>Puzzle</h2>
            <div className='numbers'>{currentGame.puzzle.numbers.map((num, idx) => (
                <span key={idx}>{num} {currentGame.puzzle.operators[idx] || ''} </span>
              ))}
            </div>
          </div>
          <div>
            <h2>Enter Your Answer</h2>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleAnswerSubmit}>Submit</button>
          </div>
          <div>
            <h2>Stats</h2>
            <div>Score: {currentGame.score}</div>
            <div>Questions answered: {currentGame.movesTaken}</div>
            <div>Best Score: {currentGame.bestScore}</div>
          </div>
          <button onClick={handleStartGame}>Restart Game</button>
        </>
      )}

      {currentGame.gameOver && (
        <div>
          <h2>Game Over</h2>
          <p>Your final score is: {currentGame.score}</p>
          <p>Best Score: {currentGame.bestScore}</p>
          <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className='name-input'
        />

          <button onClick={handleStartGame}>Restart Game</button>
        </div>
      )}

    </div>
  );
};

export default Game;
