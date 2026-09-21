/*
  ============================================================================
   GEOSENTINEL - CLEAN FRESH HARDWARE FIRMWARE (SIH26025)
   Team: Green ThinkerX | Author: Aman Kumar
   ESP32 DevKit V1 (30-Pin) + MPU-6050 + Active Buzzer
  ============================================================================
   - GPIO 21: SDA -> MPU-6050 SDA
   - GPIO 22: SCL -> MPU-6050 SCL
   - GPIO 18: BUZZER (+) -> Active Buzzer Positive Pin
   - GND: MPU-6050 GND & Buzzer Negative
   - 5V / VIN: MPU-6050 VCC
   - Baud Rate: 115200 | Telemetry Rate: 5Hz (Every 200ms)
  ============================================================================
*/

#include <Wire.h>
#include <math.h>

#define SDA_PIN       21
#define SCL_PIN       22
#define BUZZER_PIN    18

uint8_t mpuAddr = 0x68;
bool isSensorReady = false;

// Calibration Offsets (Zeroed on table at startup)
float offsetPitch = 0.0;
float offsetRoll  = 0.0;

// Non-blocking buzzer timer
unsigned long lastBuzzerToggle = 0;
bool buzzerState = false;

// Telemetry timer
unsigned long lastSendTime = 0;

void setup() {
  Serial.begin(115200);
  delay(500);

  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  // 2 Startup Confirmation Beeps
  digitalWrite(BUZZER_PIN, HIGH); delay(100);
  digitalWrite(BUZZER_PIN, LOW);  delay(80);
  digitalWrite(BUZZER_PIN, HIGH); delay(100);
  digitalWrite(BUZZER_PIN, LOW);

  // Initialize I2C
  Wire.begin(SDA_PIN, SCL_PIN, 100000);
  delay(150);

  // 1. Wake up MPU-6050 (Test address 0x68 first, then 0x69)
  Wire.beginTransmission(0x68);
  Wire.write(0x6B); // PWR_MGMT_1
  Wire.write(0x00); // Wake up
  if (Wire.endTransmission() == 0) {
    mpuAddr = 0x68;
    isSensorReady = true;
  } else {
    Wire.beginTransmission(0x69);
    Wire.write(0x6B);
    Wire.write(0x00);
    if (Wire.endTransmission() == 0) {
      mpuAddr = 0x69;
      isSensorReady = true;
    }
  }

  if (isSensorReady) {
    // Set Accelerometer to +/- 2g range
    Wire.beginTransmission(mpuAddr);
    Wire.write(0x1C);
    Wire.write(0x00);
    Wire.endTransmission();

    // Auto-Calibrate Rest Baseline on Table (20 samples)
    float sumP = 0, sumR = 0;
    int samples = 0;
    for (int i = 0; i < 20; i++) {
      Wire.beginTransmission(mpuAddr);
      Wire.write(0x3B);
      Wire.endTransmission();
      if (Wire.requestFrom((int)mpuAddr, 6) == 6) {
        uint8_t b[6];
        for (int k = 0; k < 6; k++) b[k] = Wire.read();
        int16_t ax = (int16_t)((b[0] << 8) | b[1]);
        int16_t ay = (int16_t)((b[2] << 8) | b[3]);
        int16_t az = (int16_t)((b[4] << 8) | b[5]);
        float gX = ax / 16384.0;
        float gY = ay / 16384.0;
        float gZ = az / 16384.0;
        sumP += atan2(gY, sqrt(gX * gX + gZ * gZ)) * 180.0 / 3.14159;
        sumR += atan2(-gX, gZ) * 180.0 / 3.14159;
        samples++;
      }
      delay(20);
    }
    if (samples > 0) {
      offsetPitch = sumP / samples;
      offsetRoll  = sumR / samples;
    }
    Serial.println("[OK] GeoSentinel Node Ready! MPU-6050 calibrated.");
  } else {
    Serial.println("[ERR] MPU-6050 not detected! Check SDA(21), SCL(22), VCC(5V), GND.");
  }
}

