@echo off
set "ROOT=%~dp0"
start "FitTrack Backend" /D "%ROOT%server" cmd /k "npm start"
start "FitTrack Frontend" /D "%ROOT%client" cmd /k "npm start"