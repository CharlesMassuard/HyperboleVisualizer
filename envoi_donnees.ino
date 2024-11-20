#include <WiFi.h>
#include <HTTPClient.h>

// Configuration Wi-Fi (simulé, fonctionnera même via Ethernet)
const char* ssid = "Wokwi-GUEST";       // SSID fictif
const char* password = ""; // Mot de passe fictif

// Configuration Firebase Realtime Database
const String FIREBASE_HOST = "https://hyperbolevisualizer-default-rtdb.europe-west1.firebasedatabase.app/points.json";
const String FIREBASE_API_KEY = "AIzaSyAi4ZoC65ZI7NH2H0VQ1Lvp-zHeLVMoMRQ";

int counter = 10;  // Compteur pour suivre le numéro des données envoyées

void setup() {
  Serial.begin(115200);

  // Connexion Wi-Fi simulée
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
  }
  Serial.println("Connecté au réseau (via simulation)");

  loop();
}

void loop() {
  // Attendre 3 secondes avant d'envoyer de nouvelles données
  delay(1);

  // Utiliser le compteur pour envoyer des données
  int lat = counter;
  int lon = counter;

  // Envoyer les données avec la description mise à jour
  sendDataToFirebase(lat, lon);

  // Incrémenter le compteur pour le prochain envoi
  counter++;
}

void sendDataToFirebase(int lat, int lon) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    // URL complète pour la Realtime Database Firebase (format JSON)
    String url = FIREBASE_HOST + "?auth=" + FIREBASE_API_KEY;

    // Contenu JSON du document à envoyer
    String payload = "{"
                     "\"lat\": " + String(lat) + ","
                     "\"long\": " + String(lon) +
                     "}";

    http.begin(url.c_str());
    http.addHeader("Content-Type", "application/json");

    int httpResponseCode = http.POST(payload);

    // Logs pour vérifier la réponse
    if (httpResponseCode > 0) {
      Serial.println("Données envoyées !");
      Serial.println(http.getString());  // Afficher la réponse du serveur
    } else {
      Serial.print("Erreur HTTP : ");
      Serial.println(httpResponseCode);
    }

    http.end();
  } else {
    Serial.println("Pas de connexion Wi-Fi !");
  }
}
