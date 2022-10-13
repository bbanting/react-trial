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
}

function handFullHouse(values) {
  let exclude;
  for (val of values) {
    if (values.filter((v) => v === val).length === 3) {
      exclude = val;
      break;
    }
  }

  if (!exclude) return 0;

  for (val of values) {
    if (val === exclude) continue;
    if (values.filter((v) => v === val).length === 2) return 25;

  return 0;
}


const upperHandFuncs = range(1, 7).map(n => upperHandsFactory(n));


function Game(props) {
  /**A component to contain the game functionality. */
  const [rolls, setRolls] = useState(3);
  const initDiceState = range(1, 6).map(n => ({value: n, locked: false}));
  const [dice, setDice] = useState(initDiceState);
  const [hands, setHands] = useState([]); // {name, scoreFunc, score, selected}

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
      <RollButton dice={dice} setDice={setDice} rolls={rolls} setRolls={setRolls} />
      {dice.map((die, i) => <Die key={i} die={die} setLock={setLockFactory(i)} />)}
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
    </div>);
}


function Die({ die, setLock }) {
  /**A single die in the game. */
  return (
    <button onClick={() => setLock(!die.locked)}>
      {die.value}{die.locked && <p>locked</p>}
    </button>
    
  );
}


function HandList(props) {
  /**The list of hands that may be selected for scoring. */
  return (
    <div>

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
