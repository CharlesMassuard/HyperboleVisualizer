import React, { useState, useEffect } from 'react';
import '../CSS/home.css';
import db from '../FireBase/firebase';

function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await db.collection('points').get(); // Remplacez par le nom correct
        const fetchedData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home">
      <h1>Hyperbole Visualizer</h1>
      <p>Enter a sentence and see the hyperboles in it!</p>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            {/* Affichez vos données ici */}
            {item.name} - {item.age}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
