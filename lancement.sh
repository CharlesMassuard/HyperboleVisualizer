#!/bin/bash

# Vérifier si l'argument est fourni
if [ "$#" -eq 1 ] && [ "$1" = "True" ]; then
    gnome-terminal -- bash -c "python3 ./serveur.py; exec bash"
    gnome-terminal -- bash -c "python3 ./client.py; exec bash"
else
    gnome-terminal -- bash -c "python3 ./serveur.py"
    gnome-terminal -- bash -c "python3 ./client.py"
fi