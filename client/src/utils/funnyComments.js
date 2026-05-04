const WIN_COMMENTS = [
  "pulled 'em into next week!",
  "is doing the heavy lifting!",
  "has math muscles of steel!",
  "needs a workout towel after that!",
  "is showing no mercy!",
  "hit 'em with the big brain play!",
  "is pulling like a tractor!",
];

const TIMEOUT_COMMENTS = [
  "Did everyone fall asleep?",
  "Math is hard, I get it...",
  "Too slow! Gotta be quicker than that!",
  "The rope is getting bored.",
];

const BOTH_WRONG_COMMENTS = [
  "Oops! Both swung and missed!",
  "Math malfunction! Nobody gets it!",
  "Yikes! Back to math class for both of you!",
  "A double whiff! Unbelievable!",
];

export function getFunnyComment(resultType, winnerName = '') {
  if (resultType === 'timeout') {
    return TIMEOUT_COMMENTS[Math.floor(Math.random() * TIMEOUT_COMMENTS.length)];
  }
  if (resultType === 'both_wrong') {
    return BOTH_WRONG_COMMENTS[Math.floor(Math.random() * BOTH_WRONG_COMMENTS.length)];
  }
  return `🎉 ${winnerName} ${WIN_COMMENTS[Math.floor(Math.random() * WIN_COMMENTS.length)]}`;
}
