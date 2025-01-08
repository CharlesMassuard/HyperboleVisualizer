import React, { useState } from 'react';
import '../CSS/header.css';
import SettingsImage from '../Settings.png';


function Header({ toggleCompteur, toggleDonnees , toggleTemperature}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompteurVisible, setIsCompteurVisible] = useState(true);  // initialiser à true
  const [isDonneesVisible, setIsDonneesVisible] = useState(true);  // initialiser à true
  const [isTemperatureVisible, setIsTemperatureVisible] = useState(true);  // initialiser à true

  // Ouvre/ferme la fenêtre des paramètres
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Fonction pour changer l'état de la visibilité du compteur
  const handleCompteurChange = (e) => {
    setIsCompteurVisible(e.target.checked);  // met à jour la visibilité du compteur
    toggleCompteur(e.target.checked);  // appelle la fonction parent pour gérer l'état du compteur
  };

  // Fonction pour changer l'état de la visibilité des données
  const handleDonneesChange = (e) => {
    setIsDonneesVisible(e.target.checked);  // met à jour la visibilité des données
    toggleDonnees(e.target.checked);  // appelle la fonction parent pour gérer l'état des données
  };

  const handleTemperatureChange = (e) => {
    setIsTemperatureVisible(e.target.checked);  // met à jour la visibilité de la température
    toggleTemperature(e.target.checked);  // appelle la fonction parent pour gérer l'état de la température
  }

  return (
    <div className="header">
      <h1>Hyperbole Visualiser</h1>
      <button onClick={toggleModal}><img src={SettingsImage} alt="settings" /></button>
      

      {/* Fenêtre modale des paramètres */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Paramètres</h2>
            <label>
              <input
                type="checkbox"
                checked={isCompteurVisible}  // coche la case si compteur visible
                onChange={handleCompteurChange}
              /> Afficher Compteur
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                checked={isDonneesVisible}  // coche la case si données visibles
                onChange={handleDonneesChange}
              /> Afficher Données
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                checked={isTemperatureVisible}  // coche la case si température visible
                onChange={handleTemperatureChange}
              /> Afficher Température
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
