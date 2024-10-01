import sys
import socket
from PyQt5.QtWidgets import QApplication, QMainWindow, QPushButton, QVBoxLayout, QWidget, QFileDialog, QLabel, QHBoxLayout, QSpacerItem, QSizePolicy
from PyQt5.QtCore import QTimer, Qt
from PyQt5.QtGui import QPainter, QPen
import argparse

class Dataline:
    def __init__(self, *args):
        self.index = args[0]
        self.heure = args[1]
        self.minute = args[2]
        self.seconde = args[3]
        self.d_lat = args[4]
        self.d_lon = args[5]

class Canvas(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.latitudes = []
        self.longitudes = []

    def paintEvent(self, event):
        """ Redéfinir paintEvent pour dessiner les points """
        painter = QPainter(self)
        pen = QPen(Qt.black, 3)  
        painter.setPen(pen)

        if self.latitudes and self.longitudes:
            min_lat = min(self.latitudes)
            max_lat = max(self.latitudes)
            min_lon = min(self.longitudes)
            max_lon = max(self.longitudes)

            if max_lat == min_lat:
                max_lat += 0.0001  
            if max_lon == min_lon:
                max_lon += 0.0001  

            for lat, lon in zip(self.latitudes, self.longitudes):
                x = (lon - min_lon) / (max_lon - min_lon) * self.width()
                y = (lat - min_lat) / (max_lat - min_lat) * self.height()

                y = self.height() - y

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
        self.setMinimumSize(int(screen_width*0.8), int(screen_height*0.8))

        self.client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

        self.btn_start = QPushButton("Démarrer la réception", self)
        self.btn_start.clicked.connect(self.start_receiving)

        self.map = Canvas(self)
        self.map.setMinimumSize(600, 600)
        self.map.setMaximumSize(600, 600)

        # Layout pour les informations à droite
        info_layout = QVBoxLayout()
        info_layout.addWidget(QLabel("Information 1"))
        info_layout.addWidget(QLabel("Information 2"))
        info_layout.addWidget(QLabel("Information 3"))
        info_layout.addSpacerItem(QSpacerItem(20, 40, QSizePolicy.Minimum, QSizePolicy.Expanding))

        # Layout principal
        main_layout = QHBoxLayout()
        main_layout.addWidget(self.map)
        main_layout.addLayout(info_layout)

        # Layout pour le bouton en bas
        bottom_layout = QVBoxLayout()
        bottom_layout.addLayout(main_layout)
        bottom_layout.addWidget(self.btn_start)

        container = QWidget()
        container.setLayout(bottom_layout)
        self.setCentralWidget(container)

        self.timer = QTimer()
        self.timer.timeout.connect(self.update_canvas)

        #Lancement automatique reception (+ simple pour debug)
        self.start_receiving()

    def start_receiving(self):
        try:
            self.client_socket.connect((self.ip, self.port))
            print("Connecté au serveur.")
            self.btn_start.setText("Réception en cours...")
            self.timer.start(10) #0.01s 
        except Exception as e:
            print(f"Erreur de connexion : {e}")

    def update_canvas(self):
        try:
            line = self.client_socket.recv(1024).decode()  
            if line:
                print(f"Ligne reçue : {line.strip()}")  

                if "index" in line:
                    return
                
                parts = line.strip().split(';')
                if len(parts) == 20:
                    parts = [p.replace(',', '.') for p in parts]

                    try:
                        float_parts = [float(p) for p in parts]
                        dataline = Dataline(*float_parts)
                        self.ma_liste_dataline.append(dataline)

                        self.map.latitudes.append(dataline.d_lat)
                        self.map.longitudes.append(dataline.d_lon)

                        self.map.update()

                    except ValueError as e:
                        print(f"Erreur de conversion : {e}")
        except Exception as e:
            print(f"Erreur lors de la réception des données : {e}")

    def closeEvent(self, event):
        """ Arrêter le timer et fermer le socket à la fermeture de l'application """
        self.timer.stop()
        self.client_socket.close()
        super().closeEvent(event)

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
