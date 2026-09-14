@echo off
title GeoSentinel ESP32 1-Click Firmware Flasher
color 0b
powershell -ExecutionPolicy Bypass -File "%~dp0flash_esp32.ps1"
pause
