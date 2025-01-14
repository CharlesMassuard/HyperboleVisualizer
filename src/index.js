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
import AmpereMetre from './Components/ampereMetre';
import JoulMetre from './Components/joulMetre';

const App = () => {
  const [showCompteur, setShowCompteur] = useState(true);
  const [showDonnees, setShowDonnees] = useState(true);
  const [showTemperature, setShowTemperature] = useState(true);
  const [showAmpereMetre, setShowAmpereMetre] = useState(true);
  const [showJoulMetre, setShowJoulMetre] = useState(true);
  const [points, setPoints] = useState([]);
  const collectionName = sessionStorage.getItem('collectionName') || '/';

  useEffect(() => {
    const pointsRef = ref(db, collectionName);
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
  }, [collectionName]);
    

  const toggleCompteur = () => {
    setShowCompteur(!showCompteur);
  };

  const toggleDonnees = () => {
    setShowDonnees(!showDonnees);
  };

  const toggleTemperature = () => {
    setShowTemperature(!showTemperature);
  };

  const toggleAmpereMetre = () => {
    setShowAmpereMetre(!showAmpereMetre);
  }

  const toggleJoulMetre = () => {
    setShowJoulMetre(!showJoulMetre);
  }

  return (
    <React.StrictMode>
      <Header toggleCompteur={toggleCompteur} toggleDonnees={toggleDonnees} toggleTemperature={toggleTemperature} toggleAmpereMetre={toggleAmpereMetre} toggleJoulMetre={toggleJoulMetre}/>
      
      {showDonnees && <Donnees />}
      {showCompteur && <Compteur />}
      {showTemperature && <Thermometre />}
      {showAmpereMetre && <AmpereMetre />}
      {showJoulMetre && <JoulMetre />}
      
      <div style={{ height: "50vh", width: "50%" }}>
        <CarMap points={points} />
      </div>
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

reportWebVitals();
