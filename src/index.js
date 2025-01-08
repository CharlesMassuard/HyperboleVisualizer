import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

import Donnees from './Components/donnees';
import Compteur from './Components/compteur';
import Header from './Components/header';
import Thermometre from './Components/temperature';

const App = () => {
  const [showCompteur, setShowCompteur] = useState(true);
  const [showDonnees, setShowDonnees] = useState(true);
  const [showTemperature, setShowTemperature] = useState(true);

  const toggleCompteur = () => {
    setShowCompteur(!showCompteur);  // Basculer l'affichage du compteur
  };

  const toggleDonnees = () => {
    setShowDonnees(!showDonnees);  // Basculer l'affichage des données
  };

  const toggleTemperature = () => {
    setShowTemperature(!showTemperature);  // Basculer l'affichage de la température
  };

  return (
    <React.StrictMode>
      <Header toggleCompteur={toggleCompteur} toggleDonnees={toggleDonnees} toggleTemperature={toggleTemperature}/>
      {showDonnees && <Donnees />}
      {showCompteur && <Compteur />}
      {showTemperature && <Thermometre />}
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Mesurer les performances (facultatif)
reportWebVitals();
