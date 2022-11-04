import {STATE, getCounts} from "../util";
import NewGameButton from "./NewGameButton";


export default function Stats({ gameState, diceHist, time, score, isHighscore, resetFunc}) {
    /**Displays the stats for the current game. */
    const placeholder = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0};
    const counts = {...placeholder, ...getCounts(diceHist)};
    const dieClassNames = ["one", "two", "three", "four", "five", "six"];
    const style = gameState === STATE.FINISH ? {style: {opacity: "100%"}} : {};
  
    return (
      <div className="stats-overlay">
        <div className="stats-inner">
          <div className="score">{score}</div>
          {1 && <p className="highscore-note">HIGH SCORE!</p>} {/**isHighscore needs to get fixed */}
  
          <div className="die-tallies">
          {Object.values(counts)
            .map((count, i) => {
              return (
                <div>
                <div key={i} className="die">
                  <svg 
                    className={dieClassNames[i]} 
                    width="250" height="250" 
                    viewBox="0 0 250 250" 
                    fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect id="Square" width="250" height="250" rx="20"/>
                    <circle className="dot1" cx="60" cy="53" r="25"/>
                    <circle className="dot2" cx="189" cy="53" r="25"/>
                    <circle className="dot3" cx="60" cy="125" r="25"/> 
                    <circle className="dot4" cx="125" cy="125" r="25"/>
                    <circle className="dot5" cx="189" cy="125" r="25"/>
                    <circle className="dot6" cx="60" cy="197" r="25"/>
                    <circle className="dot7" cx="189" cy="197" r="25"/>
                  </svg>
                </div>
                <div className="tally">{count}</div>
                </div>
              )
          })}
          </div>
  
          <div className="misc-stats">
            <div className="stat">
              <p>Total rolls</p>
              <p>{diceHist ? (diceHist.length / 5) : 0}</p> {/*fix this*/}
            </div>
            <div className="stat">
              <p>Total time</p>
              <p>{time / 1000}s</p> {/**write a time display func */}
            </div>
          </div>
  
          <NewGameButton resetFunc={resetFunc} />
        </div>
      </div>
    )
  }
