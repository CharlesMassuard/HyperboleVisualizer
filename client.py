import socket

def receive_csv_from_server(filename, host='localhost', port=12345):
    # Création du socket client
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect((host, port))
    print(f"Connecté au serveur sur {host}:{port}")

    # Ouvrir le fichier en mode ajout pour y écrire chaque ligne reçue
    with open(filename, 'w') as file:
        while True:
            line = client_socket.recv(1024).decode()  # Recevoir une ligne
            if not line:
                break  # Si aucune donnée n'est reçue, sortir de la boucle
            print(f"Reçu: {line.strip()}")
            file.write(line)  # Écrire la ligne reçue dans le fichier CSV
            file.flush()  # S'assurer que les données sont immédiatement écrites sur le disque

    print(f"Fichier reçu et enregistré sous {filename}.")
    client_socket.close()

if __name__ == "__main__":
    # Nom du fichier à enregistrer
    output_file = 'received_data.csv'
    receive_csv_from_server(output_file)
