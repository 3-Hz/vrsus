const seeding = (numPlayers) => {
  var rounds = Math.log(numPlayers)/Math.log(2)-1;
  var pls = [1,2];
  for(var i=0;i<rounds;i++){
    pls = nextLayer(pls);
  }
  return pls;
  function nextLayer(pls){
    var out=[];
    var length = pls.length*2+1;
    pls.forEach(function(d){
      out.push(d);
      out.push(length-d);
    });
    return out;
  }
}

const createBracket = (contestants) => {
    let n = 0; //number of rounds
    //create contestant pool, filling in empty places with byes
    let spots = [];
    while (2**n < contestants.length) {
      n++;
    }
    for (let i = 0; i < 2**n; i++) {
      spots.push(contestants[i] ? contestants[i]: 'bye');
    }
    //create bracket structure
    let bracket = [];
    for (let i = 0; i < n; i++) {
      bracket.push([]);
    }
    bracket = bracket.map((round, index) => {
      let matches = [];
      console.log(index);
      for (let i = 0; i < 2**(n-index) / 2; i++) {
        matches.push(['tbd', 'tbd']);
      }
      return matches;
    })
    //fill in first round, giving byes based on first come first serve basis
    let seed = seeding(spots.length);
    let seedIndex = seed.map(i => i - 1);
    for (let i = 0; i < seed.length; i++) {
      bracket[0][i >> 1][i % 2] = spots[seedIndex[i]];
    }
    return bracket;
}

export default createBracket;