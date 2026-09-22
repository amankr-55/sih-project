/*
  ============================================================================
   GEOSENTINEL - ZERO-CALIBRATION ROBUST SENSING ENGINE (SIH26025)
   Platform: ESP32 DevKit V1 (30-pin / 38-pin) + MPU-6050 + Active Buzzer
   Author: Aman Kumar | Team: Green ThinkerX
  ============================================================================
   Pin Connections:
   - MPU-6050 VCC -> ESP32 5V (VIN) or 3V3
   - MPU-6050 GND -> ESP32 GND
   - MPU-6050 SDA -> ESP32 GPIO 21 (D21)
   - MPU-6050 SCL -> ESP32 GPIO 22 (D22)
   - Active Buzzer (+) -> ESP32 GPIO 18 (D18)
   - Active Buzzer (-) -> ESP32 GND
   - Warning LED (+)   -> ESP32 GPIO 19 (D19 via 220 ohm resistor)
   - Warning LED (-)   -> ESP32 GND
  ============================================================================
*/

#include <Wire.h>
#include <math.h>

#define SDA_PIN       21
#define SCL_PIN       22
#define BUZZER_PIN    18
#define LED_PIN       19

uint8_t mpuAddr = 0x68;
bool mpuFound = false;

// Exponential Moving Average filter for smooth noise reduction
float filtAx = 0.0, filtAy = 0.0, filtAz = 1.0;

// Non-blocking timers
unsigned long lastSendTime = 0;
unsigned long lastI2CRetry = 0;
unsigned long lastBuzzerToggle = 0;
bool buzzerState = false;

// Clean I2C bus purge
void resetI2C() {
  Wire.end();
  pinMode(SDA_PIN, INPUT_PULLUP);
  pinMode(SCL_PIN, OUTPUT);
  for (int i = 0; i < 16; i++) {
    digitalWrite(SCL_PIN, LOW);
    delayMicroseconds(5);
    digitalWrite(SCL_PIN, HIGH);
    delayMicroseconds(5);
  }
}

// Low-level MPU-6050 Wake-up and Configuration
bool initMPU(uint8_t addr) {
  Wire.beginTransmission(addr);
  Wire.write(0x6B); // PWR_MGMT_1
  Wire.write(0x00); // Wake up device
  if (Wire.endTransmission(true) != 0) return false;
  delay(10);

  // Set clock source to X-gyro PLL
  Wire.beginTransmission(addr);
  Wire.write(0x6B);
  Wire.write(0x01);
  Wire.endTransmission(true);

  // Set DLPF to 44Hz (filters environmental vibration & drill noise)
  Wire.beginTransmission(addr);
  Wire.write(0x1A);
  Wire.write(0x03);
  Wire.endTransmission(true);

  // Set Accelerometer to +/- 2g range (16384 LSB/g)
  Wire.beginTransmission(addr);
  Wire.write(0x1C);
  Wire.write(0x00);
  Wire.endTransmission(true);

  mpuAddr = addr;
  return true;
}

// Find and connect to MPU-6050
bool connectMPU() {
  resetI2C();
  Wire.begin(SDA_PIN, SCL_PIN, 100000);
  Wire.setTimeOut(40); // 40ms timeout prevents freeze on cable disconnect
  delay(30);

  if (initMPU(0x68)) return true;
  if (initMPU(0x69)) return true;

  // Scan all addresses
  for (uint8_t a = 1; a < 127; a++) {
    if (a == 0x68 || a == 0x69) continue;
    Wire.beginTransmission(a);
    if (Wire.endTransmission(true) == 0) {
      if (initMPU(a)) return true;
    }
  }
  return false;
}

void setup() {
  Serial.begin(115200);
  delay(300);

  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  // Startup Confirmation Beep & LED Flash
  digitalWrite(LED_PIN, HIGH);
  digitalWrite(BUZZER_PIN, HIGH); delay(80);
  digitalWrite(BUZZER_PIN, LOW);  delay(60);
  digitalWrite(BUZZER_PIN, HIGH); delay(80);
  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(LED_PIN, LOW);

  // Connect MPU-6050
  mpuFound = connectMPU();
  if (mpuFound) {
    Serial.printf("[OK] MPU-6050 active at I2C address 0x%02X!\n", mpuAddr);
  } else {
    Serial.println("[WARN] MPU-6050 not found. Check GPIO 21 (SDA), GPIO 22 (SCL), and 5V Power.");
  }
}

