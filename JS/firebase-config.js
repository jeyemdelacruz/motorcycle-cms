// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-analytics.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-storage.js";


// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAxgYKM6AeBPDR1jmzsdUJtqROpL08QZH0",
  authDomain: "motobuild-a9c9a.firebaseapp.com",
  databaseURL: "https://motobuild-a9c9a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "motobuild-a9c9a",
  storageBucket: "motobuild-a9c9a.firebasestorage.app",
  messagingSenderId: "346814637770",
  appId: "1:346814637770:web:79e8260152dff9d364f633",
  measurementId: "G-F63S5C01PC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
// const analytics = getAnalytics(app);
const storage = getStorage(app);


export { app, db };