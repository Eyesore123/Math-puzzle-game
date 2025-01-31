import './App.css';
import Game from './assets/pages/Game';
import Welcomescreen from './assets/pages/Welcomescreen';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcomescreen />} />
        <Route path="/game" element={<Game />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;