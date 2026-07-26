@echo off
REM ====================================================================
REM  ClinicAI Growth - subir la web a GitHub
REM  El repositorio local ya esta creado (init + commit). Este lanzador
REM  solo lo conecta con GitHub y hace el push. La primera vez se abre
REM  el navegador para iniciar sesion en GitHub (un clic).
REM ====================================================================
title ClinicAI Growth - subir a GitHub
cd /d "%~dp0"

echo.
echo  PASO PREVIO (hazlo una vez): crea un repositorio VACIO en:
echo      https://github.com/new
echo  Nombre sugerido: clinicai-growth   ^|  Publico  ^|  SIN anadir README
echo.

set "DEFURL=https://github.com/blvckthekali-cmyk/clinicai-growth.git"
set /p "REPO=Pega la URL del repo (o pulsa Enter para usar %DEFURL%): "
if "%REPO%"=="" set "REPO=%DEFURL%"

echo.
echo  Conectando el repositorio local con: %REPO%
git remote remove origin 2>nul
git remote add origin "%REPO%"
git branch -M main

echo.
echo  Subiendo a GitHub (la primera vez se abrira el navegador para autorizar)...
git push -u origin main

echo.
echo  Si arriba ves algo como "branch 'main' set up to track..." ya esta en GitHub.
echo  Ahora, en Vercel: Add New -^> Project -^> Import -^> elige el repo -^> Deploy.
echo.
pause
