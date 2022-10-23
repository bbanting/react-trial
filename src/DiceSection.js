import {useEffect} from "react";
import {getDiceValues, STATE} from "./util";


function DiceSection({ dice, setDice, setDiceHist, rolls, setRolls, gameState, setGameState }) {
  /**The section containing the dice and roll button. */
  function setLockFactory(index) {
    const func = (value) => {
      if (gameState !== STATE.ROLLING) return;
      let newDice = dice.slice();
      newDice[index].locked = value;
      setDice(newDice);
    }
    return func;
  }

  return (
    <div>
      <RollButton 
          dice={dice} setDice={setDice} setDiceHist={setDiceHist}
          rolls={rolls} setRolls={setRolls} 
          gameState={gameState} setGameState={setGameState} 
          />
      <div className="dice-container">
        {dice.map(
          (die, i) => <Die key={i} die={die} setLock={setLockFactory(i)} />
          )}
      </div>
    </div>
  );
}


function RollButton({ dice, setDice, setDiceHist, rolls, setRolls, gameState, setGameState }) {
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
    if ([STATE.SCORING, STATE.FINISH].includes(gameState)) return;
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
    setDiceHist(d => d.concat(getDiceValues(newDice)));
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
  const classname = `die${die.locked ? " locked" : ""}`;
  return (
    <button className={classname} onClick={() => setLock(!die.locked)}>
      {die.value}
    </button>
  );
}

export default DiceSection;