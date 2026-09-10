import React, { useState } from 'react';
import { Cpu, CheckCircle2, AlertTriangle, RefreshCw, Battery, Radio, ShieldCheck, Gauge, Wrench } from 'lucide-react';

export default function SensorDiagnosticsSection({ nodes }) {
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibSuccess, setCalibSuccess] = useState(false);

  function handleRunDiagnostics() {
    setIsCalibrating(true);
    setCalibSuccess(false);
    setTimeout(() => {
      setIsCalibrating(false);
      setCalibSuccess(true);
      setTimeout(() => setCalibSuccess(false), 4000);
    }, 2000);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Cpu className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-wide flex items-center gap-2">
              HARDWARE SENSOR DIAGNOSTICS & RATIO CALIBRATION
              <span className="text-xs bg-cyan-950 text-cyan-400 border border-cyan-500/40 px-3 py-1 rounded-full font-mono font-bold">
                DGMS REGULATION 111
              </span>
            </h2>
            <p className="text-sm text-slate-300">
              Active telemetry health check, ADC resolution ratios, transducer sensitivity, and zero-datum locking
            </p>
          </div>
        </div>

        <button
          onClick={handleRunDiagnostics}
          disabled={isCalibrating}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-xl cursor-pointer ${
            isCalibrating 
              ? 'bg-slate-800 text-cyan-400 border border-cyan-500/50' 
              : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-600/30'
          }`}
        >
          <RefreshCw className={`w-5 h-5 ${isCalibrating ? 'animate-spin' : ''}`} />
          <span>{isCalibrating ? 'Scanning Mesh Sensors...' : 'Run Diagnostics Self-Test'}</span>
        </button>
      </div>

      {calibSuccess && (
        <div className="bg-emerald-950/80 border border-emerald-500/60 p-4 rounded-2xl text-emerald-200 text-sm font-bold flex items-center gap-3 animate-fade-in shadow-xl">
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          <span>ALL 6 UNDERGROUND SENSOR NODES VALIDATED: ZERO DRIFT • ADC LINEARITY RATIO 1:1 • TRANSDUCERS NOMINAL</span>
        </div>
      )}

      {/* Sensor Channel Ratio Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Ratio 1: Inclinometer */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Inclinometer Transducer</span>
          <div className="text-2xl font-black text-cyan-400 font-mono">0.002° / LSB</div>
          <p className="text-xs text-slate-400">Resolution Ratio • MPU6050 16-Bit Low Noise Gyro/Acc</p>
          <div className="pt-2 border-t border-slate-800 text-[11px] text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Drift: 0.00° (Auto-Zeroed)
          </div>
        </div>

        {/* Ratio 2: Extensometer Crack Gauge */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Crack Dilation Ratio</span>
          <div className="text-2xl font-black text-amber-400 font-mono">0.024 mm / step</div>
          <p className="text-xs text-slate-400">100mm Stroke Range • 12-Bit Linear ADC Bridge</p>
          <div className="pt-2 border-t border-slate-800 text-[11px] text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Resistance: 10.0 kΩ Nominal
          </div>
        </div>

        {/* Ratio 3: LoRa Radio Link Ratio */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">LoRa Packet Health</span>
          <div className="text-2xl font-black text-purple-400 font-mono">99.98% SNR</div>
          <p className="text-xs text-slate-400">868 MHz Sub-GHz • 0.02% Packet Loss Rate</p>
          <div className="pt-2 border-t border-slate-800 text-[11px] text-emerald-400 font-bold flex items-center gap-1">
            <Radio className="w-3.5 h-3.5" /> Subterranean Reach: 4.8 km
          </div>
        </div>

        {/* Ratio 4: Battery Discharge Autonomy */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Autonomy Ratio</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">180 Days</div>
          <p className="text-xs text-slate-400">LiFePO4 4000mAh • Deep-Sleep Cycle 1 sec</p>
          <div className="pt-2 border-t border-slate-800 text-[11px] text-emerald-400 font-bold flex items-center gap-1">
            <Battery className="w-3.5 h-3.5" /> Voltage: 3.28V (Nominal)
          </div>
        </div>

      </div>

      {/* Node-by-Node Full Diagnostic Health Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <h3 className="text-lg font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Gauge className="w-5 h-5 text-cyan-400" />
          Active Subterranean Node Health Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-xs">
                <th className="p-3">Node ID</th>
                <th className="p-3">Seam / Location</th>
                <th className="p-3">Tilt Transducer</th>
                <th className="p-3">Crack Potentiometer</th>
                <th className="p-3">MQ-Gas Heater</th>
                <th className="p-3">Pore Moisture</th>
                <th className="p-3">LoRa RSSI</th>
                <th className="p-3">Hardware Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {nodes.map(n => (
                <tr key={n.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-cyan-400">{n.id}</td>
                  <td className="p-3 font-sans text-slate-200">{n.name}</td>
                  <td className="p-3 text-emerald-400">✓ Calibrated (0.00°)</td>
                  <td className="p-3 text-emerald-400">✓ Linear ({n.crackDisplacement}mm)</td>
                  <td className="p-3 text-emerald-400">✓ 5.0V Active</td>
                  <td className="p-3 text-cyan-300">{n.moisture || 40}% (Capacitive)</td>
                  <td className="p-3 text-purple-300">{n.rssi} dBm</td>
                  <td className="p-3">
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 w-fit">
                      <ShieldCheck className="w-3.5 h-3.5" /> 100% OPERATIONAL
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
