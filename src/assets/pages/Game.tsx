import React, { useState } from 'react';
import './Game.css';

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
}

const Game: React.FC = () => {
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
  });

  const [userAnswer, setUserAnswer] = useState<string>(''); // Store user's answer
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | ''>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string>(''); // To show answer feedback

  // Ensure whole number results
// Ensure whole number results, especially for division
const generatePuzzle = (difficulty: 'easy' | 'medium' | 'hard'): Puzzle => {
    let numbers: number[] = [];
    let operators: string[] = [];
    const availableOperators = ['+', '-', '*', '/'];
  
    const getRandomInt = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;
  
    switch (difficulty) {
      case 'easy':
        // Two 2-digit numbers with only + or - operators
        numbers = [getRandomInt(10, 99), getRandomInt(10, 99)];
        operators = [availableOperators[getRandomInt(0, 1)]]; // Only + or -
        break;
      case 'medium':
        // One 2-digit number and 1-digit numbers, mixed operators like "14 / 1 + 4 * 33"
        numbers = [
          getRandomInt(10, 99), // 2-digit number
          getRandomInt(1, 4) * 2,    // 1-digit number
          getRandomInt(1, 4) * 2,    // 1-digit number
          getRandomInt(1, 4) * 2,  // 2-digit number
        ];
        operators = [
          availableOperators[getRandomInt(2, 2)], // * or /
          availableOperators[getRandomInt(0, 1)], // + or -
          availableOperators[getRandomInt(3, 4)]
        ];
        break;
      case 'hard':
        // Three pairs of 1-digit numbers, mixed operators like "8 * 18 + 9 - 9 - 95 / 5"
        numbers = [
          getRandomInt(10, 99), // Single-digit number
          getRandomInt(1, 9), // Two-digit number
          getRandomInt(1, 9), // Single-digit number
          getRandomInt(1, 9), // Two-digit number
          getRandomInt(1, 4) * 2, // Single-digit number
          getRandomInt(1, 9) * 2, // Two-digit number
        ];
        operators = [
          availableOperators[getRandomInt(2, 2)], // * or /
          availableOperators[getRandomInt(0, 1)], // + or -
          availableOperators[getRandomInt(0, 1)], // + or -
          availableOperators[getRandomInt(2, 3)], // * or /
          availableOperators[getRandomInt(0, 1)], // + or -
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
    setDifficulty(selectedDifficulty); // Set the difficulty
    const newPuzzle = generatePuzzle(selectedDifficulty);
    setCurrentGame({
      puzzle: newPuzzle,
      movesTaken: 0,
      score: 0,
      bestScore: currentGame.bestScore,
      gameStarted: true, // Game is now started
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

    setCurrentGame((prev) => ({
      ...prev,
      movesTaken: prev.movesTaken + 1,
      score: prev.score + (isCorrect ? 10 : -5),
      bestScore: Math.max(prev.bestScore, prev.score + (isCorrect ? 10 : -5)),
    }));

    if (isCorrect) {
      setFeedbackMessage('Correct!');
      const newPuzzle = generatePuzzle(difficulty);
      setCurrentGame((prev) => ({
        ...prev,
        puzzle: newPuzzle,
      }));
      setUserAnswer('');
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

  return (
    <div>
      <h1>Math Puzzle Game</h1>
      {!currentGame.gameStarted ? (
        <div className='game-container'>
          <p>Select a difficulty level to start the game:</p>
          <button style={{color: 'green'}} onClick={() => initializeGame('easy')}>Start Game (Easy)</button>
          <button style={{color: 'orange'}} onClick={() => initializeGame('medium')}>Start Game (Medium)</button>
          <button style={{color: 'red'}} onClick={() => initializeGame('hard')}>Start Game (Hard)</button>
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
            <div>Moves Taken: {currentGame.movesTaken}</div>
            <div>Best Score: {currentGame.bestScore}</div>
          </div>
          <button onClick={handleStartGame}>Restart Game</button>
        </>
      )}
    </div>
  );
};

export default Game;
