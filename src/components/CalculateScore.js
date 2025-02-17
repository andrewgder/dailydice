const CalculateScore = (dice) => {
  const counts = {};
  dice.forEach((die) => {
    counts[die] = (counts[die] || 0) + 1;
  });

  const values = Object.keys(counts)
    .map(Number)
    .sort((a, b) => a - b);
  const hasThree = Object.values(counts).includes(3);
  const hasFour = Object.values(counts).includes(4);
  const hasFive = Object.values(counts).includes(5);
  const hasPair = Object.values(counts).includes(2);
  const sumOfDice = dice.reduce((a, b) => a + b, 0);

  const isFullHouse = hasThree && hasPair;

  // Check for small and large straights
  const isSmallStraight =
    (values.includes(1) &&
      values.includes(2) &&
      values.includes(3) &&
      values.includes(4)) ||
    (values.includes(2) &&
      values.includes(3) &&
      values.includes(4) &&
      values.includes(5)) ||
    (values.includes(3) &&
      values.includes(4) &&
      values.includes(5) &&
      values.includes(6));

  const isLargeStraight =
    values.length === 5 &&
    ((values[0] === 1 && values[4] === 5) ||
      (values[0] === 2 && values[4] === 6));

  if (hasFive) return 100; // Five of a kind
  if (isLargeStraight) return 50; // Large straight
  if (isSmallStraight) return 30; // Small straight
  if (isFullHouse) return 35; // Full House
  if (hasFour) return sumOfDice + 10; // Four of a kind + 10 bonus
  if (hasThree) return sumOfDice; // Three of a kind

  return 0; // No valid score
};
export default CalculateScore;
