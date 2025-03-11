const admin = require("firebase-admin");
require("dotenv").config();

// Import the service account key JSON file
const serviceAccount = require("./serviceaccount.json"); // Adjust the path as needed

// Initialize the Firebase Admin SDK using the service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Attempt to read documents from a test collection
db.collection("test")
  .get()
  .then((snapshot) => {
    console.log("Documents retrieved successfully:");
    snapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  })
  .catch((err) => {
    console.error("Error retrieving documents:", err);
  });
