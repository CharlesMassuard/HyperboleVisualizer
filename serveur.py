import socket
import time
import argparse

def send_csv_to_client(filename, host, port):
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)  # Réutiliser l'adresse
    server_socket.bind((host, port))
    server_socket.listen(1)
    print(f"Serveur en attente de connexion sur {host}:{port}...")

    try:
        conn, addr = server_socket.accept()
        print(f"Connexion de {addr}")

        with open(filename, 'r') as file:
            for line in file:
                conn.sendall(line.encode())  # Envoi de la ligne
                print(f"Envoyé: {line.strip()}")
                time.sleep(0.01)  # Attendre 0.01 seconde avant d'envoyer la prochaine ligne

        conn.sendall("Fin transmission".encode())
        print("Fichier envoyé avec succès.")
    except Exception as e:
        print(f"Erreur lors de l'envoi des données : {e}")
    finally:
        try:
            conn.shutdown(socket.SHUT_RDWR)
            conn.close()
        except:
            pass
        server_socket.close()

if __name__ == "__main__":
    csv_file = 'output2.csv'
    parser = argparse.ArgumentParser(description="IP Serveur")
    parser.add_argument("ip_serveur", type=str, nargs='?', default='127.0.0.1', help="Adresse IP du serveur")
    parser.add_argument("port", type=int, nargs='?', default=12345, help="Port du serveur")
    args = parser.parse_args()
    print(f"Ouverture du serveur {args.ip_serveur}:{args.port}")
    send_csv_to_client(csv_file, args.ip_serveur, args.port)