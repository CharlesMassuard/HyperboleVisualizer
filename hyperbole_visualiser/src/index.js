import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { ref, onValue } from 'firebase/database'; // Firebase Realtime Database
import db from './FireBase/firebase'; // Instance Firebase

import Donnees from './Components/donnees';
import Compteur from './Components/compteur';
import Header from './Components/header';
import Thermometre from './Components/temperature';
import CarMap from './Components/map';

const App = () => {
  const [showCompteur, setShowCompteur] = useState(true);
  const [showDonnees, setShowDonnees] = useState(true);
  const [showTemperature, setShowTemperature] = useState(true);
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const pointsRef = ref(db, '/gps');
    const unsubscribe = onValue(
      pointsRef,
      (snapshot) => {
        const fetchedData = [];
        snapshot.forEach((childSnapshot) => {
          fetchedData.push({
            id: childSnapshot.key,
            ...childSnapshot.val(),
          });
        });
  
        if (fetchedData.length > 0) {
          setPoints(fetchedData); 
        }
      },
      (error) => {
        console.error('Error fetching data: ', error);
      }
    );
  
    return () => unsubscribe();
  }, []);
    

  const toggleCompteur = () => {
    setShowCompteur(!showCompteur);
  };

  const toggleDonnees = () => {
    setShowDonnees(!showDonnees);
  };

  const toggleTemperature = () => {
    setShowTemperature(!showTemperature);
  };

  return (
    <React.StrictMode>
      <Header toggleCompteur={toggleCompteur} toggleDonnees={toggleDonnees} toggleTemperature={toggleTemperature} />
      
      {showDonnees && <Donnees />}
      {showCompteur && <Compteur />}
      {showTemperature && <Thermometre />}
      
      <div style={{ height: "50vh", width: "50%" }}>
        <CarMap points={points} />
      </div>
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

reportWebVitals();
