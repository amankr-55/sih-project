import React, { useState } from 'react';
import { Ruler, AlertTriangle, Eye, ShieldCheck, Thermometer, ArrowUpRight } from 'lucide-react';
import { DGMS_THRESHOLDS } from '../utils/mockDataStream';

export default function CrackSection({ nodes, maxCrack }) {
  const [selectedNodeId, setSelectedNodeId] = useState('NODE-01');
  const activeNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  const isCriticalCrack = activeNode.crackDisplacement >= DGMS_THRESHOLDS.CRACK_CRITICAL;
  const isAdvisoryCrack = activeNode.crackDisplacement >= DGMS_THRESHOLDS.CRACK_ADVISORY;
  const crackRate = activeNode.crackRate || 0.04;

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-950 text-amber-400 border border-amber-500/30">
            <Ruler className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-wider flex items-center gap-2">
              STRATA CRACK DILATION & EXTENSOMETER SENSING
              <span className="text-[10px] bg-amber-950 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded font-mono">
                LINEAR DISPLACEMENT MONITOR
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              High-Precision Potentiometric & LVDT Extensometers • Tracks Dilation Rate (mm/hr)
            </p>
          </div>
        </div>

        {/* Node Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Inspect Station:</span>
          <select
            value={selectedNodeId}
            onChange={(e) => setSelectedNodeId(e.target.value)}
            className="bg-slate-950 text-amber-400 font-mono text-xs font-bold border border-slate-700 px-3 py-2 rounded-xl outline-none cursor-pointer"
          >
            {nodes.map(n => (
              <option key={n.id} value={n.id}>{n.id} - {n.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Crack Dilation Metric Cards + Thermal Crack View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: Thermal Infrared Crack Camera View (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-orange-400" />
              THERMAL INFRARED STRATA FISSURE SURVEILLANCE
            </span>
            <span className="text-[10px] font-mono text-orange-400 bg-orange-950/80 border border-orange-500/30 px-2 py-0.5 rounded">
              FLIR THERMAL PALETTE
            </span>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-slate-800 group">
            <img 
              src="/images/thermal_crack.jpg" 
              alt="Thermal View of Mine Strata Crack" 
              className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Visual Overlays on Image */}
            <div className="absolute top-3 left-3 bg-black/75 backdrop-blur border border-white/20 px-3 py-1.5 rounded-lg text-xs font-mono text-white">
              <div>TARGET: <strong>{activeNode.name}</strong></div>
              <div className="text-amber-400">STATUS: {isCriticalCrack ? 'CRITICAL DILATION' : 'MICRO-FRACTURE'}</div>
            </div>

            <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur border border-white/20 px-3 py-1 rounded-lg text-xs font-mono text-emerald-400">
              IR Night Vision: ACTIVE • 32.4°C Strata Temp
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Thermal differential reveals subterranean fissure expanding under pressure. Thermal signatures bypass darkness and fog.
          </p>
        </div>

        {/* Right: Telemetry & Shear Rupture Analysis (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          
          {/* Crack Width Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Linear Crack Displacement
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-black font-mono ${
                isCriticalCrack ? 'text-red-400 animate-pulse' : isAdvisoryCrack ? 'text-amber-400' : 'text-white'
              }`}>
                {activeNode.crackDisplacement.toFixed(2)}
              </span>
              <span className="text-sm font-bold text-slate-400">mm dilation</span>
            </div>

            {/* Progress bar towards critical */}
            <div className="mt-3">
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>0 mm</span>
                <span className="text-amber-400">Warn: 2.0 mm</span>
                <span className="text-red-400">Crit: 4.0 mm</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    isCriticalCrack ? 'bg-red-500' : isAdvisoryCrack ? 'bg-amber-400' : 'bg-cyan-400'
                  }`}
                  style={{ width: `${Math.min(100, (activeNode.crackDisplacement / 5.0) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Dilation Velocity Rate (mm/hr) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Dilation Rate (Velocity)
              </span>
              <ArrowUpRight className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono text-cyan-400">
                {crackRate.toFixed(2)}
              </span>
              <span className="text-xs font-bold text-slate-400">mm / hour</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              DGMS Warning: Velocity &gt;0.5 mm/hr denotes immediate rock mass shear rupture failure.
            </p>
          </div>

          {/* Extensometer Hardware Health */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">
              Sensor Hardware Specs
            </span>
            <div className="text-xs font-mono space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Transducer:</span>
                <span>Linear Potentiometric Extensometer</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Resolution:</span>
                <span>0.01 mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mounting:</span>
                <span className="text-amber-400">{activeNode.mounting}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
