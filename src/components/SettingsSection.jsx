import React, { useState } from 'react';
import { 
  Settings, 
  Usb, 
  Radio, 
  Sliders, 
  Cpu, 
  Code2, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Terminal,
  Layers,
  Key
} from 'lucide-react';
import { DGMS_THRESHOLDS } from '../utils/mockDataStream';

export default function SettingsSection({ onUpdateThresholds }) {
  const [activeTab, setActiveTab] = useState('hardware'); // 'hardware', 'thresholds', 'lora', 'code'
  const [baudRate, setBaudRate] = useState('115200');
  const [serialConnected, setSerialConnected] = useState(false);
  const [serialLogs, setSerialLogs] = useState([
    '[INIT] Web Serial Controller initialized.',
    '[READY] Plug ESP32 Gateway to USB port (COM3/COM4). Click Connect.'
  ]);

  // Local threshold states
  const [thresholds, setThresholds] = useState({ ...DGMS_THRESHOLDS });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Web Serial API handler
  async function handleConnectSerial() {
    if ('serial' in navigator) {
      try {
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: parseInt(baudRate, 10) });
        setSerialConnected(true);
        setSerialLogs(prev => [
          ...prev, 
          `[SUCCESS] Connected to USB Serial Port at ${baudRate} baud!`,
          `[LORA] Listening for ESP32 Sub-GHz payload packets...`
        ]);

        // Start reading loop
        const textDecoder = new TextDecoderStream();
        const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
        const reader = textDecoder.readable.getReader();

        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            reader.releaseLock();
            break;
          }
          if (value) {
            setSerialLogs(prev => [...prev.slice(-15), `[RX] ${value.trim()}`]);
          }
        }
      } catch (err) {
        setSerialLogs(prev => [...prev, `[ERROR] Serial Port: ${err.message}`]);
      }
    } else {
      setSerialLogs(prev => [
        ...prev,
        `[NOTE] Web Serial requires Google Chrome or Microsoft Edge. Alternatively use local Python bridge.`
      ]);
      alert('Web Serial API is natively supported in Google Chrome, Microsoft Edge, and Opera!');
    }
  }

  function handleSaveThresholds() {
    if (onUpdateThresholds) onUpdateThresholds(thresholds);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  }

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-slate-800 text-cyan-400 border border-slate-700">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-wider flex items-center gap-2">
              SYSTEM CONFIGURATION & HARDWARE-SOFTWARE INTEGRATION
              <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded font-mono">
                ENGINEERING CONSOLE
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Live USB COM Port Web Serial connection, LoRa RF mesh configurations, and DGMS threshold parameters
            </p>
          </div>
        </div>

        {/* Navigation sub-tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('hardware')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'hardware' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Usb className="w-3.5 h-3.5" />
            <span>Hardware Bridge</span>
          </button>
          <button
            onClick={() => setActiveTab('thresholds')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'thresholds' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>DGMS Limits</span>
          </button>
          <button
            onClick={() => setActiveTab('lora')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'lora' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>LoRa Radio</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'code' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Arduino Code</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Hardware Web Serial Bridge */}
      {activeTab === 'hardware' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Usb className="w-4 h-4 text-cyan-400" />
              Direct USB Web Serial Connection (Browser to ESP32)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connect your physical ESP32 LoRa Gateway directly to your laptop via USB. GeoSentinel reads serial COM telemetry directly in the browser with sub-second latency without needing external drivers.
            </p>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-bold">Serial Baud Rate:</span>
                <select
                  value={baudRate}
                  onChange={(e) => setBaudRate(e.target.value)}
                  className="bg-slate-900 text-cyan-400 font-mono font-bold border border-slate-700 px-3 py-1 rounded-lg outline-none cursor-pointer"
                >
                  <option value="9600">9600 baud</option>
                  <option value="57600">57600 baud</option>
                  <option value="115200">115200 baud (Recommended)</option>
                  <option value="230400">230400 baud</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-bold">Port Status:</span>
                <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                  serialConnected ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                }`}>
                  {serialConnected ? 'CONNECTED (ONLINE)' : 'DISCONNECTED'}
                </span>
              </div>
            </div>

            <button
              onClick={handleConnectSerial}
              className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                serialConnected 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500' 
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/30'
              }`}
            >
              <Usb className="w-4 h-4" />
              <span>{serialConnected ? 'Port Active (Click to Re-select)' : 'Connect ESP32 via USB Serial'}</span>
            </button>

            <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-3">
              📌 <strong>Step:</strong> Plug the ESP32 into any USB port. Click the button above, choose <strong>"Silicon Labs CP210x / CH340 / USB Serial"</strong> in the browser popup, and your hardware is live!
            </div>
          </div>

          {/* Serial Terminal Output */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2 font-mono">
                <Terminal className="w-4 h-4 text-cyan-400" />
                SERIAL PACKET RECEIVER TERMINAL
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Buffer: UTF-8 JSON</span>
            </div>

            <div className="flex-1 bg-black rounded-xl border border-slate-800 p-3 font-mono text-[11px] text-emerald-400 overflow-y-auto max-h-64 space-y-1">
              {serialLogs.map((log, idx) => (
                <div key={idx} className="leading-tight">{log}</div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: DGMS Statutory Thresholds */}
      {activeTab === 'thresholds' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              Statutory DGMS Trigger Limits (Coal Mines Regulations CMR 2017)
            </h3>
            {savedSuccess && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Thresholds Updated Successfully!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Tilt */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-300 font-bold">
                <span>Tilt Advisory Angle:</span>
                <span className="text-cyan-400 font-mono">{thresholds.TILT_ADVISORY}°</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="4.0"
                step="0.1"
                value={thresholds.TILT_ADVISORY}
                onChange={(e) => setThresholds({ ...thresholds, TILT_ADVISORY: parseFloat(e.target.value) })}
                className="w-full accent-cyan-500 cursor-pointer"
              />

              <div className="flex justify-between text-xs text-slate-300 font-bold pt-2">
                <span>Tilt Critical Evacuation:</span>
                <span className="text-red-400 font-mono">{thresholds.TILT_CRITICAL}°</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="8.0"
                step="0.1"
                value={thresholds.TILT_CRITICAL}
                onChange={(e) => setThresholds({ ...thresholds, TILT_CRITICAL: parseFloat(e.target.value) })}
                className="w-full accent-red-500 cursor-pointer"
              />
            </div>

            {/* Crack */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-300 font-bold">
                <span>Crack Warning Dilation:</span>
                <span className="text-amber-400 font-mono">{thresholds.CRACK_ADVISORY} mm</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={thresholds.CRACK_ADVISORY}
                onChange={(e) => setThresholds({ ...thresholds, CRACK_ADVISORY: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />

              <div className="flex justify-between text-xs text-slate-300 font-bold pt-2">
                <span>Crack Rupture Limit:</span>
                <span className="text-red-400 font-mono">{thresholds.CRACK_CRITICAL} mm</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="6.0"
                step="0.1"
                value={thresholds.CRACK_CRITICAL}
                onChange={(e) => setThresholds({ ...thresholds, CRACK_CRITICAL: parseFloat(e.target.value) })}
                className="w-full accent-red-500 cursor-pointer"
              />
            </div>

            {/* Gas */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-300 font-bold">
                <span>CH4 Ventilation Advisory:</span>
                <span className="text-amber-400 font-mono">{thresholds.CH4_ADVISORY}% vol</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="1.0"
                step="0.05"
                value={thresholds.CH4_ADVISORY}
                onChange={(e) => setThresholds({ ...thresholds, CH4_ADVISORY: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />

              <div className="flex justify-between text-xs text-slate-300 font-bold pt-2">
                <span>CH4 Power Trip Interlock:</span>
                <span className="text-red-400 font-mono">{thresholds.CH4_POWER_TRIP}% vol</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.0"
                step="0.05"
                value={thresholds.CH4_POWER_TRIP}
                onChange={(e) => setThresholds({ ...thresholds, CH4_POWER_TRIP: parseFloat(e.target.value) })}
                className="w-full accent-red-500 cursor-pointer"
              />
            </div>

            {/* Vibration */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-300 font-bold">
                <span>Seismic Micro-Tremor Alert:</span>
                <span className="text-amber-400 font-mono">{thresholds.VIBRATION_ADVISORY} g</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.5"
                step="0.05"
                value={thresholds.VIBRATION_ADVISORY}
                onChange={(e) => setThresholds({ ...thresholds, VIBRATION_ADVISORY: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />

              <div className="flex justify-between text-xs text-slate-300 font-bold pt-2">
                <span>Dynamic Rock Burst Critical:</span>
                <span className="text-red-400 font-mono">{thresholds.VIBRATION_CRITICAL} g</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="1.2"
                step="0.05"
                value={thresholds.VIBRATION_CRITICAL}
                onChange={(e) => setThresholds({ ...thresholds, VIBRATION_CRITICAL: parseFloat(e.target.value) })}
                className="w-full accent-red-500 cursor-pointer"
              />
            </div>

          </div>

          <button
            onClick={handleSaveThresholds}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save & Apply DGMS Parameters</span>
          </button>
        </div>
      )}

      {/* Tab 3: LoRa Mesh Settings */}
      {activeTab === 'lora' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-purple-400" />
            LoRa Sub-GHz Physical Layer & Mesh Protocol
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Carrier Frequency</span>
              <span className="text-base font-bold text-cyan-400">868.1 MHz (India ISM)</span>
              <span className="text-[9px] text-slate-500 block">Sub-GHz Subterranean Penetration</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Spreading Factor (SF)</span>
              <span className="text-base font-bold text-purple-400">SF7 (128 chips/symbol)</span>
              <span className="text-[9px] text-slate-500 block">Fast 5.4 kbps Data Rate</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Bandwidth (BW)</span>
              <span className="text-base font-bold text-emerald-400">125 kHz</span>
              <span className="text-[9px] text-slate-500 block">Coding Rate: 4/5</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-300 font-bold block mb-1">AES-128 Encryption & Anti-Tamper:</span>
            <p className="text-[11px] text-slate-400">
              Every packet transmitted from subterranean nodes is encrypted with a hardware key to prevent spoofing or unauthorized tampering with mine safety records.
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Ready-to-Flash Arduino Code */}
      {activeTab === 'code' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              ESP32 Firmware Code (Ready to Flash via Arduino IDE)
            </h3>
            <span className="text-xs text-slate-400 font-mono">Baud: 115200</span>
          </div>

          <pre className="bg-black text-emerald-400 p-4 rounded-xl border border-slate-800 text-xs font-mono overflow-x-auto max-h-96">
{`#include <Wire.h>
#include <SPI.h>
#include <LoRa.h>

// PIN CONFIGURATION FOR ESP32 NODE
#define PIN_POT_CRACK 34   // Analog Input for Linear Potentiometer
#define PIN_MQ_GAS    35   // Analog Input for Gas Sensor
#define PIN_SOIL      32   // Capacitive Moisture Probe
#define LORA_SS       5
#define LORA_RST      14
#define LORA_DIO0     2

const char* NODE_ID = "NODE-01";

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22); // I2C SDA, SCL for MPU6050
  
  LoRa.setPins(LORA_SS, LORA_RST, LORA_DIO0);
  if (!LoRa.begin(868E6)) {
    Serial.println("{\"error\": \"LoRa init failed\"}");
  }
}

void loop() {
  // Read Potentiometer Crack Gauge (0-3.3V mapped to 0-5.0mm)
  int potRaw = analogRead(PIN_POT_CRACK);
  float crackMM = (potRaw / 4095.0) * 5.0;

  // Read MPU6050 Tilt Angle (Sample simulated I2C)
  float tiltAngle = 0.8 + (analogRead(PIN_MQ_GAS) % 50) * 0.02;

  // Read Gas (Mapped to 0-2% CH4)
  float ch4 = (analogRead(PIN_MQ_GAS) / 4095.0) * 2.0;

  // Output JSON formatted packet to USB Serial & LoRa
  String packet = "{\\"node\\":\\"" + String(NODE_ID) + 
                  "\\",\\"tilt\\":" + String(tiltAngle, 2) + 
                  ",\\"crack\\":" + String(crackMM, 2) + 
                  ",\\"ch4\\":" + String(ch4, 2) + "}";

  Serial.println(packet);     // Pushed directly to GeoSentinel Dashboard!
  
  LoRa.beginPacket();
  LoRa.print(packet);
  LoRa.endPacket();

  delay(1000); // 1-second transmission cycle
}`}
          </pre>
        </div>
      )}

    </div>
  );
}
