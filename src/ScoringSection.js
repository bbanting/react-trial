import {HANDS, STATE, getDiceValues} from "./util";


function PlayButton({scores, setScores, dice, setDice, selected, setSelected, setYahtzees, gameState}) {
  /**The button to confirm a play choice. */
  function setScore() {
    if (![STATE.ROLLING, STATE.SCORING].includes(gameState) || selected === null) return;

    let newScores = scores.slice();
    const diceVals = getDiceValues(dice);
    const score = HANDS[selected].scoreFunc(diceVals);
    newScores[selected] = score;

    // Index 11 is yahtzee.
    if (scores[11] && HANDS[11].scoreFunc(diceVals)) setYahtzees(n => n+1);
    setScores(newScores);
    setDice(dice.map(d => ({"value": d.value, "locked": false})));
    setSelected(null);
  }

  function canPlay() {
    return [STATE.ROLLING, STATE.SCORING].includes(gameState) && selected !== null;
  }

  const buttonClass = `playbtn${canPlay() ? "" : " locked"}`;

  return (
    <button className={buttonClass} onClick={setScore}>
      Play
    </button>
  );
}


function UpperHands({selected, selectFunc, scores}) {
  const bonusScore = (scores.slice(0, 6).reduce((a, b) => a+b) >= 63) ? 35 : 0;
  return (
    <>
    <div className="hand-container">
      {HANDS.slice(0, 6).map((v, i) => {
        const classname = `hand ${scores[i] !== null ? "played" : ""} ${i == selected ? "selected" : ""}`;
        return (
          <button className={classname} value={i} key={i} onClick={(e) => selectFunc(e.currentTarget.value)}>
            <div className="handscore">{scores[i] !== null ? scores[i] : " "}</div>
            <div className="handtitle">{HANDS[i].name}</div>
          </button>
          )
        }
      )}
    </div>
    <p>BONUS: {bonusScore}</p>
    </>
  );
}


function LowerHands({selected, selectFunc, scores}) {
  return (
    <div className="hand-container lower">
      {HANDS.slice(6, HANDS.length).map((v, i) => {
        const classname = `hand ${scores[i+6] !== null ? "played" : ""} ${(i+6) == selected ? "selected" : ""}`;
        return (
          <button className={classname} value={i+6} key={i+6} onClick={(e) => selectFunc(e.currentTarget.value)}>
            <div className="handscore">{scores[i+6] !== null ? scores[i+6] : " "}</div>
            <div className="handtitle">{HANDS[i+6].name}</div>
          </button>
          )
        }
      )}
    </div>
  );
}



function ScoringSection({selected, setSelected, scores, gameState, yahtzees}) {
  /**The list of hands that may be selected for scoring. */  
  function select(index) {
    if (![STATE.ROLLING, STATE.SCORING].includes(gameState)) return;
    if (index == selected) setSelected(null);
    else if (scores[index] === null) setSelected(() => index);
  }

  return (
    <>
      <UpperHands selected={selected} selectFunc={select} scores={scores} />
      <LowerHands selected={selected} selectFunc={select} scores={scores} />
      <p>Extra yahtzees: {yahtzees}</p>
    </>
  );
}


export {PlayButton};
export default ScoringSection;