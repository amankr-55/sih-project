import React, { useState } from 'react';
import { MapPin, Radio, Battery, Compass, Layers, ShieldCheck, AlertTriangle, HardHat, ExternalLink, ArrowRight, Maximize2 } from 'lucide-react';
import { getAssetUrl } from '../utils/assetHelper';
import ImageLightboxModal from './ImageLightboxModal';

export default function SensorLocationsSection({ nodes, onSelectNode }) {
  const [lightboxData, setLightboxData] = useState(null);

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
      <div className="bg-[#152238] border-2 border-purple-500/50 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-purple-950/80 text-purple-300 border-2 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <MapPin className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide flex flex-wrap items-center gap-3">
              <span>PHYSICAL SENSOR DEPLOYMENT LOCATIONS & GEODETIC CO-ORDINATES</span>
              <span className="text-xs bg-purple-500 text-slate-950 font-black px-3.5 py-1 rounded-full font-mono uppercase">
                CAD / GIS MAP REGISTER
              </span>
            </h2>
            <p className="text-base font-bold text-slate-100 mt-1">
              Precise subterranean anchor depths, pillar tags, coordinates, and real hardware mounting photographs. Click any photo to view in full resolution.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs font-mono font-bold bg-[#0f192b] border border-purple-500/40 px-4 py-2.5 rounded-2xl text-purple-300 shadow-lg shrink-0">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>All 6 Subterranean Beacons Anchored & Georeferenced</span>
        </div>
      </div>

      {/* Grid of 6 Sensor Placement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nodes.map(node => {
          const totalTilt = Math.sqrt(node.tiltX * node.tiltX + node.tiltY * node.tiltY);
          const isCritical = node.status === 'critical';
          const isAdvisory = node.status === 'advisory';
          const imgSrc = node.image ? getAssetUrl(node.image) : getAssetUrl('images/sensor_node.jpg');

          return (
            <div 
              key={node.id}
              className={`bg-[#132240] border-2 rounded-3xl overflow-hidden shadow-2xl flex flex-col transition-all duration-300 hover:border-cyan-400 hover:shadow-cyan-500/20 ${
                isCritical ? 'border-red-500 ring-4 ring-red-500/40' :
                isAdvisory ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-600/80'
              }`}
            >
              {/* Photo Banner with Node Badge - 100% Unobstructed */}
              <div 
                onClick={() => setLightboxData({
                  image: imgSrc,
                  title: `${node.id}: ${node.name}`,
                  desc: `${node.zone} • ${node.seam} • Mounting: ${node.mounting}`,
                  location: `${node.depth} • ${node.coords}`,
                  badge: isCritical ? 'CRITICAL ALERT' : isAdvisory ? 'ADVISORY' : 'NORMAL'
                })}
                className="relative h-56 overflow-hidden bg-black cursor-pointer group"
              >
                <img 
                  src={imgSrc} 
                  alt={node.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 brightness-105 contrast-105"
                />
                
                {/* Node ID Badge */}
                <div className="absolute top-3 left-3 bg-black/85 backdrop-blur border border-cyan-400/60 text-cyan-300 font-mono font-black text-xs px-3.5 py-1 rounded-xl shadow-lg">
                  {node.id}
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`text-xs font-black px-3 py-1 rounded-full uppercase shadow-lg ${
                    isCritical ? 'bg-red-600 text-white animate-pulse' :
                    isAdvisory ? 'bg-amber-400 text-slate-950 font-black' : 'bg-emerald-500 text-slate-950 font-black'
                  }`}>
                    {node.status}
                  </span>
                </div>

                {/* Click to Enlarge hint */}
                <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-black/85 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-xl border border-cyan-400 flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-cyan-400" /> Click to Enlarge
                  </span>
                </div>
              </div>

              {/* Node Metadata Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-black text-white leading-tight">{node.name}</h3>
                  <p className="text-sm text-slate-200 font-bold mt-1">{node.zone} • {node.seam}</p>
                </div>

                {/* Depth & GPS Location Strip */}
                <div className="bg-[#0f192b] p-3 rounded-2xl border border-slate-700 flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-slate-300">Depth: <strong className="text-cyan-300">{node.depth}</strong></span>
                  <span className="text-slate-200">{node.coords}</span>
                </div>

                {/* Mounting details */}
                <div className="bg-[#0f192b] p-3.5 rounded-2xl border border-slate-700 text-xs font-mono space-y-2">
                  <div className="text-xs text-slate-300 font-bold">
                    Mounting: <strong className="text-amber-300 font-sans">{node.mounting}</strong>
                  </div>
                  <div className="text-xs text-slate-200 font-bold">
                    Telemetry: <span className="text-white">Tilt {totalTilt.toFixed(1)}° | Crack {node.crackDisplacement.toFixed(1)}mm | CH4 {node.ch4.toFixed(2)}%</span>
                  </div>
                </div>

                {/* Signal & Battery footer with direct switch button */}
                <div className="pt-3 border-t border-slate-700 flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5 font-bold text-slate-200">
                    <Battery className="w-4 h-4 text-emerald-400" />
                    {node.battery}%
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-cyan-300">
                    <Radio className="w-4 h-4" />
                    {node.rssi} dBm
                  </span>
                  <button
                    onClick={() => onSelectNode(node)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl transition-all shadow-md cursor-pointer text-xs"
                  >
                    <span>Open Tab</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
