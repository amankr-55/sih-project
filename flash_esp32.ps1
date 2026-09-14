$esptool = "C:\Users\Aman Kumar\AppData\Local\Arduino15\packages\esp32\tools\esptool_py\5.1.0\esptool.exe"
$buildDir = "C:\Users\Aman Kumar\AppData\Local\arduino\sketches\12A1145792D802A21ADDF412F1B2EC24"
$bootApp0 = "C:\Users\Aman Kumar\AppData\Local\Arduino15\packages\esp32\hardware\esp32\3.3.7\tools\partitions\boot_app0.bin"

Clear-Host
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "      GEOSENTINEL - AI MINE SUBSIDENCE EARLY WARNING SYSTEM" -ForegroundColor Cyan
Write-Host "              Team: Green ThinkerX (SIH26025)" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "Target: ESP32 on COM6" -ForegroundColor Yellow
Write-Host "HINT: Jab 'Connecting...' dikhe, ESP32 ka 'BOOT' button 2 second ke liye dabaye rakhein!" -ForegroundColor Magenta
Write-Host ""

$success = $false
$attempt = 1

while (-not $success) {
    Write-Host "[Attempt $attempt] ESP32 se connect kar rahe hain... (BOOT button dabaye rakhein)" -ForegroundColor Yellow
    
    & $esptool --chip esp32 --port COM6 --baud 460800 --before default-reset --after hard-reset write-flash -z --flash-mode dio --flash-freq 80m --flash-size 4MB 0x1000 "$buildDir\GeoSentinel_ESP32_Firmware.ino.bootloader.bin" 0x8000 "$buildDir\GeoSentinel_ESP32_Firmware.ino.partitions.bin" 0xe000 $bootApp0 0x10000 "$buildDir\GeoSentinel_ESP32_Firmware.ino.bin"
    
    if ($LASTEXITCODE -eq 0) {
        $success = $true
        Write-Host ""
        Write-Host "======================================================================" -ForegroundColor Green
        Write-Host "  [SUCCESS] NAYA CODE 100% SAFALTAPURVAK FLASH HO GAYA HAI!" -ForegroundColor Green
        Write-Host "======================================================================" -ForegroundColor Green
        Write-Host "  1. ESP32 ko table par seedha rakhein (Auto-Zero Calibration)." -ForegroundColor White
        Write-Host "  2. Table par Tilt = 0.00 deg, Vibration = 0.01g, Buzzer = SILENT." -ForegroundColor White
        Write-Host "  3. Dashboard: https://amankr-55.github.io/sih-project/" -ForegroundColor Cyan
        break
    } else {
        Write-Host ""
        Write-Host "--> [ACTION NEEDED] ESP32 par 'BOOT' button ko dabaye rakhein! <--" -ForegroundColor Red
        Write-Host "2 second me dobara try kar rahe hain..." -ForegroundColor Gray
        Start-Sleep -Seconds 2
        $attempt++
    }
}
