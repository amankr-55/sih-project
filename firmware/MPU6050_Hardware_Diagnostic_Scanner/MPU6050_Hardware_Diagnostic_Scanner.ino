/*
 ============================================================================
  GEOSENTINEL - MPU-6050 I2C HARDWARE DIAGNOSTIC & WIRING SCANNER (SIH26025)
  Team: Green ThinkerX | Author: Aman Kumar
  Platform: ESP32 DevKit V1 (30-Pin)
  
  HOW TO WIRE MPU-6050 TO ESP32:
    1. VCC -> ESP32 3.3V (or VIN/5V if GY-521 board has a 3.3V regulator)
    2. GND -> ESP32 GND
    3. SCL -> ESP32 GPIO 22 (Pin D22)
    4. SDA -> ESP32 GPIO 21 (Pin D21)
    5. AD0 -> ESP32 GND (Fixes I2C address to 0x68)
  
  Baud Rate: 115200
 ============================================================================
*/

#include <Wire.h>

#define I2C_SDA_PIN 21
#define I2C_SCL_PIN 22

uint8_t targetAddress = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n=======================================================");
  Serial.println("     GEOSENTINEL MPU-6050 I2C HARDWARE DIAGNOSTIC      ");
  Serial.println("=======================================================");
  Serial.println("Configuring I2C Bus: SDA = GPIO 21, SCL = GPIO 22...");

  Wire.begin(I2C_SDA_PIN, I2C_SCL_PIN, 100000);
  Wire.setTimeOut(250);
  delay(200);
}

void scanI2C() {
  Serial.println("\n[SCAN] Scanning all 127 I2C bus addresses...");
  byte count = 0;
  targetAddress = 0;

  for (byte address = 1; address < 127; address++) {
    Wire.beginTransmission(address);
    byte error = Wire.endTransmission();

    if (error == 0) {
      Serial.printf("  -> [FOUND] I2C Device detected at address 0x%02X!\n", address);
      if (address == 0x68 || address == 0x69) {
        targetAddress = address;
        Serial.printf("     *** MATCH: MPU-6050 Gyro/Accel confirmed on 0x%02X ***\n", address);
      }
      count++;
    } else if (error == 4) {
      Serial.printf("  -> [ERROR] Unknown error at address 0x%02X\n", address);
    }
  }

  if (count == 0) {
    Serial.println("\n[FAILED] No I2C devices found on bus!");
    Serial.println("WIRING TROUBLESHOOTING CHECKLIST:");
    Serial.println("  1. Check VCC / GND wires (Is the red power LED glowing on GY-521?)");
    Serial.println("  2. Check SCL wire -> Must connect to ESP32 Pin D22 (GPIO 22)");
    Serial.println("  3. Check SDA wire -> Must connect to ESP32 Pin D21 (GPIO 21)");
    Serial.println("  4. Check AD0 wire -> Connect to GND (fixes address to 0x68)");
  } else if (targetAddress != 0) {
    Wire.beginTransmission(targetAddress);
    Wire.write(0x6B);
    Wire.write(0x00);
    byte wakeErr = Wire.endTransmission();
    if (wakeErr == 0) {
      Serial.println("[SUCCESS] MPU-6050 Wake-up command accepted!");
    } else {
      Serial.println("[WARN] MPU-6050 wake command failed.");
    }
  }
}

void loop() {
  if (targetAddress == 0) {
    scanI2C();
    delay(2000);
    return;
  }

  Wire.beginTransmission(targetAddress);
  Wire.write(0x3B);
  if (Wire.endTransmission(false) == 0) {
    if (Wire.requestFrom((int)targetAddress, 8, (int)true) >= 8) {
      int16_t rawX = (Wire.read() << 8) | Wire.read();
      int16_t rawY = (Wire.read() << 8) | Wire.read();
      int16_t rawZ = (Wire.read() << 8) | Wire.read();
      int16_t rawTemp = (Wire.read() << 8) | Wire.read();

      float ax = rawX / 16384.0;
      float ay = rawY / 16384.0;
      float az = rawZ / 16384.0;
      float tempC = (rawTemp / 340.0) + 36.53;
      float gMagnitude = sqrt(ax * ax + ay * ay + az * az);

      Serial.printf("[LIVE 0x%02X] Accel X: %+1.2fg | Y: %+1.2fg | Z: %+1.2fg | Total: %1.2fg | Temp: %2.1fC\n",
                    targetAddress, ax, ay, az, gMagnitude, tempC);
    } else {
      Serial.println("[READ ERROR] Wire requestFrom returned fewer than 8 bytes.");
      targetAddress = 0;
    }
  } else {
    Serial.println("[BUS ERROR] MPU-6050 I2C transmission failed. Re-scanning...");
    targetAddress = 0;
  }

  delay(400);
}