void loop() {
  unsigned long now = millis();

  // Auto-reconnect in background if sensor was disconnected
  if (!mpuFound && (now - lastI2CRetry > 1000)) {
    lastI2CRetry = now;
    mpuFound = connectMPU();
  }

  float rawAx = 0.0, rawAy = 0.0, rawAz = 1.0;
  float tempC = 26.5;

  if (mpuFound) {
    Wire.beginTransmission(mpuAddr);
    Wire.write(0x3B); // ACCEL_XOUT_H
    if (Wire.endTransmission(true) == 0) {
      if (Wire.requestFrom((int)mpuAddr, 8, (int)true) >= 8) {
        uint8_t xh = Wire.read(); uint8_t xl = Wire.read();
        uint8_t yh = Wire.read(); uint8_t yl = Wire.read();
        uint8_t zh = Wire.read(); uint8_t zl = Wire.read();
        uint8_t th = Wire.read(); uint8_t tl = Wire.read();

        int16_t ix = (int16_t)((xh << 8) | xl);
        int16_t iy = (int16_t)((yh << 8) | yl);
        int16_t iz = (int16_t)((zh << 8) | zl);
        int16_t it = (int16_t)((th << 8) | tl);

        if (!(ix == 0 && iy == 0 && iz == 0)) {
          rawAx = ix / 16384.0;
          rawAy = iy / 16384.0;
          rawAz = iz / 16384.0;
          tempC = (it / 340.0) + 36.53;
        }
      }
    } else {
      mpuFound = false;
    }
  }

  // Smooth accelerometer reading with Exponential Filter (80% historical, 20% fresh)
  filtAx = (filtAx * 0.80) + (rawAx * 0.20);
  filtAy = (filtAy * 0.80) + (rawAy * 0.20);
  filtAz = (filtAz * 0.80) + (rawAz * 0.20);

  // 1. Compute True Pitch, Roll, and Net Strata Tilt from Gravity Vector
  // Table rest flat position: Pitch = 0.00 deg, Roll = 0.00 deg, Tilt = 0.00 deg
  float pitch = atan2(filtAy, sqrt(filtAx * filtAx + filtAz * filtAz)) * 180.0 / 3.14159265;
  float roll  = atan2(-filtAx, filtAz) * 180.0 / 3.14159265;
  float tilt  = sqrt(pitch * pitch + roll * roll);
  if (tilt < 0.15) tilt = 0.00; // Flat rest deadband

  // 2. Compute Dynamic Strata Vibration (deviation from 1.0g static gravity)
  float totalG = sqrt(rawAx * rawAx + rawAy * rawAy + rawAz * rawAz);
  float vibration = fabs(totalG - 1.0);
  if (vibration < 0.02) vibration = 0.01;

  // 3. Computed Crack Dilation (mm)
  float crack = (tilt * 0.15) + (vibration * 1.8);
  if (crack > 5.0) crack = 5.0;
  if (tilt < 0.15 && vibration < 0.03) crack = 0.00;

  // 4. DGMS Safety Trigger Evaluation
  String status = "normal";
  if (tilt >= 2.60 || vibration >= 0.28 || crack >= 1.20) {
    status = "critical";
  } else if (tilt >= 1.20 || vibration >= 0.14 || crack >= 0.60) {
    status = "advisory";
  }

  // 5. Buzzer & LED Actuator Controls
  if (status == "critical") {
    digitalWrite(LED_PIN, HIGH);
    if (now - lastBuzzerToggle >= 150) {
      lastBuzzerToggle = now;
      buzzerState = !buzzerState;
      digitalWrite(BUZZER_PIN, buzzerState ? HIGH : LOW);
    }
  } else if (status == "advisory") {
    digitalWrite(LED_PIN, HIGH);
    digitalWrite(BUZZER_PIN, LOW);
    buzzerState = false;
  } else {
    digitalWrite(LED_PIN, LOW);
    digitalWrite(BUZZER_PIN, LOW);
    buzzerState = false;
  }

  // 6. Stream Structured JSON Telemetry Packet every 200ms (5 Hz)
  if (now - lastSendTime >= 200) {
    lastSendTime = now;

    String packet = "{";
    packet += "\"id\":\"NODE-01\",";
    packet += "\"location\":\"Seam 3-A Longwall Face\",";
    packet += "\"tilt\":" + String(tilt, 2) + ",";
    packet += "\"pitch\":" + String(pitch, 2) + ",";
    packet += "\"roll\":" + String(roll, 2) + ",";
    packet += "\"vibration\":" + String(vibration, 2) + ",";
    packet += "\"crack\":" + String(crack, 2) + ",";
    packet += "\"temp\":" + String(tempC, 1) + ",";
    packet += "\"status\":\"" + status + "\",";
    packet += "\"timestamp\":" + String(now / 1000);
    packet += "}";

    Serial.println(packet);
  }

  // 7. Handle Inbound Browser Commands
  if (Serial.available() > 0) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    cmd.toUpperCase();
    if (cmd == "TEST" || cmd == "BEEP" || cmd == "SIREN_ON") {
      digitalWrite(LED_PIN, HIGH);
      digitalWrite(BUZZER_PIN, HIGH); delay(200);
      digitalWrite(BUZZER_PIN, LOW); delay(100);
      digitalWrite(BUZZER_PIN, HIGH); delay(200);
      digitalWrite(BUZZER_PIN, LOW);
      digitalWrite(LED_PIN, LOW);
    }
  }

  delay(10);
}
