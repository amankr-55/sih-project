import React, { useEffect, useRef, useState } from 'react';
import { Droplets, Waves, AlertTriangle, ShieldCheck, ThermometerSnowflake, Gauge } from 'lucide-react';
import { DGMS_THRESHOLDS } from '../utils/mockDataStream';

export default function MoistureSection({ nodes, onInjectMoisture }) {
  const [selectedNodeId, setSelectedNodeId] = useState('NODE-01');
  const canvasRef = useRef(null);

  const activeNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];
  const moisturePct = activeNode.moisture || 42.5;

  // Animated water wave canvas simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const height = canvas.height;
      const width = canvas.width;
      const waterLevel = height - (moisturePct / 100) * height * 0.85;

      const isCritical = moisturePct >= DGMS_THRESHOLDS.MOISTURE_CRITICAL;
      const isAdvisory = moisturePct >= DGMS_THRESHOLDS.MOISTURE_ADVISORY;

      // Draw background soil stratum
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // Water gradient
      const grad = ctx.createLinearGradient(0, waterLevel, 0, height);
      if (isCritical) {
        grad.addColorStop(0, 'rgba(239, 68, 68, 0.7)');
        grad.addColorStop(1, 'rgba(153, 27, 27, 0.9)');
      } else if (isAdvisory) {
        grad.addColorStop(0, 'rgba(245, 158, 11, 0.6)');
        grad.addColorStop(1, 'rgba(180, 83, 9, 0.8)');
      } else {
        grad.addColorStop(0, 'rgba(14, 165, 233, 0.6)');
        grad.addColorStop(1, 'rgba(3, 105, 161, 0.9)');
      }

      // Draw undulating wave
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, waterLevel);

      for (let x = 0; x <= width; x += 10) {
        const y = waterLevel + Math.sin(x * 0.03 + step) * 8 + Math.cos(x * 0.02 - step * 0.8) * 4;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // Top wave crest glow
      ctx.strokeStyle = isCritical ? '#fca5a5' : isAdvisory ? '#fde68a' : '#7dd3fc';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 10) {
        const y = waterLevel + Math.sin(x * 0.03 + step) * 8 + Math.cos(x * 0.02 - step * 0.8) * 4;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      step += 0.05;
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [moisturePct]);

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30">
            <Droplets className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-wider flex items-center gap-2">
              PORE-WATER SATURATION & SOIL LIQUEFACTION MONITOR
              <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-500/40 px-2 py-0.5 rounded font-mono">
                GROUNDWATER INGRESS SENSING
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Capacitive Soil Probe & Piezometer Telemetry • Detects Slurry Inundation & Shear Loss
            </p>
          </div>
        </div>

        {/* Node selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Select Seam Probe:</span>
          <select
            value={selectedNodeId}
            onChange={(e) => setSelectedNodeId(e.target.value)}
            className="bg-slate-950 text-cyan-400 font-mono text-xs font-bold border border-slate-700 px-3 py-2 rounded-xl outline-none cursor-pointer"
          >
            {nodes.map(n => (
              <option key={n.id} value={n.id}>{n.id} - {n.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Animated Water Tank + Liquefaction Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Animated Water Column Tank (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 font-mono">
              <Waves className="w-4 h-4 text-cyan-400" />
              STRATA PORE-WATER FLUID COLUMN SATURATION
            </span>
            <span className="text-xs font-mono font-bold text-cyan-400">{moisturePct.toFixed(1)}%</span>
          </div>

          <div className="relative flex-1 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center min-h-[260px]">
            <canvas
              ref={canvasRef}
              width={480}
              height={260}
              className="w-full h-full block"
            />
            <div className="absolute top-3 left-4 bg-slate-900/90 border border-slate-700 p-2.5 rounded-xl font-mono">
              <span className="text-[10px] text-slate-400 block">Current Pore Saturation</span>
              <span className="text-2xl font-black text-white">{moisturePct.toFixed(1)}%</span>
              <span className="text-[9px] text-slate-500 block">Advisory: &gt;70% | Critical: &gt;88%</span>
            </div>
          </div>
        </div>

        {/* Liquefaction & Groundwater Ingress Metrics (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">
              Strata Liquefaction Assessment
            </span>

            <div className="p-3 rounded-xl border mb-3 flex items-center justify-between ${
              moisturePct >= 88 ? 'bg-red-950/60 border-red-500/50 text-red-200' :
              moisturePct >= 70 ? 'bg-amber-950/60 border-amber-500/50 text-amber-200' :
              'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
            }">
              <div>
                <span className="text-xs font-black uppercase block">
                  {moisturePct >= 88 ? 'SEVERE LIQUEFACTION / SLURRY RISK' :
                   moisturePct >= 70 ? 'GROUNDWATER INGRESS ADVISORY' :
                   'STABLE DRY STRATA COEFFICIENT'}
                </span>
                <p className="text-[11px] opacity-80">
                  {moisturePct >= 88 ? 'Overburden shear strength degraded by >65%. Risk of inrush into gallery.' :
                   moisturePct >= 70 ? 'Moisture condensation high. Check drainage sumps and pumping stations.' :
                   'Cohesion intact. Groundwater infiltration below danger threshold.'}
                </p>
              </div>
              <Gauge className="w-8 h-8 opacity-90" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Pore Pressure</span>
                <span className="text-base font-bold text-white">{(moisturePct * 0.42).toFixed(1)} kPa</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Infiltration Rate</span>
                <span className="text-base font-bold text-cyan-400">{(moisturePct * 0.08).toFixed(2)} L/min</span>
              </div>
            </div>
          </div>

          {/* Node-by-Node Moisture Levels */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">
              All Monitoring Zones Moisture Distribution
            </span>
            <div className="space-y-1.5 font-mono text-xs">
              {nodes.map(n => (
                <div key={n.id} className="flex items-center justify-between gap-2">
                  <span className="text-slate-400 text-[11px] w-20">{n.id}</span>
                  <div className="flex-1 bg-slate-950 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        (n.moisture || 40) >= 88 ? 'bg-red-500' : (n.moisture || 40) >= 70 ? 'bg-amber-400' : 'bg-cyan-400'
                      }`}
                      style={{ width: `${n.moisture || 40}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-white w-12 text-right">{(n.moisture || 40).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
