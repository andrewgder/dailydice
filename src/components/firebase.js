// firebase.js

import firebase from "firebase/app";
import "firebase/firestore";
require("dotenv").config();

// Replace with your own Firebase config object
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  // ... other config values
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export { db };
