// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-analytics.js";
// import { getStorage } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-storage.js";


// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCqFQo-m7Tc-kijypR4rsOulvOmyN4u0Ts",
  authDomain: "thesis-motor-engine.firebaseapp.com",
  projectId: "thesis-motor-engine",
  storageBucket: "thesis-motor-engine.appspot.com",
  messagingSenderId: "230443989653",
  appId: "1:230443989653:web:5e48eef7759a1a3844b99c",
  measurementId: "G-JJEBSLZH59",
  databaseURL: "https://thesis-motor-engine-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
// const analytics = getAnalytics(app);
// const storage = getStorage(app);


export { app, db };