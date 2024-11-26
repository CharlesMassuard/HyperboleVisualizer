import React, { useState, useEffect } from 'react';
import '../CSS/donnees.css';
import { ref, onValue } from 'firebase/database'; // Import des fonctions Realtime Database
import db from '../FireBase/firebase'; // Import de l'instance Realtime Database

function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Référence à la collection 'points' dans la Realtime Database
    const pointsRef = ref(db, 'points');

    // Écoute en temps réel des modifications dans 'points'
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
        console.log("Updated Data:", fetchedData); // Vérifiez les données reçues en temps réel
        setData(fetchedData);
      },
      (error) => {
        console.error("Error fetching data: ", error);
      }
    );

    // Nettoyage de l'écouteur lors du démontage du composant
    return () => unsubscribe();
  }, []);

  return (
    <div className="donnees-box">
      <ul className="donnees-list">
        {data.map((item) => (
          <li key={item.id}>
            {/* Affichez vos données ici */}
            {item.lat} - {item.long}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
