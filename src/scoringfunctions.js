function upperHandFactory(n) {
  function func(values) {
    let total = 0;
    for (let v of values) {
      if (v === n) total += v;
    }
    return total;
  }
  return func;
}
  

function nOfKindHandFactory(n, points=0) {
  function func(values) {
    if (!n) return points ? points : values.reduce((a, b) => a+b);
    
    // t is the tolerance for failure.
    for (let t = values.length - n; t>=0; t--) {
      if (values.filter((v => v === values[t])).length >= n) {
        return points ? points : values.reduce((a, b) => a+b);
      }
    }
    return 0;
  }  
  return func;
}
  

function nStraightHandFactory(n, points) {
  function func(values) {
    let sortedValues = Array.from(new Set(values)).sort();
    // t is the tolerance for failure.
    for (let t = values.length - n; t>=0; t--) {
      const comp = sortedValues[0];
      if (sortedValues.filter((v, i) => v === comp+i).length >= n) {
        return points;
      }
      sortedValues = sortedValues.slice(1);
    }
    return 0;
  }
  return func;
}
  

export function handFullHouse(values) {
  let exclude;
  for (let val of values) {
      if (values.filter((v) => v === val).length === 3) {
      exclude = val;
      break;
      }
  }

  if (!exclude) return 0;

  for (let val of values) {
      if (val === exclude) continue;
      if (values.filter((v) => v === val).length === 2) return 25;
  }
  return 0;
}


export const handAces = upperHandFactory(1);
export const handTwos = upperHandFactory(2);
export const handThrees = upperHandFactory(3);
export const handFours = upperHandFactory(4);
export const handFives = upperHandFactory(5);
export const handSixes = upperHandFactory(6);

export const hand3OfKind = nOfKindHandFactory(3);
export const hand4OfKind = nOfKindHandFactory(4);
export const handSmallStraight =  nStraightHandFactory(4, 30);
export const handLargeStraight =  nStraightHandFactory(5, 40);
export const handYahtzee = nOfKindHandFactory(5, 50);
export const handChance = nOfKindHandFactory(0);