export const GameRules = {
  onScore(value) {
    let rtn = { score: value, isGoodScore: false, text: "" };
    if (value === 4) {
      rtn.score = 7;
      rtn.isGoodScore = true;
      rtn.text = "Nice!";
    } else if (value === 5) {
      rtn.score = 8;
      rtn.isGoodScore = true;
      rtn.text = "Good!";
    }
    return rtn;
  },
};
