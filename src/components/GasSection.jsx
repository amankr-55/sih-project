import React, { useState } from 'react';
import { Wind, Flame, AlertOctagon, ShieldCheck, Zap, Fan, Gauge, Droplet } from 'lucide-react';
import { DGMS_THRESHOLDS } from '../utils/mockDataStream';

export default function GasSection({ nodes, maxCH4, maxCO }) {
  const [ventilationBoost, setVentilationBoost] = useState(false);

  const isCH4Tripped = maxCH4 >= DGMS_THRESHOLDS.CH4_POWER_TRIP;
  const isCH4Warning = maxCH4 >= DGMS_THRESHOLDS.CH4_ADVISORY;
  const isCOWarning = maxCO >= DGMS_THRESHOLDS.CO_ADVISORY;

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 border-2 border-emerald-500/30 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-950/80 text-emerald-300 border-2 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Wind className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-wider flex items-center gap-2">
              ATMOSPHERIC GAS & COMBUSTIBILITY MONITOR
              <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-500/60 px-2.5 py-0.5 rounded font-mono font-bold">
                DGMS REGULATION 115
              </span>
            </h2>
            <p className="text-sm font-semibold text-slate-200">
              Catalytic Bead & Electrochemical Sensing • Automatic Electrical Interlock Trip Circuit
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setVentilationBoost(!ventilationBoost)}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-lg ${
              ventilationBoost || isCH4Warning
                ? 'bg-cyan-500 text-slate-950 shadow-cyan-500/40 animate-pulse'
                : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Fan className={`w-4 h-4 ${ventilationBoost || isCH4Warning ? 'animate-spin' : ''}`} />
            <span>{ventilationBoost || isCH4Warning ? 'EMERGENCY FORCED VENTILATION (BOOST)' : 'Forced Ventilation: Normal (12.4 m³/s)'}</span>
          </button>
        </div>
      </div>

      {/* Top Cards: Gas Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Methane CH4 */}
        <div className={`p-5 rounded-2xl border-2 shadow-2xl flex flex-col justify-between ${
          isCH4Tripped ? 'bg-red-950/80 border-red-500 animate-hazard-pulse' :
          isCH4Warning ? 'bg-amber-950/60 border-amber-500' : 'bg-slate-900/95 border-slate-700/80'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-200 uppercase tracking-wider">Methane (CH4)</span>
            <Flame className={`w-5 h-5 ${isCH4Tripped ? 'text-red-400' : 'text-emerald-300'}`} />
          </div>
          <div className="my-3">
            <span className={`text-4xl font-mono font-black ${
              isCH4Tripped ? 'text-red-400' : isCH4Warning ? 'text-amber-300' : 'text-white'
            }`}>
              {maxCH4.toFixed(2)}%
            </span>
            <span className="text-xs text-slate-300 block font-mono font-bold mt-1">vol in air (LEL 5.0%)</span>
          </div>
          <div className="text-xs font-mono text-slate-200 border-t border-slate-700 pt-2.5 flex justify-between font-bold">
            <span>Trip Limit: 1.25%</span>
            <span className={isCH4Tripped ? 'text-red-400 font-black' : 'text-emerald-300'}>
              {isCH4Tripped ? 'TRIPPED' : 'SAFE'}
            </span>
          </div>
        </div>

        {/* Carbon Monoxide CO */}
        <div className={`p-5 rounded-2xl border-2 shadow-2xl flex flex-col justify-between ${
          maxCO >= 50 ? 'bg-red-950/80 border-red-500 animate-hazard-pulse' :
          isCOWarning ? 'bg-amber-950/60 border-amber-500' : 'bg-slate-900/95 border-slate-700/80'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-200 uppercase tracking-wider">Carbon Monoxide (CO)</span>
            <Gauge className={`w-5 h-5 ${maxCO >= 50 ? 'text-red-400' : 'text-purple-300'}`} />
          </div>
          <div className="my-3">
            <span className={`text-4xl font-mono font-black ${
              maxCO >= 50 ? 'text-red-400' : isCOWarning ? 'text-amber-300' : 'text-white'
            }`}>
              {maxCO.toFixed(1)}
            </span>
            <span className="text-xs text-slate-300 block font-mono font-bold mt-1">parts per million (ppm)</span>
          </div>
          <div className="text-xs font-mono text-slate-200 border-t border-slate-700 pt-2.5 flex justify-between font-bold">
            <span>Critical: 50 ppm</span>
            <span className={maxCO >= 50 ? 'text-red-400 font-black' : 'text-emerald-300'}>
              {maxCO >= 50 ? 'DANGER' : 'NORMAL'}
            </span>
          </div>
        </div>

        {/* Oxygen O2 */}
        <div className="p-5 rounded-2xl border-2 bg-slate-900/95 border-slate-700/80 shadow-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-200 uppercase tracking-wider">Oxygen (O2)</span>
            <Wind className="w-5 h-5 text-cyan-300" />
          </div>
          <div className="my-3">
            <span className="text-4xl font-mono font-black text-white">20.8%</span>
            <span className="text-xs text-slate-300 block font-mono font-bold mt-1">safe atmospheric vol</span>
          </div>
          <div className="text-xs font-mono text-slate-200 border-t border-slate-700 pt-2.5 flex justify-between font-bold">
            <span>Min Statutory: 19.5%</span>
            <span className="text-emerald-300 font-black">OPTIMAL</span>
          </div>
        </div>

        {/* Electrical Power Interlock Status */}
        <div className={`p-5 rounded-2xl border-2 shadow-2xl flex flex-col justify-between ${
          isCH4Tripped ? 'bg-red-950/90 border-red-500' : 'bg-slate-900/95 border-slate-700/80'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-200 uppercase tracking-wider">Power Interlock Relay</span>
            <Zap className={`w-5 h-5 ${isCH4Tripped ? 'text-red-400' : 'text-emerald-300'}`} />
          </div>
          <div className="my-3">
            <span className={`text-2xl font-mono font-black ${isCH4Tripped ? 'text-red-400' : 'text-emerald-300'}`}>
              {isCH4Tripped ? 'POWER SHUTOFF' : 'ENERGIZED'}
            </span>
            <span className="text-xs text-slate-300 block font-bold mt-1">Substation relay interlock</span>
          </div>
          <div className="text-xs font-mono text-slate-200 border-t border-slate-700 pt-2.5 font-bold">
            {isCH4Tripped ? '⚠ Auto-tripped by GeoSentinel' : 'Grid healthy (No explosion spark risk)'}
          </div>
        </div>

      </div>

      {/* Node Gas Table */}
      <div className="bg-slate-900/95 border-2 border-slate-700/80 rounded-2xl p-5 shadow-2xl">
        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>Zone-Wise Continuous Gas Telemetry Breakdown</span>
          <span className="text-xs text-cyan-300 font-mono">6 Nodes Actively Sampling</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="bg-slate-950 text-slate-200 text-xs border-b-2 border-slate-700 font-black">
                <th className="p-3">Node</th>
                <th className="p-3">Gallery / Working Zone</th>
                <th className="p-3">CH4 (% vol)</th>
                <th className="p-3">CO (ppm)</th>
                <th className="p-3">O2 (%)</th>
                <th className="p-3">Temp (°C)</th>
                <th className="p-3">Humidity (%RH)</th>
                <th className="p-3">Ventilation Status</th>
              </tr>
            </thead>
            <tbody>
              {nodes.map(n => {
                const nodeCH4Trip = n.ch4 >= DGMS_THRESHOLDS.CH4_POWER_TRIP;
                const nodeCH4Warn = n.ch4 >= DGMS_THRESHOLDS.CH4_ADVISORY;
                return (
                  <tr key={n.id} className="border-b border-slate-800 hover:bg-slate-800/60 transition-colors font-bold">
                    <td className="p-3 text-cyan-300 font-black">{n.id}</td>
                    <td className="p-3 text-white font-sans font-bold">{n.name} ({n.zone})</td>
                    <td className={`p-3 font-black ${nodeCH4Trip ? 'text-red-400' : nodeCH4Warn ? 'text-amber-300' : 'text-emerald-300'}`}>
                      {n.ch4.toFixed(2)}%
                    </td>
                    <td className="p-3 font-black text-slate-100">{n.co.toFixed(1)} ppm</td>
                    <td className="p-3 text-slate-200">{n.o2 || 20.8}%</td>
                    <td className="p-3 text-slate-200">{n.temperature}°C</td>
                    <td className="p-3 text-slate-200">{n.humidity}%</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded text-xs font-black ${
                        nodeCH4Trip ? 'bg-red-950 text-red-300 border border-red-500' :
                        nodeCH4Warn ? 'bg-amber-950 text-amber-300 border border-amber-500' :
                        'bg-emerald-950 text-emerald-300 border border-emerald-500'
                      }`}>
                        {nodeCH4Trip ? 'VENTILATION OVERRIDE' : nodeCH4Warn ? 'ADVISORY' : 'NORMAL'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
