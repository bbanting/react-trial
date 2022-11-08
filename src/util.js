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

export const TRAN = {
  HIDDEN: 0,
  ENTER: 1,
  EXIT: 2
}

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


export function getCounts(numbers) {
  let results = {};
  for (let n of numbers) {
    if (results.hasOwnProperty(n)) results[n]++;
    else results[n] = 1;
  }

  return results;
}


export function getScoreCookie() {
  const re = /highscore=(\d+)/;
  const currentScore= re.exec(document.cookie);
  if (currentScore != null) return currentScore[1];
  else return 0;
}


export function setScoreCookie(score) {
  document.cookie = `highscore=${score}`;
}
