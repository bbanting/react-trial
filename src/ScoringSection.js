import {useState} from "react";
import {HANDS, STATE, getDiceValues} from "./util";


function UpperHands({selectFunc, scores}) {
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


function LowerHands({selectFunc}) {
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


function ScoringSection({scores, setScores, dice, gameState, yahtzees, setYahtzees}) {
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

    // Index 11 is yahtzee.
    if (scores[11] && HANDS[11].scoreFunc(diceVals)) setYahtzees(n => n+1);
    setScores(newScores);
    setSelected(null);
  }

  return (
    <>
      <UpperHands selected={selected} selectFunc={select} scores={scores} />
      <LowerHands selected={selected} selectFunc={select} />
      <p>Extra yahtzees: {yahtzees}</p>
      <button onClick={setScore}>Confirm</button>
    </>
  );
}

export default ScoringSection;