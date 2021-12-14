import './App.css';
import { useState } from 'react';
import QuizzGame from './components/QuizzGame.js';

function App() {
  const [gameToStart, setGameToStart] = useState(true);
  return (
    <div className='App'>
      <h1>The React Quizz Game</h1>
      <h2>Get to know me!</h2>
      {gameToStart && (
        <div className='gameToStart'>
          <p>
            That is a little quizz game with facts for you to know me better.
          </p>
          <p>Have fun &#x1F642; 🙂</p>
          {/* Two different ways to add emojis, the second way is a VSCode extension */}
          <button
            onClick={() => {
              setGameToStart(!gameToStart);
            }}
          >
            Start the Quizz
          </button>
        </div>
      )}
      {!gameToStart && <QuizzGame />}
    </div>
  );
}

export default App;
