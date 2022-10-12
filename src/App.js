import React, { useState, useEffect } from 'react';


function Game(props) {
  /**A component to contain the game functionality. */
  const [score, setScore] = useState(0);
  const [rolls, setRolls] = useState(0);
  const [dice, setDice] = useState([
    {value: 1, locked: false}, 
    {value: 1, locked: false}, 
    {value: 1, locked: false}, 
    {value: 1, locked: false}, 
    {value: 1, locked: false}, 
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
      <RollButton dice={dice} setDice={setDice} />
      {dice.map((die, i) => <Die key={i} die={die} setLock={setLockFactory(i)} />)}
    </div>
  );
  
}


function RollButton({ dice, setDice }) {
  /**The button the user clicks to roll the dice. */
  function getDieRoll() {
    return Math.trunc(Math.random() * 6) + 1;
  }

  function rollDice() {
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
  }

    return (
      <button onClick={rollDice}>Roll</button>
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


function App() {
  return (
    <div>
      <Game />
    </div>
  );
}


export default App;
