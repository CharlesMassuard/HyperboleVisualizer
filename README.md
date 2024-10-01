# Lancement de la simulation

Lancement du serveur : 

```python
python3 ./serveur.py {adresse_serveur} {port_serveur}
```

Lancement du client : 

```python
python3 ./client.py {adresse_serveur} {port_serveur}
```

> [!IMPORTANT]
> Le serveur doit être lancé **avant** le client. Un terminal différent doit être utilisé pour le serveur et le client.

> [!NOTE]
> Les valeurs par défaut sont : <br>
> IP: 127.0.0.1 <br>
> Port : 12345 <br>
> *Cela fonctionne donc pour une execution en local, avaec le client et le serveur sur la même machine*


## Lancement automatique sur une même machine

Afin de lancer la simulation sur votre machine, avec le serveur et le client sur la même machine, executez le fichier **lancement.sh** :

```sh
sh lancement.sh
```

Afin de lancer en mode **DEBUG** et ne pas fermer les terminaux à la fin de l'execution : 

```sh
sh lancement.sh True
```