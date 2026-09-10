import React, { useState } from 'react';
import { Thermometer, Flame, AlertTriangle, ShieldCheck, Sun, Wind, ArrowUpRight, Gauge, CheckCircle2 } from 'lucide-react';
import { DGMS_THRESHOLDS } from '../utils/mockDataStream';

export default function TemperatureSection({ nodes }) {
  const [selectedNodeId, setSelectedNodeId] = useState('NODE-01');
  const [simTemp, setSimTemp] = useState(null);

  const activeNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];
  const currentTemp = simTemp !== null ? simTemp : (activeNode.temperature || 29.4);

  const isTempCritical = currentTemp >= 45.0; // Spontaneous coal combustion danger
  const isTempAdvisory = currentTemp >= DGMS_THRESHOLDS.TEMP_ADVISORY; // 38°C Wet bulb heat stress

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner - Ultra High Contrast */}
      <div className="bg-[#121e36] border border-cyan-500/40 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
            <Thermometer className="w-9 h-9 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide flex items-center gap-2">
              SUBTERRANEAN TEMPERATURE & HEAT MONITOR
              <span className="text-xs bg-orange-950 text-orange-400 border border-orange-500/50 px-3 py-1 rounded-full font-mono font-bold">
                DGMS CMR 2017
              </span>
            </h2>
            <p className="text-sm text-slate-300 font-medium mt-1">
              Active strata core temperature readings across all underground coal seams • Early detection for spontaneous combustion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-300 font-bold">Select Sensor Station:</span>
          <select
            value={selectedNodeId}
            onChange={(e) => {
              setSelectedNodeId(e.target.value);
              setSimTemp(null);
            }}
            className="bg-[#0b1424] text-orange-400 font-mono text-sm font-black border border-slate-700 px-4 py-2.5 rounded-2xl outline-none cursor-pointer shadow-lg"
          >
            {nodes.map(n => (
              <option key={n.id} value={n.id}>{n.id} - {n.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Temperature Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Giant Main Thermometer Card (5 cols) */}
        <div className={`lg:col-span-5 p-7 rounded-3xl border shadow-2xl flex flex-col justify-between transition-all ${
          isTempCritical 
            ? 'bg-red-950/80 border-red-500 shadow-red-900/50 animate-hazard-pulse' 
            : isTempAdvisory 
            ? 'bg-amber-950/70 border-amber-500' 
            : 'bg-[#15233e] border-slate-700/80'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-slate-300 uppercase tracking-wider">
                ACTIVE STRATA PROBE READING
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-black font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                {activeNode.id}
              </span>
            </div>

            {/* Giant Bold Temperature */}
            <div className="flex items-baseline gap-3 my-4">
              <span className={`text-6xl md:text-7xl font-black font-mono tracking-tight ${
                isTempCritical ? 'text-red-400' : isTempAdvisory ? 'text-amber-400' : 'text-white'
              }`}>
                {currentTemp.toFixed(1)}
              </span>
              <span className="text-3xl font-black text-orange-400">°C</span>
            </div>

            {/* Clear Status Message */}
            <div className="mt-4">
              {isTempCritical ? (
                <div className="bg-red-900/90 border border-red-400 p-4 rounded-2xl text-red-100 text-sm font-bold flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-300 animate-pulse shrink-0" />
                  <span>CRITICAL: SPONTANEOUS COAL COMBUSTION / FIRE RISK! TRIGGER EMERGENCY COOLING!</span>
                </div>
              ) : isTempAdvisory ? (
                <div className="bg-amber-900/90 border border-amber-400 p-4 rounded-2xl text-amber-100 text-sm font-bold flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-300 shrink-0" />
                  <span>ADVISORY: WET-BULB TEMPERATURE EXCEEDS 38°C STATUTORY LIMIT</span>
                </div>
              ) : (
                <div className="bg-emerald-950/80 border border-emerald-500/60 p-4 rounded-2xl text-emerald-200 text-sm font-bold flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <span>STATUTORY SAFE: STRATA THERMAL EQUILIBRIUM WITHIN NORMAL RANGE (26°C - 33°C)</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Hardware Temperature Test Slider */}
          <div className="mt-8 pt-5 border-t border-slate-700/80">
            <div className="flex justify-between text-sm text-slate-300 font-bold mb-2">
              <span>Test Temperature Value:</span>
              <span className="text-orange-400 font-mono font-black text-base">{currentTemp.toFixed(1)}°C</span>
            </div>
            <input
              type="range"
              min="24"
              max="52"
              step="0.5"
              value={currentTemp}
              onChange={(e) => setSimTemp(parseFloat(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer h-2 bg-slate-950 rounded-lg"
            />
            <div className="flex justify-between text-xs text-slate-400 font-mono mt-2 font-bold">
              <span>24°C Surface</span>
              <span className="text-emerald-400">30°C Normal</span>
              <span className="text-amber-400">38°C Advisory</span>
              <span className="text-red-400">45°C Fire Trip</span>
            </div>
          </div>
        </div>

        {/* Breakdown & Geothermal Gradients (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          
          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#15233e] border border-slate-700/80 p-5 rounded-3xl shadow-xl text-center">
              <span className="text-xs font-black text-slate-400 uppercase block mb-1">Wet-Bulb Index</span>
              <span className="text-3xl font-black font-mono text-cyan-400">
                {(currentTemp * 0.88).toFixed(1)}°C
              </span>
              <span className="text-xs text-slate-400 font-medium block mt-1">CMR Limit: 38.0°C</span>
            </div>

            <div className="bg-[#15233e] border border-slate-700/80 p-5 rounded-3xl shadow-xl text-center">
              <span className="text-xs font-black text-slate-400 uppercase block mb-1">Geothermal Gradient</span>
              <span className="text-3xl font-black font-mono text-purple-400">
                +2.8°C
              </span>
              <span className="text-xs text-slate-400 font-medium block mt-1">Per 100m Subterranean</span>
            </div>

            <div className="bg-[#15233e] border border-slate-700/80 p-5 rounded-3xl shadow-xl text-center">
              <span className="text-xs font-black text-slate-400 uppercase block mb-1">Exhaust Heat Dissipation</span>
              <span className="text-3xl font-black font-mono text-emerald-400">
                420 kW
              </span>
              <span className="text-xs text-slate-400 font-medium block mt-1">Shaft Return Ventilation</span>
            </div>
          </div>

          {/* All Seams Thermal List */}
          <div className="bg-[#15233e] border border-slate-700/80 p-6 rounded-3xl shadow-xl flex-1">
            <h3 className="text-base font-black text-white uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>All Subterranean Seams Live Heat Register</span>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                Sampling: 1000ms
              </span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              {nodes.map(n => {
                const nodeTemp = n.temperature || 28.0;
                const isWarn = nodeTemp >= DGMS_THRESHOLDS.TEMP_ADVISORY;
                const isCrit = nodeTemp >= 45.0;

                return (
                  <div key={n.id} className="bg-[#0e1728] p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
                    <div className="w-28">
                      <span className="font-black text-orange-400 text-sm block">{n.id}</span>
                      <span className="text-[11px] text-slate-400 font-sans">{n.zone}</span>
                    </div>

                    <div className="flex-1 bg-slate-900 rounded-full h-3.5 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCrit ? 'bg-red-500' : isWarn ? 'bg-amber-400' : 'bg-gradient-to-r from-cyan-500 via-emerald-400 to-orange-400'
                        }`}
                        style={{ width: `${Math.min(100, (nodeTemp / 50) * 100)}%` }}
                      />
                    </div>

                    <div className="text-right w-20">
                      <span className={`text-base font-black ${isCrit ? 'text-red-400' : isWarn ? 'text-amber-400' : 'text-white'}`}>
                        {nodeTemp.toFixed(1)}°C
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
