import {useEffect} from "react";
import {STATE} from "./util";


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

export default DiceSection;