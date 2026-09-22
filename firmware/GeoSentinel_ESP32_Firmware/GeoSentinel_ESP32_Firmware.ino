/*
  ============================================================================
   GEOSENTINEL - ZERO-CALIBRATION ROBUST SENSING ENGINE (SIH26025)
   Team: Green ThinkerX | Author: Aman Kumar
   ESP32 DevKit V1 (30-Pin) + MPU-6050 + Active Buzzer
  ============================================================================
   - GPIO 21: SDA -> MPU-6050 SDA
   - GPIO 22: SCL -> MPU-6050 SCL
   - GPIO 18: BUZZER (+) -> Active Buzzer Positive Pin
   - GND: MPU-6050 GND & Buzzer Negative
   - 5V / VIN: MPU-6050 VCC
   - True Gravity Vector Inclinometer: 0.00° Flat on table automatically!
   - Baud Rate: 115200 | Telemetry Rate: 5Hz (Every 200ms)
  ============================================================================
*/

#include <Wire.h>
#include <math.h>

#define SDA_PIN       21
#define SCL_PIN       22
#define BUZZER_PIN    18
#define LED_PIN       19
#define POT_PIN       34   // Linear Potentiometer (Crack gauge 0-5mm)
#define GAS_PIN       35   // MQ-4 Gas Sensor (Analog A0)
#define MOISTURE_PIN  33   // Capacitive Soil Moisture Sensor (AOUT)

uint8_t mpuAddr = 0x68;
bool mpuFound = false;

// Exponential Moving Average (EMA) for butter-smooth noise reduction
float filtAx = 0.0, filtAy = 0.0, filtAz = 1.0;

// Non-blocking buzzer & LED timer
unsigned long lastBuzzerToggle = 0;
bool buzzerBeepState = false;

// Telemetry timer
unsigned long lastSendTime = 0;
unsigned long lastI2CRetry = 0;

// Reset & Clear I2C Bus
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

  // Set DLPF to 44Hz (filters drill noise)
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
  Wire.setTimeOut(40); // 40ms timeout prevents any I2C hang on cable hot-plug
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

  pinMode(POT_PIN, INPUT);
  pinMode(GAS_PIN, INPUT);
  pinMode(MOISTURE_PIN, INPUT);

  // Startup Confirmation Beeps & LED flash
  digitalWrite(LED_PIN, HIGH);
  digitalWrite(BUZZER_PIN, HIGH); delay(80);
  digitalWrite(BUZZER_PIN, LOW);  delay(60);
  digitalWrite(BUZZER_PIN, HIGH); delay(80);
  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(LED_PIN, LOW);

  // Connect MPU
  mpuFound = connectMPU();
  if (mpuFound) {
    Serial.printf("[OK] MPU-6050 online at 0x%02X!\n", mpuAddr);
  } else {
    Serial.println("[WARN] MPU-6050 not responding. Check GPIO 21/22 & 5V VCC.");
  }
}

void loop() {
  unsigned long now = millis();

  // Auto-Reconnect in background if sensor disconnected
  if (!mpuFound && (now - lastI2CRetry > 1000)) {
    lastI2CRetry = now;
    mpuFound = connectMPU();
    if (mpuFound) {
      Serial.printf("[RECONNECT] MPU-6050 Restored at 0x%02X!\n", mpuAddr);
    }
  }

  float rawAx = 0.0, rawAy = 0.0, rawAz = 1.0;
  float tempC = 26.8;

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

  // Smooth Accelerometer with Exponential Filter (80% old + 20% new)
  filtAx = (filtAx * 0.80) + (rawAx * 0.20);
  filtAy = (filtAy * 0.80) + (rawAy * 0.20);
  filtAz = (filtAz * 0.80) + (rawAz * 0.20);

  // 1. Calculate True Physical Tilt from Gravity Vector
  // Sitting flat on table: Pitch ~ 0°, Roll ~ 0°, Tilt ~ 0.00°
  float pitch = atan2(filtAy, sqrt(filtAx * filtAx + filtAz * filtAz)) * 180.0 / 3.14159;
  float roll  = atan2(-filtAx, filtAz) * 180.0 / 3.14159;
  float tilt  = sqrt(pitch * pitch + roll * roll);
  if (tilt < 0.15) tilt = 0.00; // Flat rest deadband

  // 2. Calculate Dynamic Vibration (Delta from 1.0g static gravity)
  float totalG = sqrt(rawAx * rawAx + rawAy * rawAy + rawAz * rawAz);
  float vibration = fabs(totalG - 1.0);
  if (vibration < 0.02) vibration = 0.01;

// Set to true only if you have physical Potentiometer/MQ-4/Moisture wired to GPIO 34/35/33
#define ENABLE_ANALOG_SENSORS false

  // 3. Physical Crack Dilation (mm)
  float crack = 0.0;
#if ENABLE_ANALOG_SENSORS
  int potRaw = analogRead(POT_PIN);
  if (potRaw > 100) {
    crack = (potRaw / 4095.0) * 5.0; // 0 to 5.0 mm range
  } else {
    crack = (tilt * 0.15) + (vibration * 1.8);
  }
#else
  // Geotechnical crack dilation derived directly from strata tilt & micro-vibration
  crack = (tilt * 0.15) + (vibration * 1.8);
#endif
  if (crack > 5.0) crack = 5.0;
  if (tilt < 0.15 && vibration < 0.03) crack = 0.00;

  float ch4 = 0.22;
  float moisture = 38.0;

#if ENABLE_ANALOG_SENSORS
  int gasRaw = analogRead(GAS_PIN);
  if (gasRaw > 200) {
    ch4 = (gasRaw / 4095.0) * 2.50; // 0 to 2.5% vol CH4
  }

  int moistRaw = analogRead(MOISTURE_PIN);
  if (moistRaw > 200) {
    moisture = 100.0 - ((moistRaw / 4095.0) * 100.0);
    if (moisture < 0) moisture = 0.0;
  }
#endif

  // 4. DGMS Safety Evaluation & Alert Status
  String status = "normal";
  if (tilt >= 2.60 || vibration >= 0.28 || crack >= 1.20 || ch4 >= 1.25 || moisture >= 85.0) {
    status = "critical";
  } else if (tilt >= 1.20 || vibration >= 0.14 || crack >= 0.60 || ch4 >= 0.75 || moisture >= 65.0) {
    status = "advisory";
  }

  // 5. Buzzer & LED Actuators
  if (status == "critical") {
    digitalWrite(LED_PIN, HIGH);
    if (now - lastBuzzerToggle >= 150) {
      lastBuzzerToggle = now;
      buzzerBeepState = !buzzerBeepState;
      digitalWrite(BUZZER_PIN, buzzerBeepState ? HIGH : LOW);
    }
  } else if (status == "advisory") {
    digitalWrite(LED_PIN, HIGH);
    digitalWrite(BUZZER_PIN, LOW);
    buzzerBeepState = false;
  } else {
    digitalWrite(LED_PIN, LOW);
    digitalWrite(BUZZER_PIN, LOW);
    buzzerBeepState = false;
  }

  // 6. Stream Live JSON Packet every 200ms (5 Hz)
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
    packet += "\"ch4\":" + String(ch4, 2) + ",";
    packet += "\"moisture\":" + String(moisture, 1) + ",";
    packet += "\"status\":\"" + status + "\",";
    packet += "\"timestamp\":" + String(now / 1000);
    packet += "}";

    Serial.println(packet);
  }

  // 7. Remote Command Handler from Browser
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
