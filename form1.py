from PyQt5.QtWidgets import QApplication, QMainWindow, QPushButton, QFileDialog, QLabel, QVBoxLayout, QWidget, QLineEdit, QSlider
from PyQt5.QtGui import QPixmap, QPainter, QColor
from PyQt5.QtCore import Qt
from PIL import Image
import sys

class Dataline:
    def __init__(self, index, heure, minute, seconde, d_lat, d_lon, quality, x, y, perx, pery, pixx, pixy, ah, v, a, s, d, deg, rpm):
        self.index = index
        self.heure = heure
        self.minute = minute
        self.seconde = seconde
        self.d_lat = d_lat
        self.d_lon = d_lon
        self.quality = quality
        self.x = x
        self.y = y
        self.perx = perx
        self.pery = pery
        self.pixx = pixx
        self.pixy = pixy
        self.ah = ah
        self.v = v
        self.a = a
        self.s = s
        self.d = d
        self.deg = deg
        self.rpm = rpm

class Form1(QMainWindow):
    def __init__(self):
        super().__init__()
        self.trans_state = None
        self.default_image = None
        self.ma_bit_map_inviolee = None
        self.m_pen_red = QColor(255, 0, 0)
        self.m_pen_black = QColor(0, 0, 0)
        self.m_pen_green = QColor(0, 255, 0)
        self.m_rectangle = (0, 0, 1, 1)
        self.m_brush_red = QColor(255, 0, 0)
        self.m_brush_green = QColor(0, 255, 0)
        self.m_brush_black = QColor(0, 0, 0)
        self.sr = None
        self.line = None
        self.ma_liste_dataline = []
        self.min_x = self.max_x = self.min_y = self.max_y = 0
        self.low_index = self.high_index = 0
        self.first_point_index = None
        self.second_point_index = None

        self.initUI()

    def initUI(self):
        self.setWindowTitle('GPS Decoder')
        self.setGeometry(100, 100, 800, 600)

        # Layout principal
        layout = QVBoxLayout()

        # Label pour l'affichage de l'image
        self.label = QLabel(self)
        self.label.setGeometry(50, 50, 700, 500)
        layout.addWidget(self.label)

        # Zone de saisie pour le temps écoulé
        self.textbox_avg_time = QLineEdit(self)
        self.textbox_avg_time.setPlaceholderText('Temps écoulé (en secondes)')
        layout.addWidget(self.textbox_avg_time)

        # Boutons
        self.button_load = QPushButton('Load Data', self)
        self.button_load.clicked.connect(self.button_load_click)
        layout.addWidget(self.button_load)

        self.button_ref_point1 = QPushButton('Set Point 1', self)
        self.button_ref_point1.clicked.connect(self.button_ref_point1_click)
        layout.addWidget(self.button_ref_point1)

        self.button_ref_point2 = QPushButton('Set Point 2', self)
        self.button_ref_point2.clicked.connect(self.button_ref_point2_click)
        layout.addWidget(self.button_ref_point2)

        # Slider pour sélectionner les index
        self.trackbar = QSlider(Qt.Horizontal, self)
        self.trackbar.setMinimum(0)
        self.trackbar.setMaximum(0)
        self.trackbar.setTickPosition(QSlider.TicksBelow)
        self.trackbar.setTickInterval(1)
        self.trackbar.setValue(0)
        self.trackbar.valueChanged.connect(self.trackbar_changed)
        layout.addWidget(self.trackbar)

        # Widgets pour afficher les informations sur les points
        self.textbox_id = QLineEdit(self)
        self.textbox_id.setPlaceholderText('Index du point')
        layout.addWidget(self.textbox_id)

        self.textbox_H = QLineEdit(self)
        self.textbox_H.setPlaceholderText('Heure')
        layout.addWidget(self.textbox_H)

        self.textbox_M = QLineEdit(self)
        self.textbox_M.setPlaceholderText('Minute')
        layout.addWidget(self.textbox_M)

        self.textbox_S = QLineEdit(self)
        self.textbox_S.setPlaceholderText('Seconde')
        layout.addWidget(self.textbox_S)

        self.textbox_Vitesse = QLineEdit(self)
        self.textbox_Vitesse.setPlaceholderText('Vitesse')
        layout.addWidget(self.textbox_Vitesse)

        self.textbox_A = QLineEdit(self)
        self.textbox_A.setPlaceholderText('A')
        layout.addWidget(self.textbox_A)

        self.textbox_V = QLineEdit(self)
        self.textbox_V.setPlaceholderText('V')
        layout.addWidget(self.textbox_V)

        # Configuration de la fenêtre principale
        container = QWidget()
        container.setLayout(layout)
        self.setCentralWidget(container)

    def button_load_click(self):
        options = QFileDialog.Options()
        file_path, _ = QFileDialog.getOpenFileName(self, "Open Data File", "", "All Files (*);;CSV Files (*.csv)", options=options)
        if file_path:
            print(file_path)
            with open(file_path, 'r') as file:
                self.ma_liste_dataline = []
                for line in file:
                    parts = line.strip().split(';')
                    if len(parts) == 20:
                        # Remplacer les virgules par des points
                        parts = [p.replace(',', '.') for p in parts]
                        
                        # Vérifier que toutes les parties peuvent être converties en float
                        try:
                            # Vérifier que chaque élément est convertible en float
                            float_parts = [float(p) for p in parts]
                            dataline = Dataline(*float_parts)
                            self.ma_liste_dataline.append(dataline)
                        except ValueError as e:
                            print(f"Erreur de conversion sur cette ligne : {line} | Erreur : {e}")
                self.trackbar.setMaximum(len(self.ma_liste_dataline) - 1)
                self.update_picturebox(0)

    def button_ref_point1_click(self):
        self.first_point_index = self.trackbar.value()
        self.update_moyenne()

    def button_ref_point2_click(self):
        self.second_point_index = self.trackbar.value()
        self.update_moyenne()

    def trackbar_changed(self):
        index = self.trackbar.value()
        self.update_picturebox(index)

    def update_moyenne(self):
        if len(self.ma_liste_dataline) == 0 or self.first_point_index is None or self.second_point_index is None:
            return
        
        if self.first_point_index >= self.second_point_index:
            return

        # Calcul du temps écoulé en secondes
        point1 = self.ma_liste_dataline[self.first_point_index]
        point2 = self.ma_liste_dataline[self.second_point_index]

        temps_ecoule = (point2.heure - point1.heure) * 3600
        temps_ecoule += (point2.minute - point1.minute) * 60
        temps_ecoule += (point2.seconde - point1.seconde)

        self.textbox_avg_time.setText(f"{temps_ecoule:.2f} secondes")

    def update_picturebox(self, local_index):
        if not self.ma_liste_dataline:
            return

        # Créer un QPixmap et un QPainter
        pixmap = QPixmap(700, 500)
        pixmap.fill(Qt.white)
        painter = QPainter(pixmap)

        # Calculer les dimensions du QPixmap
        width = pixmap.width()
        height = pixmap.height()

        # Calculer les coordonnées minimales et maximales des points
        min_x = min(dataline.pixx for dataline in self.ma_liste_dataline)
        max_x = max(dataline.pixx for dataline in self.ma_liste_dataline)
        min_y = min(dataline.pixy for dataline in self.ma_liste_dataline)
        max_y = max(dataline.pixy for dataline in self.ma_liste_dataline)

        # Calculer le centre du QPixmap
        center_x = width / 2
        center_y = height / 2

        # Calculer les décalages pour centrer les points
        scale_x = width / (max_x - min_x) if max_x != min_x else 1
        scale_y = height / (max_y - min_y) if max_y != min_y else 1

        offset_x = center_x - ((max_x + min_x) / 2) * scale_x
        offset_y = center_y - ((max_y + min_y) / 2) * scale_y

        # Dessiner tous les points en noir
        for dataline in self.ma_liste_dataline:
            x = int((dataline.pixx * scale_x) + offset_x)
            y = int((dataline.pixy * scale_y) + offset_y)
            painter.setPen(self.m_pen_black)
            painter.drawEllipse(x - 2, y - 2, 4, 4)

        # Dessiner le point sélectionné en rouge
        selected_point = self.ma_liste_dataline[local_index]
        x = int((selected_point.pixx * scale_x) + offset_x)
        y = int((selected_point.pixy * scale_y) + offset_y)
        painter.setPen(self.m_pen_red)
        painter.setBrush(self.m_brush_red)
        painter.drawEllipse(x - 7, y - 7, 14, 14)  # Point actuel en rouge et plus grand

        # Dessiner les points de référence en vert
        if self.first_point_index is not None:
            ref_point1 = self.ma_liste_dataline[self.first_point_index]
            x = int((ref_point1.pixx * scale_x) + offset_x)
            y = int((ref_point1.pixy * scale_y) + offset_y)
            painter.setPen(self.m_pen_green)
            painter.setBrush(self.m_brush_green)
            painter.drawEllipse(x - 5, y - 5, 10, 10)  # Premier point de référence en vert

        if self.second_point_index is not None:
            ref_point2 = self.ma_liste_dataline[self.second_point_index]
            x = int((ref_point2.pixx * scale_x) + offset_x)
            y = int((ref_point2.pixy * scale_y) + offset_y)
            painter.setPen(self.m_pen_green)
            painter.setBrush(self.m_brush_green)
            painter.drawEllipse(x - 5, y - 5, 10, 10)  # Deuxième point de référence en vert

        painter.end()
        self.label.setPixmap(pixmap)

        # Mettre à jour les informations des points
        self.textbox_id.setText(str(local_index))
        self.textbox_H.setText(str(self.ma_liste_dataline[local_index].heure))
        self.textbox_M.setText(str(self.ma_liste_dataline[local_index].minute))
        self.textbox_S.setText(str(self.ma_liste_dataline[local_index].seconde))
        self.textbox_Vitesse.setText(str(self.ma_liste_dataline[local_index].s))
        self.textbox_A.setText(str(self.ma_liste_dataline[local_index].a))
        self.textbox_V.setText(str(self.ma_liste_dataline[local_index].v))


def main():
    app = QApplication(sys.argv)
    form = Form1()
    form.show()
    sys.exit(app.exec_())

if __name__ == "__main__":
    main()