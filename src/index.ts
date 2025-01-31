import React, { useState, useEffect } from 'react';

interface Puzzle {
  numbers: string[];
  operators: string;
  result: number;
}

interface GameState {
  puzzle: Puzzle;
  movesTaken: number;
  score: number;
  bestScore: number;
  rank: number;
}

const Game: React.FC = () => {
  const [puzzle, setPuzzle] = useState<Puzzle>({
    numbers: ['2', '3', '4', '5', '+', '-', '*', '/'],
    operators: '+-*/',
    result: 3,
  });

  const [movesTaken, setMovesTaken] = useState(0);
  const [score, setScore] = useState(150);
  const [bestScore, setBestScore] = useState(150);
  const [rank, setRank] = useState(0);

  const [currentGame, setCurrentGame] = useState<GameState>({
    puzzle: {
      numbers: ['2', '3', '4', '5', '+', '-', '*', '/'],
      operators: '+-*/',
      result: 3,
    },
    movesTaken: 0,
    score: 0,
    bestScore: 0,
    rank: 0,
  });

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const difficultyLevels = ['easy', 'medium', 'hard'] as const;
    type Difficulty = typeof difficultyLevels[number];

    const generatePuzzle = (difficulty: Difficulty): Puzzle => {
      let puzzle: Puzzle;
      switch (difficulty) {
        case 'easy':
          puzzle = generateEasyPuzzle();
          break;
        case 'medium':
          puzzle = generateMediumPuzzle();
          break;
        case 'hard':
          puzzle = generateHardPuzzle();
          break;
      }
      return { ...puzzle, result: puzzle.result };
    };

    const generateEasyPuzzle = (): Puzzle => {
      const numbers = ['1', '2', '3', '4'];
      const operators = '+-*/'.split('');
      const result = eval(numbers.join('') + (operators[Math.floor(Math.random() * operators.length)]));
      return {
        numbers: [...numbers, ...operators],
        operators: operators.join(''),
        result,
      };
    };

    const generateMediumPuzzle = (): Puzzle => {
      const numbers = ['1', '2', '3', '4'];
      const operators = '+-*/'.split('');
      const operatorWeightage = { '+': 0.5, '-': 0.6, '*': 0.8, '/': 1 };

      let puzzle: Puzzle;
      do {
        puzzle = {
          numbers: [...numbers],
          operators: operators.join(''),
          result: 0,
        };
        for (let i of ['+', '-', '*', '/']) {
          if (Math.random() < operatorWeightage[i]) {
            const idx = operators.indexOf(i);
            puzzle.operators = operators.splice(idx, 1).join('');
            puzzle.operators = operators.unshift(i).join('');
            break;
          }
        }
      } while (puzzle.result > 20 || puzzle.result < -20);

      return puzzle;
    };

    const generateHardPuzzle = (): Puzzle => {
      const numbers = ['1', '2', '3', '4', '5'];
      const operators = '+-*/'.split('');

      let puzzle: Puzzle;
      do {
        puzzle = {
          numbers: [...numbers],
          operators: operators.join(''),
          result: Math.floor(Math.random() * 10) - 5,
        };

        while (puzzle.operators.length < 4) {
          const newOperator = ['+', '-', '*', '/'][Math.floor(Math.random() * 4)];
          puzzle.operators += newOperator;
        }

        const randomizedOperators = [...puzzle.operators].sort(() => Math.random() - 0.5).join('');
        puzzle.operators = randomizedOperators;

        try {
          let value = parseExpression(puzzle.numbers.join(''), puzzle.operators);
          if (!isNaN(value) && Math.abs(value - puzzle.result) < 0.1) {
            break;
          }
        } catch (e) {
          continue;
        }
      } while (puzzle.operators.length > 3);

      return puzzle;
    };

    const parseExpression = (expr: string, operators: string): number => {
      try {
        if (expr.includes('Error') || expr.includes('NaN')) return NaN;

        let value = Number(expr.split(',').map(num => +num).join(''));
        const currentOperators = operators.split('').filter(op => op !== '');

        while (currentOperators.length > 0 && !currentOperators.every(op => {
          if (['+', '-'].includes(op)) {
            const a = value;
            const b = parseExpression(currentOperators.find(i => i === op)!, operators.slice(0, i));
            return (a + b === expr) || (a - b === expr);
          } else if (['*', '/'].includes(op)) {
            const a = value;
            const b = parseExpression(currentOperators.find(i => i === op)!, operators.slice(0, i));
            return (a * b === expr) || (a / b === expr);
          }
        }));

        return value;
      } catch (e) {
        console.error('Error parsing expression:', expr);
        return NaN;
      }
    };

    const difficulty = difficultyLevels[Math.floor(Math.random() * difficultyLevels.length)];
    const newPuzzle = generatePuzzle(difficulty);
    setPuzzle(newPuzzle);
    setCurrentGame({
      puzzle: newPuzzle,
      movesTaken: 0,
      score: 0,
      bestScore: 0,
      rank: 0,
    });
  };

  const playGame = () => {
    if (currentGame.movesTaken >= movesTaken) return;

    const winningCondition = currentGame.puzzle.numbers.every((num, i) =>
      num === currentGame.puzzle.result.toString() || (i % 2 === 0 && parseInt(num) !== undefined)
    );

    setCurrentGame(prev => ({
      ...prev,
      puzzle: prev.puzzle,
      movesTaken: Math.max(0, movesTaken + 1),
      score: calculateScore(currentGame.puzzle.operators.length),
      bestScore: isBest(currentGame.bestScore, currentGame.score),
      rank: prev.rank,
    }));

    return winningCondition;
  };

  const isBest = (best: number, newBest: number) => {
    if (newBest > best || best === undefined) {
      if (best === undefined) {
        return newBest;
      } else {
        return Math.max(newBest, best);
      }
    } else {
      return best;
    }
  };

  const calculateScore = (operatorsUsed: number) => {
    const score = operatorsUsed - 1;
    return score;
  };

  return (
    <div>
      <h1>Math Puzzle Game</h1>
      <div>
        <button onClick={initializeGame}>New Game</button>
      </div>
      <div>
        <h2>Puzzle</h2>
        <div>{puzzle.numbers.join(' ')}</div>
        <div>{puzzle.operators}</div>
        <div>Result: {puzzle.result}</div>
      </div>
      <div>
        <h2>Game State</h2>
        <div>Moves Taken: {currentGame.movesTaken}</div>
        <div>Score: {currentGame.score}</div>
        <div>Best Score: {currentGame.bestScore}</div>
        <div>Rank: {currentGame.rank}</div>
      </div>
    </div>
  );
};

export default Game;