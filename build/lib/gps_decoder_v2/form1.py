from PyQt5.QtWidgets import QApplication, QMainWindow, QPushButton, QFileDialog, QLabel
from PyQt5.QtGui import QPixmap, QPainter, QColor
from PyQt5.QtCore import Qt
from PIL import Image
from .dataline import Dataline
import sys

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

        self.initUI()

    def initUI(self):
        self.setWindowTitle('GPS Decoder')
        self.setGeometry(100, 100, 800, 600)

        self.label = QLabel(self)
        self.label.setGeometry(50, 50, 700, 500)

        self.button1 = QPushButton('Load Data', self)
        self.button1.setGeometry(50, 10, 100, 30)
        self.button1.clicked.connect(self.button1_click)

        self.button_ref_point2 = QPushButton('Ref Point 2', self)
        self.button_ref_point2.setGeometry(160, 10, 100, 30)
        self.button_ref_point2.clicked.connect(self.button_ref_point2_click)

    def button1_click(self):
        options = QFileDialog.Options()
        file_path, _ = QFileDialog.getOpenFileName(self, "Open Data File", "", "All Files (*);;CSV Files (*.csv)", options=options)
        if file_path:
            with open(file_path, 'r') as file:
                self.ma_liste_dataline = []
                for line in file:
                    print(line)
                    parts = line.strip().split(';')
                    if len(parts) == 20:
                        dataline = Dataline(*map(float, parts))
                        self.ma_liste_dataline.append(dataline)
            self.update_moyenne()
            self.update_picturebox(0)

    def button_ref_point2_click(self):
        self.update_picturebox(1)

    def update_moyenne(self):
        if not self.ma_liste_dataline:
            return
        self.min_x = min(d.x for d in self.ma_liste_dataline)
        self.max_x = max(d.x for d in self.ma_liste_dataline)
        self.min_y = min(d.y for d in self.ma_liste_dataline)
        self.max_y = max(d.y for d in self.ma_liste_dataline)

    def update_picturebox(self, local_index):
        if not self.ma_liste_dataline:
            return
        dataline = self.ma_liste_dataline[local_index]
        pixmap = QPixmap(700, 500)
        pixmap.fill(Qt.white)
        painter = QPainter(pixmap)
        painter.setPen(self.m_pen_red)
        painter.drawEllipse(dataline.x - 5, dataline.y - 5, 10, 10)
        painter.end()
        self.label.setPixmap(pixmap)

def main():
    app = QApplication(sys.argv)
    form = Form1()
    form.show()
    sys.exit(app.exec_())

if __name__ == "__main__":
    main()