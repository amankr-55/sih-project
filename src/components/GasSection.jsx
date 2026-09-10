import React, { useState } from 'react';
import { Wind, Flame, AlertOctagon, ShieldCheck, Zap, Fan, Gauge, Droplet } from 'lucide-react';
import { DGMS_THRESHOLDS } from '../utils/mockDataStream';

export default function GasSection({ nodes, maxCH4, maxCO }) {
  const [ventilationBoost, setVentilationBoost] = useState(false);

  const isCH4Tripped = maxCH4 >= DGMS_THRESHOLDS.CH4_POWER_TRIP;
  const isCH4Warning = maxCH4 >= DGMS_THRESHOLDS.CH4_ADVISORY;
  const isCOWarning = maxCO >= DGMS_THRESHOLDS.CO_ADVISORY;

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/30">
            <Wind className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-wider flex items-center gap-2">
              ATMOSPHERIC GAS & COMBUSTIBILITY MONITOR
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-mono">
                DGMS REGULATION 115
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Catalytic Bead & Electrochemical Sensing • Automatic Electrical Interlock Trip Circuit
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setVentilationBoost(!ventilationBoost)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              ventilationBoost || isCH4Warning
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/40 animate-pulse'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Fan className={`w-4 h-4 ${ventilationBoost || isCH4Warning ? 'animate-spin' : ''}`} />
            <span>{ventilationBoost || isCH4Warning ? 'EMERGENCY VENTILATION (BOOST)' : 'Forced Ventilation: Normal'}</span>
          </button>
        </div>
      </div>

      {/* Top Cards: Gas Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Methane CH4 */}
        <div className={`p-4 rounded-2xl border shadow-xl flex flex-col justify-between ${
          isCH4Tripped ? 'bg-red-950/60 border-red-500/60 animate-hazard-pulse' :
          isCH4Warning ? 'bg-amber-950/40 border-amber-500/50' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Methane (CH4)</span>
            <Flame className={`w-4 h-4 ${isCH4Tripped ? 'text-red-400' : 'text-emerald-400'}`} />
          </div>
          <div className="my-2">
            <span className={`text-3xl font-mono font-black ${
              isCH4Tripped ? 'text-red-400' : isCH4Warning ? 'text-amber-400' : 'text-white'
            }`}>
              {maxCH4.toFixed(2)}%
            </span>
            <span className="text-xs text-slate-400 block font-mono">vol in air</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-2 flex justify-between">
            <span>Trip Limit: 1.25%</span>
            <span className={isCH4Tripped ? 'text-red-400 font-bold' : 'text-emerald-400'}>
              {isCH4Tripped ? 'TRIPPED' : 'SAFE'}
            </span>
          </div>
        </div>

        {/* Carbon Monoxide CO */}
        <div className={`p-4 rounded-2xl border shadow-xl flex flex-col justify-between ${
          maxCO >= 50 ? 'bg-red-950/60 border-red-500/60 animate-hazard-pulse' :
          isCOWarning ? 'bg-amber-950/40 border-amber-500/50' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Carbon Monoxide (CO)</span>
            <Gauge className={`w-4 h-4 ${maxCO >= 50 ? 'text-red-400' : 'text-purple-400'}`} />
          </div>
          <div className="my-2">
            <span className={`text-3xl font-mono font-black ${
              maxCO >= 50 ? 'text-red-400' : isCOWarning ? 'text-amber-400' : 'text-white'
            }`}>
              {maxCO.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 block font-mono">parts per million (ppm)</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-2 flex justify-between">
            <span>Critical: 50 ppm</span>
            <span className={maxCO >= 50 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
              {maxCO >= 50 ? 'DANGER' : 'NORMAL'}
            </span>
          </div>
        </div>

        {/* Oxygen O2 */}
        <div className="p-4 rounded-2xl border bg-slate-900/90 border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Oxygen (O2)</span>
            <Wind className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-mono font-black text-white">20.8%</span>
            <span className="text-xs text-slate-400 block font-mono">safe atmospheric vol</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-2 flex justify-between">
            <span>Min Statutory: 19.5%</span>
            <span className="text-emerald-400 font-bold">OPTIMAL</span>
          </div>
        </div>

        {/* Electrical Power Interlock Status */}
        <div className={`p-4 rounded-2xl border shadow-xl flex flex-col justify-between ${
          isCH4Tripped ? 'bg-red-950/80 border-red-500' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Power Interlock</span>
            <Zap className={`w-4 h-4 ${isCH4Tripped ? 'text-red-400' : 'text-emerald-400'}`} />
          </div>
          <div className="my-2">
            <span className={`text-xl font-mono font-black ${isCH4Tripped ? 'text-red-400' : 'text-emerald-400'}`}>
              {isCH4Tripped ? 'POWER SHUTOFF' : 'ENERGIZED'}
            </span>
            <span className="text-xs text-slate-400 block">Substation relay interlock</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
            {isCH4Tripped ? '⚠ Auto-tripped by GeoSentinel' : 'Grid healthy (No explosion spark risk)'}
          </div>
        </div>

      </div>

      {/* Node Gas Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
          Zone-Wise Continuous Gas Telemetry Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-[11px] border-b border-slate-800">
                <th className="p-2.5">Node</th>
                <th className="p-2.5">Gallery / Working Zone</th>
                <th className="p-2.5">CH4 (% vol)</th>
                <th className="p-2.5">CO (ppm)</th>
                <th className="p-2.5">O2 (%)</th>
                <th className="p-2.5">Temp (°C)</th>
                <th className="p-2.5">Humidity (%RH)</th>
                <th className="p-2.5">Ventilation Status</th>
              </tr>
            </thead>
            <tbody>
              {nodes.map(n => {
                const nodeCH4Trip = n.ch4 >= DGMS_THRESHOLDS.CH4_POWER_TRIP;
                const nodeCH4Warn = n.ch4 >= DGMS_THRESHOLDS.CH4_ADVISORY;
                return (
                  <tr key={n.id} className="border-b border-slate-800/60 hover:bg-slate-800/40 transition-colors">
                    <td className="p-2.5 font-bold text-cyan-400">{n.id}</td>
                    <td className="p-2.5 text-slate-200 font-sans">{n.name} ({n.zone})</td>
                    <td className={`p-2.5 font-bold ${nodeCH4Trip ? 'text-red-400' : nodeCH4Warn ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {n.ch4.toFixed(2)}%
                    </td>
                    <td className="p-2.5 font-bold text-slate-200">{n.co.toFixed(1)} ppm</td>
                    <td className="p-2.5 text-slate-300">{n.o2 || 20.8}%</td>
                    <td className="p-2.5 text-slate-300">{n.temperature}°C</td>
                    <td className="p-2.5 text-slate-300">{n.humidity}%</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        nodeCH4Trip ? 'bg-red-950 text-red-400 border border-red-500/40' :
                        nodeCH4Warn ? 'bg-amber-950 text-amber-400 border border-amber-500/40' :
                        'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
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
