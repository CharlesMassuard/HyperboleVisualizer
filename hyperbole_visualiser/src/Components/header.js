import React, { useState } from 'react';
import '../CSS/header.css';

function Header({ toggleCompteur, toggleDonnees }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompteurVisible, setIsCompteurVisible] = useState(true);  // initialiser à true
  const [isDonneesVisible, setIsDonneesVisible] = useState(true);  // initialiser à true

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

  return (
    <div className="header">
      <h1>Hyperbole Visualiser</h1>
      <button onClick={toggleModal}>Paramètres</button>

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
            <button onClick={toggleModal}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
