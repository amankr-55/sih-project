import React from 'react';
import { AlertTriangle, AlertOctagon, CheckCircle2, Siren, Zap, Flame } from 'lucide-react';

export default function AlarmBanner({ status, maxTilt, maxCrack, maxCH4, maxCO }) {
  if (status === 'critical') {
    return (
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-red-950 border-y-2 border-red-500 py-2.5 px-4 shadow-2xl animate-hazard-pulse">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-white">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-red-600 rounded-lg animate-bounce text-white shadow-lg">
              <Siren className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-black tracking-widest text-sm text-red-200 uppercase flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-red-400" />
                  LEVEL-3 CRITICAL EVACUATION ORDER ACTIVATED
                </span>
                <span className="bg-red-500 text-black text-[10px] font-black px-1.5 py-0.2 rounded uppercase animate-pulse">
                  IMMINENT SUBSIDENCE
                </span>
              </div>
              <p className="text-xs text-red-200/90 font-medium">
                Strata rupture threshold exceeded. Acoustic sirens engaged. Personnel must retreat to designated Refuge Chambers immediately.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono bg-red-950/80 border border-red-500/50 px-3 py-1.5 rounded-lg">
            <div className="flex items-center gap-1 text-red-300">
              <span>MAX TILT:</span>
              <span className="font-bold text-white bg-red-800 px-1 rounded">{maxTilt.toFixed(2)}°</span>
            </div>
            <div className="flex items-center gap-1 text-red-300">
              <span>CRACK:</span>
              <span className="font-bold text-white bg-red-800 px-1 rounded">{maxCrack.toFixed(2)} mm</span>
            </div>
            <div className="flex items-center gap-1 text-amber-300">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span>POWER INTERLOCK:</span>
              <span className="font-bold text-red-400 uppercase">TRIPPED</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'advisory') {
    return (
      <div className="bg-gradient-to-r from-amber-950 via-amber-900/60 to-amber-950 border-y border-amber-500/80 py-2 px-4 shadow-lg animate-advisory-pulse">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-amber-100">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-amber-600/80 rounded-lg text-white">
              <AlertTriangle className="w-5 h-5 text-amber-200" />
            </div>
            <div className="text-left">
              <span className="font-black tracking-wider text-xs text-amber-300 uppercase flex items-center gap-1.5">
                LEVEL-2 ADVISORY: ANOMALOUS STRATA TILT OR MICRO-FRACTURING DETECTED
              </span>
              <p className="text-xs text-amber-200/80">
                Ground movement exceeds 2.5° advisory limit. Safety engineers notified for on-site strata inspection.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono bg-amber-950/70 border border-amber-500/40 px-3 py-1 rounded-lg">
            <div className="flex items-center gap-1 text-amber-300">
              <span>PEAK TILT:</span>
              <span className="font-bold text-white">{maxTilt.toFixed(2)}°</span>
            </div>
            <div className="flex items-center gap-1 text-amber-300">
              <span>CRACK DILATION:</span>
              <span className="font-bold text-white">{maxCrack.toFixed(2)} mm</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal Status
  return (
    <div className="bg-emerald-950/40 border-y border-emerald-500/30 py-1.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-emerald-400">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="font-bold tracking-wide uppercase">
            STATUS NORMAL: ALL WORKINGS & STRATA EQUILIBRIUM WITHIN DGMS STATUTORY LIMITS
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400 text-[11px]">LoRa Sub-GHz RF Telemetry Active & Streaming</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px] font-mono text-slate-300">
          <span>Max Tilt: <strong className="text-emerald-400">{maxTilt.toFixed(2)}°</strong> (Limit 2.5°)</span>
          <span>Max Crack: <strong className="text-emerald-400">{maxCrack.toFixed(2)} mm</strong> (Limit 2.0 mm)</span>
          <span>Methane CH4: <strong className="text-emerald-400">{maxCH4.toFixed(2)}%</strong> (Trip 1.25%)</span>
        </div>
      </div>
    </div>
  );
}
