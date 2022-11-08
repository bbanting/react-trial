import React, { useState, useEffect, useRef } from 'react';
import {STATE, HANDS, TRAN, range, getDiceValues, getScoreCookie, setScoreCookie} from "../util";
import DiceSection, {RollButton} from './DiceSection';
import ScoringSection, {PlayButton} from "./ScoringSection";
import Stats from "./Stats";
import ScoreDisplay from "./ScoreDisplay";
import Celebration from './Celebration';


function App() {
  const [gameState, setGameState] = useState(STATE.BEGIN);
  const [rolls, setRolls] = useState(3);
  const [totalRolls, setTotalRolls] = useState(0);
  const [yahtzees, setYahtzees] = useState(range(1, 14).fill(false));
  const [dice, setDice] = useState(range(1, 6).map(n => ({value: n, locked: false, new: false})));
  const [diceHist, setDiceHist] = useState([]);
  const [scores, setScores] = useState(range(1, 14).fill(null));
  const [selected, setSelected] = useState(null);
  // time stores the start time of the game and, at game finish, the total elapsed time
  const [time, setTime] = useState(null);

  const [yahtzeeCeleState, setYahtzeeCeleState] = useState(TRAN.HIDDEN);
  
  const prevGameStateRef = useRef(STATE.BEGIN);
  const prevHighscoreRef = useRef(getScoreCookie());

  // This checks if the game is finished after scoring or moves
  // the game state on to the next turn so long as the state is 
  // not BEGIN (otherwise it may be triggered before the game starts).
  useEffect(() => {
    if (scores.every(s => s !== null)) {
      changeGameState(STATE.FINISH);
    } else if (gameState !== STATE.BEGIN) {
      changeGameState(STATE.PREROLL);
      setRolls(3);
    }
  }, [scores]);
  
  // Set high score at end game.
  useEffect(() => {
    if (gameState != STATE.FINISH) return;
    if (isNewHighscore()) setScoreCookie(getScore());
  }, [gameState]);
  
  // Triggers the yahtzee animation when one is rolled.
  useEffect(() => {
    // Index 11 is yahtzee.
    if (![STATE.ROLLING, STATE.SCORING].includes(gameState)) return;
    if (scores[11] !== 0 && HANDS[11].scoreFunc(getDiceValues(dice))) {
      setYahtzeeCeleState(TRAN.ENTER);
      const timeout1 = setTimeout(() => setYahtzeeCeleState(TRAN.EXIT), 3000);
      const timeout2 = setTimeout(() => setYahtzeeCeleState(TRAN.HIDDEN), 5000);
      return () => {clearTimeout(timeout1); clearTimeout(timeout2);}
    };
  }, [rolls]);

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
    return getScore() > prevHighscoreRef.current;
  }

  function newGame() {
    prevHighscoreRef.current = getScore();
    changeGameState(STATE.BEGIN);
    setRolls(3);
    setTotalRolls(0);
    setYahtzees(range(1,14).fill(false));
    setDice(range(1, 6).map(n => ({value: n, locked: false})))
    setScores(scores.fill(null));
    setDiceHist([]);
  }

  return (
    <>
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
            rolls={rolls} setRolls={setRolls} setTotalRolls={setTotalRolls}
            gameState={gameState} setGameState={setGameState}
            prevState={prevGameStateRef} setTime={setTime}
            />
          <PlayButton 
            scores={scores} setScores={setScores}
            dice={dice} setDice={setDice}
            selected={selected} setSelected={setSelected}
            yahtzees={yahtzees} setYahtzees={setYahtzees} 
            gameState={gameState} setTime={setTime}
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

    </div>

    <Celebration tranState={yahtzeeCeleState} dice={dice}/>

    <Stats
      gameState={gameState}
      diceHist={diceHist} 
      time={time} 
      score={getScore()} isHighscore={isNewHighscore}
      resetFunc={newGame}
      totalRolls={totalRolls}
      />
    </>
  );
}


export default App;
