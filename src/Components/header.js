import React, { useState } from 'react';
import { ref, remove, get } from 'firebase/database'; // Import des fonctions Firebase
import '../CSS/header.css';
import SettingsImage from '../Settings.png';
import db from '../FireBase/firebase'; // Import de l'instance Firebase

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
    setCollectionName(newName);
    sessionStorage.setItem('collectionName', newName); // Stocke la valeur dans la session
  };

  // Supprimer toutes les données de la collection
  const handleDeleteData = async () => {
    if (!collectionName) {
      alert('Veuillez spécifier un nom de collection.');
      return;
    }
    const collectionRef = ref(db, collectionName);
    try {
      await remove(collectionRef);
      alert('Toutes les données ont été supprimées.');
    } catch (error) {
      console.error('Erreur lors de la suppression des données :', error);
      alert('Une erreur est survenue lors de la suppression.');
    }
  };

  // Exporter la BD en JSON
  const handleExportData = async () => {
    if (!collectionName) {
      alert('Veuillez spécifier un nom de collection.');
      return;
    }
    const collectionRef = ref(db, collectionName);
    try {
      const snapshot = await get(collectionRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const json = JSON.stringify(data, null, 2); // Convertir en JSON formaté
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${collectionName}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        alert('Aucune donnée trouvée dans la collection.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'exportation des données :', error);
      alert('Une erreur est survenue lors de l\'exportation.');
    }
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
                onChange={handleCollectionNameChange}
              />
            </label>
            <button onClick={handleDeleteData}>Supprimer les données</button>
            <br />
            <button onClick={handleExportData}>Exporter en JSON</button>
            <br />
            <button onClick={toggleModal}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
