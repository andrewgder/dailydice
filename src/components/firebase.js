// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "../config";
// require("dotenv").config();

// // Replace with your own Firebase config object
// const firebaseConfig = {
//   apiKey: process.env.apiKey,
//   authDomain: process.env.authDomain,
//   projectId: process.env.projectId,
//   // ... other config values
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { app };
export { db };
