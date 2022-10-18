import React, { useState, useEffect } from 'react';
import {STATE, HANDS, range, getDiceValues, getCounts, getScoreCookie, setScoreCookie} from "./util";
import DiceSection from './DiceSection';
import ScoringSection from "./ScoringSection";


function Game(props) {
  /**A component to contain the game functionality. */
  const [gameState, setGameState] = useState(STATE.BEGIN);
  const [rolls, setRolls] = useState(3);
  const [yahtzees, setYahtzees] = useState(0);
  const [dice, setDice] = useState(range(1, 6).map(n => ({value: n, locked: false})));
  const [diceHist, setDiceHist] = useState([]);
  const [scores, setScores] = useState(range(1, 14).fill(null));
  // time stores the start time of the game and, at game finish, the total elapsed time
  const [time, setTime] = useState(Date.now());

  // This checks if the game is finished after scoring or moves
  // the game state on to the next turn so long as the state is 
  // not BEGIN (otherwise it may be triggered before the game starts).
  useEffect(() => {
    if (scores.every(s => s !== null)) {
      setGameState(STATE.FINISH);
      setTime(t => Math.round((Date.now() - t) / 1000));
    } else if (gameState !== STATE.BEGIN) {
      setGameState(STATE.PREROLL);
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
  }, [dice]);

  function getScore() {
    const extraYahtzeeScore = ((yahtzees-1) > 0) ? ((yahtzees-1) * 50) : 0;
    const bonus = (scores.slice(0, 6).reduce((a, b) => a+b) >= 63) ? 35 : 0;
    return scores.reduce((a, b) => a+b) + extraYahtzeeScore + bonus;
  }
  
  function isNewHighscore() {
    return getScore() > getScoreCookie();
  }

  function newGame() {
    setGameState(STATE.BEGIN);
    setRolls(3);
    setYahtzees(0);
    setDice(range(1, 6).map(n => ({value: n, locked: false})))
    setScores(scores.fill(null));
  }

  return (
    <div>
      <button onClick={newGame}>New Game</button>
      <ScoreDisplay score={getScore()} />
      <DiceSection 
        dice={dice} setDice={setDice} setDiceHist={setDiceHist}
        rolls={rolls} setRolls={setRolls} 
        gameState={gameState} setGameState={setGameState} 
        />
      <ScoringSection 
        scores={scores} setScores={setScores} 
        dice={dice}
        gameState={gameState}
        yahtzees={yahtzees} setYahtzees={setYahtzees}
        />
      {gameState === STATE.FINISH && 
        <Stats 
          diceHist={diceHist} 
          time={time} 
          score={getScore()} highscore={isNewHighscore}/>
        }
    </div>
  );
}


function ScoreDisplay({score}) {
  /**Displays the current score. */
  return (
    <div style={{fontSize: "x-large"}}>
      {score}
    </div>
  )
}


function Stats({ diceHist, time, score, highscore }) {
  /**Displays the stats for the current game. */
  const placeholder = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0};
  const counts = {...placeholder, ...getCounts(diceHist)};
  const timeElapsed = time

  return (
    <div>
      {highscore() && <p>NEW HIGH SCORE!</p>}
      <p>Score: {score}</p>
      {Object.entries(counts).map(c => 
        <p key={c[0]}>{c[0]}: {c[1]}</p>
        )}
      <p>Total rolls: {diceHist ? (diceHist.length / 5) : 0}</p>
      <p>Total time: {time}</p>
    </div>
  )
}


function App() {
  return (
    <div>
      <h1>Yahtzee</h1>
      <Game />
    </div>
  );
}


export default App;
