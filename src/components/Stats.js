import {useEffect, useState, useRef} from "react";
import {STATE, getCounts, TRAN} from "../util";
import {DieSVG, shapeClasses} from "./DiceSection";
import NewGameButton from "./NewGameButton";


export default function Stats({ gameState, diceHist, time, score, isHighscore, resetFunc, totalRolls}) {
    /**Displays the stats for the current game. */
    const [tranState, setTranState] = useState(TRAN.HIDDEN);
    useEffect(() => {if (gameState === STATE.FINISH) setTranState(TRAN.ENTER)}, [gameState]);

    const counts = {...{1:0, 2:0, 3:0, 4:0, 5:0, 6:0}, ...getCounts(diceHist)};
    const className = "stats-overlay " + Object.entries(TRAN)[tranState][0].toLowerCase();

    return (
      <div className={className} key={Math.random()}>
        <div className="stats-inner" key={Math.random()} onAnimationEnd={() => {if (tranState === TRAN.EXIT) setTranState(TRAN.HIDDEN)}}>
          <div className="score">{score}</div>
          {isHighscore() && <p className="highscore-note">HIGH SCORE!</p>}
  
          <div className="die-tallies">
          {Object.values(counts)
            .map((count, i) => {
              return (
                <div key={i}>
                  <div className="die"><DieSVG className={shapeClasses[i+1]} /></div>
                  <div className="tally">{count}</div>
                </div>
              )
          })}
          </div>
  
          <div className="misc-stats">
            <div className="stat">
              <p>Total rolls</p>
              <p>{totalRolls}</p>
            </div>
            {gameState === STATE.FINISH && 
            <div className="stat">
              <p>Total time</p>
              <p>{time}s</p> {/**write a time display func */}
            </div>
            }
          </div>
  
          <NewGameButton resetFunc={resetFunc} />
          <button className="closebtn" onClick={() => setTranState(TRAN.EXIT)}>close</button>
        </div>
      </div>
    )
  }
