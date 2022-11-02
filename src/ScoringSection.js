import {HANDS, STATE, getDiceValues} from "./util";


function PlayButton({scores, setScores, dice, setDice, selected, setSelected, yahtzees, setYahtzees, gameState}) {
  /**The button to confirm a play choice. */
  function setScore() {
    if (![STATE.ROLLING, STATE.SCORING].includes(gameState) || selected === null) return;

    let newScores = scores.slice();
    const diceVals = getDiceValues(dice);
    const score = HANDS[selected].scoreFunc(diceVals);
    newScores[selected] = score;

    // Index 11 is yahtzee.
    if (scores[11] && HANDS[11].scoreFunc(diceVals)) {
      const newYahtzees = yahtzees.slice();
      newYahtzees[selected] = true;
      setYahtzees(newYahtzees);
    }
    setScores(newScores);
    setDice(dice.map(d => ({"value": d.value, "locked": false})));
    setSelected(null);
  }

  function canPlay() {
    return [STATE.ROLLING, STATE.SCORING].includes(gameState) && selected !== null;
  }

  const buttonClass = `playbtn${canPlay() ? "" : " locked noclick"}`;

  return (
    <button className={buttonClass} onClick={setScore}>
      Play
    </button>
  );
}


function HandSection({n, offset, selected, selectFunc, scores, yahtzees, dice, gameState}) {
  /**The upper sections of hands. */

  function getHandScoreDisplay(index) {
    const potentialScore = HANDS[index].scoreFunc(diceVals);
    const preview = (potentialScore && ![STATE.PREROLL, STATE.BEGIN].includes(gameState)) ? potentialScore : " ";
    const handScore = scores[index] !== null ? scores[index] : preview
    const className = `hand
    ${scores[index] !== null ? " played noclick" : ""}
    ${index == selected ? " selected" : ""}
    ${yahtzees[index] ? " bonus-yahtzee" : ""}`;
    return [handScore, className];
  }

  const diceVals = getDiceValues(dice);
  const style = {style: {gridTemplateRows: `repeat(${Math.round(n / 2)}, 1fr)`}};

  return (
    <div className="hand-container" {...style}>
      {HANDS.slice(0+offset, n+offset).map((v, i) => {
        const [handScore, className] = getHandScoreDisplay(i+offset);
        return (
          <button className={className} value={i+offset} key={i} onClick={(e) => selectFunc(e.currentTarget.value)}>
            <div className="handscore">{handScore}</div>
            <div className="handtitle">{HANDS[i+offset].name}</div>
          </button>
          )
        }
      )}
    </div>
  );
}


function Totals({scores}) {
  /**The running totals of both sections. */
  const upTotal = scores.slice(0, 6).reduce((a,b) => a+b);
  const downTotal = scores.slice(6, 14).reduce((a,b) => a+b);
  console.log(upTotal);
  console.log(upTotal >= 63);

  return (
    <div className="totals">
      <div className="uptotal">
        <div></div>
        <div>{`${upTotal}${"▲"}`}</div>
        {upTotal >= 63 ? <div key={5} className="bonus">+35</div> : <div></div>}
      </div>
      <div className="downtotal">{downTotal}▼</div>
    </div>
  );
}


function ScoringSection({selected, setSelected, scores, gameState, yahtzees, dice}) {
  /**The list of hands that may be selected for scoring. */  
  function select(index) {
    if (![STATE.ROLLING, STATE.SCORING].includes(gameState)) return;
    if (index == selected) setSelected(null);
    else if (scores[index] === null) setSelected(() => index);
  }

  return (
    <>
      <HandSection 
        n={6} offset={0} 
        selected={selected} selectFunc={select} 
        scores={scores} yahtzees={yahtzees} 
        dice={dice} gameState={gameState} 
        />
      <Totals scores={scores} />
      <HandSection 
        n={7} offset={6} 
        selected={selected} selectFunc={select} 
        scores={scores} yahtzees={yahtzees} 
        dice={dice} gameState={gameState} 
        />
    </>
  );
}


export {PlayButton};
export default ScoringSection;
