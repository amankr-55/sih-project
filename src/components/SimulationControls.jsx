import React, { useState } from 'react';
import { Sliders, Play, RotateCcw, AlertTriangle, Siren, Flame, Cpu, Usb, Radio } from 'lucide-react';
import { DGMS_THRESHOLDS } from '../utils/mockDataStream';

export default function SimulationControls({ 
  nodes, 
  onTriggerScenario, 
  onManualSliderChange,
  hardwareMode,
  onToggleHardwareMode 
}) {
  const [selectedNodeId, setSelectedNodeId] = useState('NODE-01');
  const currentNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  const currentTilt = Math.sqrt(currentNode.tiltX * currentNode.tiltX + currentNode.tiltY * currentNode.tiltY);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-950 text-purple-400 border border-purple-500/30">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-2">
              HACKATHON SAND-TRAY SIMULATION & HARDWARE INGESTION DECK
              <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-500/40 px-1.5 py-0.2 rounded font-mono">
                SIH26025 JUDGING DEMO
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">
              Simulate physical ground movement, sand-tray tilt, and strata cracks in real-time
            </p>
          </div>
        </div>

        {/* Source Mode Toggle: Simulation vs Hardware Bridge */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => onToggleHardwareMode('simulation')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all ${
              hardwareMode === 'simulation'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Sand-Tray Sim</span>
          </button>
          <button
            onClick={() => onToggleHardwareMode('hardware')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all ${
              hardwareMode === 'hardware'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Usb className="w-3.5 h-3.5" />
            <span>LoRa USB (COM3)</span>
          </button>
        </div>
      </div>

      {/* Quick Scenario Triggers */}
      <div className="mb-4">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Quick Demonstration Scenarios for Judges:
        </span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => onTriggerScenario('normal')}
            className="flex items-center justify-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
            <span>1. Normal Baseline</span>
          </button>

          <button
            onClick={() => onTriggerScenario('advisory')}
            className="flex items-center justify-center gap-1.5 bg-amber-950/40 hover:bg-amber-900/60 text-amber-200 border border-amber-600/50 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>2. Sand-Tray Tilt (3.5°)</span>
          </button>

          <button
            onClick={() => onTriggerScenario('critical')}
            className="flex items-center justify-center gap-1.5 bg-red-950/50 hover:bg-red-900/70 text-red-200 border border-red-500/60 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer animate-pulse"
          >
            <Siren className="w-3.5 h-3.5 text-red-400" />
            <span>3. Roof Collapse (5.8°)</span>
          </button>

          <button
            onClick={() => onTriggerScenario('gas')}
            className="flex items-center justify-center gap-1.5 bg-purple-950/40 hover:bg-purple-900/60 text-purple-200 border border-purple-500/50 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-purple-400" />
            <span>4. Gas Breach (CH4 1.4%)</span>
          </button>
        </div>
      </div>

      {/* Manual Fine-Tuning Controls */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 font-bold">Adjust Specific Node:</span>
            <select
              value={selectedNodeId}
              onChange={(e) => setSelectedNodeId(e.target.value)}
              className="bg-slate-900 text-cyan-400 font-mono text-xs font-bold border border-slate-700 px-2 py-1 rounded-lg outline-none cursor-pointer"
            >
              {nodes.map(n => (
                <option key={n.id} value={n.id}>{n.id} - {n.name}</option>
              ))}
            </select>
          </div>

          <div className="text-[11px] font-mono text-slate-400">
            Node Status: <strong className={
              currentNode.status === 'critical' ? 'text-red-400' :
              currentNode.status === 'advisory' ? 'text-amber-400' : 'text-emerald-400'
            }>{currentNode.status.toUpperCase()}</strong>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Tilt Angle Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Inclinometer Tilt Angle:</span>
              <span className="font-mono font-bold text-cyan-400">{currentTilt.toFixed(2)}°</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="7.5"
              step="0.1"
              value={currentTilt}
              onChange={(e) => onManualSliderChange(selectedNodeId, 'tilt', parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500 mt-0.5 font-mono">
              <span>0° Normal</span>
              <span className="text-amber-500 font-bold">2.5° Warn</span>
              <span className="text-red-500 font-bold">5.0° Evac</span>
              <span>7.5°</span>
            </div>
          </div>

          {/* Crack Width Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Crack Potentiometer:</span>
              <span className="font-mono font-bold text-amber-400">{currentNode.crackDisplacement.toFixed(2)} mm</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="5.0"
              step="0.05"
              value={currentNode.crackDisplacement}
              onChange={(e) => onManualSliderChange(selectedNodeId, 'crack', parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500 mt-0.5 font-mono">
              <span>0 mm</span>
              <span className="text-amber-500 font-bold">2.0 mm Warn</span>
              <span className="text-red-500 font-bold">4.0 mm Rupture</span>
              <span>5.0 mm</span>
            </div>
          </div>

          {/* Methane Gas Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Methane (CH4) Gas:</span>
              <span className="font-mono font-bold text-emerald-400">{currentNode.ch4.toFixed(2)}% vol</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="2.0"
              step="0.05"
              value={currentNode.ch4}
              onChange={(e) => onManualSliderChange(selectedNodeId, 'ch4', parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500 mt-0.5 font-mono">
              <span>0% Normal</span>
              <span className="text-amber-500 font-bold">0.75% Warn</span>
              <span className="text-red-500 font-bold">1.25% Trip</span>
              <span>2.0%</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
