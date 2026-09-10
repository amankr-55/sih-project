import React, { useEffect, useRef, useState } from 'react';
import { Droplets, Waves, AlertTriangle, ShieldCheck, Gauge, CheckCircle2 } from 'lucide-react';
import { DGMS_THRESHOLDS } from '../utils/mockDataStream';

export default function MoistureSection({ nodes }) {
  const [selectedNodeId, setSelectedNodeId] = useState('NODE-01');
  const canvasRef = useRef(null);

  const activeNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];
  const moisturePct = activeNode.moisture || 42.5;

  const isCritical = moisturePct >= DGMS_THRESHOLDS.MOISTURE_CRITICAL;
  const isAdvisory = !isCritical && moisturePct >= DGMS_THRESHOLDS.MOISTURE_ADVISORY;

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
      const waterLevel = height - (moisturePct / 100) * height * 0.82;

      // Draw background soil stratum
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // Water gradient
      const grad = ctx.createLinearGradient(0, waterLevel, 0, height);
      if (isCritical) {
        grad.addColorStop(0, 'rgba(239, 68, 68, 0.85)');
        grad.addColorStop(1, 'rgba(153, 27, 27, 0.95)');
      } else if (isAdvisory) {
        grad.addColorStop(0, 'rgba(245, 158, 11, 0.8)');
        grad.addColorStop(1, 'rgba(180, 83, 9, 0.95)');
      } else {
        grad.addColorStop(0, 'rgba(14, 165, 233, 0.8)');
        grad.addColorStop(1, 'rgba(3, 105, 161, 0.95)');
      }

      // Draw undulating wave
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, waterLevel);

      step += 0.04;
      for (let x = 0; x <= width; x += 10) {
        const y = waterLevel + Math.sin(x * 0.02 + step) * 8 + Math.cos(x * 0.04 - step) * 4;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [moisturePct, isCritical, isAdvisory]);

  return (
    <div className="space-y-6 animate-fade-in text-white">
      
      {/* Header Banner - High Contrast */}
      <div className="bg-[#18253f] border-2 border-cyan-500/60 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-blue-500/30 text-blue-300 border-2 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            <Droplets className="w-10 h-10 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide flex items-center gap-3">
              PORE-WATER SATURATION & SOIL LIQUEFACTION MONITOR
              <span className="text-xs bg-cyan-500 text-slate-950 font-black px-3 py-1 rounded-full uppercase">
                AQUIFER SENSING
              </span>
            </h2>
            <p className="text-base text-slate-100 font-bold mt-1">
              Capacitive soil moisture probe & piezometer telemetry • Early detection of strata slurry liquefaction & inrush
            </p>
          </div>
        </div>

        {/* Node selector */}
        <div className="flex items-center gap-3 bg-[#0d1627] p-2.5 rounded-2xl border border-slate-700 shadow-lg">
          <span className="text-sm text-white font-black">Select Seam Probe:</span>
          <select
            value={selectedNodeId}
            onChange={(e) => setSelectedNodeId(e.target.value)}
            className="bg-[#16233d] text-cyan-300 font-mono text-sm font-black border border-cyan-500/50 px-4 py-2 rounded-xl outline-none cursor-pointer shadow-md"
          >
            {nodes.map(n => (
              <option key={n.id} value={n.id}>{n.id} - {n.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Animated Water Tank + Liquefaction Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Animated Water Column Tank (6 cols) */}
        <div className="lg:col-span-6 bg-[#182642] border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-black text-white flex items-center gap-2 font-mono">
                <Waves className="w-5 h-5 text-cyan-400" />
                STRATA PORE-WATER FLUID COLUMN SATURATION
              </span>
              <span className="text-sm font-mono font-black text-cyan-300 bg-[#0c1424] px-3 py-1 rounded-xl border border-cyan-500/40">
                {moisturePct.toFixed(1)}%
              </span>
            </div>

            <div className="relative h-72 rounded-2xl border border-slate-700 overflow-hidden shadow-inner">
              <canvas
                ref={canvasRef}
                width={500}
                height={288}
                className="w-full h-full block"
              />
              
              <div className="absolute top-4 left-4 bg-black/85 backdrop-blur border border-white/20 p-3.5 rounded-2xl font-mono shadow-xl">
                <span className="text-xs text-slate-300 font-bold block">Current Pore Saturation</span>
                <span className="text-4xl font-black text-white">{moisturePct.toFixed(1)}%</span>
                <span className="text-xs text-amber-300 font-black block mt-1">Warning: &gt;70% | Critical: &gt;88%</span>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-[#0e172a] p-3.5 rounded-xl border border-slate-700">
              <span className="text-slate-300 text-xs font-bold block">Hydrostatic Pore Pressure</span>
              <span className="text-xl font-black text-white">{(moisturePct * 0.42).toFixed(1)} kPa</span>
            </div>
            <div className="bg-[#0e172a] p-3.5 rounded-xl border border-slate-700">
              <span className="text-slate-300 text-xs font-bold block">Groundwater Seepage Inflow</span>
              <span className="text-xl font-black text-cyan-300">{(moisturePct * 0.08).toFixed(2)} L/min</span>
            </div>
          </div>
        </div>

        {/* Liquefaction & Real Mine Sump Photo (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          
          {/* Liquefaction Status Banner */}
          <div className={`p-5 rounded-3xl border-2 shadow-xl flex items-center justify-between gap-4 ${
            isCritical ? 'bg-red-950/90 border-red-500 text-white' :
            isAdvisory ? 'bg-amber-950/90 border-amber-500 text-white' :
            'bg-emerald-950/90 border-emerald-500 text-white'
          }`}>
            <div>
              <span className="text-base font-black uppercase tracking-wider block">
                {isCritical ? 'CRITICAL: SEVERE STRATA LIQUEFACTION RISK' :
                 isAdvisory ? 'ADVISORY: GROUNDWATER INGRESS ELEVATED' :
                 'STATUTORY SAFE: STABLE DRY STRATA COEFFICIENT'}
              </span>
              <p className="text-xs font-bold text-slate-100 mt-1 leading-relaxed">
                {isCritical ? 'Rock mass shear strength degraded by >65%. High danger of quicksand inrush into active haulage.' :
                 isAdvisory ? 'Pore pressure rising. Verify submersible dewatering pump operation in main drainage sump.' :
                 'Overburden cohesion intact. Piezometric pore pressure normal below statutory warning limits.'}
              </p>
            </div>
            <Gauge className="w-12 h-12 shrink-0 opacity-90" />
          </div>

          {/* Real Sump Photo Card */}
          <div className="bg-[#182642] border border-slate-700 rounded-3xl overflow-hidden shadow-xl group">
            <div className="relative h-48 overflow-hidden bg-black">
              <img
                src="./images/mine_water_sump.jpg"
                alt="Underground Drainage Sump"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 bg-black/85 backdrop-blur border border-blue-400 px-3 py-1 rounded-xl text-xs font-mono font-black text-blue-300">
                DRAINAGE SUMP #04 • WATER STAFF GAUGE
              </div>
            </div>
            <div className="p-4 bg-[#101b30] flex items-center justify-between text-xs">
              <div>
                <strong className="text-white text-sm block">Subterranean Retention Reservoir & Dewatering Sump</strong>
                <span className="text-slate-300 font-medium">Clear groundwater pool with staff gauge at 1.2m depth</span>
              </div>
              <span className="font-mono font-bold text-cyan-300 bg-cyan-950 px-3 py-1.5 rounded-xl border border-cyan-500/40">
                PUMPS: ACTIVE
              </span>
            </div>
          </div>

          {/* Distribution list */}
          <div className="bg-[#182642] border border-slate-700 p-5 rounded-3xl shadow-xl flex-1">
            <span className="text-sm text-white font-black uppercase tracking-wider block mb-3">
              All 6 Monitoring Zones Moisture Distribution
            </span>
            <div className="space-y-2.5 font-mono text-xs">
              {nodes.map(n => (
                <div key={n.id} className="flex items-center justify-between gap-3 bg-[#0e172a] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-white font-black text-xs w-20">{n.id}</span>
                  <div className="flex-1 bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-700">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        (n.moisture || 40) >= 88 ? 'bg-red-500' : (n.moisture || 40) >= 70 ? 'bg-amber-400' : 'bg-cyan-400'
                      }`}
                      style={{ width: `${n.moisture || 40}%` }}
                    />
                  </div>
                  <span className="text-sm font-black text-white w-14 text-right">{(n.moisture || 40).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
