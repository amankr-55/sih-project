/*
  =============================================================================
  GEOSENTINEL - MPU-6050 & HARDWARE DEEP DIAGNOSTIC TOOL
  Team: Green ThinkerX | SIH26025
  =============================================================================
  This sketch performs a 100% thorough hardware diagnostic:
  1. Tests Active Buzzer on GPIO 18
  2. Clears & recovers I2C Bus on GPIO 21 (SDA) and GPIO 22 (SCL)
  3. Scans all 127 I2C addresses to find MPU-6050 (0x68 / 0x69)
  4. Reads WHO_AM_I hardware register
  5. Streams Live Accel X, Y, Z, Real-Time Tilt Angle, and Vibration
  =============================================================================
*/

#include <Wire.h>

#define PIN_SDA    21
#define PIN_SCL    22
#define PIN_BUZZER 18

uint8_t detectedAddr = 0;
bool sensorFound = false;

// I2C Bus Recovery
void clearI2CBus() {
  pinMode(PIN_SDA, INPUT_PULLUP);
  pinMode(PIN_SCL, OUTPUT);
  for (int i = 0; i < 10; i++) {
    digitalWrite(PIN_SCL, LOW);
    delayMicroseconds(10);
    digitalWrite(PIN_SCL, HIGH);
    delayMicroseconds(10);
  }
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n=======================================================");
  Serial.println("   GEOSENTINEL HARDWARE DEEP DIAGNOSTIC CHECK");
  Serial.println("=======================================================");

  // 1. Test Buzzer
  pinMode(PIN_BUZZER, OUTPUT);
  Serial.println("[TEST 1/4] Testing Buzzer on GPIO 18...");
  digitalWrite(PIN_BUZZER, HIGH);
  delay(150);
  digitalWrite(PIN_BUZZER, LOW);
  delay(80);
  digitalWrite(PIN_BUZZER, HIGH);
  delay(150);
  digitalWrite(PIN_BUZZER, LOW);
  Serial.println("   -> Buzzer Test Complete! (Did you hear 2 beeps?)");

  // 2. Clear I2C Bus
  Serial.println("\n[TEST 2/4] Resetting & Clearing I2C Bus...");
  clearI2CBus();
  Wire.begin(PIN_SDA, PIN_SCL, 100000);
  Wire.setTimeOut(200);
  delay(200);

  // 3. Scan I2C Addresses
  Serial.println("\n[TEST 3/4] Scanning I2C Bus for MPU-6050 (0x68 / 0x69)...");
  int count = 0;
  for (uint8_t addr = 1; addr < 127; addr++) {
    Wire.beginTransmission(addr);
    byte err = Wire.endTransmission();
    if (err == 0) {
      Serial.printf("   [FOUND] I2C Device detected at address: 0x%02X (%d)\n", addr, addr);
      if (addr == 0x68 || addr == 0x69) {
        detectedAddr = addr;
        sensorFound = true;
      }
      count++;
    }
  }

  if (count == 0) {
    Serial.println("   [ERROR] NO I2C DEVICES FOUND!");
    Serial.println("   -> Check VCC wire (Try connecting to 5V/VIN or 3.3V)");
    Serial.println("   -> Check GND wire");
    Serial.println("   -> Check SDA -> GPIO 21");
    Serial.println("   -> Check SCL -> GPIO 22");
    return;
  }

  if (!sensorFound) {
    Serial.println("   [WARN] I2C device found but not at 0x68/0x69. Using first found device...");
    detectedAddr = 0x68;
  }

  // 4. Initialize MPU & Wake up
  Serial.printf("\n[TEST 4/4] Initializing MPU at 0x%02X...\n", detectedAddr);
  
  // Wake up
  Wire.beginTransmission(detectedAddr);
  Wire.write(0x6B); // PWR_MGMT_1
  Wire.write(0x00); // Wake up
  byte res = Wire.endTransmission();

  if (res == 0) {
    Serial.println("   -> Power Management 0x6B: WAKE UP SUCCESS!");
  } else {
    Serial.printf("   -> Power Management Failed (Error code: %d)\n", res);
  }

  // Read WHO_AM_I (0x75)
  Wire.beginTransmission(detectedAddr);
  Wire.write(0x75);
  Wire.endTransmission(false);
  Wire.requestFrom((int)detectedAddr, 1);
  if (Wire.available()) {
    byte who = Wire.read();
    Serial.printf("   -> WHO_AM_I Register: 0x%02X ", who);
    if (who == 0x68) Serial.println("(Genuine MPU-6050)");
    else if (who == 0x70 || who == 0x72) Serial.println("(MPU-6500 Compatible)");
    else Serial.printf("(Device ID: 0x%02X)\n", who);
  }

  // Configure +/- 2g and DLPF
  Wire.beginTransmission(detectedAddr);
  Wire.write(0x1A); // CONFIG
  Wire.write(0x03); // 44Hz DLPF
  Wire.endTransmission();

  Wire.beginTransmission(detectedAddr);
  Wire.write(0x1C); // ACCEL_CONFIG
  Wire.write(0x00); // +/- 2g
  Wire.endTransmission();

  Serial.println("\n=======================================================");
  Serial.println("   LIVE STREAMING SENSOR DATA (Tilt Sensor to test!)");
  Serial.println("=======================================================\n");
}

void loop() {
  if (detectedAddr == 0) {
    delay(1000);
    return;
  }

  Wire.beginTransmission(detectedAddr);
  Wire.write(0x3B); // ACCEL_XOUT_H
  if (Wire.endTransmission(false) == 0) {
    if (Wire.requestFrom((int)detectedAddr, 6, (int)true) >= 6) {
      int16_t rawX = (Wire.read() << 8) | Wire.read();
      int16_t rawY = (Wire.read() << 8) | Wire.read();
      int16_t rawZ = (Wire.read() << 8) | Wire.read();

      float ax = rawX / 16384.0;
      float ay = rawY / 16384.0;
      float az = rawZ / 16384.0;

      // Calculate approximate tilt in degrees from vertical Z
      float pitch = atan2(ay, sqrt(ax * ax + az * az)) * 180.0 / 3.14159;
      float roll  = atan2(-ax, az) * 180.0 / 3.14159;
      float totalTilt = sqrt(pitch * pitch + roll * roll);

      // Total G-force magnitude
      float totalG = sqrt(ax * ax + ay * ay + az * az);
      float vibG = fabs(totalG - 1.0);

      Serial.printf("[LIVE] Accel: X=%.2fg  Y=%.2fg  Z=%.2fg | Tilt: %.2f deg | Vib: %.2fg\n",
                    ax, ay, az, totalTilt, vibG);

      // If tilted more than 15 degrees, trigger a short test beep
      if (totalTilt > 15.0 || vibG > 0.4) {
        digitalWrite(PIN_BUZZER, HIGH);
        delay(40);
        digitalWrite(PIN_BUZZER, LOW);
      }
    }
  } else {
    Serial.println("[ERR] Failed to read from MPU-6050! Checking wires...");
    clearI2CBus();
    delay(500);
  }

  delay(200);
}
