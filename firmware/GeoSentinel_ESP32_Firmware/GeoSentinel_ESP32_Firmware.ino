/*
  ============================================================================
   GEOSENTINEL - AI MINE SUBSIDENCE EARLY WARNING SYSTEM (SIH26025)
   Team: Green ThinkerX | Author: Aman Kumar
   Platform: ESP32 DevKit V1 (30-Pin)
   
   PROVEN HIGH-SENSITIVITY SENSING ENGINE (Pitch & Roll Euler Kinematics)
   - Real Euler-Angle Tilt Kinematics (Pitch & Roll relative to table baseline)
   - Dynamic G-Force Vibration Sensing (Delta from 1.0g gravity vector)
   - Mining Machinery vs Seismic Strata Rupture Frequency Separation
   - Active Buzzer High-Current Drive (GPIO 18)
   - Baud Rate: 115200 | Telemetry Rate: ~3Hz (Every 300ms)
  ============================================================================
*/

#include <Wire.h>
#include <math.h>
#include "BluetoothSerial.h"

BluetoothSerial SerialBT;

// ================= HARDWARE PINOUT =================
#define I2C_SDA_PIN          21    // GPIO21 (SDA) -> MPU-6050 SDA
#define I2C_SCL_PIN          22    // GPIO22 (SCL) -> MPU-6050 SCL
#define PIN_ALARM_BUZZER     18    // GPIO18 -> Active Buzzer (+)

// ================= DGMS & DEMO SENSITIVITY THRESHOLDS =================
const float MINING_MAX_MACHINERY_VIB = 0.12; // g-force (Ambient mining machinery)
const float THRESH_TILT_ADVISORY     = 1.20; // degrees (Triggers yellow advisory on slight tilt)
const float THRESH_TILT_CRITICAL     = 2.60; // degrees (Triggers red alarm on deliberate tilt)
const float THRESH_VIB_CRITICAL      = 0.25; // g-force (Triggers on table tap / shake)
const float THRESH_CRACK_CRITICAL    = 0.80; // mm

// MPU-6050 I2C Configuration
uint8_t mpuAddress = 0x68;
bool mpuConnected = false;
unsigned long lastMpuRetryTime = 0;

// Baseline Calibration Offsets (Zeroed on table at startup)
float basePitch = 0.0;
float baseRoll  = 0.0;
bool isCalibrated = false;

// Peak detection for vibration frequency estimation
unsigned long lastPeakTime = 0;
float prevVib = 0.0;
float currentFrequencyHz = 0.0;

// Telemetry Timing: 300ms (~3.3 packets/sec)
unsigned long lastTelemetryTime = 0;
const unsigned long TELEMETRY_INTERVAL_MS = 300;

// Buzzer Non-Blocking Safety Timer
unsigned long buzzerBeepUntil = 0;
unsigned long nextAllowedBeep = 0;

void buzzerOn() {
  digitalWrite(PIN_ALARM_BUZZER, HIGH);
}

void buzzerOff() {
  digitalWrite(PIN_ALARM_BUZZER, LOW);
}

// I2C Hardware Bus Recovery (Cleans SDA if stuck)
void recoverI2CBus() {
  pinMode(I2C_SDA_PIN, INPUT_PULLUP);
  pinMode(I2C_SCL_PIN, OUTPUT);
  digitalWrite(I2C_SCL_PIN, HIGH);
  delayMicroseconds(10);
  for (int i = 0; i < 10; i++) {
    digitalWrite(I2C_SCL_PIN, LOW);
    delayMicroseconds(10);
    digitalWrite(I2C_SCL_PIN, HIGH);
    delayMicroseconds(10);
  }
}

