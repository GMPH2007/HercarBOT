@echo off
title HercarIA - Asistente Virtual IESTP Hermanos Carcamo
color 1F
chcp 65001 > nul

echo =====================================================================
echo    INICIANDO HERCARIA - IESTP "HERMANOS CARCAMO" (PAITA - PIURA)
echo =====================================================================
echo.
echo  [+] Verificando entorno de ejecucion Python...
python --version > nul 2>&1
if %errorlevel% neq 0 (
    echo  [!] No se encontro Python instalado en el sistema.
    echo  [+] Abriendo version web directa en tu navegador...
    start index.html
    pause
    exit /b
)

echo  [+] Iniciando Servidor con Voz Neural Femenina y abriendo navegador...
echo.
python server.py

pause
