import React, { useState, useEffect } from 'react';
import '../CSS/home.css';
import { collection, onSnapshot } from 'firebase/firestore'; // Import des fonctions Firestore
import db from '../FireBase/firebase'; // Import de l'instance Firestore

function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Écoute en temps réel des modifications dans la collection 'points'
    const unsubscribe = onSnapshot(
      collection(db, 'points'), 
      (querySnapshot) => {
        const fetchedData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
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
    <div className="home">
      <h1>Hyperbole Visualizer</h1>
      <p>Enter a sentence and see the hyperboles in it!</p>
      <ul>
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
