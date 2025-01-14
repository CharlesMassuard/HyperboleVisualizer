import React, { useState, useEffect } from 'react';
import '../CSS/donnees.css';
import { ref, onValue } from 'firebase/database'; // Import des fonctions Realtime Database
import db from '../FireBase/firebase'; // Import de l'instance Realtime Database

function Donnees() {
  const [data, setData] = useState([]);
  const [position, setPosition] = useState({ x: '5%', y: '70%' }); // Position initiale
  const [isDragging, setIsDragging] = useState(false);
  const collectionName = sessionStorage.getItem('collectionName') || '/';


  // Gestion des données Firebase
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
        setData(fetchedData);
      },
      (error) => {
        console.error("Error fetching data: ", error);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

  // Gestion des déplacements
  const handleMouseDown = (e) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - 300, // Ajustez pour centrer l'objet
        y: e.clientY - 100,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="donnees-container"
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        className="donnees-box"
        onMouseDown={handleMouseDown}
      >
        <ul className="donnees-list">
          {data.map((item) => (
            <li key={item.id}>
              {item.latitude} - {item.longitude} - {item.V}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Donnees;