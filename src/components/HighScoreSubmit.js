// HighScoreSubmit.js
import React from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { getToken } from "firebase/app-check";
import { appCheck } from "./firebase";
const HighScoreSubmit = ({ score, onScoreSubmitted, playerName }) => {
  const submitScore = async () => {
    if (playerName) {
      try {
        await getToken(appCheck, false);
        await addDoc(collection(db, "highScores"), {
          name: playerName,
          score: score,
          timestamp: serverTimestamp(), // firestore timestamp
        });
        console.log("High score stored in Firestore.");
        if (onScoreSubmitted) onScoreSubmitted();
      } catch (error) {
        console.error("Error storing high score: ", error);
      }
    } else {
      alert("Please enter your name before submitting!");
      return;
    }
  };

  return (
    <button className="submit-button" onClick={submitScore}>
      Submit Score
    </button>
  );
};

export default HighScoreSubmit;
