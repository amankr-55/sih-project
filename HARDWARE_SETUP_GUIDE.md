# GeoSentinel Hardware Setup & Wiring Guide (SIH26025)
**Team:** Green ThinkerX  
**Platform:** ESP32 DevKit V1 (30-pin / 38-pin) + MPU-6050 + Active Buzzer

---

## 1. Pin-to-Pin Connection Table

| Sensor / Module | Sensor Pin | ESP32 Pin | Purpose |
|:---|:---:|:---:|:---|
| **MPU-6050** | **VCC** | **VIN / 5V** (or 3V3) | Power Supply |
| | **GND** | **GND** | Ground |
| | **SDA** | **GPIO 21** (D21) | I2C Data |
| | **SCL** | **GPIO 22** (D22) | I2C Clock |
| **Active Buzzer** | **Positive (+)** | **GPIO 18** (D18) | Audio Alarm Siren |
| | **Negative (-)** | **GND** | Ground |
| **Warning LED** | **Anode (+)** | **GPIO 19** (via 220Ω resistor) | Visual Danger Indicator |
| | **Cathode (-)** | **GND** | Ground |

---

## 2. Flashing Code in Arduino IDE

1. Open `firmware/GeoSentinel_ESP32_Firmware/GeoSentinel_ESP32_Firmware.ino` in Arduino IDE.
2. Select Board: **DOIT ESP32 DEVKIT V1**.
3. Select Port: Your COM Port (e.g. `COM3` or `COM4`).
4. Click **Upload (Arrow)** button.
5. **Close Arduino IDE Serial Monitor (`Ctrl + Shift + M`)** after flashing so the web dashboard can connect without port conflict!

---

## 3. Connecting to Dashboard

1. Open **Google Chrome** or **Microsoft Edge** to:
   - Live: `https://amankr-55.github.io/sih-project/`
   - Local: `http://localhost:5173`
2. Click **"CONNECT HARDWARE PORT"** in the top header.
3. Select your ESP32 COM port and click **Connect**.
4. Tilt the MPU-6050 — watch the 3D model and real-time graphs respond instantly!
