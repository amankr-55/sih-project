import React, { useEffect, useRef, useState } from 'react';
import { Activity, Radio, AlertTriangle, ShieldCheck, Zap, Waves as WaveIcon } from 'lucide-react';
import { DGMS_THRESHOLDS } from '../utils/mockDataStream';

export default function VibrationSection({ nodes, onInjectTremor }) {
  const canvasRef = useRef(null);
  const [activeNodeId, setActiveNodeId] = useState('NODE-01');
  const [tremorBurst, setTremorBurst] = useState(false);

  const activeNode = nodes.find(n => n.id === activeNodeId) || nodes[0];
  const peakG = activeNode.vibrationG || 0.06;

  // Real-time canvas oscilloscope animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Centerline
      const midY = canvas.height / 2;
      ctx.strokeStyle = '#334155';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(canvas.width, midY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw active waveform
      const isCritical = peakG >= DGMS_THRESHOLDS.VIBRATION_CRITICAL;
      const isAdvisory = peakG >= DGMS_THRESHOLDS.VIBRATION_ADVISORY;
      
      ctx.strokeStyle = isCritical ? '#ef4444' : isAdvisory ? '#f59e0b' : '#38bdf8';
      ctx.lineWidth = isCritical ? 3.5 : 2;
      ctx.shadowColor = isCritical ? 'rgba(239, 68, 68, 0.8)' : 'rgba(56, 189, 248, 0.6)';
      ctx.shadowBlur = 10;

      ctx.beginPath();
      const baseAmp = isCritical ? 65 : isAdvisory ? 38 : 12;
      const freq1 = 0.04;
      const freq2 = 0.09;

      for (let x = 0; x < canvas.width; x++) {
        // Multi-frequency seismic noise simulation
        const noise = (Math.random() - 0.5) * (isCritical ? 14 : 3);
        const y = midY + Math.sin(x * freq1 + phase) * baseAmp + Math.cos(x * freq2 - phase * 1.5) * (baseAmp * 0.4) + noise;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      phase += isCritical ? 0.22 : isAdvisory ? 0.12 : 0.05;
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [peakG]);

  function handleTriggerTestTremor() {
    setTremorBurst(true);
    if (onInjectTremor) onInjectTremor(activeNodeId, 0.72);
    setTimeout(() => {
      setTremorBurst(false);
      if (onInjectTremor) onInjectTremor(activeNodeId, 0.06);
    }, 4000);
  }

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-950 text-blue-400 border border-blue-500/30">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-wider flex items-center gap-2">
              SEISMIC VIBRATION & ROOF STRATA MICRO-TREMOR MONITOR
              <span className="text-[10px] bg-blue-950 text-blue-400 border border-blue-500/40 px-2 py-0.5 rounded font-mono">
                DGMS TECH REF 2021
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              High-Frequency Piezoelectric Geophone & 3-Axis Accelerometer (MPU6050) Strata Waveform
            </p>
          </div>
        </div>

        {/* Node selector & Test button */}
        <div className="flex items-center gap-3">
          <select
            value={activeNodeId}
            onChange={(e) => setActiveNodeId(e.target.value)}
            className="bg-slate-950 text-cyan-400 font-mono text-xs font-bold border border-slate-700 px-3 py-2 rounded-xl outline-none cursor-pointer"
          >
            {nodes.map(n => (
              <option key={n.id} value={n.id}>{n.id} - {n.name}</option>
            ))}
          </select>

          <button
            onClick={handleTriggerTestTremor}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs shadow-lg transition-all cursor-pointer ${
              tremorBurst
                ? 'bg-red-600 text-white animate-bounce'
                : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{tremorBurst ? 'BURST ACTIVE (0.72g)!' : 'Simulate Micro-Tremor'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Oscilloscope + Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: 60 FPS Real-time Oscilloscope (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 font-mono flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping inline-block"></span>
              LIVE SEISMIC ACCELEROMETER OSCILLOSCOPE (60 FPS)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Sampling: 1000 Hz • Sub-GHz LoRa</span>
          </div>

          <div className="relative flex-1 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-1 min-h-[260px]">
            <canvas
              ref={canvasRef}
              width={720}
              height={260}
              className="w-full h-full block"
            />
            <div className="absolute top-2 left-3 font-mono text-[10px] text-cyan-400/80 bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
              Channel: Triaxial Accel Vector (g)
            </div>
            <div className="absolute bottom-2 right-3 font-mono text-[10px] text-slate-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
              Thresholds: Advisory &gt;0.30g | Critical &gt;0.65g
            </div>
          </div>
        </div>

        {/* Right: Key Vibration Metrics Cards (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          
          {/* Peak Acceleration Gauge Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Peak Resultant Acceleration
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-black font-mono ${
                peakG >= 0.65 ? 'text-red-400 animate-pulse' : peakG >= 0.30 ? 'text-amber-400' : 'text-cyan-400'
              }`}>
                {peakG.toFixed(3)}
              </span>
              <span className="text-sm font-bold text-slate-400">g-force</span>
            </div>
            <div className="mt-2 text-xs">
              {peakG >= 0.65 ? (
                <span className="text-red-400 font-bold bg-red-950/60 border border-red-500/40 px-2 py-0.5 rounded flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> DYNAMIC ROCK-BURST RISK
                </span>
              ) : peakG >= 0.30 ? (
                <span className="text-amber-400 font-bold bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> STRATA MICRO-FRACTURING
                </span>
              ) : (
                <span className="text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> NORMAL AMBIENT STRATA
                </span>
              )}
            </div>
          </div>

          {/* Tri-Axial Breakdown Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Triaxial Motion Vectors
            </span>

            <div className="space-y-1.5 font-mono text-xs">
              <div>
                <div className="flex justify-between text-slate-300 text-[11px] mb-0.5">
                  <span>X-Axis (Dip Horizontal):</span>
                  <span className="font-bold text-cyan-400">{(peakG * 0.7).toFixed(3)} g</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (peakG / 0.8) * 100)}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 text-[11px] mb-0.5">
                  <span>Y-Axis (Strike Horizontal):</span>
                  <span className="font-bold text-blue-400">{(peakG * 0.5).toFixed(3)} g</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-400 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (peakG * 0.7 / 0.8) * 100)}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 text-[11px] mb-0.5">
                  <span>Z-Axis (Vertical Roof Sag):</span>
                  <span className="font-bold text-purple-400">{(peakG * 0.9).toFixed(3)} g</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-purple-400 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (peakG * 0.9 / 0.8) * 100)}%` }}></div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
              P-Wave Velocity: <strong className="text-white">3,850 m/s</strong> (Sandstone Roof)
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
