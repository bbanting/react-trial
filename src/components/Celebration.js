import {DieSVG, shapeClasses} from "./DiceSection";
import {TRAN} from "../util.js";


export default function Celebration({tranState, dice}) {
  /**The celebration animation that runs when user rolls a yahtzee. */
  const stateClass = Object.entries(TRAN)[tranState][0].toLowerCase();
  return (
    <div className={`cele ${stateClass}`}>
      <div className="bg">
        <div key={Math.random()}></div>
        <div key={Math.random()}></div>
      </div>
      <div className="dice-effect">
        {Array(5).fill(0).map((v, i) => {
          const style = {style: {animationDelay: `${Math.random()}s`}}
          return (
          <div key={Math.random()} className="die" {...style}>
            <DieSVG className={shapeClasses[dice[0].value]} />
          </div>
        )
        })}
        
      </div>
      <div className="text">
        {Array.from("YAHTZEE").map((v, i) => {
          return (
          <div key={Math.random()} className="letter" style={{animationDelay: `${.75 + (0.1 * i)}s`}}>
            {v}
          </div>
          )
        })}
      </div>
    </div>
  );
}
