import React, { useState, useEffect } from 'react';
import {STATE, HANDS, range, getDiceValues, getCounts} from "./util";
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
  
  // This checks if the game is finished after scoring or moves
  // the game state on to the next turn so long as the state is 
  // not BEGIN (otherwise it may be triggered before the game starts).
  useEffect(() => {
    if (scores.every(s => s !== null)) setGameState(STATE.FINISH);
    else if (gameState !== STATE.BEGIN) {
      setGameState(STATE.PREROLL);
      setRolls(3);
    }
  }, [scores]);
  
  useEffect(() => {
    // Index 11 is yahtzee.
    if (scores[11] !== 0 && HANDS[11].scoreFunc(getDiceValues(dice))) window.alert("YAHTZEE!");
  }, [dice])

  function getScore() {
    const extraYahtzeeScore = ((yahtzees-1) > 0) ? ((yahtzees-1) * 50) : 0;
    const bonus = (scores.slice(0, 6).reduce((a, b) => a+b) >= 63) ? 35 : 0;
    return scores.reduce((a, b) => a+b) + extraYahtzeeScore + bonus;
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


function App() {
  return (
    <div>
      <Game />
    </div>
  );
}


export default App;