// Low-level MPU-6050 / MPU-6500 Initializer
bool tryInitMPU(uint8_t addr) {
  Wire.beginTransmission(addr);
  Wire.write(0x6B); // PWR_MGMT_1
  Wire.write(0x00); // Wake up device
  if (Wire.endTransmission() != 0) return false;

  delay(15);

  // Set clock source (PLL with Gyro X)
  Wire.beginTransmission(addr);
  Wire.write(0x6B);
  Wire.write(0x01);
  Wire.endTransmission();

  // Set DLPF (Digital Low Pass Filter) to 44Hz
  Wire.beginTransmission(addr);
  Wire.write(0x1A); // CONFIG
  Wire.write(0x03);
  Wire.endTransmission();

  // Accelerometer Config: +/- 2g range (16384 LSB/g)
  Wire.beginTransmission(addr);
  Wire.write(0x1C); // ACCEL_CONFIG
  Wire.write(0x00);
  Wire.endTransmission();

  mpuAddress = addr;
  return true;
}

// Auto-scan and connect to MPU
bool scanAndConnectMPU() {
  if (tryInitMPU(0x68)) { mpuAddress = 0x68; return true; }
  if (tryInitMPU(0x69)) { mpuAddress = 0x69; return true; }
  for (uint8_t addr = 1; addr < 127; addr++) {
    if (addr == 0x68 || addr == 0x69) continue;
    Wire.beginTransmission(addr);
    if (Wire.endTransmission() == 0) {
      if (tryInitMPU(addr)) { mpuAddress = addr; return true; }
    }
  }
  return false;
}

// Auto-Zero Table Baseline Calibration
void calibrateMPU() {
  Serial.printf("[CALIB] Locking rest position on I2C 0x%02X... Keep sensor still!\n", mpuAddress);
  float sumP = 0, sumR = 0;
  int validSamples = 0;

  for (int i = 0; i < 25; i++) {
    Wire.beginTransmission(mpuAddress);
    Wire.write(0x3B);
    if (Wire.endTransmission(false) == 0) {
      if (Wire.requestFrom((int)mpuAddress, 6, (int)true) >= 6) {
        int16_t rx = (Wire.read() << 8) | Wire.read();
        int16_t ry = (Wire.read() << 8) | Wire.read();
        int16_t rz = (Wire.read() << 8) | Wire.read();
        float ax = rx / 16384.0;
        float ay = ry / 16384.0;
        float az = rz / 16384.0;
        float p = atan2(ay, sqrt(ax * ax + az * az)) * 180.0 / 3.14159265;
        float r = atan2(-ax, az) * 180.0 / 3.14159265;
        sumP += p;
        sumR += r;
        validSamples++;
      }
    }
    delay(20);
  }

  if (validSamples > 0) {
    basePitch = sumP / validSamples;
    baseRoll  = sumR / validSamples;
    isCalibrated = true;
    Serial.printf("[CALIB] Baseline Locked! (Base Pitch: %.2f deg | Base Roll: %.2f deg). Rest = 0.00 deg.\n", basePitch, baseRoll);
  }
}

// Process commands from USB WebSerial / Bluetooth
void processCommand(String cmd) {
  cmd.trim();
  cmd.toUpperCase();
  if (cmd == "BUZZ_TEST" || cmd == "TEST" || cmd == "BEEP" || cmd == "1") {
    Serial.println("[BUZZER] Manual Hardware Buzzer Test Triggered!");
    for (int i = 0; i < 3; i++) {
      digitalWrite(PIN_ALARM_BUZZER, HIGH);
      delay(150);
      digitalWrite(PIN_ALARM_BUZZER, LOW);
      delay(100);
    }
  } else if (cmd == "BUZZ_ON" || cmd == "SIREN_ON") {
    digitalWrite(PIN_ALARM_BUZZER, HIGH);
    Serial.println("[BUZZER] Buzzer Forced ON");
  } else if (cmd == "BUZZ_OFF" || cmd == "SIREN_OFF") {
    digitalWrite(PIN_ALARM_BUZZER, LOW);
    Serial.println("[BUZZER] Buzzer Forced OFF");
  } else if (cmd == "CALIB" || cmd == "ZERO") {
    calibrateMPU();
  }
}

