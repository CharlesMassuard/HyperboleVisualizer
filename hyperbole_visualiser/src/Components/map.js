import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const CarMap = ({ points }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(null);
  const [iconSize, setIconSize] = useState([32, 32]); 

  console.log(points[0]);

  const pointsWithLng = points.map((point) => ({
    lat: point.latitude,
    lng: point.longitude,
    time: point.time,
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex < pointsWithLng.length - 1 ? prevIndex + 1 : prevIndex
      );
      setCurrentTime(pointsWithLng[currentIndex].time);
      if (currentIndex < pointsWithLng.length - 1) {
        setIconSize([40, 40]);
      } else {
        setIconSize([32, 32]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [pointsWithLng, currentIndex]);

  const currentPoint = pointsWithLng[currentIndex];

  const path2 = pointsWithLng.slice(0, currentIndex + 1);

  // Convertir en JSON
  const path2JSON = JSON.stringify({ path2 }, null, 2);

  console.log(path2JSON);
  console.log(path2);

  // Définir l'icône de la voiture avec une taille dynamique
  const carIcon = new L.Icon({
    iconUrl: "https://img.icons8.com/ios/452/car.png", // Lien vers une icône de voiture (utilise une icône ou une image de ton choix)
    iconSize: iconSize, // Taille dynamique de l'icône
    iconAnchor: [16, 32], // Point d'ancrage de l'icône
    popupAnchor: [0, -32], // Position du popup par rapport à l'icône
  });

  return (
    <div>
      {path2.length > 0 ? ( // Vérifie que path2 n'est pas vide
        <MapContainer
          center={path2[0]} // Centrage initial sur le premier point
          zoom={18}
          style={{ height: "500px", width: "100%" }}
        >
          {/* Couche de base OpenStreetMap */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          />

          {/* Ligne entre les points */}
          <Polyline positions={path2} color="blue" />

          {/* Marqueur pour la position actuelle avec l'icône personnalisée */}
          {currentPoint && (
            <Marker position={currentPoint} icon={carIcon}>
              <Popup>
                <div>
                  <h4>Position actuelle de la voiture</h4>
                  <p><strong>Latitude:</strong> {currentPoint.lat}</p>
                  <p><strong>Longitude:</strong> {currentPoint.lng}</p>
                  <p><strong>Heure:</strong> {currentTime}</p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      ) : (
        <p>Chargement des données...</p> // Affiche un message pendant le chargement
      )}
    </div>
  );
};

export default CarMap;
