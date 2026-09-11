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
    <div className="space-y-6 animate-fade-in text-white">
      
      {/* Header Banner - Ultra High Contrast & Brightness */}
      <div className="bg-[#152238] border-2 border-orange-500/50 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-orange-500/30 text-orange-300 border-2 border-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.5)]">
            <Thermometer className="w-10 h-10 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide flex flex-wrap items-center gap-3">
              <span>SUBTERRANEAN TEMPERATURE & STRATA HEAT MONITOR</span>
              <span className="text-xs bg-orange-500 text-slate-950 font-black px-3.5 py-1 rounded-full uppercase">
                DGMS CMR 2017 MANDATE
              </span>
            </h2>
            <p className="text-base text-slate-100 font-bold mt-1">
              Deep borehole rock temperature sensors • Continuous thermal equilibrium & spontaneous coal fire detection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#0f192b] p-2.5 rounded-2xl border border-slate-700 shadow-lg">
          <span className="text-sm text-white font-black">Station:</span>
          <select
            value={selectedNodeId}
            onChange={(e) => {
              setSelectedNodeId(e.target.value);
              setSimTemp(null);
            }}
            className="bg-[#16233d] text-orange-300 font-mono text-sm font-black border border-orange-500/50 px-4 py-2 rounded-xl outline-none cursor-pointer shadow-md"
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
        <div className={`lg:col-span-5 p-7 rounded-3xl border-2 shadow-2xl flex flex-col justify-between transition-all ${
          isTempCritical 
            ? 'bg-red-950/90 border-red-500 shadow-red-900/50 animate-hazard-pulse' 
            : isTempAdvisory 
            ? 'bg-amber-950/80 border-amber-500 shadow-amber-900/40' 
            : 'bg-[#132240] border-slate-600/80 shadow-2xl'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-black text-white uppercase tracking-wider font-mono">
                CURRENT STRATA PROBE READING
              </span>
              <span className="px-3.5 py-1.5 rounded-xl text-sm font-black font-mono bg-cyan-500 text-slate-950 shadow">
                {activeNode.id}
              </span>
            </div>

            {/* Giant Bold Temperature Gauge */}
            <div className="flex items-baseline gap-3 my-5">
              <span className={`text-6xl sm:text-7xl font-black font-mono tracking-tight ${
                isTempCritical ? 'text-red-400 animate-pulse' : isTempAdvisory ? 'text-amber-300' : 'text-white'
              }`}>
                {currentTemp.toFixed(1)}
              </span>
              <span className="text-4xl font-black text-orange-400">°C</span>
            </div>

            {/* High-Contrast Status Banner */}
            <div className="mt-4">
              {isTempCritical ? (
                <div className="bg-red-900 border-2 border-red-400 p-4 rounded-2xl text-white text-base font-black flex items-center gap-3 shadow-lg">
                  <AlertTriangle className="w-7 h-7 text-red-300 animate-pulse shrink-0" />
                  <span>CRITICAL HAZARD: Spontaneous Combustion / Coal Fire Imminent! Engage Emergency Nitrogen Infusion!</span>
                </div>
              ) : isTempAdvisory ? (
                <div className="bg-amber-900 border-2 border-amber-400 p-4 rounded-2xl text-white text-base font-black flex items-center gap-3 shadow-lg">
                  <AlertTriangle className="w-7 h-7 text-amber-300 shrink-0" />
                  <span>DGMS ADVISORY: Strata Wet-Bulb Exceeds 38.0°C Limit. Boost Face Ventilation Velocity!</span>
                </div>
              ) : (
                <div className="bg-emerald-950 border-2 border-emerald-500 p-4 rounded-2xl text-emerald-100 text-base font-black flex items-center gap-3 shadow-lg">
                  <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" />
                  <span>STATUTORY SAFE: Subterranean Thermal Equilibrium Normal (Optimal range 26°C - 33°C)</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Hardware Temperature Test Slider */}
          <div className="mt-8 pt-5 border-t border-slate-700">
            <div className="flex justify-between text-base text-white font-black mb-2">
              <span>Simulate / Test Temperature:</span>
              <span className="text-orange-300 font-mono font-black text-lg bg-[#0b1424] px-3 py-0.5 rounded-lg border border-orange-500/40">
                {currentTemp.toFixed(1)}°C
              </span>
            </div>
            <input
              type="range"
              min="24"
              max="52"
              step="0.5"
              value={currentTemp}
              onChange={(e) => setSimTemp(parseFloat(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer h-3 bg-slate-900 rounded-lg"
            />
            <div className="flex justify-between text-xs text-white font-mono mt-2 font-black">
              <span>24°C Surface</span>
              <span className="text-emerald-400">30°C Normal</span>
              <span className="text-amber-400">38°C Advisory</span>
              <span className="text-red-400">45°C Fire Trip</span>
            </div>
          </div>
        </div>

        {/* Breakdown & Geothermal Gradients (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          
          {/* 3 Metric Cards - High Visibility */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="bg-[#132240] border-2 border-slate-600/80 p-5 rounded-3xl shadow-2xl text-center">
              <span className="text-xs font-black text-cyan-300 uppercase block mb-1">Wet-Bulb Index</span>
              <span className="text-4xl font-black font-mono text-cyan-300">
                {(currentTemp * 0.88).toFixed(1)}°C
              </span>
              <span className="text-xs text-slate-200 font-bold block mt-1">DGMS Max Limit: 38.0°C</span>
            </div>

            <div className="bg-[#132240] border-2 border-slate-600/80 p-5 rounded-3xl shadow-2xl text-center">
              <span className="text-xs font-black text-purple-300 uppercase block mb-1">Geothermal Gradient</span>
              <span className="text-4xl font-black font-mono text-purple-300">
                +2.8°C
              </span>
              <span className="text-xs text-slate-200 font-bold block mt-1">Per 100m Subterranean Depth</span>
            </div>

            <div className="bg-[#132240] border-2 border-slate-600/80 p-5 rounded-3xl shadow-2xl text-center">
              <span className="text-xs font-black text-emerald-300 uppercase block mb-1">Ventilation Heat Purge</span>
              <span className="text-4xl font-black font-mono text-emerald-300">
                420 kW
              </span>
              <span className="text-xs text-slate-200 font-bold block mt-1">Main Return Shaft CFM</span>
            </div>

          </div>

          {/* All Seams Thermal List */}
          <div className="bg-[#132240] border-2 border-slate-600/80 p-6 rounded-3xl shadow-2xl flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" />
                ALL SUBTERRANEAN SENSOR STATIONS LIVE HEAT REGISTER
              </h3>
              <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950 px-3 py-1 rounded-xl border border-cyan-500/40">
                Real-Time Sampling
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {nodes.map(n => {
                const nodeTemp = n.temperature || 28.0;
                const isWarn = nodeTemp >= DGMS_THRESHOLDS.TEMP_ADVISORY;
                const isCrit = nodeTemp >= 45.0;

                return (
                  <div key={n.id} className="bg-[#0e172a] p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-4 shadow">
                    <div className="w-32">
                      <span className="font-black text-orange-300 text-sm block">{n.id}</span>
                      <span className="text-xs text-slate-200 font-sans font-bold">{n.zone}</span>
                    </div>

                    <div className="flex-1 bg-slate-900 rounded-full h-4 overflow-hidden border border-slate-700">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCrit ? 'bg-red-500' : isWarn ? 'bg-amber-400' : 'bg-gradient-to-r from-cyan-400 via-emerald-400 to-orange-400'
                        }`}
                        style={{ width: `${Math.min(100, (nodeTemp / 50) * 100)}%` }}
                      />
                    </div>

                    <div className="text-right w-24">
                      <span className={`text-lg font-black ${isCrit ? 'text-red-400' : isWarn ? 'text-amber-300' : 'text-white'}`}>
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
