import React, { useState } from 'react';
import { 
  Settings, 
  Radio, 
  Sliders, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Layers, 
  Key
} from 'lucide-react';
import { DGMS_THRESHOLDS } from '../utils/mockDataStream';

export default function SettingsSection({ 
  thresholds: propThresholds, 
  onUpdateThresholds 
}) {
  const [activeTab, setActiveTab] = useState('thresholds'); // thresholds, lora
  const [thresholds, setThresholds] = useState(propThresholds || { ...DGMS_THRESHOLDS });
  const [savedSuccess, setSavedSuccess] = useState(false);

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
              SYSTEM CONFIGURATION & DGMS SAFETY CONTROLS
              <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded font-mono">
                SAFETY CONSOLE
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              DGMS statutory limit configurations, subterranean LoRa mesh network topology, and sensor calibration
            </p>
          </div>
        </div>

        {/* Navigation sub-tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
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
            <span>LoRa Mesh Network</span>
          </button>
        </div>
      </div>



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
        </div>
      )}
    </div>
  );
}
