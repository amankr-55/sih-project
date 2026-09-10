import React, { useState } from 'react';
import { Camera, Eye, CloudFog, Thermometer, ShieldAlert, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';

export default function CameraSection() {
  const [activeViewMode, setActiveViewMode] = useState('split'); // 'split', 'thermal', 'fog'
  const [snapshotTaken, setSnapshotTaken] = useState(false);

  function handleTriggerSnapshot() {
    setSnapshotTaken(true);
    setTimeout(() => setSnapshotTaken(false), 2500);
  }

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30">
            <Camera className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-wider flex items-center gap-2">
              SUBTERRANEAN OPTICAL, THERMAL & FOG-PENETRATION SURVEILLANCE
              <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-500/40 px-2 py-0.5 rounded font-mono">
                AI COMPUTER VISION
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Penetrates 0% Visibility Dense Coal Dust & Fog via AI Edge De-Haze and Long-Wave Infrared (LWIR)
            </p>
          </div>
        </div>

        {/* Vision Filter Toggles */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveViewMode('split')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeViewMode === 'split' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Fog Penetration (AR)
          </button>
          <button
            onClick={() => setActiveViewMode('thermal')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeViewMode === 'thermal' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Thermal Infrared
          </button>
          <button
            onClick={handleTriggerSnapshot}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${snapshotTaken ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{snapshotTaken ? 'Logged to Audit!' : 'Capture Frame'}</span>
          </button>
        </div>
      </div>

      {/* Main Video/Image Feeds Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Primary Camera Display (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white flex items-center gap-2 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse inline-block" />
              {activeViewMode === 'thermal' 
                ? 'MINE-CAM 01: THERMAL STRATA DISPLACEMENT SENSOR (FACE 3-A)'
                : 'MINE-CAM 08: HAULAGE ROADWAY — AI DE-FOG & DUST PENETRATION'}
            </span>
            <span className="text-[10px] text-cyan-400 font-mono bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
              Real-Time AI Stream • 1080p
            </span>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-black group min-h-[380px] flex items-center justify-center">
            {activeViewMode === 'thermal' ? (
              <img
                src="/images/thermal_crack.jpg"
                alt="Thermal Infrared View of Strata Crack"
                className="w-full h-full object-cover max-h-[460px]"
              />
            ) : (
              <img
                src="/images/fog_camera.jpg"
                alt="Fog Penetration Computer Vision View"
                className="w-full h-full object-cover max-h-[460px]"
              />
            )}

            {/* On-Screen Heads-Up Display (HUD) */}
            <div className="absolute top-3 left-3 bg-black/80 backdrop-blur border border-white/20 px-3 py-1.5 rounded-lg text-xs font-mono text-white space-y-0.5">
              <div className="text-cyan-400 font-bold">GEO-VISION HUD v2.4</div>
              <div>ENVIRONMENT: <strong className="text-amber-300">DENSE COAL SMOG & FOG</strong></div>
              <div>PENETRATION ALGORITHM: <strong className="text-emerald-400">ACTIVE DE-HAZE + LWIR</strong></div>
            </div>

            <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur border border-white/20 px-3 py-1 rounded-lg text-xs font-mono text-emerald-400">
              Live Visibility: <span className="text-red-400 font-bold">Raw: 0.0m (Blind)</span> ➔ <span className="text-emerald-300 font-bold">AI Processed: 45.0m</span>
            </div>

            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur border border-white/20 px-3 py-1.5 rounded-lg text-xs font-mono text-white text-right">
              <div>LATENCY: <strong>14 ms</strong></div>
              <div className="text-emerald-400">LINK: <strong>LoRa High-Throughput</strong></div>
            </div>
          </div>

          <div className="mt-2.5 text-xs text-slate-400 flex items-center justify-between">
            <span>💡 Optical cameras fail when coal dust or winter fog rolls in. Our dual-channel thermal & wireframe de-fogging preserves complete tunnel situational awareness.</span>
          </div>
        </div>

        {/* Secondary Cameras & Telemetry (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          
          {/* Secondary Camera Thumbnail 1: Thermal View */}
          <div 
            onClick={() => setActiveViewMode('thermal')}
            className={`bg-slate-900/90 border rounded-2xl p-3 shadow-xl cursor-pointer transition-all hover:border-orange-500/60 ${
              activeViewMode === 'thermal' ? 'border-orange-500 ring-1 ring-orange-500/50' : 'border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5 font-mono">
                <Thermometer className="w-3.5 h-3.5 text-orange-400" />
                CAM 01: Thermal Crack Feed
              </span>
              <span className="text-[10px] font-mono text-orange-400">32.4°C</span>
            </div>
            <div className="relative h-28 rounded-xl overflow-hidden border border-slate-800 bg-black">
              <img 
                src="/images/thermal_crack.jpg" 
                alt="Thermal Crack Preview" 
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-2 bg-black/80 text-[9px] font-mono text-white px-1.5 rounded">
                Click to Expand
              </span>
            </div>
          </div>

          {/* Secondary Camera Thumbnail 2: Fog Camera */}
          <div 
            onClick={() => setActiveViewMode('split')}
            className={`bg-slate-900/90 border rounded-2xl p-3 shadow-xl cursor-pointer transition-all hover:border-cyan-500/60 ${
              activeViewMode === 'split' ? 'border-cyan-500 ring-1 ring-cyan-500/50' : 'border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5 font-mono">
                <CloudFog className="w-3.5 h-3.5 text-cyan-400" />
                CAM 08: Fog-Vision Wireframe
              </span>
              <span className="text-[10px] font-mono text-emerald-400">De-Fog: ON</span>
            </div>
            <div className="relative h-28 rounded-xl overflow-hidden border border-slate-800 bg-black">
              <img 
                src="/images/fog_camera.jpg" 
                alt="Fog Vision Preview" 
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-2 bg-black/80 text-[9px] font-mono text-white px-1.5 rounded">
                Click to Expand
              </span>
            </div>
          </div>

          {/* Secondary Camera Thumbnail 3: Physical Hardware Deployment */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-xl">
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <span className="font-bold text-white font-mono">
                CAM 03: Node 01 Physical Anchor
              </span>
              <span className="text-[10px] font-mono text-cyan-400">Seam #3</span>
            </div>
            <div className="relative h-28 rounded-xl overflow-hidden border border-slate-800 bg-black">
              <img 
                src="/images/sensor_node.jpg" 
                alt="Physical Hardware Node" 
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-2 bg-black/80 text-[9px] font-mono text-emerald-400 px-1.5 rounded">
                Hardware Anchored
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
