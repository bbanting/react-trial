import {DieSVG} from "./DiceSection";


export default function Celebration({celeRef, dice}) {
  /**The celebration animation that runs when user rolls a yahtzee. */
  return (
    <div ref={celeRef} className="cele hidden">
      <div className="bg">
        <div key={Math.random()}></div>
        <div key={Math.random()}></div>
      </div>
      <div className="dice-effect">
        {Array(5).fill(0).map((v, i) => {
          const style = {style: {animationDelay: `${Math.random()}s`}}
          return (
          <div key={Math.random()} className="die" {...style}>
            <DieSVG className="six" />
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
