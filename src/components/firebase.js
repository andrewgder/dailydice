// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig, siteKey, debugToken } from "../config";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAuth, signInAnonymously } from "firebase/auth";
if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  window.FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken;
  console.log("Debug token set:", !!debugToken);
}

// console.log(process.env.firebaseConfig);

// // Replace with your own Firebase config object
// const firebaseConfig = {
//   apiKey: process.env.apiKey,
//   authDomain: process.env.authDomain,
//   projectId: process.env.projectId,
//   // ... other config values
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(siteKey),
  isTokenAutoRefreshEnabled: true,
});

const db = getFirestore(app);

// In your app initialization
const auth = getAuth(app);
signInAnonymously(auth);

export { app, db, appCheck };
