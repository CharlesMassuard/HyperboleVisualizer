import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

import Donnees from './Components/donnees';
import Compteur from './Components/compteur';
import Header from './Components/header';

const App = () => {
  const [showCompteur, setShowCompteur] = useState(true);
  const [showDonnees, setShowDonnees] = useState(true);

  const toggleCompteur = () => {
    setShowCompteur(!showCompteur);  // Basculer l'affichage du compteur
  };

  const toggleDonnees = () => {
    setShowDonnees(!showDonnees);  // Basculer l'affichage des données
  };

  return (
    <React.StrictMode>
      <Header toggleCompteur={toggleCompteur} toggleDonnees={toggleDonnees} />
      {showDonnees && <Donnees />}
      {showCompteur && <Compteur />}
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Mesurer les performances (facultatif)
reportWebVitals();
