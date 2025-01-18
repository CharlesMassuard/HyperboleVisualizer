import React, { useState, useEffect } from 'react';
import '../CSS/joulMetre.css';
import { ref, onValue } from 'firebase/database'; // Firebase Realtime Database
import db from '../FireBase/firebase'; // Instance Firebase


function JoulMetre() {
    const [lastPoint, setLastPoint] = useState(null);
    const [position, setPosition] = useState({ x: 65, y: 30 }); // Utilisation de pourcentages pour la position
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 }); // Pour stocker le décalage entre la souris et l'élément
    const collectionName = sessionStorage.getItem('collectionName') || '/data';
    const [moyenneJoules, setMoyenneJoules] = useState(0);

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
              setLastPoint(fetchedData[fetchedData.length - 1]);
            }
          },
          (error) => {
            console.error('Error fetching data: ', error);
          }
        );
    
        return () => unsubscribe();
      }, [collectionName]);
    
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
              const moyenne = fetchedData.reduce((acc, point) => acc + point.J, 0) / fetchedData.length;
              setMoyenneJoules(moyenne);
            }
          },
          (error) => {
            console.error('Error fetching data: ', error);
          }
        );
    
        return () => unsubscribe();
      }, [collectionName]);
    

    const handleMouseDown = (e) => {
        // Désactive la sélection du texte pendant le déplacement
        document.body.style.userSelect = 'none';
    
        const rect = e.target.getBoundingClientRect();
        setOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
        setIsDragging(true);
      };
    
      const handleMouseMove = (e) => {
        if (isDragging) {
          // Calculer la nouvelle position en fonction de la souris
          setPosition({
            x: ((e.clientX - offset.x) / window.innerWidth) * 100, // Convertir en pourcentage
            y: ((e.clientY - offset.y) / window.innerHeight) * 100, // Convertir en pourcentage
          });
        }
      };
    
      const handleMouseUp = () => {
        // Réactive la sélection de texte après le déplacement
        document.body.style.userSelect = 'auto';
        setIsDragging(false);
      };
    return (
        <div
        className="ampere-container"
        style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            position: 'absolute',
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // S'assure que le déplacement cesse si la souris quitte l'élément
        onMouseDown={handleMouseDown}
        >
            <h2>Joul</h2>
            {lastPoint && <p className="ampere">{lastPoint.J}</p>}
            <h2>Moyenne Total</h2>
            <p>{moyenneJoules.toFixed(2)}</p>
        </div>
    );
}

export default JoulMetre;