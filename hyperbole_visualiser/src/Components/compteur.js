import React, { useState, useEffect } from 'react';
import '../CSS/compteur.css';
import { ref, onValue } from 'firebase/database'; // Firebase Realtime Database
import db from '../FireBase/firebase'; // Instance Firebase

function Compteur() {
  const [lastPoint, setLastPoint] = useState(null);
  const [angle, setAngle] = useState(0); // Nouvel état pour l'angle de l'aiguille

  useEffect(() => {
    const pointsRef = ref(db, '/');
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
  
  useEffect(() => {
    // Calcul de l'angle en fonction de la vitesse
    const validVitesse = lastPoint?.V ? Math.max(0, Math.min(lastPoint.V, 100)) : 0;
    const newAngle = (validVitesse / 100) * 180; // Calcul de l'angle en fonction de la vitesse
    
    // Animation fluide de l'aiguille
    const step = (newAngle - angle) / 10; // Fractionner l'angle en 10 étapes pour l'animation
    let currentAngle = angle;
    const interval = setInterval(() => {
      currentAngle += step;
      if (Math.abs(currentAngle - newAngle) < Math.abs(step)) {
        clearInterval(interval);
        currentAngle = newAngle;
      }
      setAngle(currentAngle);
    }, 50); // Mettre à jour toutes les 50ms pour une animation fluide
    
    return () => clearInterval(interval); // Nettoyer l'intervalle lors du démontage du composant
  }, [lastPoint, angle]); // Déclenche l'animation chaque fois que `lastPoint` ou `angle` change

  return (
    <div className="compteur-box">
      {lastPoint ? (
        <div>
          {/* Aiguille */}
          <svg
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '300px',
              height: '150px',
            }}
          >
            {/* Pivot central */}
            <circle cx="150" cy="150" r="5" fill="#000" />
            {/* Aiguille */}
            <line
              x1="150"
              y1="150"
              x2={150 + 100 * Math.cos((angle - 180) * (Math.PI / 180))}
              y2={150 + 100 * Math.sin((angle - 180) * (Math.PI / 180))}
              stroke="#FF0000"
              strokeWidth="3"
            />
          </svg>

          {/* Graduations */}
          <svg
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '300px',
              height: '150px',
            }}
          >
            {[...Array(11).keys()].map((i) => {
              const gradAngle = (i / 10) * 180 - 180; // Angle pour chaque graduation
              const x1 = 150 + 90 * Math.cos((gradAngle) * (Math.PI / 180));
              const y1 = 150 + 90 * Math.sin((gradAngle) * (Math.PI / 180));
              const x2 = 150 + 100 * Math.cos((gradAngle) * (Math.PI / 180));
              const y2 = 150 + 100 * Math.sin((gradAngle) * (Math.PI / 180));
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#000"
                  strokeWidth={i % 5 === 0 ? 2 : 1}
                />
              );
            })}
          </svg>

          {/* Marqueurs des limites */}
          <svg
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '300px',
              height: '150px',
            }}
          >
            <text x="50" y="140" textAnchor="middle" fill="#000">0</text>
            <text x="150" y="140" textAnchor="middle" fill="#000">50</text>
            <text x="250" y="140" textAnchor="middle" fill="#000">100</text>
          </svg>
        </div>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
}

export default Compteur;
