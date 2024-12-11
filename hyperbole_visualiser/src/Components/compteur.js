import React, { useState, useEffect } from 'react';
import '../CSS/compteur.css';
import { ref, onValue } from 'firebase/database'; // Firebase Realtime Database
import db from '../FireBase/firebase'; // Instance Firebase

function Compteur() {
  const [lastPoint, setLastPoint] = useState(null);
  const [angle, setAngle] = useState(0);
  const [position, setPosition] = useState({ x: '80%', y: '70%' });
  const [isDragging, setIsDragging] = useState(false);
  const [size, setSize] = useState(300); // Taille dynamique

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

  useEffect(() => {
    const validVitesse = lastPoint?.V ? Math.max(0, Math.min(lastPoint.V, 100)) : 0;
    const newAngle = (validVitesse / 100) * 180;

    const step = (newAngle - angle) / 10;
    let currentAngle = angle;
    const interval = setInterval(() => {
      currentAngle += step;
      if (Math.abs(currentAngle - newAngle) < Math.abs(step)) {
        clearInterval(interval);
        currentAngle = newAngle;
      }
      setAngle(currentAngle);
    }, 50);

    return () => clearInterval(interval);
  }, [lastPoint, angle]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - size / 2,
        y: e.clientY - size / 4,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div>
      <div>
        <label htmlFor="sizeSlider">Taille du compteur :</label>
        <input
          id="sizeSlider"
          type="range"
          min="200"
          max="600"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
      </div>
  
      <div
        style={{ position: 'absolute', left: position.x, top: position.y }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div
          className="compteur-container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            className="compteur-box"
            onMouseDown={handleMouseDown}
            style={{
              width: `${size}px`,
              height: `${size / 2}px`,
              position: 'relative',
              cursor: 'grab',
            }}
          >
            {lastPoint ? (
              <div>
                <svg
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: `${size}px`,
                    height: `${size / 2}px`,
                  }}
                >
                  <circle cx={size / 2} cy={size / 2} r="5" fill="#000" />
                  <line
                    x1={size / 2}
                    y1={size / 2}
                    x2={size / 2 + (size / 3) * Math.cos((angle - 180) * (Math.PI / 180))}
                    y2={size / 2 + (size / 3) * Math.sin((angle - 180) * (Math.PI / 180))}
                    stroke="#FF0000"
                    strokeWidth="3"
                  />
                </svg>
                <svg
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: `${size}px`,
                    height: `${size / 2}px`,
                  }}
                >
                  {[...Array(11).keys()].map((i) => {
                    const gradAngle = (i / 10) * 180 - 180;
                    const x1 = size / 2 + (size / 3.3) * Math.cos((gradAngle) * (Math.PI / 180));
                    const y1 = size / 2 + (size / 3.3) * Math.sin((gradAngle) * (Math.PI / 180));
                    const x2 = size / 2 + (size / 3) * Math.cos((gradAngle) * (Math.PI / 180));
                    const y2 = size / 2 + (size / 3) * Math.sin((gradAngle) * (Math.PI / 180));
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
              </div>
            ) : (
              <p>Chargement...</p>
            )}
          </div>
  
          {lastPoint && (
            <p
              className="vitesse"
              style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginTop: '10px',
              }}
            >
              Vitesse: {lastPoint.V}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Compteur;
