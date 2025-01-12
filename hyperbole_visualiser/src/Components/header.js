import React, { useState } from 'react';
import '../CSS/header.css';
import SettingsImage from '../Settings.png';

function Header({ toggleCompteur, toggleDonnees, toggleTemperature }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompteurVisible, setIsCompteurVisible] = useState(true);
  const [isDonneesVisible, setIsDonneesVisible] = useState(true);
  const [isTemperatureVisible, setIsTemperatureVisible] = useState(true);
  const [collectionName, setCollectionName] = useState(
    sessionStorage.getItem('collectionName') || '' // Récupère la valeur initiale depuis le sessionStorage
  );

  // Ouvre/ferme la fenêtre des paramètres
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Fonction pour changer l'état de la visibilité du compteur
  const handleCompteurChange = (e) => {
    setIsCompteurVisible(e.target.checked);
    toggleCompteur(e.target.checked);
  };

  // Fonction pour changer l'état de la visibilité des données
  const handleDonneesChange = (e) => {
    setIsDonneesVisible(e.target.checked);
    toggleDonnees(e.target.checked);
  };

  // Fonction pour changer l'état de la visibilité de la température
  const handleTemperatureChange = (e) => {
    setIsTemperatureVisible(e.target.checked);
    toggleTemperature(e.target.checked);
  };

  // Fonction pour mettre à jour le nom de la collection
  const handleCollectionNameChange = (e) => {
    const newName = e.target.value;
    setCollectionName(newName); // Met à jour l'état local
    sessionStorage.setItem('collectionName', newName); // Stocke la valeur dans la session
  };

  return (
    <div className="header">
      <h1>Hyperbole Visualiser</h1>
      <button onClick={toggleModal}>
        <img src={SettingsImage} alt="settings" />
      </button>

      {/* Fenêtre modale des paramètres */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Paramètres</h2>
            <label>
              <input
                type="checkbox"
                checked={isCompteurVisible}
                onChange={handleCompteurChange}
              />{' '}
              Afficher Compteur
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                checked={isDonneesVisible}
                onChange={handleDonneesChange}
              />{' '}
              Afficher Données
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                checked={isTemperatureVisible}
                onChange={handleTemperatureChange}
              />{' '}
              Afficher Température
            </label>
            <br />
            <h2>Base de données</h2>
            <label>
              Nom de la collection
              <input
                type="text"
                value={collectionName}
                onChange={handleCollectionNameChange} // Gère le changement de valeur
              />
            </label>
            <br />
            <button onClick={toggleModal}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
