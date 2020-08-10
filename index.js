const firestoreService = require('firestore-export-import');
const serviceAccount = require('./serviceAccountKey.json');


// In your index.js

const firestoreService = require('firestore-export-import');
const serviceAccount = require('./gcloud-sa.json');


// var admin = require("firebase-admin");

// var serviceAccount = require("path/to/serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://simpli-2-sandbox-9c4f.firebaseio.com"
// });


let databaseURL = "https://simpli-2-sandbox-9c4f.firebaseio.com";

// // Initiate Firebase App
// // appName is optional, you can obmit it.
const appName = '[DEFAULT]';
firestoreService.initializeApp(serviceAccount, databaseURL, appName);

// firestoreService
//   .backup('tracking_locations')
//   .then((data) => console.log(JSON.stringify(data)));

// Start importing your data
// The array of date, location and reference fields are optional
firestoreService.restore('data.json');
