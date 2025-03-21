import { useState, useEffect } from "react";
import Dice from "./Dice"; // Import the Dice component
import "../styles/App.css";
import DiceRollAudio from "./DiceAudio";
import InfoModal from "./InfoModal";
import CalculateScore from "./CalculateScore";
import ScorePreview from "./ScorePreview";
import HighScoreSubmit from "./HighScoreSubmit";
import Leaderboard from "./Leaderboard";

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
  const [lockDisabled, setLockDisabled] = useState(false);
  const [hasPlayedToday, setHasPlayedToday] = useState(false);

  useEffect(() => {
    const lastPlayed = localStorage.getItem("lastPlayedDate");
    const today = new Date().toISOString().split("T")[0];

    if (lastPlayed === today) {
      setHasPlayedToday(true);
    }
  }, []);

  const reroll = () => {
    if (lockDisabled) return;
    setLockDisabled(true);
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
        setRollingDice([]);
        setLockDisabled(false); // Stop rolling effect
      }, 2000);

      setRerollCount((prev) => prev - 1);
    }
  };
  const lockInScore = () => {
    if (lockDisabled) return;
    setLockDisabled(true);
    if (currentRound === 5) {
      const roundScore = CalculateScore(rolls[currentRound]);
      setScore((prevScore) => prevScore + roundScore);
      setRoundScores((prevScores) => [...prevScores, roundScore]);
      setGameOver(true);
    }
    if (currentRound < 5) {
      const roundScore = CalculateScore(rolls[currentRound]);
      setScore((prevScore) => prevScore + roundScore);
      setRoundScores((prevScores) => [...prevScores, roundScore]);
      DiceRollAudio();
      setSelectedDice([]);
      setRollingDice([...Array(5).keys()]);
      setTimeout(() => {
        setRollingDice([]); // Stop rolling animation after 1 second
        setCurrentRound((prevRound) => prevRound + 1);
        setRerollCount(2);
        setSelectedDice([]);
        setLockDisabled(false);
      }, 2000); // Matches the rolling animation time (1s)
    }
  };
  // Optionally, you can still update your local leaderboard here
  // const updateLeaderboard = () => {
  //   setLeaderboard((prevLeaderboard) => {
  //     const newLeaderboard = [
  //       ...prevLeaderboard,
  //       { name: "Player", score },
  //     ].sort((a, b) => b.score - a.score);
  //     return newLeaderboard;
  //   });
  // };
  const resetGame = () => {
    if (!playerName.trim()) {
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
    // Reset the game state for a new game
    setRolls(generateDailyRolls());
    setCurrentRound(0);
    setScore(0);
    setRoundScores([]);
    setSelectedDice([]);
    setRerollCount(2);
    setLockDisabled(false);
    setGameOver(false);
  };
  const playedGame = () => {
    if (!hasPlayedToday) {
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem("lastPlayedDate", today);
      setHasPlayedToday(true);
    }
  };

  return (
    <div className="game-container">
      <h1 className="title">
        Daily Dice Challenge <InfoModal />
      </h1>

      {hasPlayedToday ? (
        <h2>You have already played today. Come back tomorrow!</h2>
      ) : (
        <>
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
                  <button
                    className="action-button"
                    onClick={reroll}
                    disabled={lockDisabled}
                  >
                    Reroll Unselected
                  </button>
                )}
                <button
                  className="action-button"
                  disabled={lockDisabled}
                  onClick={lockInScore}
                >
                  Lock In Score
                </button>{" "}
              </>
            )}
            {gameOver && (
              <div className="game-over">
                <h3> Enter your name to submit your score!</h3>
                <input
                  type="text"
                  placeholder="Name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="name-input"
                />
                <HighScoreSubmit
                  score={score}
                  onScoreSubmitted={() => {
                    resetGame();
                    playedGame();
                  }}
                  playerName={playerName}
                />
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
        </>
      )}
      <Leaderboard></Leaderboard>
    </div>
  );
}
