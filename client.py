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
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Client PyQt5 - Affichage des points")
        self.ma_liste_dataline = []
        self.current_index = 0

        self.setMinimumSize(800, 800)

        self.client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

        self.btn_start = QPushButton("Démarrer la réception", self)
        self.btn_start.clicked.connect(self.start_receiving)

        self.canvas = Canvas(self)
        self.canvas.setMinimumSize(600, 600)

        layout = QVBoxLayout()
        layout.addWidget(self.canvas)
        layout.addWidget(self.btn_start)

        container = QWidget()
        container.setLayout(layout)
        self.setCentralWidget(container)

        self.timer = QTimer()
        self.timer.timeout.connect(self.update_canvas)

    def start_receiving(self):
        try:
            self.client_socket.connect(('192.168.13.126', 12345))
            print("Connecté au serveur.")
            self.timer.start(1000)  
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

                        self.canvas.latitudes.append(dataline.d_lat)
                        self.canvas.longitudes.append(dataline.d_lon)

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
