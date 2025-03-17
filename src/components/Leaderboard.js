import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
  Timestamp,
} from "firebase/firestore";
import { app } from "./firebase";

const db = getFirestore(app);

const getStartOfWeek = () => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // Get current day (0 = Sunday, 1 = Monday, etc.)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - dayOfWeek); // Move to Sunday
  startOfWeek.setHours(0, 0, 0, 0); // Reset time

  return Timestamp.fromDate(startOfWeek); // Convert to Firestore Timestamp
};

const Leaderboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const startOfWeek = getStartOfWeek();
    // Reference to the scores collection, ordered by 'score' in descending order
    const scoresQuery = query(
      collection(db, "highScores"),
      where("timestamp", ">=", startOfWeek),
      orderBy("score", "desc")
    );

    // Listen for real-time updates
    const unsubscribe = onSnapshot(scoresQuery, (querySnapshot) => {
      const scoresData = [];
      querySnapshot.forEach((doc) => {
        scoresData.push({ id: doc.id, ...doc.data() });
      });

      //   Display top 10 weekly high scores
      setScores(scoresData.slice(0, 10));
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h3 className="leaderboard">Weekly Top 10 Leaderboard</h3>
      <ul className="leaderboard">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((entry, index) => (
              <tr key={index} className="leaderboard-entry">
                <td>{index + 1}</td>
                <td>{entry.name}</td>
                <td>{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ul>
    </div>
  );
};

export default Leaderboard;
