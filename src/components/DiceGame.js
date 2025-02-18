import { useState } from "react";
import Dice from "./Dice"; // Import the Dice component
import "../styles/App.css";
import DiceRollAudio from "./DiceAudio";
import InfoModal from "./InfoModal";
import CalculateScore from "./CalculateScore";
import ScorePreview from "./ScorePreview";

const generateDailyRolls = () => {
  return Array(6)
    .fill()
    .map(() =>
      Array(5)
        .fill()
        .map(() => Math.floor(Math.random() * 6) + 1)
    );
};

export default function DiceGame() {
  const [rolls, setRolls] = useState(generateDailyRolls());
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedDice, setSelectedDice] = useState([]);
  const [score, setScore] = useState(0);
  const [roundScores, setRoundScores] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [rerollCount, setRerollCount] = useState(2);
  const [rollingDice, setRollingDice] = useState([]);
  const [playerName, setPlayerName] = useState(""); // New state for player name
  const [gameOver, setGameOver] = useState(false);

  const reroll = () => {
    if (rerollCount > 0 && currentRound < 6) {
      DiceRollAudio();
      const diceToRoll = rolls[currentRound]
        .map((_, i) => (selectedDice.includes(i) ? null : i))
        .filter((i) => i !== null);

      setRollingDice(diceToRoll);

      setTimeout(() => {
        setRolls((prevRolls) => {
          const newRolls = prevRolls.map((round, index) =>
            index === currentRound
              ? round.map((die, i) =>
                  diceToRoll.includes(i)
                    ? Math.floor(Math.random() * 6) + 1
                    : die
                )
              : round
          );
          return [...newRolls];
        });
        setRollingDice([]); // Stop rolling effect
      }, 2000);

      setRerollCount((prev) => prev - 1);
    }
  };
  const lockInScore = () => {
    if (currentRound < 6) {
      DiceRollAudio();
      setRollingDice([...Array(5).keys()]);
      setTimeout(() => {
        setRollingDice([]); // Stop rolling animation after 1 second
        const roundScore = CalculateScore(rolls[currentRound]);
        setScore((prevScore) => prevScore + roundScore);
        setRoundScores((prevScores) => [...prevScores, roundScore]);
        setCurrentRound((prevRound) => prevRound + 1);
        setRerollCount(2);
        setSelectedDice([]);
      }, 2000); // Matches the rolling animation time (1s)
      if (currentRound === 5) {
        setGameOver(true);
      }
    }
  };

  const submitScore = () => {
    if (!playerName.trim()) {
      alert("Please enter your name before submitting!");
      return;
    }

    setLeaderboard((prevLeaderboard) => {
      const newLeaderboard = [
        ...prevLeaderboard,
        { name: playerName, score },
      ].sort((a, b) => b.score - a.score);
      return newLeaderboard;
    });

    setPlayerName(""); // Reset input after submission
    // Reset game state
  };

  return (
    <div className="game-container">
      <h1 className="title">
        Daily Dice Challenge <InfoModal />
      </h1>
      <h2 className="round">
        {" "}
        {gameOver ? "Game Over!" : `Round ${currentRound + 1}/6`}
      </h2>
      <p> {gameOver ? "" : `Rerolls left: ${rerollCount}`}</p>
      <div className="dice-container">
        {rolls[currentRound]?.map((die, index) => (
          <Dice
            key={index}
            value={die}
            isRolling={rollingDice.includes(index)}
            isSelected={selectedDice.includes(index)}
            onClick={() =>
              setSelectedDice((prevSelected) =>
                prevSelected.includes(index)
                  ? prevSelected.filter((i) => i !== index)
                  : [...prevSelected, index]
              )
            }
          />
        ))}
      </div>
      <ScorePreview dice={rolls[currentRound]} />

      <div className="button-container">
        {" "}
        {!gameOver && (
          <>
            {rerollCount > 0 && (
              <button className="action-button" onClick={reroll}>
                Reroll Unselected
              </button>
            )}
            <button className="action-button" onClick={lockInScore}>
              Lock In Score
            </button>{" "}
          </>
        )}
        {gameOver && (
          <div className="game-over">
            <h3>Game Over! Enter your name:</h3>
            <input
              type="text"
              placeholder="Your Name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="name-input"
            />
            <button className="submit-button" onClick={submitScore}>
              Submit Score
            </button>
          </div>
        )}
      </div>
      <h2 className="score">Total Score: {score}</h2>
      <h3 className="round-scores-title">Round Scores</h3>
      <div className="round-scores-container">
        {/* Round Numbers */}
        <div className="round-numbers">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="round-number">
              {index + 1}
            </div>
          ))}
        </div>

        {/* Score Boxes */}
        <div className="round-score-boxes">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="round-score-box">
              {roundScores[index] !== undefined ? roundScores[index] : "-"}
            </div>
          ))}
        </div>
      </div>

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
