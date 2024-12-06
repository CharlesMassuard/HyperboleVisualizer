import React, { useState, useEffect } from 'react';
import '../CSS/temperature.css';
import { ref, onValue } from 'firebase/database'; // Firebase Realtime Database
import db from '../FireBase/firebase'; // Instance Firebase

function Thermometre() {
  const [lastPoint, setLastPoint] = useState(null);
  const [position, setPosition] = useState({ x: '50%', y: '70%' });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const pointsRef = ref(db, '/data');
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
          setLastPoint(fetchedData[fetchedData.length - 1]);
        }
      },
      (error) => {
        console.error('Error fetching data: ', error);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - 30, // Ajuster pour centrer le thermomètre sur la souris
        y: e.clientY - 100, // Ajuster pour centrer le thermomètre sur la souris
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Calculer la position du "liquide" en fonction de la température
  const getLiquidHeight = () => {
    const temperature = lastPoint?.T ?? 0;
    const validTemperature = Math.max(-30, Math.min(temperature, 50)); // Température de -30°C à 50°C
    return ((validTemperature + 30) / 80) * 100; // Calculer la hauteur du liquide en pourcentage
  };

  // Fonction pour obtenir la couleur en fonction de la température
  const getLiquidColor = () => {
    const temperature = lastPoint?.T ?? 0;
    const validTemperature = Math.max(-30, Math.min(temperature, 50)); // Température de -30°C à 50°C

    // Définir une couleur en fonction de la température
    if (validTemperature <= 0) {
      return '#0000FF'; // Bleu pour les températures froides
    } else if (validTemperature > 0 && validTemperature <= 25) {
      return '#FFA500'; // Jaune pour les températures modérées
    } else {
      return '#FF0000'; // Rouge pour les températures chaudes
    }
  };

  return (
    <div
      className="thermometre-container"
      style={{
        left: position.x,
        top: position.y,
        position: 'absolute',
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // S'assure que le déplacement cesse si la souris quitte l'élément
    >
      <div
        className="thermometre-box"
        onMouseDown={handleMouseDown}
        style={{ cursor: 'grab' }}
      >
        {lastPoint ? (
          <div
            style={{
              position: 'relative',
              width: '60px',
              height: '200px',
              backgroundColor: '#e0e0e0',
              borderRadius: '30px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                bottom: '0',
                width: '100%',
                height: `${getLiquidHeight()}%`,
                backgroundColor: getLiquidColor(), // Couleur du liquide basée sur la température
                borderRadius: '30px 30px 0 0',
                transition: 'height 0.5s ease, background-color 0.5s ease', // Animation de la hauteur et de la couleur
              }}
            ></div>
          </div>
        ) : (
          <p>Chargement...</p>
        )}
      </div>

      {lastPoint && (
        <p className="temperature">
          {lastPoint.T}°C
        </p>
      )}
    </div>
  );
}

export default Thermometre;
