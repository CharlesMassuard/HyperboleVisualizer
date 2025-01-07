import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const CarMap = ({ points }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Remplacer "long" par "lng" dans les points
  const pointsWithLng = points.map((point) => ({
    lat: point.lat,
    lng: point.long, // Remplacer "long" par "lng"
  }));

  // Fonction pour animer le déplacement de la voiture
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex < pointsWithLng.length - 1 ? prevIndex + 1 : prevIndex
      );
    }, 1000); // Mise à jour toutes les secondes

    return () => clearInterval(interval);
  }, [pointsWithLng]);

  const currentPoint = pointsWithLng[currentIndex];

  const path2 = pointsWithLng.slice(0, currentIndex + 1);

  // Convertir en JSON
  const path2JSON = JSON.stringify({ path2 }, null, 2);

  console.log(path2JSON);
  console.log(path2);

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

          {/* Marqueur pour la position actuelle */}
          {currentPoint && (
            <Marker position={currentPoint}>
              <Popup>Position actuelle de la voiture</Popup>
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
