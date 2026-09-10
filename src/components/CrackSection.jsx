import React, { useState } from 'react';
import { Ruler, AlertTriangle, Eye, ShieldCheck, Thermometer, ArrowUpRight, Camera, CheckCircle2 } from 'lucide-react';
import { DGMS_THRESHOLDS } from '../utils/mockDataStream';

export default function CrackSection({ nodes, maxCrack }) {
  const [selectedNodeId, setSelectedNodeId] = useState('NODE-01');
  const [viewMode, setViewMode] = useState('real'); // 'real' | 'thermal'
  const activeNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  const isCriticalCrack = activeNode.crackDisplacement >= DGMS_THRESHOLDS.CRACK_CRITICAL;
  const isAdvisoryCrack = activeNode.crackDisplacement >= DGMS_THRESHOLDS.CRACK_ADVISORY;
  const crackRate = activeNode.crackRate || 0.04;

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 border-2 border-amber-500/30 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-amber-950/80 text-amber-300 border-2 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <Ruler className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-wider flex items-center gap-2">
              STRATA CRACK DILATION & EXTENSOMETER SENSING
              <span className="text-xs bg-amber-950 text-amber-300 border border-amber-500/60 px-2.5 py-0.5 rounded font-mono font-bold">
                LINEAR DISPLACEMENT MONITOR
              </span>
            </h2>
            <p className="text-sm font-semibold text-slate-200">
              High-Precision Potentiometric & LVDT Extensometers • Tracks Continuous Dilation Rate (mm/hr)
            </p>
          </div>
        </div>

        {/* Node Selector */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-100">Inspect Station:</span>
          <select
            value={selectedNodeId}
            onChange={(e) => setSelectedNodeId(e.target.value)}
            className="bg-slate-950 text-amber-300 font-mono text-sm font-black border-2 border-amber-500/40 px-4 py-2 rounded-xl outline-none cursor-pointer shadow-lg"
          >
            {nodes.map(n => (
              <option key={n.id} value={n.id}>{n.id} — {n.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Dual Camera/Visual View + Telemetry Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Real Photographic vs Thermal View (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/95 border-2 border-slate-700/80 rounded-2xl p-5 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('real')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  viewMode === 'real'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-800 text-slate-200 hover:text-white'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>REAL FIELD EXTENSOMETER PHOTO</span>
              </button>
              <button
                onClick={() => setViewMode('thermal')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  viewMode === 'thermal'
                    ? 'bg-orange-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-800 text-slate-200 hover:text-white'
                }`}
              >
                <Thermometer className="w-4 h-4" />
                <span>FLIR THERMAL INFRARED</span>
              </button>
            </div>
            <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2.5 py-1 rounded">
              {viewMode === 'real' ? 'OPTICAL HIGH-RES MACRO' : 'FLIR THERMAL PALETTE'}
            </span>
          </div>

          <div className="relative rounded-xl overflow-hidden border-2 border-slate-700 group flex-1 min-h-[300px]">
            <img 
              src={viewMode === 'real' ? './images/real_mine_crack.jpg' : './images/thermal_crack.jpg'} 
              alt={viewMode === 'real' ? "Real Subterranean Mine Wall Digital Extensometer" : "Thermal View of Mine Strata Crack"} 
              className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Visual Overlays on Image */}
            <div className="absolute top-3 left-3 bg-black/85 backdrop-blur border border-white/30 px-3.5 py-2 rounded-xl text-xs font-mono text-white shadow-xl">
              <div>STATION: <strong className="text-amber-300 font-bold">{activeNode.name}</strong></div>
              <div className="text-slate-200">FRACTURE DILATION: <strong className="text-amber-400 font-black">{activeNode.crackDisplacement.toFixed(2)} mm</strong></div>
              <div className="text-cyan-300">STATUS: {isCriticalCrack ? 'CRITICAL DILATION' : 'MICRO-FRACTURE STABLE'}</div>
            </div>

            <div className="absolute bottom-3 right-3 bg-black/85 backdrop-blur border border-white/30 px-3.5 py-1.5 rounded-xl text-xs font-mono text-emerald-300 font-bold shadow-xl">
              Optical Caliper Lock: ACTIVE • Precision ±0.01 mm
            </div>
          </div>
          <p className="text-xs font-medium text-slate-200 mt-3">
            {viewMode === 'real' 
              ? 'High-resolution macro view of subterranean coal rib with high-tensile anchor bolts and digital linear potentiometer tracking micro-crack shearing.'
              : 'Thermal differential reveals subterranean fissure expanding under pressure. Thermal signatures bypass darkness and coal dust fog.'}
          </p>
        </div>

        {/* Right: Telemetry & Shear Rupture Analysis (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Crack Width Card */}
          <div className="bg-slate-900/95 border-2 border-slate-700/80 rounded-2xl p-5 shadow-2xl">
            <span className="text-xs text-slate-300 font-black uppercase tracking-wider block mb-1">
              Linear Crack Displacement (Extensometer)
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-5xl font-black font-mono tracking-tight ${
                isCriticalCrack ? 'text-red-400 animate-pulse' : isAdvisoryCrack ? 'text-amber-300' : 'text-white'
              }`}>
                {activeNode.crackDisplacement.toFixed(2)}
              </span>
              <span className="text-base font-bold text-slate-200">mm dilation</span>
            </div>

            {/* Progress bar towards critical */}
            <div className="mt-4">
              <div className="flex justify-between text-xs font-mono font-bold text-slate-200 mb-1.5">
                <span>0 mm</span>
                <span className="text-amber-300">Warn: 2.0 mm</span>
                <span className="text-red-400">Crit: 4.0 mm</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-3.5 overflow-hidden border border-slate-700">
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
          <div className="bg-slate-900/95 border-2 border-slate-700/80 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-300 font-black uppercase tracking-wider">
                Dilation Rate (Velocity)
              </span>
              <ArrowUpRight className="w-5 h-5 text-cyan-300" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black font-mono text-cyan-300">
                {crackRate.toFixed(2)}
              </span>
              <span className="text-sm font-bold text-slate-200">mm / hour</span>
            </div>
            <p className="text-xs font-semibold text-slate-300 mt-2">
              DGMS Warning Threshold: Velocity &gt;0.5 mm/hr indicates rapid strata creep and shear rupture risk.
            </p>
          </div>

          {/* Extensometer Hardware Health */}
          <div className="bg-slate-900/95 border-2 border-slate-700/80 rounded-2xl p-5 shadow-2xl">
            <span className="text-xs text-slate-300 font-black uppercase tracking-wider block mb-2.5">
              Extensometer Sensor Specification
            </span>
            <div className="text-xs font-mono space-y-2 text-slate-200 font-bold">
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Transducer:</span>
                <span className="text-white">Linear Potentiometric Extensometer</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Resolution:</span>
                <span className="text-cyan-300">0.01 mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Mounting:</span>
                <span className="text-amber-300">{activeNode.mounting}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
