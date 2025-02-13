import '../../index.css';
import './Welcomescreen.css';
import './Landingpagefooter.css';
import GithubIcon from '../Github.png';

import { useEffect } from 'react';

export default function Welcomescreen() {

  useEffect(() => {
    const landingpagefooter = document.getElementById('landingpagefooter');
    if (landingpagefooter) {
      landingpagefooter.addEventListener('click', function() {
        landingpagefooter.style.display = 'none';
      });
    }
  }, []);

  return (
    <div>
      <h1>Welcome to Math Puzzle Game!</h1>
      <p className='instructions'>This is a game where you solve math questions and do simple mental arithmetic. Difficulty levels are easy, medium, and hard. You get points for each correct answer and negative points for incorrect answers.</p>
      <h2 className='instructions'>Instructions:</h2>
        <p className='instructions'>1. Choose a difficulty level.<br />
        2. Solve the questions one at a time.<br />
        3. Enter your answer with Enter key or by clicking the Submit button.<br />
        4. If your answer is correct, you move to the next question until you've solved all the questions.<br />
        5. Right answers may contain decimals. When there are decimals, type answer with one decimal point.<br />
        </p>
      <div className='instructions'>Click here to get started:</div>
      <button onClick={() => window.location.href = '/game'}>Start</button>
      
      <footer className="landingpagefooter" id="landingpagefooter" style={{ display: 'block' }}>
            <div className="footerdiv" id="footerdiv">
                <p className="game1" style={{ color: 'black'}} id="game1">Check out my other games:
                </p>
                <p className="game2" id="game2">
                    <a href="https://memory-game-topaz-pi.vercel.app/" target="_blank">Memory Game</a>
                </p>
                <p className="game3" id="game3">
                    <a href="https://snakegame-mocha-kappa.vercel.app/" target="_blank">Snake Game</a>
                </p>
                <p className="github" id="github">
                    <a href="https://github.com/Eyesore123" target="_blank">
                    <img src={GithubIcon} alt="Github Icon" className="githubicon" id="githubicon" />
                    </a>
                </p>
            </div>
        </footer>
    </div>
  )
}
