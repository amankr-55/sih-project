/*
 ============================================================================
  GEOSENTINEL - 2-PIN HARDWARE BUZZER DIAGNOSTIC TEST (SIH26025)
  Team: Green ThinkerX | Author: Aman Kumar
  Platform: ESP32 DevKit V1 (30-Pin)

  USE THIS SIMPLE TEST SKETCH TO VERIFY YOUR PHYSICAL 2-PIN BUZZER:
  1. Buzzer (+) (Long Leg / '+' sign on sticker) -> ESP32 GPIO 18 (Pin D18)
  2. Buzzer (-) (Short Leg)                      -> ESP32 GND
  
  Baud Rate: 115200
 ============================================================================
*/

#define PIN_BUZZER_PRIMARY   18   // Default: GPIO 18 (D18)
#define PIN_BUZZER_ALT       4    // Alternate test pin: GPIO 4 (D4)

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n=======================================================");
  Serial.println("   GEOSENTINEL 2-PIN PHYSICAL BUZZER DIAGNOSTIC TEST   ");
  Serial.println("=======================================================");
  Serial.println("Testing Pin GPIO 18 (D18) and GPIO 4 (D4)...");
  Serial.println("WIRING INSTRUCTIONS:");
  Serial.println("  1. Buzzer (+) Long leg -> GPIO 18 (or D18)");
  Serial.println("  2. Buzzer (-) Short leg -> GND");
  Serial.println("=======================================================\n");

  pinMode(PIN_BUZZER_PRIMARY, OUTPUT);
  pinMode(PIN_BUZZER_ALT, OUTPUT);

  // 3 Fast Startup Beeps
  Serial.println("[TEST] 3 Quick Beeps on GPIO 18...");
  for (int i = 0; i < 3; i++) {
    digitalWrite(PIN_BUZZER_PRIMARY, HIGH);
    digitalWrite(PIN_BUZZER_ALT, HIGH);
    delay(150);
    digitalWrite(PIN_BUZZER_PRIMARY, LOW);
    digitalWrite(PIN_BUZZER_ALT, LOW);
    delay(100);
  }
  delay(1000);
}

void loop() {
  Serial.println("[CYCLE] 1. HIGH (BEEP ON) for 1 second...");
  digitalWrite(PIN_BUZZER_PRIMARY, HIGH);
  digitalWrite(PIN_BUZZER_ALT, HIGH);
  delay(1000);

  Serial.println("[CYCLE] 2. LOW (SILENT) for 1 second...");
  digitalWrite(PIN_BUZZER_PRIMARY, LOW);
  digitalWrite(PIN_BUZZER_ALT, LOW);
  delay(1000);

  Serial.println("[CYCLE] 3. Triple Rapid Emergency Alarm Pulse...");
  for (int i = 0; i < 3; i++) {
    digitalWrite(PIN_BUZZER_PRIMARY, HIGH);
    digitalWrite(PIN_BUZZER_ALT, HIGH);
    delay(120);
    digitalWrite(PIN_BUZZER_PRIMARY, LOW);
    digitalWrite(PIN_BUZZER_ALT, LOW);
    delay(80);
  }
  delay(1500);
}
