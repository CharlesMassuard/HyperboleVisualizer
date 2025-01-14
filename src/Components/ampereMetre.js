import React, { useState, useEffect } from 'react';
import '../CSS/ampereMetre.css';
import { ref, onValue } from 'firebase/database'; // Firebase Realtime Database
import db from '../FireBase/firebase'; // Instance Firebase

function AmpereMetre() {
    const [lastPoint, setLastPoint] = useState(null);
  const [position, setPosition] = useState({ x: '50%', y: '70%' });
  const [isDragging, setIsDragging] = useState(false);
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
          setLastPoint(fetchedData[fetchedData.length - 1]);
        }
      },
      (error) => {
        console.error('Error fetching data: ', error);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

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


  return (
    <div
      className="ampere-container"
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
        className="ampere-box"
        onMouseDown={handleMouseDown}
        style={{ cursor: 'grab' }}
      >
        {lastPoint && (
            <p className="ampere">
            {lastPoint.A}
            </p>
        )}
        </div>
    </div>
  );
}

export default AmpereMetre;