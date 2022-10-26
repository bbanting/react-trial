import {useEffect, useRef} from "react";
import {getDiceValues, range, STATE} from "./util";


const oneDie = 
  <g id="Five">
    <rect id="Square" width="250" height="250" rx="20"/>
    {/* <circle id="Dot5" cx="189" cy="197" r="25" fill="black"/> */}
    {/* <circle id="Dot2" cx="189" cy="53" r="25" fill="black"/> */}
    {/* <circle id="Dot4" cx="60" cy="197" r="25" fill="black"/> */}
    <circle id="Dot3" cx="125" cy="125" r="25" fill="black"/>
    {/* <circle id="Dot1" cx="60" cy="53" r="25" fill="black"/> */}
  </g>;
const twoDie = 
  <g id="Two">
    <rect id="Square" width="250" height="250" rx="20"/>
    <circle id="Dot5" cx="189" cy="197" r="25" fill="black"/>
    {/* <circle id="Dot2" cx="189" cy="53" r="25" fill="black"/> */}
    {/* <circle id="Dot4" cx="60" cy="197" r="25" fill="black"/> */}
    {/* <circle id="Dot3" cx="125" cy="125" r="25" fill="black"/> */}
    <circle id="Dot1" cx="60" cy="53" r="25" fill="black"/>
  </g>;
const threeDie = 
  <g id="Three">
    <rect id="Square" width="250" height="250" rx="20"/>
    <circle id="Dot5" cx="189" cy="197" r="25" fill="black"/>
    {/* <circle id="Dot2" cx="189" cy="53" r="25" fill="black"/> */}
    {/* <circle id="Dot4" cx="60" cy="197" r="25" fill="black"/> */}
    <circle id="Dot3" cx="125" cy="125" r="25" fill="black"/>
    <circle id="Dot1" cx="60" cy="53" r="25" fill="black"/>
  </g>;
const fourDie = 
  <g id="Four">
    <rect id="Square" width="250" height="250" rx="20"/>
    <circle id="Dot5" cx="189" cy="197" r="25" fill="black"/>
    <circle id="Dot2" cx="189" cy="53" r="25" fill="black"/>
    <circle id="Dot4" cx="60" cy="197" r="25" fill="black"/>
    {/* <circle id="Dot3" cx="125" cy="125" r="25" fill="black"/> */}
    <circle id="Dot1" cx="60" cy="53" r="25" fill="black"/>
  </g>;
const fiveDie = 
  <g id="Five">
    <rect id="Square" width="250" height="250" rx="20"/>
    <circle id="Dot5" cx="189" cy="197" r="25" fill="black"/>
    <circle id="Dot2" cx="189" cy="53" r="25" fill="black"/>
    <circle id="Dot4" cx="60" cy="197" r="25" fill="black"/>
    <circle id="Dot3" cx="125" cy="125" r="25" fill="black"/>
    <circle id="Dot1" cx="60" cy="53" r="25" fill="black"/>
  </g>;
const sixDie = 
  <g id="Six">
    <rect id="Square" width="250" height="250" rx="20"/>
    <circle id="Dot6" cx="189" cy="197" r="25" fill="black"/>
    <circle id="Dot5" cx="189" cy="125" r="25" fill="black"/>
    <circle id="Dot4" cx="189" cy="53" r="25" fill="black"/>
    <circle id="Dot3" cx="60" cy="197" r="25" fill="black"/>
    <circle id="Dot2" cx="60" cy="125" r="25" fill="black"/>
    <circle id="Dot1" cx="60" cy="53" r="25" fill="black"/>
  </g>;

const dieSVGs = {
  1: oneDie,
  2: twoDie,
  3: threeDie,
  4: fourDie,
  5: fiveDie,
  6: sixDie
}

function DiceSection({ dice, setDice, setDiceHist, rolls, setRolls, gameState, setGameState }) {
  /**The section containing the dice and roll button. */
  const prevDiceVals = useRef(range(1, 6));

  function setLockFactory(index) {
    const func = (value) => {
      if (gameState !== STATE.ROLLING) return;
      let newDice = dice.slice().map((d) => ({...d, ...{new: false}}));
      newDice[index] = {...newDice[index], ...{locked: value}};
      setDice(newDice);
    }
    return func;
  }

  return (
    <div>
      <RollButton 
          dice={dice} setDice={setDice}
          prevDiceVals={prevDiceVals} setDiceHist={setDiceHist}
          rolls={rolls} setRolls={setRolls} 
          gameState={gameState} setGameState={setGameState} 
          />
      <div className="dice-container">
        {dice.map(
          (die, i) => <Die key={i} die={die} prevDieVal={prevDiceVals.current[i]} setLock={setLockFactory(i)} />
          )}
      </div>
    </div>
  );
}


function RollButton({ dice, setDice, prevDiceVals, setDiceHist, rolls, setRolls, gameState, setGameState }) {
  /**The button the user clicks to roll the dice. */
  useEffect(() => {
    if (rolls < 1) {
      setGameState(STATE.SCORING);
      setDice(dice.map(d => ({...d, ...{locked: false}})));
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
        newDice.push({...die, ...{new: false}});
      } else {
        const n = getDieRoll();
        newDice.push({value: n, locked: false, new: true});
      }
    }
    prevDiceVals.current = getDiceValues(dice);
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


function Die({ die, prevDieVal, setLock }) {
  /**A single die in the game. */
  const classname = `die${die.locked ? " locked" : ""}${die.new ? " new" : ""}`;
  const SVG = dieSVGs[die.value];
  const prevSVG = dieSVGs[prevDieVal];
  const style = {animationDelay: `${Math.floor(Math.random()*100)}ms`};

  return (
    <div key={Math.random()} className={classname} style={style} onClick={() => setLock(!die.locked)}>
      <svg className="currsvg" width="250" height="250" viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg">
        {SVG}
      </svg>
      <svg className="prevsvg" width="250" height="250" viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg">
        {prevSVG}
      </svg>
    </div>
  );
}

export default DiceSection;
