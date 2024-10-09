import sys
import socket
from PyQt5.QtWidgets import QApplication, QMainWindow, QPushButton, QVBoxLayout, QWidget, QFileDialog, QLabel, QHBoxLayout, QSpacerItem, QSizePolicy
from PyQt5.QtCore import QTimer, Qt
from PyQt5.QtGui import QPainter, QPen, QPixmap
import argparse
import time
import math

class Dataline:
    def __init__(self, *args):
        self.index = args[0]
        self.heure = int(args[1])
        self.minute = int(args[2])
        self.seconde = int(args[3])
        self.d_lat = args[4]
        self.d_lon = args[5]
        self.volt = args[14]
        self.ampere = args[15]
        self.vitesse = args[16]

class Canvas(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.latitudes = []
        self.longitudes = []
        self.image = QPixmap("./imgs/Circuit.bmp")  # Remplacez par le chemin de votre image

        # Limites géographiques ajustées
        self.min_lat = 43.765800 + (0.5 * 0.0007)  # Déplacer plus vers le haut
        self.max_lat = 43.775000 + (0.5 * 0.0007)  # Déplacer plus vers le haut
        self.min_lon = -0.044500 - (4 * 0.0005)  # Déplacement plus léger à droite en longitude
        self.max_lon = -0.034000 - (4 * 0.0005)  # Déplacement plus léger à droite en longitude

    def rotate_point(self, lat, lon, center_lat, center_lon, angle_rad):
        """ Fonction pour tourner un point (lat, lon) autour du centre (center_lat, center_lon) d'un angle angle_rad """
        # Convertir les latitudes et longitudes en coordonnées cartésiennes relatives
        lat_rel = lat - center_lat
        lon_rel = lon - center_lon

        # Appliquer la rotation
        new_lat = center_lat + (lat_rel * math.cos(angle_rad)) - (lon_rel * math.sin(angle_rad))
        new_lon = center_lon + (lat_rel * math.sin(angle_rad)) + (lon_rel * math.cos(angle_rad))

        return new_lat, new_lon

    def paintEvent(self, event):
        """ Redéfinir paintEvent pour dessiner l'image de fond et les points ajustés avec rotation """
        painter = QPainter(self)

        # Dessiner l'image de fond
        if not self.image.isNull():
            painter.drawPixmap(self.rect(), self.image)

        pen = QPen(Qt.black, 3)
        painter.setPen(pen)

        # Centre de rotation (ici on choisit la moyenne des limites lat/lon)
        center_lat = (self.max_lat + self.min_lat) / 2
        center_lon = (self.max_lon + self.min_lon) / 2

        # Angle de rotation en radians (par exemple 5 degrés dans le sens des aiguilles d'une montre)
        angle_deg = 15  # vous pouvez ajuster cet angle
        angle_rad = math.radians(angle_deg)

        if self.latitudes and self.longitudes:
            for lat, lon in zip(self.latitudes, self.longitudes):
                # Appliquer la rotation à chaque point autour du centre
                rotated_lat, rotated_lon = self.rotate_point(lat, lon, center_lat, center_lon, angle_rad)

                # Convertir les coordonnées GPS en coordonnées x, y
                x = (rotated_lon - self.min_lon) / (self.max_lon - self.min_lon) * self.width()
                y = (rotated_lat - self.min_lat) / (self.max_lat - self.min_lat) * self.height()

                # Inverser l'axe Y pour correspondre à l'origine en haut à gauche
                y = self.height() - y

                # Dessiner le point sur la carte
                painter.drawPoint(int(x), int(y))


class ClientApp(QMainWindow):
    def __init__(self, ip, port):
        super().__init__()

        self.ip = ip
        self.port = port

        self.setWindowTitle("Client PyQt5 - Affichage des points")
        self.ma_liste_dataline = []
        self.current_index = 0

        # Obtenir la taille de l'écran
        screen = QApplication.primaryScreen().geometry()
        screen_width = screen.width()
        screen_height = screen.height()

        # Définir la taille minimale de la fenêtre en fonction de la taille de l'écran
        self.setMinimumSize(int(screen_width * 0.8), int(screen_height * 0.8))
        self.move(
            (screen_width - self.width()) // 2,
            (screen_height - self.height()) // 2
        )

        self.client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

        self.btn_start = QPushButton("Démarrer la réception", self)
        self.btn_start.setStyleSheet("background-color: black; color: white; font-size: 16px; padding: 10px; border-radius: 5px;")
        self.btn_start.clicked.connect(self.start_receiving)

        self.map = Canvas(self)
        self.map.setMinimumSize(600, 600)
        self.map.setMaximumSize(600, 600)

        # Layout pour les informations à droite
        self.date = QLabel(f"{time.strftime('%d/%m/%Y %H:%M:%S')}")
        self.date.setAlignment(Qt.AlignCenter)
        self.date.setStyleSheet("font-size: 18px;")

        self.heure = QLabel("Heure de la capture : N/A")
        self.heure.setStyleSheet("font-size: 18px;")

        self.coords = QLabel("Coordonnées : N/A")
        self.coords.setStyleSheet("font-size: 18px;")

        self.vitesse = QLabel("Vitesse : 0km/h")
        self.vitesse.setStyleSheet("font-size: 18px;")

        self.volt = QLabel("Tension : 0V")
        self.volt.setStyleSheet("font-size: 18px;")

        self.ampere = QLabel("Courant : 0A")
        self.ampere.setStyleSheet("font-size: 18px;")

        info_layout = QVBoxLayout()
        info_layout.addWidget(self.heure)
        info_layout.addWidget(self.coords)
        info_layout.addWidget(self.vitesse)
        info_layout.addWidget(self.volt)
        info_layout.addWidget(self.ampere)

        # Layout principal
        center_layout = QHBoxLayout()
        center_layout.addWidget(self.map)
        center_layout.addSpacerItem(QSpacerItem(20, 20, QSizePolicy.Expanding, QSizePolicy.Minimum))
        center_layout.addLayout(info_layout)

        # Layout pour le bouton en bas
        main_layout = QVBoxLayout()
        main_layout.addWidget(self.date)
        main_layout.addLayout(center_layout)
        main_layout.addWidget(self.btn_start)

        container = QWidget()
        container.setLayout(main_layout)
        self.setCentralWidget(container)

        self.timer = QTimer()
        self.timer.timeout.connect(self.update_canvas)

        self.heure_timer = QTimer()
        self.heure_timer.timeout.connect(lambda: self.date.setText(f"{time.strftime('%d/%m/%Y %H:%M:%S')}"))
        self.heure_timer.start(1000)

        self.btn_text_timer = QTimer()
        self.btn_text_timer.timeout.connect(self.change_button_text)

        # Lancement automatique reception (+ simple pour debug)
        self.start_receiving()

    def start_receiving(self):
        try:
            self.client_socket.connect((self.ip, self.port))
            print("Connecté au serveur.")
            self.btn_start.setDisabled(True)
            self.btn_start.setText("Réception en cours") 
            self.timer.start(10)  # 0.01s 
            self.btn_text_timer.start(1000)
        except Exception as e:
            print(f"Erreur de connexion : {e}")

    def change_button_text(self):
        current_text = self.btn_start.text()
        match current_text:
            case "Réception en cours":
                self.btn_start.setText("Réception en cours.")
            case "Réception en cours.":
                self.btn_start.setText("Réception en cours..")
            case "Réception en cours..":
                self.btn_start.setText("Réception en cours...")
            case _ :
               self.btn_start.setText("Réception en cours") 

    def update_canvas(self):
        try:
            line = self.client_socket.recv(1024).decode()  
            if line:
                print(f"Ligne reçue : {line.strip()}")  

                if "index" in line:
                    return

                if line == "Fin transmission":
                    self.close_connection()
                    return

                parts = line.strip().split(';')
                if len(parts) == 20:
                    parts = [p.replace(',', '.') for p in parts]

                    try:
                        float_parts = [float(p) for p in parts]
                        dataline = Dataline(*float_parts)
                        self.ma_liste_dataline.append(dataline)

                        # Ajout des coordonnées GPS
                        self.map.latitudes.append(dataline.d_lat)
                        self.map.longitudes.append(dataline.d_lon)

                        # Mise à jour des informations affichées
                        self.heure.setText(f"Heure de la capture : {dataline.heure}:{dataline.minute}:{dataline.seconde}")
                        self.coords.setText(f"Coordonnées : {round(dataline.d_lat, 5)}:{round(dataline.d_lon, 5)}")
                        self.vitesse.setText(f"Vitesse : {dataline.vitesse} km/h")
                        self.volt.setText(f"Tension : {dataline.volt} V")
                        self.ampere.setText(f"Courant : {dataline.ampere} A")

                        # Mise à jour de la carte
                        self.map.update()

                    except ValueError as e:
                        print(f"Erreur de conversion : {e}")
        except Exception as e:
            print(f"Erreur lors de la réception des données : {e}")

    def close_connection(self):
        """ Fermer le socket et arrêter le timer sans fermer l'application """
        self.timer.stop()
        self.btn_text_timer.stop()
        self.client_socket.close()

        # Réinitialiser les informations
        self.vitesse.setText("Vitesse : 0km/h")
        self.volt.setText("Tension : 0V")
        self.ampere.setText("Courant : 0A")
        self.btn_start.setText("Réception terminée")
        self.btn_start.setStyleSheet("background-color: green; color: white; font-size: 16px; padding: 10px; border-radius: 5px;")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="IP du serveur")
    parser.add_argument("ip_serveur", type=str, nargs='?', default='127.0.0.1', help="Adresse IP du serveur depuis lequel on souhaite recevoir les données")
    parser.add_argument("port", type=int, nargs='?', default=12345, help="Port du serveur depuis lequel on souhaite recevoir les données")
    args = parser.parse_args()
    print(f"Connexion au serveur {args.ip_serveur}:{args.port}")
    app = QApplication(sys.argv)
    window = ClientApp(ip=args.ip_serveur, port=args.port)
    window.show()
    sys.exit(app.exec_())
