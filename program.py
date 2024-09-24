import sys
from PyQt5.QtWidgets import QApplication
from form1 import Form1

def main():
    app = QApplication(sys.argv)
    form = Form1()
    form.show()
    sys.exit(app.exec_())

if __name__ == "__main__":
    main()