@echo off
REM ====================================================================
REM  ClinicAI Growth - desplegar en Vercel
REM  Doble clic. La primera vez inicia sesion (se abre el navegador) y
REM  hace unas preguntas simples; despues sube la web a produccion.
REM ====================================================================
title ClinicAI Growth - desplegar en Vercel
cd /d "%~dp0"

where vercel >nul 2>nul
if errorlevel 1 (
  echo  Instalando la CLI de Vercel...
  call npm i -g vercel
)

echo.
echo  Comprobando sesion de Vercel...
vercel whoami >nul 2>nul
if errorlevel 1 (
  echo  No hay sesion. Iniciando sesion (se abrira tu navegador)...
  call vercel login
)

echo.
echo  Desplegando a produccion...
call vercel --prod

echo.
echo  Listo. Arriba veras la URL publica (https://...vercel.app)
pause
