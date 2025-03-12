// HighScoreSubmit.js
import React from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

const HighScoreSubmit = ({ score, onScoreSubmitted, playerName }) => {
  const submitScore = async () => {
    try {
      await addDoc(collection(db, "highScores"), {
        name: playerName,
        score: score,
        date: new Date(), // or use serverTimestamp() if needed
      });
      console.log("High score stored in Firestore.");
      if (onScoreSubmitted) onScoreSubmitted();
    } catch (error) {
      console.error("Error storing high score: ", error);
    }
  };

  return (
    <button className="submit-button" onClick={submitScore}>
      Submit Score
    </button>
  );
};

export default HighScoreSubmit;