void loop() {
  unsigned long now = millis();

  // Try re-connecting if sensor was offline
  if (!isSensorReady) {
    Wire.beginTransmission(0x68);
    Wire.write(0x6B);
    Wire.write(0x00);
    if (Wire.endTransmission() == 0) {
      mpuAddr = 0x68;
      isSensorReady = true;
    }
    delay(200);
  }

  float gX = 0, gY = 0, gZ = 1.0;

  if (isSensorReady) {
    Wire.beginTransmission(mpuAddr);
    Wire.write(0x3B); // ACCEL_XOUT_H
    if (Wire.endTransmission() == 0) {
      if (Wire.requestFrom((int)mpuAddr, 6) == 6) {
        uint8_t b[6];
        for (int i = 0; i < 6; i++) b[i] = Wire.read();
        int16_t ax = (int16_t)((b[0] << 8) | b[1]);
        int16_t ay = (int16_t)((b[2] << 8) | b[3]);
        int16_t az = (int16_t)((b[4] << 8) | b[5]);

        gX = ax / 16384.0;
        gY = ay / 16384.0;
        gZ = az / 16384.0;
      }
    } else {
      isSensorReady = false;
    }
  }

  // Calculate Real-World Physical Tilt Angle (Pitch & Roll)
  float rawPitch = atan2(gY, sqrt(gX * gX + gZ * gZ)) * 180.0 / 3.14159;
  float rawRoll  = atan2(-gX, gZ) * 180.0 / 3.14159;

  float deltaPitch = rawPitch - offsetPitch;
  float deltaRoll  = rawRoll  - offsetRoll;
  float tilt = sqrt(deltaPitch * deltaPitch + deltaRoll * deltaRoll);
  if (tilt < 0.10) tilt = 0.00; // Flat rest baseline

  // Calculate Dynamic G-Force (Vibration)
  float totalG = sqrt(gX * gX + gY * gY + gZ * gZ);
  float vibration = fabs(totalG - 1.0);
  if (vibration < 0.02) vibration = 0.01;

  // Derive Crack Displacement (mm)
  float crack = (tilt * 0.15) + (vibration * 1.8);
  if (crack > 5.0) crack = 5.0;
  if (tilt < 0.15 && vibration < 0.03) crack = 0.00;

  // Determine Alert Status
  String status = "normal";
  if (tilt >= 2.60 || vibration >= 0.28 || crack >= 1.20) {
    status = "critical";
  } else if (tilt >= 1.20 || vibration >= 0.14 || crack >= 0.60) {
    status = "advisory";
  }

  // Buzzer Control: BEEP only during Critical Alarm, OFF during Normal
  if (status == "critical") {
    if (now - lastBuzzerToggle >= 150) {
      lastBuzzerToggle = now;
      buzzerState = !buzzerState;
      digitalWrite(BUZZER_PIN, buzzerState ? HIGH : LOW);
    }
  } else {
    digitalWrite(BUZZER_PIN, LOW); // Guaranteed OFF
    buzzerState = false;
  }

  // Stream Live JSON Data every 200ms
  if (now - lastSendTime >= 200) {
    lastSendTime = now;

    String packet = "{";
    packet += "\"id\":\"NODE-01\",";
    packet += "\"location\":\"Seam 3-A Longwall Face\",";
    packet += "\"tilt\":" + String(tilt, 2) + ",";
    packet += "\"pitch\":" + String(deltaPitch, 2) + ",";
    packet += "\"roll\":" + String(deltaRoll, 2) + ",";
    packet += "\"vibration\":" + String(vibration, 2) + ",";
    packet += "\"crack\":" + String(crack, 2) + ",";
    packet += "\"temp\":27.2,";
    packet += "\"status\":\"" + status + "\",";
    packet += "\"timestamp\":" + String(now / 1000);
    packet += "}";

    Serial.println(packet);
  }

  // Listen for Manual Commands from Dashboard
  if (Serial.available() > 0) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    cmd.toUpperCase();
    if (cmd == "TEST" || cmd == "BEEP") {
      digitalWrite(BUZZER_PIN, HIGH); delay(150);
      digitalWrite(BUZZER_PIN, LOW);
    } else if (cmd == "ZERO" || cmd == "CALIB") {
      offsetPitch = rawPitch;
      offsetRoll  = rawRoll;
      Serial.println("[OK] Zeroed!");
    }
  }

  delay(10);
}
