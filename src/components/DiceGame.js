import { useState, useEffect } from "react";
import "../styles/App.css";

const generateDailyRolls = () => {
  const seed = new Date().toISOString().split("T")[0]; // Use date as seed for consistency
  let rolls = [];
  for (let i = 0; i < 6; i++) {
    // 6 rounds
    rolls.push(
      Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1)
    );
  }
  return rolls;
};

export default function DiceGame() {
  const [rolls, setRolls] = useState(generateDailyRolls());
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedDice, setSelectedDice] = useState([]);
  const [score, setScore] = useState(0);
  const [roundScores, setRoundScores] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [rerollCount, setRerollCount] = useState(2);

  const reroll = () => {
    if (rerollCount > 0 && currentRound < 6) {
      setRolls((prevRolls) => {
        const newRolls = prevRolls.map((round, index) => {
          if (index === currentRound) {
            return round.map((die, i) =>
              selectedDice.includes(i) ? die : Math.floor(Math.random() * 6) + 1
            );
          }
          return round;
        });
        return [...newRolls];
      });
      setRerollCount((prevCount) => prevCount - 1);
    }
  };

  const lockInScore = () => {
    if (currentRound < 6) {
      const roundScore = rolls[currentRound].reduce((a, b) => a + b, 0);
      setScore((prevScore) => prevScore + roundScore);
      setRoundScores((prevScores) => [...prevScores, roundScore]);
      setCurrentRound((prevRound) => prevRound + 1);
      setRerollCount(2); // Reset reroll count for next round
      setSelectedDice([]); // Reset selection for the new round
    }
  };

  const submitScore = () => {
    setLeaderboard((prevLeaderboard) => {
      const newLeaderboard = [
        ...prevLeaderboard,
        { name: "Player", score },
      ].sort((a, b) => b.score - a.score);
      return newLeaderboard;
    });
  };

  return (
    <div className="game-container">
      <h1 className="title">Daily Dice Challenge</h1>
      <h2 className="round">Round {currentRound + 1}/6</h2>
      <p>Rerolls left: {rerollCount}</p>
      <div className="dice-container">
        {rolls[currentRound]?.map((die, index) => (
          <button
            key={index}
            onClick={() =>
              setSelectedDice((prevSelected) =>
                prevSelected.includes(index)
                  ? prevSelected.filter((i) => i !== index)
                  : [...prevSelected, index]
              )
            }
            className={`dice ${
              selectedDice.includes(index) ? "selected" : "locked"
            }`}
          >
            {die}
          </button>
        ))}
      </div>
      <div className="button-container">
        {rerollCount > 0 && (
          <button className="action-button" onClick={reroll}>
            Reroll Unselected
          </button>
        )}
        <button className="action-button" onClick={lockInScore}>
          Lock In Score
        </button>
        {currentRound === 6 && (
          <button className="submit-button" onClick={submitScore}>
            Submit Score
          </button>
        )}
      </div>
      <h2 className="score">Total Score: {score}</h2>
      <h3 className="round-scores-title">Round Scores</h3>
      <ul className="round-scores">
        {roundScores.map((roundScore, index) => (
          <li key={index} className="round-score-entry">
            Round {index + 1}: {roundScore}
          </li>
        ))}
      </ul>
      <h3 className="leaderboard-title">Leaderboard</h3>
      <ul className="leaderboard">
        {leaderboard.map((entry, index) => (
          <li key={index} className="leaderboard-entry">
            {entry.name}: {entry.score}
          </li>
        ))}
      </ul>
    </div>
  );
}
