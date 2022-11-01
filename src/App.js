import React, { useState, useEffect, useRef } from 'react';
import {STATE, HANDS, range, getDiceValues, getCounts, getScoreCookie, setScoreCookie} from "./util";
import DiceSection, {RollButton} from './DiceSection';
import ScoringSection, {PlayButton} from "./ScoringSection";


function Game(props) {
  /**A component to contain the game functionality. */
  const [gameState, setGameState] = useState(STATE.BEGIN);
  const [rolls, setRolls] = useState(3);
  const [yahtzees, setYahtzees] = useState(range(1, 14).fill(false));
  const [dice, setDice] = useState(range(1, 6).map(n => ({value: n, locked: false, new: false})));
  const [diceHist, setDiceHist] = useState([]);
  const [scores, setScores] = useState(range(1, 14).fill(null));
  const [selected, setSelected] = useState(null);
  // time stores the start time of the game and, at game finish, the total elapsed time
  const [time, setTime] = useState(Date.now());
  
  const prevGameStateRef = useRef(null);

  // This checks if the game is finished after scoring or moves
  // the game state on to the next turn so long as the state is 
  // not BEGIN (otherwise it may be triggered before the game starts).
  useEffect(() => {
    if (scores.every(s => s !== null)) {
      changeGameState(STATE.FINISH);
      setTime(t => Math.round((Date.now() - t) / 1000));
    } else if (gameState !== STATE.BEGIN) {
      changeGameState(STATE.PREROLL);
      setRolls(3);
    }
  }, [scores]);
  
  useEffect(() => {
    if (gameState != STATE.FINISH) return;
    setTime(t => Math.round((Date.now() - t) / 1000));
    if (isNewHighscore()) setScoreCookie(getScore());
  }, [gameState]);

  useEffect(() => {
    // Index 11 is yahtzee.
    if (scores[11] !== 0 && HANDS[11].scoreFunc(getDiceValues(dice))) window.alert("YAHTZEE!");
  }, [rolls]);

  useEffect(() => {
    if (prevGameStateRef.current === STATE.BEGIN) {
      setTime(Date.now());
    }
  }, [gameState]);

  function changeGameState(newState) {
    prevGameStateRef.current = gameState;
    setGameState(newState);
  }

  function getScore() {
    const extraYahtzees = yahtzees.filter(n => n === true).length;
    const extraYahtzeeScore = (extraYahtzees > 0) ? (extraYahtzees * 50) : 0;
    const bonus = (scores.slice(0, 6).reduce((a, b) => a+b) >= 63) ? 35 : 0;
    return scores.reduce((a, b) => a+b) + extraYahtzeeScore + bonus;
  }
  
  function isNewHighscore() {
    return getScore() > getScoreCookie();
  }

  function newGame() {
    changeGameState(STATE.BEGIN);
    setRolls(3);
    setYahtzees(range(1,14).fill(false));
    setDice(range(1, 6).map(n => ({value: n, locked: false})))
    setScores(scores.fill(null));
    setDiceHist([]);
  }

  return (
    <div className="main">
      <header>
        <h1>Yahtzee</h1>
        <ScoreDisplay score={getScore()} />
      </header>

      <div className="sticky-section">
        <DiceSection 
          dice={dice} setDice={setDice}
          rolls={rolls} 
          gameState={gameState} 
          />
          
        <div className="roll-play-container">
          <RollButton 
            dice={dice} setDice={setDice}
            setDiceHist={setDiceHist}
            rolls={rolls} setRolls={setRolls} 
            gameState={gameState} setGameState={setGameState} 
            />
          <PlayButton 
            scores={scores} setScores={setScores}
            dice={dice} setDice={setDice}
            selected={selected} setSelected={setSelected}
            yahtzees={yahtzees} setYahtzees={setYahtzees} 
            gameState={gameState} 
            />
        </div>
      </div>

      <ScoringSection 
        selected={selected} setSelected={setSelected}
        scores={scores}
        gameState={gameState}
        yahtzees={yahtzees}
        dice={dice}
        />

      {/* <NewGameButton resetFunc={newGame} /> */}

      {gameState === STATE.FINISH && 
        <Stats 
          diceHist={diceHist} 
          time={time} 
          score={getScore()} highscore={isNewHighscore}
          resetFunc={newGame}
          />
        }
    </div>
  );
}


function NewGameButton({resetFunc}) {
  return (
    <button className="newgamebtn" onClick={resetFunc}>
      New Game
    </button>
  );
}


function ScoreDisplay({score}) {
  /**Displays the current score. */
  return (
    <div className="score">
      {score}
    </div>
  )
}


function Stats({ diceHist, time, score, highscore, resetFunc}) {
  /**Displays the stats for the current game. */
  const placeholder = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0};
  const counts = {...placeholder, ...getCounts(diceHist)};

  return (
    <div>
      {highscore() && <p>NEW HIGH SCORE!</p>}
      <p>Score: {score}</p>
      {Object.entries(counts).map(c => 
        <p key={c[0]}>{c[0]}: {c[1]}</p>
        )}
      <p>Total rolls: {diceHist ? (diceHist.length / 5) : 0}</p>
      <p>Total time: {time}</p>
      <NewGameButton resetFunc={resetFunc} />
    </div>
  )
}


function App() {
  return (
    <Game />
  );
}


export default App;