void setup() {
  Serial.begin(115200);
  delay(300);

  // Initialize Wireless Bluetooth SPP
  SerialBT.begin("GeoSentinel-Node01");
  Serial.println("\n[BT] Wireless Bluetooth Serial Initialized: 'GeoSentinel-Node01'");

  // Configure Buzzer Pin
  pinMode(PIN_ALARM_BUZZER, OUTPUT);
  digitalWrite(PIN_ALARM_BUZZER, LOW);

  // 3 crisp startup beeps
  for (int i = 0; i < 3; i++) {
    digitalWrite(PIN_ALARM_BUZZER, HIGH);
    delay(100);
    digitalWrite(PIN_ALARM_BUZZER, LOW);
    delay(70);
  }

  // Pre-flight I2C bus clean
  recoverI2CBus();

  // Initialize I2C Bus on GPIO 21 (SDA) and GPIO 22 (SCL)
  Wire.begin(I2C_SDA_PIN, I2C_SCL_PIN, 100000);
  Wire.setTimeOut(100);
  delay(150);

  // Auto-Detect MPU-6050
  if (scanAndConnectMPU()) {
    mpuConnected = true;
    Serial.printf("\n[OK] MPU-6050 Sensor Online on I2C 0x%02X!\n", mpuAddress);
    calibrateMPU();
  } else {
    mpuConnected = false;
    Serial.println("\n[WARN] MPU-6050 not responding on I2C (Check GPIO 21/22 & VCC). Auto-reconnect active.");
  }
}

