import React from 'react';
import { MapPin, Radio, Battery, Compass, Layers, ShieldCheck, AlertTriangle, HardHat, ExternalLink, ArrowRight } from 'lucide-react';

export default function SensorLocationsSection({ nodes, onSelectNode }) {
  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 border-2 border-purple-500/40 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-purple-950/80 text-purple-300 border-2 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <MapPin className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-wider flex items-center gap-2">
              PHYSICAL SENSOR DEPLOYMENT LOCATIONS & GEODETIC CO-ORDINATES
              <span className="text-xs bg-purple-950 text-purple-300 border border-purple-500/60 px-2.5 py-0.5 rounded font-mono font-bold">
                CAD / GIS MAP REGISTER
              </span>
            </h2>
            <p className="text-sm font-semibold text-slate-200">
              Precise subterranean anchor depths, pillar tags, coordinates, and real hardware mounting photographs. Click any station to open its Dedicated Sensor Health Tab.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs font-mono font-bold bg-slate-950 border border-purple-500/40 px-4 py-2 rounded-xl text-purple-300 shadow-lg">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>All 6 Subterranean Beacons Anchored & Georeferenced</span>
        </div>
      </div>

      {/* Grid of 6 Sensor Placement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {nodes.map(node => {
          const totalTilt = Math.sqrt(node.tiltX * node.tiltX + node.tiltY * node.tiltY);
          const isCritical = node.status === 'critical';
          const isAdvisory = node.status === 'advisory';

          return (
            <div 
              key={node.id}
              className={`bg-slate-900/95 border-2 rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-all duration-300 hover:border-cyan-400 hover:shadow-cyan-500/20 ${
                isCritical ? 'border-red-500 ring-2 ring-red-500/50' :
                isAdvisory ? 'border-amber-400' : 'border-slate-700/80'
              }`}
            >
              {/* Photo Banner with Node Badge */}
              <div className="relative h-48 overflow-hidden bg-slate-950">
                <img 
                  src={node.image || "./images/sensor_node.jpg"} 
                  alt={node.name} 
                  className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity hover:scale-105 duration-500"
                />
                
                {/* Node ID Badge */}
                <div className="absolute top-3 left-3 bg-black/85 backdrop-blur border border-cyan-400/60 text-cyan-300 font-mono font-black text-xs px-3 py-1 rounded-lg shadow-lg">
                  {node.id}
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full uppercase shadow-lg ${
                    isCritical ? 'bg-red-600 text-white animate-pulse' :
                    isAdvisory ? 'bg-amber-400 text-slate-950 font-black' : 'bg-emerald-500 text-slate-950 font-black'
                  }`}>
                    {node.status}
                  </span>
                </div>

                {/* Depth & GPS Overlay */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-black/85 backdrop-blur border border-white/20 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-white flex justify-between shadow-lg">
                  <span>Depth: <strong className="text-cyan-300">{node.depth}</strong></span>
                  <span className="text-slate-200">{node.coords}</span>
                </div>
              </div>

              {/* Node Metadata Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base font-black text-white leading-tight">{node.name}</h3>
                  <p className="text-xs text-slate-200 font-bold mt-0.5">{node.zone} • {node.seam}</p>
                </div>

                {/* Mounting details */}
                <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5">
                  <div className="text-xs text-slate-300 font-bold">
                    Mounting: <strong className="text-amber-300 font-sans">{node.mounting}</strong>
                  </div>
                  <div className="text-xs text-slate-300 font-bold">
                    Telemetry: <span className="text-white">Tilt {totalTilt.toFixed(1)}° | Crack {node.crackDisplacement.toFixed(1)}mm | CH4 {node.ch4.toFixed(2)}%</span>
                  </div>
                </div>

                {/* Signal & Battery footer with direct switch button */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
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
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-lg transition-all shadow cursor-pointer text-xs"
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
