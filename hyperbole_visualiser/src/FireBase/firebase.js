// Import des modules Firebase
import { initializeApp } from 'firebase/app'; // Initialise l'application Firebase
import { getFirestore } from 'firebase/firestore'; // Import Firestore

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAi4ZoC65ZI7NH2H0VQ1Lvp-zHeLVMoMRQ",
  authDomain: "hyperbolevisualizer.firebaseapp.com",
  projectId: "hyperbolevisualizer",
  storageBucket: "hyperbolevisualizer.firebasestorage.app",
  messagingSenderId: "206996044032",
  appId: "1:206996044032:web:f817efd6da76b64b909be5",
  measurementId: "G-CK0KZ4894Y"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);

// Initialisation Firestore
const db = getFirestore(app);

export default db;
