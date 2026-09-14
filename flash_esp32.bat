@echo off
setlocal enabledelayedexpansion
title GeoSentinel ESP32 1-Click Firmware Flasher
color 0b

echo ======================================================================
echo       GEOSENTINEL - AI MINE SUBSIDENCE EARLY WARNING SYSTEM
echo               Team: Green ThinkerX (SIH26025)
echo ======================================================================
echo.
echo  Target Board: ESP32 DevKit V1 (30-Pin)
echo  Serial Port : COM6
echo.
echo  ----------------------------------------------------------------------
echo  [IMPORTANT INSTRUCTION FOR FLASHING]:
echo  ESP32 board par micro-USB port ke paas do chhote button hote hain:
echo    1. "EN" (Reset)
echo    2. "BOOT" ya "IO0" (Download mode)
echo.
echo  Jab niche "Connecting........" dikhe, tab "BOOT" button ko 2 second
echo  ke liye DABAYE RAKHEIN (Press and hold), jab tak flashing shuru na ho jaye!
echo  ----------------------------------------------------------------------
echo.

set ESPTOOL="C:\Users\Aman Kumar\AppData\Local\Arduino15\packages\esp32\tools\esptool_py\5.1.0\esptool.exe"
set BUILD_DIR=C:\Users\Aman Kumar\AppData\Local\arduino\sketches\12A1145792D802A21ADDF412F1B2EC24
set BOOT_APP0="C:\Users\Aman Kumar\AppData\Local\Arduino15\packages\esp32\hardware\esp32\3.3.7\tools\partitions\boot_app0.bin"

:FLASH_ATTEMPT
echo [*] ESP32 se connect kar rahe hain (COM6)...
echo     (Agar connecting dikhe to BOOT button dabaye rakhein!)
echo.

%ESPTOOL% --chip esp32 --port COM6 --baud 460800 --before default-reset --after hard-reset write-flash -z --flash-mode dio --flash-freq 80m --flash-size 4MB 0x1000 "%BUILD_DIR%\GeoSentinel_ESP32_Firmware.ino.bootloader.bin" 0x8000 "%BUILD_DIR%\GeoSentinel_ESP32_Firmware.ino.partitions.bin" 0xe000 %BOOT_APP0% 0x10000 "%BUILD_DIR%\GeoSentinel_ESP32_Firmware.ino.bin"

if %errorlevel% equ 0 (
    echo.
    echo ======================================================================
    echo   [SUCCESS] NAYA CODE 100%% SAFALTAPURVAK FLASH HO GAYA HAI!
    echo ======================================================================
    echo.
    echo   1. ESP32 ko table par seedha/flat rakhein (Auto-Zero Calibration).
    echo   2. Flat rehne par Tilt = 0.00 deg, Crack = 0.00 mm, Buzzer = SILENT.
    echo   3. Ab jab aap MPU-6050 ko hilayenge to dashboard par live graph chalega!
    echo.
    echo   Dashboard link: https://amankr-55.github.io/sih-project/
    echo ======================================================================
    echo.
    goto FINISH
) else (
    echo.
    color 0c
    echo ======================================================================
    echo   [WAITING FOR BOOT BUTTON]
    echo   ESP32 abhi running mode me hai. Flashing mode me lane ke liye:
    echo   ---> APNE ESP32 KA "BOOT" BUTTON DABAYE RAKHEIN! <---
    echo ======================================================================
    echo   3 second me dobara connect karne ki koshish kar rahe hain...
    color 0b
    timeout /t 3 /nobreak >nul
    goto FLASH_ATTEMPT
)

:FINISH
pause
