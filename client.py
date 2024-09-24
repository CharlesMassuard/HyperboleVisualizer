import sys
import socket
from PyQt5.QtWidgets import QApplication, QMainWindow, QPushButton, QVBoxLayout, QWidget, QFileDialog
from PyQt5.QtCore import QTimer, Qt
from PyQt5.QtGui import QPainter, QPen

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
        pen = QPen(Qt.black, 3)  # Stylo pour dessiner les points
        painter.setPen(pen)

        # Normaliser les coordonnées pour les afficher correctement dans le widget
        if self.latitudes and self.longitudes:
            min_lat = min(self.latitudes)
            max_lat = max(self.latitudes)
            min_lon = min(self.longitudes)
            max_lon = max(self.longitudes)

            # Gérer le cas où toutes les latitudes ou longitudes sont identiques
            if max_lat == min_lat:
                max_lat += 0.0001  # Ajout d'une petite valeur pour éviter la division par zéro
            if max_lon == min_lon:
                max_lon += 0.0001  # Ajout d'une petite valeur pour éviter la division par zéro

            # Ajustement de l'échelle des coordonnées
            for lat, lon in zip(self.latitudes, self.longitudes):
                # Normaliser les coordonnées pour qu'elles rentrent dans la zone de dessin
                x = (lon - min_lon) / (max_lon - min_lon) * self.width()
                y = (lat - min_lat) / (max_lat - min_lat) * self.height()

                # Inverser l'axe des y (en fonction de la direction d'affichage souhaitée)
                y = self.height() - y

                painter.drawPoint(int(x), int(y))

class ClientApp(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Client PyQt5 - Affichage des points")
        self.ma_liste_dataline = []
        self.current_index = 0

        # Agrandir la fenêtre
        self.setMinimumSize(800, 800)

        # Configuration du socket
        self.client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

        # Interface graphique
        self.btn_start = QPushButton("Démarrer la réception", self)
        self.btn_start.clicked.connect(self.start_receiving)

        # Zone de dessin
        self.canvas = Canvas(self)
        self.canvas.setMinimumSize(600, 600)

        # Disposition
        layout = QVBoxLayout()
        layout.addWidget(self.canvas)
        layout.addWidget(self.btn_start)

        container = QWidget()
        container.setLayout(layout)
        self.setCentralWidget(container)

        # Timer pour la mise à jour régulière de l'affichage
        self.timer = QTimer()
        self.timer.timeout.connect(self.update_canvas)

    def start_receiving(self):
        try:
            # Connexion au serveur
            self.client_socket.connect(('192.168.13.126', 12345))
            print("Connecté au serveur.")
            self.timer.start(1000)  # Démarre la mise à jour toutes les secondes
        except Exception as e:
            print(f"Erreur de connexion : {e}")

    def update_canvas(self):
        # Réception d'une ligne du serveur
        try:
            line = self.client_socket.recv(1024).decode()  # Recevoir une ligne
            if line:
                print(f"Ligne reçue : {line.strip()}")  # Afficher la ligne reçue

                # Ignorer la ligne des en-têtes du fichier CSV
                if "index" in line:
                    return
                
                parts = line.strip().split(';')
                if len(parts) == 20:
                    # Remplacer les virgules par des points pour les coordonnées
                    parts = [p.replace(',', '.') for p in parts]

                    # Essayez de convertir les parties en float
                    try:
                        float_parts = [float(p) for p in parts]
                        dataline = Dataline(*float_parts)
                        self.ma_liste_dataline.append(dataline)

                        # Ajouter les nouvelles coordonnées
                        self.canvas.latitudes.append(dataline.d_lat)
                        self.canvas.longitudes.append(dataline.d_lon)

                        # Repeindre le widget avec les nouvelles coordonnées
                        self.canvas.update()

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
    app = QApplication(sys.argv)
    window = ClientApp()
    window.show()
    sys.exit(app.exec_())
