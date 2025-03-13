import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { app } from "./firebase";

const db = getFirestore(app);

const Leaderboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    // Reference to the scores collection, ordered by 'score' in descending order
    const scoresQuery = query(
      collection(db, "highScores"),
      orderBy("score", "desc")
    );

    // Listen for real-time updates
    const unsubscribe = onSnapshot(scoresQuery, (querySnapshot) => {
      const scoresData = [];
      querySnapshot.forEach((doc) => {
        scoresData.push({ id: doc.id, ...doc.data() });
      });
      setScores(scoresData);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h3 className="leaderboard">Leaderboard</h3>
      <ul className="leaderboard">
        {scores.map((score, index) => (
          <li key={score.id} className="leaderboard-entry">
            {index + 1}. {score.name}: {score.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
