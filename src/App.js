import React, { useState, useEffect } from 'react';


function range(start, end) {
  const nums = [];
  for (let x=start; x<end; x++) nums.push(x);
  return nums;
}


function getDiceValues(dice) {
  return dice.map(d => d.value);
}


function upperHandFactory(n) {
  function func(values) {
    let total = 0;
    for (let v of values) {
      if (v === n) total += v;
    }
    return total;
  }
  return func;
}

function nOfKindHandFactory(n) {
  function func(values) {
    if (!n) return values.reduce((a, b) => a+b);
    let found = [];
    for (let val of values) {
      if (values.filter((v => v === val)).length >= n) return found.reduce((a, b) => a+b);
    }
    return 0;
  }  
  return func;
}

function nStraightHandFactory(n, points) {
  function func(values) {
    const tolerance = values.length - n;
    let sortedValues = values.sort();
    for (let t=0; t>tolerance; t++) {
      const comp = sortedValues[0];
      let attempt = sortedValues.filter((v, i) => v === comp+i);
      if (attempt.length >= n) return points;
      sortedValues = sortedValues.slice(1);
    }
    return 0;
  }
  return func;
}

function handFullHouse(values) {
  let exclude;
  for (let val of values) {
    if (values.filter((v) => v === val).length === 3) {
      exclude = val;
      break;
    }
  }

  if (!exclude) return 0;

  for (let val of values) {
    if (val === exclude) continue;
    if (values.filter((v) => v === val).length === 2) return 25;
  }
  return 0;
}


function Game(props) {
  /**A component to contain the game functionality. */
  const [rolls, setRolls] = useState(3);
  const [yahtzees, setYahtzees] = useState(0);
  const [dice, setDice] = useState(range(1, 6).map(n => ({value: n, locked: false})));
  const [scores, setScores] = useState(range(1, 12).fill(null));

  function getScore() {
    let extraYahtzeeScore = ((yahtzees-1) > 0) ? ((yahtzees-1) * 50) : 0;
    return scores.reduce((a, b) => a+b) + extraYahtzeeScore;
  }

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
      <ScoreDisplay score={getScore()} />
      <RollButton dice={dice} setDice={setDice} rolls={rolls} setRolls={setRolls} />
      {dice.map((die, i) => <Die key={i} die={die} setLock={setLockFactory(i)} />)}
      <HandList scores={scores} setScores={setScores} dice={dice} />
    </div>
  );
}


function RollButton({ dice, setDice, rolls, setRolls }) {
  /**The button the user clicks to roll the dice. */
  function getDieRoll() {
    return Math.trunc(Math.random() * 6) + 1;
  }

  function rollDice() {
    if (rolls < 1) return;
    
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
      {rolls} roll{rolls!=1 && "s"} left
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


function HandList({scores, setScores, dice}) {
  /**The list of hands that may be selected for scoring. */
  const hands = [
    {name: "Aces", scoreFunc: upperHandFactory(1)},
    {name: "Twos", scoreFunc: upperHandFactory(2)},
    {name: "Threes", scoreFunc: upperHandFactory(3)},
    {name: "Fours", scoreFunc: upperHandFactory(4)},
    {name: "Fives", scoreFunc: upperHandFactory(5)},
    {name: "Sixes", scoreFunc: upperHandFactory(6)},
    {name: "Three of a Kind", scoreFunc: nOfKindHandFactory(3)}, 
    {name: "Four of a Kind", scoreFunc: nOfKindHandFactory(4)}, 
    {name: "Full House", scoreFunc: handFullHouse}, 
    {name: "Small Straight", scoreFunc: nStraightHandFactory(4, 30)}, 
    {name: "Large Straight", scoreFunc: nStraightHandFactory(5, 40)}, 
    {name: "YAHTZEE", scoreFunc: nOfKindHandFactory(5)},
    {name: "Chance", scoreFunc: nOfKindHandFactory(0)}
  ];

  let selected = null;
  
  function select(index) {
    if (scores[index] === null) selected = index;
    console.log(`Selected ${hands[index].name}`);
  }
  
  function setScore() {
    if (selected === null) return;

    let newScores = scores.slice();
    const diceVals = getDiceValues(dice);
    const score = hands[selected].scoreFunc(diceVals);
    newScores[selected] = score;

    setScores(newScores);
    selected = null;
  }

  return (
    <>
      <div>
        {hands.slice(0, 6).map(((v, i) => (<button value={i} key={i} onClick={(e) => select(e.target.value)}>{hands[i].name}</button>)))}
      </div>
      <div>
        {hands.slice(6, -1).map(((v, i) => (<button value={i+6} key={i+6} onClick={(e) => select(e.target.value)}>{hands[i+6].name}</button>)))}
      </div>
      <button onClick={setScore}>Confirm</button>
    </>
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
