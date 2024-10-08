@echo off

REM Vérifier si l'argument est fourni
if "%1"=="True" (
    start cmd /k python serveur.py
    start cmd /k python client.py
) else (
    start cmd /c python serveur.py
    start cmd /c python client.py
)
