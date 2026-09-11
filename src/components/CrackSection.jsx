import React, { useState } from 'react';
import { Ruler, AlertTriangle, Eye, ShieldCheck, Thermometer, ArrowUpRight, Camera, CheckCircle2, Maximize2 } from 'lucide-react';
import { DGMS_THRESHOLDS } from '../utils/mockDataStream';
import { getAssetUrl } from '../utils/assetHelper';
import ImageLightboxModal from './ImageLightboxModal';

export default function CrackSection({ nodes, maxCrack }) {
  const [selectedNodeId, setSelectedNodeId] = useState('NODE-01');
  const [viewMode, setViewMode] = useState('real'); // 'real' | 'thermal'
  const [lightboxData, setLightboxData] = useState(null);
  const activeNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  const isCriticalCrack = activeNode.crackDisplacement >= DGMS_THRESHOLDS.CRACK_CRITICAL;
  const isAdvisoryCrack = activeNode.crackDisplacement >= DGMS_THRESHOLDS.CRACK_ADVISORY;
  const crackRate = activeNode.crackRate || 0.04;

  const currentImg = viewMode === 'real' ? getAssetUrl('images/real_mine_crack.jpg') : getAssetUrl('images/thermal_crack.jpg');

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

      {/* Header Banner */}
      <div className="bg-[#152238] border-2 border-amber-500/50 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-amber-950/80 text-amber-300 border-2 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
            <Ruler className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide flex flex-wrap items-center gap-3">
              <span>STRATA CRACK DILATION & EXTENSOMETER SENSING</span>
              <span className="text-xs bg-amber-500 text-slate-950 px-3.5 py-1 rounded-full font-mono font-black uppercase">
                LINEAR DISPLACEMENT MONITOR
              </span>
            </h2>
            <p className="text-base font-bold text-slate-100 mt-1">
              High-Precision Potentiometric & LVDT Extensometers • Tracks Continuous Dilation Rate (mm/hr)
            </p>
          </div>
        </div>

        {/* Node Selector */}
        <div className="flex items-center gap-3 bg-[#0f192b] p-2.5 rounded-2xl border border-slate-700 shadow-lg">
          <span className="text-sm font-black text-white">Inspect Station:</span>
          <select
            value={selectedNodeId}
            onChange={(e) => setSelectedNodeId(e.target.value)}
            className="bg-[#16233d] text-amber-300 font-mono text-sm font-black border border-amber-500/50 px-4 py-2 rounded-xl outline-none cursor-pointer shadow-md"
          >
            {nodes.map(n => (
              <option key={n.id} value={n.id}>{n.id} — {n.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Dual Camera/Visual View + Telemetry Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Real Photographic vs Thermal View (7 cols) */}
        <div className="lg:col-span-7 bg-[#132240] border-2 border-slate-600/80 rounded-3xl p-6 shadow-2xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('real')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  viewMode === 'real'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'bg-[#0f192b] text-slate-200 hover:text-white border border-slate-700'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>REAL FIELD EXTENSOMETER PHOTO</span>
              </button>
              <button
                onClick={() => setViewMode('thermal')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  viewMode === 'thermal'
                    ? 'bg-orange-500 text-slate-950 shadow-md font-bold'
                    : 'bg-[#0f192b] text-slate-200 hover:text-white border border-slate-700'
                }`}
              >
                <Thermometer className="w-4 h-4" />
                <span>FLIR THERMAL INFRARED</span>
              </button>
            </div>
            <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-3 py-1 rounded-xl">
              {viewMode === 'real' ? 'OPTICAL HIGH-RES MACRO' : 'FLIR THERMAL PALETTE'}
            </span>
          </div>

          {/* Photo Viewport - Unobstructed */}
          <div 
            onClick={() => setLightboxData({
              image: currentImg,
              title: viewMode === 'real' ? 'Real Field Mine Extensometer' : 'FLIR Thermal Strata Crack View',
              desc: `Station: ${activeNode.name} • Fracture Dilation: ${activeNode.crackDisplacement.toFixed(2)}mm`,
              location: activeNode.zone || activeNode.name,
              badge: viewMode === 'real' ? 'OPTICAL MACRO' : 'FLIR THERMAL'
            })}
            className="relative rounded-2xl overflow-hidden border-2 border-slate-600 group flex-1 min-h-[320px] bg-black cursor-pointer shadow-2xl"
          >
            <img 
              src={currentImg} 
              alt={viewMode === 'real' ? "Real Subterranean Mine Wall Digital Extensometer" : "Thermal View of Mine Strata Crack"} 
              className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-103 brightness-105 contrast-105"
            />
            
            {/* Non-intrusive click-to-enlarge hint */}
            <div className="absolute top-3 right-3 bg-black/75 backdrop-blur px-3 py-1.5 rounded-xl border border-white/30 text-xs font-mono font-bold text-white flex items-center gap-2 shadow-lg group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Click to Enlarge</span>
            </div>
          </div>

          {/* Info bar under image */}
          <div className="bg-[#0f192b] p-4 rounded-2xl border border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[11px]">INSPECTED SEAM LOCATION:</span>
              <strong className="text-white text-sm font-bold">{activeNode.name} ({activeNode.zone})</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">DILATION READING:</span>
              <strong className="text-amber-400 text-sm font-black">{activeNode.crackDisplacement.toFixed(2)} mm</strong>
            </div>
            <div className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Caliper Lock: ±0.01 mm</span>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-100 mt-1">
            {viewMode === 'real' 
              ? 'High-resolution macro view of subterranean coal rib with high-tensile anchor bolts and digital linear potentiometer tracking micro-crack shearing.'
              : 'Thermal differential reveals subterranean fissure expanding under pressure. Thermal signatures bypass darkness and coal dust fog.'}
          </p>
        </div>

        {/* Right: Telemetry & Shear Rupture Analysis (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          {/* Crack Width Card */}
          <div className="bg-[#132240] border-2 border-slate-600/80 rounded-3xl p-6 shadow-2xl">
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
          <div className="bg-[#132240] border-2 border-slate-600/80 rounded-3xl p-6 shadow-2xl">
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
            <p className="text-sm font-semibold text-slate-100 mt-2">
              DGMS Warning Threshold: Velocity &gt;0.5 mm/hr indicates rapid strata creep and shear rupture risk.
            </p>
          </div>

          {/* Extensometer Hardware Health */}
          <div className="bg-[#132240] border-2 border-slate-600/80 rounded-3xl p-6 shadow-2xl">
            <span className="text-xs text-slate-300 font-black uppercase tracking-wider block mb-2.5">
              Extensometer Sensor Specification
            </span>
            <div className="text-sm font-mono space-y-2 text-slate-100 font-bold">
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
