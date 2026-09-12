# GeoSentinel Hardware Assembly & Wiring Guide (SIH26025)
**Team:** Green ThinkerX  
**Platform:** ESP32 DevKit V1 (30-pin / 38-pin)  
**Target:** Undergound Subterranean Strata Monitoring & Early Warning System

---

## 1. Parts Inventory Checklist (हार्डवेयर सामान)

| Component | Quantity | Purpose in Mine Subsidence System |
|:---|:---:|:---|
| **ESP32 DevKit V1** (30 or 38 pin) | 1 | Master Microcontroller with Wi-Fi/BLE & ADC |
| **MPU-6050** Module | 1 | 3-Axis Inclinometer (Tilt) & Acoustic Geophone (Vibration) |
| **Linear Potentiometer** (10k) | 1 | Extensometer Crack Dilation Gauge (0 to 5.0 mm) |
| **MQ-4** (or MQ-2) Gas Sensor | 1 | Methane (CH4) & Combustible Strata Gas Detector |
| **Capacitive Moisture Sensor v1.2** | 1 | Sump Water Ingress & Aquifer Saturation |
| **Active 5V Buzzer** | 1 | Audio Siren Alarm (DGMS Statutory Safety Alert) |
| **Red LED + 220Ω Resistor** | 1 | Visual Flash Interlock Indicator |
| **Breadboard & Jumper Wires** | 1 set | Male-to-Male & Male-to-Female Jumpers |
| **Micro-USB Cable** | 1 | Flashing & Live Web Serial connection to Laptop |

---

## 2. Complete Pin-to-Pin Wiring Diagram (पिन कनेक्शन टेबल)

### Power Distribution (पावर कनेक्शन):
- Connect **ESP32 3V3** pin to the **Red (+) Rail** on the breadboard.
- Connect **ESP32 GND** pin to the **Blue (-) Rail** on the breadboard.
- Connect **ESP32 VIN / 5V** to the power pin of MQ-4 and Buzzer (these need 5V).

---

### Detailed Sensor Connections:

| Sensor / Part | Sensor Pin | Connects to ESP32 Pin | Wire Function |
|:---|:---:|:---:|:---|
| **MPU-6050** | VCC | **3V3** (or 5V if 5V tolerant) | Power |
| | GND | **GND** | Ground |
| | SCL | **GPIO 22** (D22) | I2C Clock Line |
| | SDA | **GPIO 21** (D21) | I2C Data Line |
| **Linear Potentiometer** (Crack Gauge) | Pin 1 (Left) | **GND** | 0V Reference |
| | Pin 2 (Center Wiper) | **GPIO 34** (D34) | Analog Voltage (0 - 3.3V) |
| | Pin 3 (Right) | **3V3** | 3.3V Reference |
| **MQ-4 / MQ-2** (Gas Sensor) | VCC | **VIN / 5V** | 5V Heater Power |
| | GND | **GND** | Ground |
| | A0 (Analog Out) | **GPIO 35** (D35) | Analog CH4 Voltage |
| **Capacitive Moisture** (Water Sump) | VCC | **3V3** | 3.3V Power |
| | GND | **GND** | Ground |
| | AOUT | **GPIO 33** (D33) | Analog Moisture Reading |
| **Active Buzzer** | Positive (+) | **GPIO 18** (D18) | Digital Output Trigger |
| | Negative (-) | **GND** | Ground |
| **Red Warning LED** | Anode (Long leg) | **GPIO 19** (via 220Ω resistor) | Digital Output Indicator |
| | Cathode (Short leg) | **GND** | Ground |

---

## 3. How to Flash Code via Arduino IDE (अपलोड करने का तरीका)

1. **Arduino IDE Download**: [arduino.cc/en/software](https://www.arduino.cc/en/software)
2. **Add ESP32 Board Support**:
   - Go to `File` -> `Preferences`.
   - In "Additional Boards Manager URLs", paste:
     `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
   - Go to `Tools` -> `Board` -> `Boards Manager`, search **esp32**, click **Install**.
3. **Open Firmware**:
   - Open `firmware/GeoSentinel_ESP32_Firmware/GeoSentinel_ESP32_Firmware.ino` in Arduino IDE.
4. **Select Board & Port**:
   - `Tools` -> `Board` -> `esp32` -> **DOIT ESP32 DEVKIT V1**
   - `Tools` -> `Port` -> Select your COM port (e.g. `COM3` or `COM4`).
5. **Upload**: Click the **Upload (Arrow)** button.
   *(Note: If it stays on "Connecting...", press and hold the **BOOT** button on the ESP32 until the upload percentage starts).*

---

## 4. Connecting Live Hardware to GeoSentinel Web Dashboard

1. Keep the ESP32 plugged into your laptop via USB.
2. Open your live dashboard: **https://amankr-55.github.io/sih-project/** in Chrome or Edge.
3. Click on the **👑 Hardware & Settings** tab.
4. Set Baud Rate to **115200**.
5. Click **Connect to USB COM Port**.
6. Select your ESP32 from the browser pop-up.
7. 🎉 **Your live physical breadboard sensors will now stream directly onto the GeoSentinel 3D dashboard in real-time!**
