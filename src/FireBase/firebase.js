import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database'; // Import Realtime Database

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1ttRGoeXvo29Zu0H-9OZy-Km3BpTvJ8Y",
  authDomain: "test-c15c4.firebaseapp.com",
  databaseURL: "https://test-c15c4-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "test-c15c4",
  storageBucket: "test-c15c4.firebasestorage.app",
  messagingSenderId: "221712750387",
  appId: "1:221712750387:web:225a551c67785279101046",
  measurementId: "G-FWK3E5RXZ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
export default db;