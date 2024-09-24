import socket
import time

def send_csv_to_client(filename, host='192.168.13.125', port=12356):
    # Création du socket serveur
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((host, port))
    server_socket.listen(1)
    print(f"Serveur en attente de connexion sur {host}:{port}...")

    conn, addr = server_socket.accept()
    print(f"Connexion de {addr}")

    # Ouvrir le fichier CSV et envoyer une ligne par seconde
    with open(filename, 'r') as file:
        for line in file:
            conn.sendall(line.encode())  # Envoi de la ligne
            print(f"Envoyé: {line.strip()}")
            time.sleep(1)  # Attendre 1 seconde avant d'envoyer la prochaine ligne

    print("Fichier envoyé avec succès.")
    conn.close()
    server_socket.close()

if __name__ == "__main__":
    # Nom du fichier CSV à envoyer
    csv_file = 'output.csv'
    send_csv_to_client(csv_file)
