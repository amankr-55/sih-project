import React, { useState } from 'react';
import { Thermometer, Flame, AlertTriangle, ShieldCheck, Sun, Wind, ArrowUpRight, Gauge } from 'lucide-react';
import { DGMS_THRESHOLDS } from '../utils/mockDataStream';

export default function TemperatureSection({ nodes }) {
  const [selectedNodeId, setSelectedNodeId] = useState('NODE-01');
  const [simTemp, setSimTemp] = useState(null);

  const activeNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];
  const currentTemp = simTemp !== null ? simTemp : (activeNode.temperature || 29.4);

  const isTempCritical = currentTemp >= 45.0; // Spontaneous coal combustion danger
  const isTempAdvisory = currentTemp >= DGMS_THRESHOLDS.TEMP_ADVISORY; // 38°C Wet bulb heat stress

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-orange-950 text-orange-400 border border-orange-500/30">
            <Thermometer className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-wider flex items-center gap-2">
              SUBTERRANEAN THERMAL GRADIENT & HEAT MONITOR
              <span className="text-xs bg-orange-950 text-orange-400 border border-orange-500/40 px-2.5 py-0.5 rounded font-mono font-bold">
                DGMS CIRCULAR 111 (CMR 2017)
              </span>
            </h2>
            <p className="text-sm text-slate-400">
              PT100 RTD & Digital Strata Temperature Sensors • Early Warning for Spontaneous Coal Combustion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold">Select Station:</span>
          <select
            value={selectedNodeId}
            onChange={(e) => {
              setSelectedNodeId(e.target.value);
              setSimTemp(null);
            }}
            className="bg-slate-950 text-orange-400 font-mono text-sm font-bold border border-slate-700 px-3 py-2 rounded-xl outline-none cursor-pointer"
          >
            {nodes.map(n => (
              <option key={n.id} value={n.id}>{n.id} - {n.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Temperature Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Big Temperature Gauge Card (5 cols) */}
        <div className={`lg:col-span-5 p-6 rounded-3xl border shadow-2xl flex flex-col justify-between transition-all ${
          isTempCritical ? 'bg-red-950/70 border-red-500 animate-hazard-pulse' :
          isTempAdvisory ? 'bg-amber-950/60 border-amber-500' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                STRATA CORE TEMPERATURE
              </span>
              <Flame className={`w-6 h-6 ${isTempCritical ? 'text-red-400 animate-bounce' : 'text-orange-400'}`} />
            </div>

            <div className="flex items-baseline gap-2 my-4">
              <span className={`text-6xl font-black font-mono tracking-tight ${
                isTempCritical ? 'text-red-400' : isTempAdvisory ? 'text-amber-400' : 'text-white'
              }`}>
                {currentTemp.toFixed(1)}
              </span>
              <span className="text-2xl font-bold text-slate-400">°C</span>
            </div>

            {/* Status Indicator */}
            <div className="mt-2">
              {isTempCritical ? (
                <div className="bg-red-900/80 border border-red-400 p-3 rounded-xl text-red-100 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-300 animate-pulse" />
                  <span>CRITICAL: SPONTANEOUS COAL COMBUSTION / FIRE RISK DETECTED!</span>
                </div>
              ) : isTempAdvisory ? (
                <div className="bg-amber-900/80 border border-amber-400 p-3 rounded-xl text-amber-100 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-300" />
                  <span>ADVISORY: WET BULB HEAT STRESS EXCEEDS 38°C STATUTORY LIMIT</span>
                </div>
              ) : (
                <div className="bg-emerald-950/70 border border-emerald-500/50 p-3 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>NORMAL: THERMAL EQUILIBRIUM WITHIN SAFE STRATA RANGE</span>
                </div>
              )}
            </div>
          </div>

          {/* Test slider */}
          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <div className="flex justify-between text-xs text-slate-400 font-bold mb-1.5">
              <span>Simulate Temperature Spike:</span>
              <span className="text-orange-400 font-mono font-black">{currentTemp.toFixed(1)}°C</span>
            </div>
            <input
              type="range"
              min="24"
              max="52"
              step="0.5"
              value={currentTemp}
              onChange={(e) => setSimTemp(parseFloat(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>24°C Surface</span>
              <span className="text-amber-500 font-bold">38°C Warn</span>
              <span className="text-red-500 font-bold">45°C Fire Trip</span>
              <span>52°C</span>
            </div>
          </div>
        </div>

        {/* Temperature Metrics & Heat Distribution (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Key Metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-lg text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Wet-Bulb Index</span>
              <span className="text-2xl font-black font-mono text-cyan-400">
                {(currentTemp * 0.88).toFixed(1)}°C
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">DGMS Max: 38.0°C</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-lg text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Geothermal Rate</span>
              <span className="text-2xl font-black font-mono text-purple-400">
                +2.8°C
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Per 100m Depth</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-lg text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Heat Extraction</span>
              <span className="text-2xl font-black font-mono text-emerald-400">
                420 kW
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Main Return Fan</span>
            </div>
          </div>

          {/* Zone-by-Zone Temperature Breakdown */}
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl flex-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>All Subterranean Seams Thermal Register</span>
              <span className="text-xs font-mono text-slate-400">Normal Range: 26°C - 33°C</span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              {nodes.map(n => {
                const nodeTemp = n.temperature || 28.0;
                const isWarn = nodeTemp >= DGMS_THRESHOLDS.TEMP_ADVISORY;
                return (
                  <div key={n.id} className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3">
                    <div className="w-24">
                      <span className="font-bold text-orange-400 block">{n.id}</span>
                      <span className="text-[10px] text-slate-500 font-sans">{n.zone}</span>
                    </div>

                    <div className="flex-1 bg-slate-900 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          nodeTemp >= 45 ? 'bg-red-500' : isWarn ? 'bg-amber-400' : 'bg-gradient-to-r from-cyan-500 to-orange-400'
                        }`}
                        style={{ width: `${Math.min(100, (nodeTemp / 50) * 100)}%` }}
                      />
                    </div>

                    <div className="text-right w-16">
                      <span className={`text-sm font-bold ${nodeTemp >= 45 ? 'text-red-400 font-black' : isWarn ? 'text-amber-400' : 'text-white'}`}>
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
