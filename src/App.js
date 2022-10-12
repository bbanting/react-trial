import React, { useState, useEffect } from 'react';


function range(start, end) {
  const nums = [];
  for (let x=start; x<end; x++) nums.push(x);
  return nums;
}


function getDiceValues(dice) {
  return dice.map(d => d.value);
}


function upperHandsFactory(n) {
  function func(values) {
    const total = 0;
    for (let v of values) {
      if (v === n) total += v;
    }
    return total;
  }
  return func;
}

function handXOfKindFactory(x) {
  function func(values) {
    let found = [];
    for (let val of values) {
      for (let comp of values) {
        if (val === comp) found.push(val);
      }
      if (found.length >= x) return found.reduce((a, b) => a+b);
      else found = [];
    }
    return 0;
  }  

  return func;
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
