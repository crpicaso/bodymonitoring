@echo off
chcp 65001 > nul
title Weight Overview Pro - Dropbox Sync Server
echo ========================================================
echo   Starte Weight Overview Pro Dropbox Sync Server...
echo ========================================================
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
if %errorlevel% neq 0 (
    echo.
    echo Server beendet oder Fehler aufgetreten.
    pause
)
