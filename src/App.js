import React, { useState, useEffect } from 'react';
import {handAces, handTwos, handThrees, 
  handFours, handFives, handSixes, 
  hand3OfKind, hand4OfKind, handFullHouse, 
  handSmallStraight, handLargeStraight, handYahtzee, 
  handChance} from "./scoringfunctions";


const STATE = {
  BEGIN: 1,
  PREROLL: 2,
  ROLLING: 3,
  SCORING: 4,
  FINISH: 5
};


const HANDS = [
  {name: "Aces", scoreFunc: handAces},
  {name: "Twos", scoreFunc: handTwos},
  {name: "Threes", scoreFunc: handThrees},
  {name: "Fours", scoreFunc: handFours},
  {name: "Fives", scoreFunc: handFives},
  {name: "Sixes", scoreFunc: handSixes},
  {name: "Three of a Kind", scoreFunc: hand3OfKind}, 
  {name: "Four of a Kind", scoreFunc: hand4OfKind}, 
  {name: "Full House", scoreFunc: handFullHouse}, 
  {name: "Small Straight", scoreFunc: handSmallStraight}, 
  {name: "Large Straight", scoreFunc: handLargeStraight}, 
  {name: "YAHTZEE", scoreFunc: handYahtzee},
  {name: "Chance", scoreFunc: handChance}
];


function range(start, end) {
  const nums = [];
  for (let x=start; x<end; x++) nums.push(x);
  return nums;
}


function getDiceValues(dice) {
  return dice.map(d => d.value);
}


function Game(props) {
  /**A component to contain the game functionality. */
  const [gameState, setGameState] = useState(STATE.BEGIN);
  const [rolls, setRolls] = useState(3);
  const [yahtzees, setYahtzees] = useState(0);
  const [dice, setDice] = useState(range(1, 6).map(n => ({value: n, locked: false})));
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
      <p>Extra yahtzees: {yahtzees}</p>
      <DiceSection 
        dice={dice} setDice={setDice} 
        rolls={rolls} setRolls={setRolls} 
        gameState={gameState} setGameState={setGameState} 
        />
      <ScoringSection 
        scores={scores} setScores={setScores} 
        dice={dice}
        gameState={gameState}
        setYahtzees={setYahtzees}
        />
    </div>
  );
}


function DiceSection({ dice, setDice, rolls, setRolls, gameState, setGameState }) {
  /**The section containing the dice and roll button. */
  function setLockFactory(index) {
    const func = (value) => {
      let newDice = dice.slice();
      newDice[index].locked = value;
      setDice(newDice);
    }
    return func;
  }

  return (
    <div>
      <RollButton 
          dice={dice} setDice={setDice} 
          rolls={rolls} setRolls={setRolls} 
          gameState={gameState} setGameState={setGameState} 
          />
      {dice.map(
        (die, i) => <Die key={i} die={die} setLock={setLockFactory(i)} />
        )}
    </div>
  );
}


function RollButton({ dice, setDice, rolls, setRolls, gameState, setGameState }) {
  /**The button the user clicks to roll the dice. */
  useEffect(() => {
    if (rolls < 1) {
      setGameState(STATE.SCORING);
      setDice(dice.map(d => ({"value": d.value, "locked": false})));
    }
  }, [rolls]);

  function getDieRoll() {
    return Math.trunc(Math.random() * 6) + 1;
  }

  function rollDice() {
    if (![STATE.ROLLING, STATE.BEGIN, STATE.PREROLL].includes(gameState)) return;
    if ([STATE.BEGIN, STATE.PREROLL].includes(gameState)) setGameState(STATE.ROLLING);
    
    if (rolls < 1) setRolls(3);
    
    const newDice = [];
    for (let die of dice) {
      if (die.locked) {
        newDice.push(die);
      } else {
        const n = getDieRoll();
        newDice.push({value: n, locked: false});
      }
    }

    setDice(newDice);
    setRolls(n => n - 1);
  }

  return (
    <div>
      <button onClick={rollDice}>Roll</button>
      {rolls} roll{rolls!==1 && "s"} left
    </div>
    );
}


function Die({ die, setLock }) {
  /**A single die in the game. */
  return (
    <button onClick={() => setLock(!die.locked)}>
      {die.value}{die.locked && <p>locked</p>}
    </button>
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


function UpperHands({selected, selectFunc, scores}) {
  const bonusScore = (scores.slice(0, 6).reduce((a, b) => a+b) >= 63) ? 35 : 0
  return (
    <div>
      {HANDS.slice(0, 6).map(
        ((v, i) => (
          <button value={i} key={i} onClick={(e) => selectFunc(e.target.value)}>
            {HANDS[i].name}
          </button>
          ))
        )}
      <p>BONUS: {bonusScore}</p>
    </div>
  );
}


function LowerHands({selected, selectFunc, scores}) {
  return (
    <div>
      {HANDS.slice(6, HANDS.length).map(
        ((v, i) => (
          <button value={i+6} key={i+6} onClick={(e) => selectFunc(e.target.value)}>
            {HANDS[i+6].name}
          </button>
          ))
        )}
    </div>
  );
}


function ScoringSection({scores, setScores, dice, gameState, setYahtzees}) {
  /**The list of hands that may be selected for scoring. */
  const [selected, setSelected] = useState(null);
  
  function select(index) {
    if (scores[index] === null) setSelected(() => index);
    else if (index === selected) setSelected(null);
  }

  function setScore() {
    if (![STATE.ROLLING, STATE.SCORING].includes(gameState) || selected === null) return;

    let newScores = scores.slice();
    const diceVals = getDiceValues(dice);
    const score = HANDS[selected].scoreFunc(diceVals);
    newScores[selected] = score;

    if (scores[11] && HANDS[11].scoreFunc(diceVals)) setYahtzees(n => n+1);
    setScores(newScores);
    setSelected(null);
  }

  return (
    <>
      <UpperHands selected={selected} selectFunc={select} scores={scores} />
      <LowerHands selected={selected} selectFunc={select} />
      <button onClick={setScore}>Confirm</button>
    </>
  );
}


function App() {
  return (
    <div>
      <Game />
    </div>
  );
}


export default App;
