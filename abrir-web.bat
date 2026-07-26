@echo off
REM ====================================================================
REM  ClinicAI Growth - abre la web con servidor local (estilos + chatbot)
REM  Doble clic en este archivo. Se abrira tu navegador automaticamente.
REM ====================================================================
title ClinicAI Growth - servidor local
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  [X] No se encontro Node.js. Instalalo desde https://nodejs.org y vuelve a intentarlo.
  echo.
  pause
  exit /b 1
)

node server.js
echo.
echo  El servidor se ha detenido. Pulsa una tecla para cerrar.
pause >nul
