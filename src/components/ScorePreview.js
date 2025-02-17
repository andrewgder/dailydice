import React from "react";
import CalculateScore from "./CalculateScore";

const getAppliedRule = (dice) => {
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

  if (hasFive) return "Five of a Kind (100 points)";
  if (isLargeStraight) return "Large Straight (50 points)";
  if (isSmallStraight) return "Small Straight (30 points)";
  if (isFullHouse) return "Full House (35 points)";
  if (hasFour) return `Four of a Kind (Sum: ${sumOfDice} + 10)`;
  if (hasThree) return `Three of a Kind (Sum: ${sumOfDice})`;

  return "No rule applied (0 points)";
};

const ScorePreview = ({ dice }) => {
  if (!dice || dice.length === 0) return null;

  const score = CalculateScore(dice);
  const ruleApplied = getAppliedRule(dice);

  return (
    <div className="score-preview">
      <h3>Current Score Preview</h3>
      <p>
        <strong>Score:</strong> {score}
      </p>
      <p>
        <strong>Rule Applied:</strong> {ruleApplied}
      </p>
    </div>
  );
};

export default ScorePreview;
