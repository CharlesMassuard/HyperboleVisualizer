#!/bin/bash

gnome-terminal -- bash -c "python3 ./serveur.py; exec bash"
gnome-terminal -- bash -c "python3 ./client.py; exec bash"