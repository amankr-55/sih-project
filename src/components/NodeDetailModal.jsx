import React from 'react';
import { X, Battery, Wifi, Thermometer, Droplets, AlertTriangle, ShieldCheck, Compass } from 'lucide-react';
import { DGMS_THRESHOLDS } from '../utils/mockDataStream';

export default function NodeDetailModal({ node, onClose, onSimulateNodeChange }) {
  if (!node) return null;

  const totalTilt = Math.sqrt(node.tiltX * node.tiltX + node.tiltY * node.tiltY);
  const isCritical = totalTilt >= DGMS_THRESHOLDS.TILT_CRITICAL || node.crackDisplacement >= DGMS_THRESHOLDS.CRACK_CRITICAL;
  const isAdvisory = !isCritical && (totalTilt >= DGMS_THRESHOLDS.TILT_ADVISORY || node.crackDisplacement >= DGMS_THRESHOLDS.CRACK_ADVISORY);

  let statusBadge = (
    <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-full">
      <ShieldCheck className="w-3.5 h-3.5" /> STATUTORY SAFE
    </span>
  );

  if (isCritical) {
    statusBadge = (
      <span className="flex items-center gap-1 text-xs font-bold text-red-400 bg-red-950/80 border border-red-500/40 px-2.5 py-1 rounded-full animate-pulse">
        <AlertTriangle className="w-3.5 h-3.5" /> CRITICAL EVACUATION LIMIT
      </span>
    );
  } else if (isAdvisory) {
    statusBadge = (
      <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-950/80 border border-amber-500/40 px-2.5 py-1 rounded-full">
        <AlertTriangle className="w-3.5 h-3.5" /> ADVISORY THRESHOLD
      </span>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-950 text-cyan-400 border border-cyan-500/30 rounded-xl font-mono font-black text-sm">
              {node.id}
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">{node.name}</h3>
              <p className="text-xs text-slate-400">{node.zone} • {node.seam}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {statusBadge}
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          
          {/* Geotechnical metrics card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Geotechnical Strata Displacement</span>
              <span className="font-mono text-slate-500">DGMS Ref: CMR 111</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
                <span className="text-[10px] text-slate-400 block font-medium">Biaxial Tilt (Total)</span>
                <span className={`text-lg font-mono font-black ${
                  totalTilt >= 5.0 ? 'text-red-400' : totalTilt >= 2.5 ? 'text-amber-400' : 'text-white'
                }`}>
                  {totalTilt.toFixed(2)}°
                </span>
                <span className="text-[9px] text-slate-500 block">Limit: 2.5°</span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
                <span className="text-[10px] text-slate-400 block font-medium">Tilt X / Y Axes</span>
                <span className="text-sm font-mono font-bold text-slate-200 block mt-1">
                  X: {node.tiltX.toFixed(1)}° | Y: {node.tiltY.toFixed(1)}°
                </span>
                <span className="text-[9px] text-slate-500 block">Inclinometer</span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
                <span className="text-[10px] text-slate-400 block font-medium">Crack Dilation</span>
                <span className={`text-lg font-mono font-black ${
                  node.crackDisplacement >= 4.0 ? 'text-red-400' : node.crackDisplacement >= 2.0 ? 'text-amber-400' : 'text-white'
                }`}>
                  {node.crackDisplacement.toFixed(2)} mm
                </span>
                <span className="text-[9px] text-slate-500 block">Limit: 2.0 mm</span>
              </div>
            </div>
          </div>

          {/* Environmental & Gas card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-2.5">
              Atmospheric & Gas Telemetry
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Methane CH4</span>
                  <span className={`text-base font-mono font-black ${node.ch4 >= 1.25 ? 'text-red-400' : 'text-white'}`}>
                    {node.ch4.toFixed(2)}% vol
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Trip: 1.25%</span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Carbon Monoxide CO</span>
                  <span className={`text-base font-mono font-black ${node.co >= 50 ? 'text-red-400' : 'text-white'}`}>
                    {node.co.toFixed(1)} ppm
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Warn: 25 ppm</span>
              </div>
            </div>
          </div>

          {/* Hardware Health Bar */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-slate-950/60 border border-slate-800 p-2 rounded-lg">
              <Thermometer className="w-3.5 h-3.5 mx-auto text-amber-400 mb-1" />
              <span className="text-slate-400 text-[10px] block">Temperature</span>
              <span className="font-mono font-bold text-white">{node.temperature}°C</span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 p-2 rounded-lg">
              <Droplets className="w-3.5 h-3.5 mx-auto text-blue-400 mb-1" />
              <span className="text-slate-400 text-[10px] block">Humidity</span>
              <span className="font-mono font-bold text-white">{node.humidity}%</span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 p-2 rounded-lg">
              <Battery className="w-3.5 h-3.5 mx-auto text-emerald-400 mb-1" />
              <span className="text-slate-400 text-[10px] block">Battery</span>
              <span className="font-mono font-bold text-white">{node.battery}%</span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 p-2 rounded-lg">
              <Wifi className="w-3.5 h-3.5 mx-auto text-cyan-400 mb-1" />
              <span className="text-slate-400 text-[10px] block">LoRa RSSI</span>
              <span className="font-mono font-bold text-white">{node.rssi} dBm</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-950 border-t border-slate-800 p-3 px-5 flex items-center justify-between text-xs">
          <span className="text-slate-400">Node Transmission Interval: <strong className="text-white">1000 ms</strong></span>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
}
