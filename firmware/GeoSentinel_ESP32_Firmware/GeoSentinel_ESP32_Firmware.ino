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
float maxVibPeak = 0.0;

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
  float tempC = 27.0;

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
          tempC = (it / 340.0) + 36.53 - 10.0; // Ambient normalized
        }
      } else {
        mpuFound = false; // Trigger re-init
      }
    } else {
      mpuFound = false; // Trigger re-init
    }
  }

  // EMA Noise Filtering
  filtAx = 0.20 * rawAx + 0.80 * filtAx;
  filtAy = 0.20 * rawAy + 0.80 * filtAy;
  filtAz = 0.20 * rawAz + 0.80 * filtAz;

  // Real 3D Orientation (Pitch & Roll in Degrees)
  float pitch = atan2(filtAx, sqrt(filtAy * filtAy + filtAz * filtAz)) * (180.0 / M_PI);
  float roll  = atan2(filtAy, sqrt(filtAx * filtAx + filtAz * filtAz)) * (180.0 / M_PI);
  float totalTilt = sqrt(pitch * pitch + roll * roll);

  // Dynamic Vibration (deviation from static 1G gravity)
  float normG = sqrt(rawAx * rawAx + rawAy * rawAy + rawAz * rawAz);
  float currentVib = fabs(normG - 1.0);
  if (currentVib < 0.005) currentVib = 0.005; // Base ambient threshold

  if (currentVib > maxVibPeak) maxVibPeak = currentVib;
  maxVibPeak *= 0.94; // Smooth exponential decay
  if (maxVibPeak < 0.005) maxVibPeak = 0.005;

  // Alarm threshold calculation
  String status = "normal";
  if (totalTilt >= 25.0 || maxVibPeak >= 0.55) {
    status = "critical";
  } else if (totalTilt >= 15.0 || maxVibPeak >= 0.35) {
    status = "warning";
  }

  // Buzzer & LED Warning Control
  if (status == "critical") {
    // Rapid pulsating alarm
    if (now - lastBuzzerToggle >= 100) {
      lastBuzzerToggle = now;
      buzzerState = !buzzerState;
      digitalWrite(BUZZER_PIN, buzzerState ? HIGH : LOW);
      digitalWrite(LED_PIN, buzzerState ? HIGH : LOW);
    }
  } else if (status == "warning") {
    // Intermittent slow beep
    if (now - lastBuzzerToggle >= 400) {
      lastBuzzerToggle = now;
      buzzerState = !buzzerState;
      digitalWrite(BUZZER_PIN, buzzerState ? HIGH : LOW);
      digitalWrite(LED_PIN, buzzerState ? HIGH : LOW);
    }
  } else {
    digitalWrite(BUZZER_PIN, LOW);
    digitalWrite(LED_PIN, LOW);
  }

  // Transmit Telemetry JSON every 200ms (5Hz)
  if (now - lastSendTime >= 200) {
    lastSendTime = now;

    Serial.print("{\"id\":\"NODE-01\",\"tilt\":");
    Serial.print(totalTilt, 2);
    Serial.print(",\"pitch\":");
    Serial.print(pitch, 2);
    Serial.print(",\"roll\":");
    Serial.print(roll, 2);
    Serial.print(",\"vibration\":");
    Serial.print(maxVibPeak, 3);
    Serial.print(",\"crack\":0.00,\"temp\":");
    Serial.print(tempC, 1);
    Serial.print(",\"status\":\"");
    Serial.print(status);
    Serial.println("\"}");
  }

  delay(10);
}