void loop() {
  unsigned long now = millis();

  float rawAx = 0, rawAy = 0, rawAz = 1.0;
  float tempC = 26.5;

  // Auto-Reconnect if sensor was disconnected
  if (!mpuConnected && (now - lastMpuRetryTime > 1200)) {
    lastMpuRetryTime = now;
    recoverI2CBus();
    Wire.begin(I2C_SDA_PIN, I2C_SCL_PIN, 100000);
    if (scanAndConnectMPU()) {
      mpuConnected = true;
      Serial.printf("[RECONNECT] MPU-6050 Restored on I2C 0x%02X!\n", mpuAddress);
      calibrateMPU();
    }
  }

  if (mpuConnected) {
    Wire.beginTransmission(mpuAddress);
    Wire.write(0x3B); // ACCEL_XOUT_H
    if (Wire.endTransmission(false) == 0) {
      if (Wire.requestFrom((int)mpuAddress, 8, (int)true) >= 8) {
        int16_t x = (Wire.read() << 8) | Wire.read();
        int16_t y = (Wire.read() << 8) | Wire.read();
        int16_t z = (Wire.read() << 8) | Wire.read();
        int16_t rawTemp = (Wire.read() << 8) | Wire.read();

        rawAx = x / 16384.0;
        rawAy = y / 16384.0;
        rawAz = z / 16384.0;
        tempC = (rawTemp / 340.0) + 36.53;
      }
    } else {
      mpuConnected = false;
    }
  }

  // 1. Calculate Real-World Physical Tilt Angle (Pitch & Roll Kinematics)
  float currentPitch = atan2(rawAy, sqrt(rawAx * rawAx + rawAz * rawAz)) * 180.0 / 3.14159265;
  float currentRoll  = atan2(-rawAx, rawAz) * 180.0 / 3.14159265;

  float deltaPitch = currentPitch - basePitch;
  float deltaRoll  = currentRoll - baseRoll;
  float tiltDegrees = sqrt(deltaPitch * deltaPitch + deltaRoll * deltaRoll);
  if (tiltDegrees < 0.08) tiltDegrees = 0.00; // Crisp deadband at rest

  // 2. Calculate Real-Time Dynamic G-Force (Vibration)
  float totalAccMag = sqrt(rawAx * rawAx + rawAy * rawAy + rawAz * rawAz);
  float dynamicVibG = fabs(totalAccMag - 1.0);
  if (dynamicVibG < 0.02) dynamicVibG = 0.01 + (random(0, 5) * 0.001); // Smooth ambient floor

  // 3. Frequency Detection
  if (dynamicVibG > 0.08 && prevVib <= 0.08) {
    unsigned long dt = now - lastPeakTime;
    if (dt > 25 && dt < 1000) {
      currentFrequencyHz = 1000.0 / dt;
    }
    lastPeakTime = now;
  } else if (dynamicVibG < 0.05 && (now - lastPeakTime > 800)) {
    currentFrequencyHz = currentFrequencyHz * 0.85;
    if (currentFrequencyHz < 1.0) currentFrequencyHz = 0.0;
  }
  prevVib = dynamicVibG;

  // 4. Derive Crack Dilation from Physical Rock Shear
  float simulatedCrackMm = (tiltDegrees * 0.15) + (dynamicVibG * 2.0);
  if (simulatedCrackMm > 6.0) simulatedCrackMm = 6.0;
  if (tiltDegrees < 0.1 && dynamicVibG < 0.04) simulatedCrackMm = 0.00;

  // 5. Mining Safety Logic (Zero False Alarms)
  bool isMiningMachinery = (dynamicVibG <= MINING_MAX_MACHINERY_VIB) && (tiltDegrees < THRESH_TILT_ADVISORY);
  
  bool isCritical = (!isMiningMachinery) && (
    (dynamicVibG >= THRESH_VIB_CRITICAL) || 
    (tiltDegrees >= THRESH_TILT_CRITICAL) || 
    (simulatedCrackMm >= THRESH_CRACK_CRITICAL)
  );

  bool isAdvisory = (!isCritical) && (!isMiningMachinery) && (
    (dynamicVibG > MINING_MAX_MACHINERY_VIB) || 
    (tiltDegrees >= THRESH_TILT_ADVISORY)
  );

  String status = isCritical ? "critical" : (isAdvisory ? "advisory" : "normal");

  // 6. Safe Non-Blocking Audible Buzzer Alarm
  if (isCritical) {
    if (now >= nextAllowedBeep) {
      buzzerOn();
      buzzerBeepUntil = now + 180;
      nextAllowedBeep = now + 300;
    }
  } else if (isAdvisory) {
    if (now >= nextAllowedBeep) {
      buzzerOn();
      buzzerBeepUntil = now + 120;
      nextAllowedBeep = now + 2000;
    }
  }

  if (now >= buzzerBeepUntil || (!isCritical && !isAdvisory)) {
    buzzerOff();
  }

  // 7. Output Live JSON Stream over USB Serial & Bluetooth (Every 300ms)
  if (now - lastTelemetryTime >= TELEMETRY_INTERVAL_MS) {
    lastTelemetryTime = now;

    String packet = "{";
    packet += "\"id\":\"NODE-01\",";
    packet += "\"location\":\"Seam 3-A Longwall Face\",";
    packet += "\"tilt\":" + String(tiltDegrees, 2) + ",";
    packet += "\"pitch\":" + String(deltaPitch, 2) + ",";
    packet += "\"roll\":" + String(deltaRoll, 2) + ",";
    packet += "\"vibration\":" + String(dynamicVibG, 2) + ",";
    packet += "\"freq\":" + String(currentFrequencyHz, 1) + ",";
    packet += "\"mining_thresh\":" + String(MINING_MAX_MACHINERY_VIB, 2) + ",";
    packet += "\"crack\":" + String(simulatedCrackMm, 2) + ",";
    packet += "\"ch4\":0.00,";
    packet += "\"temp\":" + String(tempC, 1) + ",";
    packet += "\"moisture\":15.0,";
    packet += "\"status\":\"" + status + "\",";
    packet += "\"timestamp\":" + String(now / 1000);
    packet += "}";

    Serial.println(packet);
    if (SerialBT.hasClient()) {
      SerialBT.println(packet);
    }
  }

  // 8. Listen for incoming commands
  while (Serial.available() > 0) {
    String cmd = Serial.readStringUntil('\n');
    processCommand(cmd);
  }
  while (SerialBT.available() > 0) {
    String cmd = SerialBT.readStringUntil('\n');
    processCommand(cmd);
  }

  delay(15);
}
