// Import des modules Firebase
import { initializeApp } from 'firebase/app'; // Initialise l'application Firebase
import { getDatabase } from 'firebase/database'; // Import Realtime Database

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAi4ZoC65ZI7NH2H0VQ1Lvp-zHeLVMoMRQ",
  authDomain: "hyperbolevisualizer.firebaseapp.com",
  databaseURL: "https://hyperbolevisualizer-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "hyperbolevisualizer",
  storageBucket: "hyperbolevisualizer.firebasestorage.app",
  messagingSenderId: "206996044032",
  appId: "1:206996044032:web:f817efd6da76b64b909be5",
  measurementId: "G-CK0KZ4894Y"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);

// Initialisation Realtime Database
const db = getDatabase(app);

export default db;
