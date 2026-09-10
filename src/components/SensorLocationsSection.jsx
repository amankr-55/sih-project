import React from 'react';
import { MapPin, Radio, Battery, Compass, Layers, ShieldCheck, AlertTriangle, HardHat } from 'lucide-react';

export default function SensorLocationsSection({ nodes, onSelectNode }) {
  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-950 text-purple-400 border border-purple-500/30">
            <MapPin className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-wider flex items-center gap-2">
              PHYSICAL SENSOR DEPLOYMENT LOCATIONS & GEODETIC CO-ORDINATES
              <span className="text-[10px] bg-purple-950 text-purple-400 border border-purple-500/40 px-2 py-0.5 rounded font-mono">
                CAD / GIS MAP REGISTER
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Precise subterranean anchor depths, pillar tags, coordinates, and real hardware mounting photographs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-slate-300">All 6 Subterranean Beacons Anchored & Georeferenced</span>
        </div>
      </div>

      {/* Grid of 6 Sensor Placement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nodes.map(node => {
          const totalTilt = Math.sqrt(node.tiltX * node.tiltX + node.tiltY * node.tiltY);
          const isCritical = node.status === 'critical';
          const isAdvisory = node.status === 'advisory';

          return (
            <div 
              key={node.id}
              className={`bg-slate-900/90 border rounded-2xl overflow-hidden shadow-xl flex flex-col transition-all duration-300 hover:border-cyan-500/60 ${
                isCritical ? 'border-red-500/80 ring-1 ring-red-500/50' :
                isAdvisory ? 'border-amber-500/80' : 'border-slate-800'
              }`}
            >
              {/* Photo Banner with Node Badge */}
              <div className="relative h-44 overflow-hidden bg-slate-950">
                <img 
                  src={node.image || "./images/sensor_node.jpg"} 
                  alt={node.name} 
                  className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity"
                />
                
                {/* Node ID Badge */}
                <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur border border-cyan-500/40 text-cyan-300 font-mono font-bold text-xs px-2.5 py-1 rounded-lg">
                  {node.id}
                </div>

                {/* Status Badge */}
                <div className="absolute top-2.5 right-2.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow ${
                    isCritical ? 'bg-red-600 text-white animate-pulse' :
                    isAdvisory ? 'bg-amber-500 text-black' : 'bg-emerald-600 text-white'
                  }`}>
                    {node.status}
                  </span>
                </div>

                {/* Depth & GPS Overlay */}
                <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur border border-white/10 px-2.5 py-1 rounded-lg text-[11px] font-mono text-slate-200 flex justify-between">
                  <span>Depth: <strong className="text-cyan-400">{node.depth}</strong></span>
                  <span>{node.coords}</span>
                </div>
              </div>

              {/* Node Metadata Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">{node.name}</h3>
                  <p className="text-xs text-slate-400 font-medium">{node.zone} • {node.seam}</p>
                </div>

                {/* Mounting details */}
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 text-xs font-mono space-y-1">
                  <div className="text-[11px] text-slate-400">
                    Mounting: <strong className="text-amber-400 font-sans">{node.mounting}</strong>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Telemetry: <span className="text-slate-200">Tilt {totalTilt.toFixed(1)}° | Crack {node.crackDisplacement.toFixed(1)}mm | CH4 {node.ch4.toFixed(2)}%</span>
                  </div>
                </div>

                {/* Signal & Battery footer */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Battery className="w-3.5 h-3.5 text-emerald-400" />
                    {node.battery}% LiFePO4
                  </span>
                  <span className="flex items-center gap-1 text-cyan-400">
                    <Radio className="w-3.5 h-3.5" />
                    {node.rssi} dBm (LoRa)
                  </span>
                  <button
                    onClick={() => onSelectNode(node)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer"
                  >
                    Inspect
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
