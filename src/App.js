import React, { useState, useEffect } from 'react';


function Game(props) {
  /**A component to contain the game functionality. */
  const [score, setScore] = useState(0);
  const [rolls, setRolls] = useState(3);
  const [dice, setDice] = useState([
    {value: 1, locked: false}, 
    {value: 2, locked: false}, 
    {value: 3, locked: false}, 
    {value: 4, locked: false}, 
    {value: 5, locked: false}, 
  ])

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


function App() {
  return (
    <div>
      <Game />
    </div>
  );
}


export default App;
