import {handAces, handTwos, handThrees, 
  handFours, handFives, handSixes, 
  hand3OfKind, hand4OfKind, handFullHouse, 
  handSmallStraight, handLargeStraight, handYahtzee, 
  handChance} from "./scoringfunctions";

export const STATE = {
  BEGIN: 1,
  PREROLL: 2,
  ROLLING: 3,
  SCORING: 4,
  FINISH: 5
};


export const HANDS = [
  {name: "Aces", scoreFunc: handAces},
  {name: "Twos", scoreFunc: handTwos},
  {name: "Threes", scoreFunc: handThrees},
  {name: "Fours", scoreFunc: handFours},
  {name: "Fives", scoreFunc: handFives},
  {name: "Sixes", scoreFunc: handSixes},
  {name: "Three of a Kind", scoreFunc: hand3OfKind}, 
  {name: "Four of a Kind", scoreFunc: hand4OfKind}, 
  {name: "Full House", scoreFunc: handFullHouse}, 
  {name: "Small Straight", scoreFunc: handSmallStraight}, 
  {name: "Large Straight", scoreFunc: handLargeStraight}, 
  {name: "YAHTZEE", scoreFunc: handYahtzee},
  {name: "Chance", scoreFunc: handChance}
];


export function range(start, end) {
  const nums = [];
  for (let x=start; x<end; x++) nums.push(x);
  return nums;
}


export function getDiceValues(dice) {
  return dice.map(d => d.value);
}