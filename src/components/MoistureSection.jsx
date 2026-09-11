import React, { useEffect, useRef, useState } from 'react';
import { Droplets, Waves, AlertTriangle, ShieldCheck, Gauge, CheckCircle2, Maximize2 } from 'lucide-react';
import { DGMS_THRESHOLDS } from '../utils/mockDataStream';
import { getAssetUrl } from '../utils/assetHelper';
import ImageLightboxModal from './ImageLightboxModal';

export default function MoistureSection({ nodes }) {
  const [selectedNodeId, setSelectedNodeId] = useState('NODE-01');
  const [lightboxData, setLightboxData] = useState(null);
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
      
      {/* Lightbox Modal */}
      {lightboxData && (
        <ImageLightboxModal 
          isOpen={!!lightboxData}
          onClose={() => setLightboxData(null)}
          imageSrc={lightboxData.image}
          title={lightboxData.title}
          subtitle={lightboxData.desc}
          location={lightboxData.location}
          badge={lightboxData.badge}
        />
      )}

      {/* Header Banner - High Contrast */}
      <div className="bg-[#152238] border-2 border-cyan-500/60 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-blue-500/30 text-blue-300 border-2 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            <Droplets className="w-10 h-10 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide flex flex-wrap items-center gap-3">
              <span>PORE-WATER SATURATION & SOIL LIQUEFACTION MONITOR</span>
              <span className="text-xs bg-cyan-500 text-slate-950 font-black px-3.5 py-1 rounded-full uppercase">
                AQUIFER SENSING
              </span>
            </h2>
            <p className="text-base text-slate-100 font-bold mt-1">
              Capacitive soil moisture probe & piezometer telemetry • Early detection of strata slurry liquefaction & inrush
            </p>
          </div>
        </div>

        {/* Node selector */}
        <div className="flex items-center gap-3 bg-[#0f192b] p-2.5 rounded-2xl border border-slate-700 shadow-lg">
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
        <div className="lg:col-span-6 bg-[#132240] border-2 border-slate-600/80 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
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
              <div className="absolute top-3 left-4 font-mono text-xs text-white bg-black/75 px-3 py-1.5 rounded-xl border border-white/20">
                Subterranean Piezometer: {activeNode.id}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs font-mono text-slate-200">
            <span>Critical Saturation: &gt;88.0%</span>
            <span className="text-cyan-400 font-bold">Dynamic Wave Propagation: Active</span>
          </div>
        </div>

        {/* Liquefaction Hazard Metric Cards (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          
          {/* Liquefaction Warning Card */}
          <div className={`p-6 rounded-3xl border-2 shadow-2xl flex items-center justify-between ${
            isCritical 
              ? 'bg-red-950/90 border-red-500 text-red-100 animate-hazard-pulse' 
              : isAdvisory 
              ? 'bg-amber-950/80 border-amber-500 text-amber-100' 
              : 'bg-[#132240] border-slate-600/80 text-white'
          }`}>
            <div>
              <span className="text-xs font-black uppercase tracking-wider font-mono block mb-1">
                Strata Liquefaction Assessment
              </span>
              <h3 className="text-2xl font-black">
                {isCritical ? 'CRITICAL SLURRY INRUSH RISK' : isAdvisory ? 'ADVISORY: ELEVATED PORE PRESSURE' : 'SOIL COHESION STABLE'}
              </h3>
              <p className="text-sm font-bold text-slate-100 mt-1">
                {isCritical 
                  ? 'Pore water pressure exceeds effective vertical overburden stress. Immediate pump boost required!' 
                  : isAdvisory 
                  ? 'Water saturation approaching critical shear-failure threshold.' 
                  : 'Capacitive sensors confirm normal dry sandstone strata matrix.'}
              </p>
            </div>
            <Gauge className="w-12 h-12 shrink-0 opacity-90" />
          </div>

          {/* Real Sump Photo Card - Full Visibility & Click to Enlarge */}
          <div 
            onClick={() => setLightboxData({
              image: getAssetUrl('images/mine_water_sump.jpg'),
              title: 'Subterranean Retention Reservoir & Dewatering Sump',
              desc: 'Subterranean water retention sump with staff gauge and submersible dewatering pumps. Monitors pore pressure to prevent quicksand strata liquefaction.',
              location: 'Shaft 2 Bottom Dewatering Sump #04',
              badge: 'AQUIFER SURVEILLANCE'
            })}
            className="bg-[#132240] border-2 border-slate-600/80 rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
          >
            <div className="relative h-56 overflow-hidden bg-black">
              <img
                src={getAssetUrl('images/mine_water_sump.jpg')}
                alt="Underground Drainage Sump"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103 brightness-105 contrast-105"
              />
              <div className="absolute top-3 left-3 bg-blue-600 text-white font-mono font-black text-xs px-3 py-1 rounded-xl shadow-lg">
                DRAINAGE SUMP #04 • WATER STAFF GAUGE
              </div>
              <div className="absolute top-3 right-3 bg-black/75 backdrop-blur px-3 py-1.5 rounded-xl border border-white/30 text-xs font-mono font-bold text-white flex items-center gap-2 shadow-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Click to Enlarge</span>
              </div>
            </div>

            <div className="p-4 bg-[#0f192b] flex items-center justify-between text-xs border-t border-slate-700">
              <div>
                <strong className="text-white text-sm block">Subterranean Retention Reservoir & Dewatering Sump</strong>
                <span className="text-slate-200 font-bold">Clear groundwater pool with staff gauge at 1.2m depth</span>
              </div>
              <span className="font-mono font-black text-cyan-300 bg-cyan-950 px-3 py-1.5 rounded-xl border border-cyan-500/40">
                PUMPS: ACTIVE
              </span>
            </div>
          </div>

          {/* Distribution list */}
          <div className="bg-[#132240] border-2 border-slate-600/80 p-6 rounded-3xl shadow-2xl flex-1">
            <span className="text-sm text-white font-black uppercase tracking-wider block mb-3">
              All 6 Monitoring Zones Moisture Distribution
            </span>
            <div className="space-y-3 font-mono text-xs">
              {nodes.map(n => (
                <div key={n.id} className="flex items-center justify-between gap-3 bg-[#0f192b] p-3 rounded-2xl border border-slate-700">
                  <span className="text-white font-black text-xs w-20">{n.id}</span>
                  <div className="flex-1 bg-slate-900 rounded-full h-3.5 overflow-hidden border border-slate-700">
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
