import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine, 
  CartesianGrid, 
  AreaChart,
  Area
} from 'recharts';
import { 
  Activity, 
  Compass, 
  Ruler, 
  Thermometer, 
  Zap, 
  Wind, 
  LayoutGrid, 
  Maximize2,
  TrendingUp,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import { DGMS_THRESHOLDS } from '../utils/mockDataStream';

// Professional Control Room Dark Tooltip
const ControlRoomTooltip = ({ active, payload, label, unit = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/95 border border-cyan-500/30 p-2.5 rounded-xl shadow-2xl backdrop-blur-xl text-xs font-mono">
        <div className="text-slate-400 font-bold border-b border-slate-800 pb-1 mb-1.5 flex items-center justify-between gap-4">
          <span>{label}</span>
          <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-cyan-400 border border-slate-700">
            REAL-TIME
          </span>
        </div>
        {payload.map((entry, index) => (
          <div key={`tip-${index}`} className="flex items-center justify-between gap-4 py-0.5">
            <span style={{ color: entry.color }} className="font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full inline-block shadow-sm" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="text-white font-black">
              {entry.value} {unit}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function TelemetryPanels({ 
  historyData, 
  status,
  serialConnected = false,
  isSimStreamActive = false,
  onToggleSimStream
}) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'focused'
  const [selectedMetric, setSelectedMetric] = useState('tilt'); // 'tilt', 'vibration', 'crack', 'temp', 'freq', 'gas'

  // Latest readings calculation
  const latest = historyData[historyData.length - 1] || {};
  const currentTilt = +(latest.tilt || 0).toFixed(2);
  const currentVib = +(latest.vibration || 0.01).toFixed(2);
  const currentCrack = +(latest.crack || 0).toFixed(2);
  const currentTemp = +(latest.temp || 28.5).toFixed(1);
  const currentFreq = +(latest.freq || 0).toFixed(1);
  const currentCH4 = +(latest.ch4 || 0.22).toFixed(2);
  const currentCO = +(latest.co || 6.5).toFixed(1);

  // Peak metrics in current window
  const maxTiltInWindow = Math.max(...historyData.map(d => d.tilt || 0), 0);
  const maxVibInWindow = Math.max(...historyData.map(d => d.vibration || 0), 0);
  const maxCrackInWindow = Math.max(...historyData.map(d => d.crack || 0), 0);
  const maxTempInWindow = Math.max(...historyData.map(d => d.temp || 0), 0);
  const maxFreqInWindow = Math.max(...historyData.map(d => d.freq || 0), 0);
  const maxCH4InWindow = Math.max(...historyData.map(d => d.ch4 || 0), 0);

  return (
    <div className="flex flex-col gap-4 h-full animate-fade-in">
      
      {/* Control Header & Mode Switcher */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white tracking-wide">
                MULTI-PARAMETRIC TELEMETRY ARRAYS
              </h2>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded font-mono font-bold">
                SEPARATED SENSOR STREAMS
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              High-frequency real-time physical telemetry segregated by parameter
            </p>
          </div>
        </div>

        {/* Hardware Status / Simulation Stream Controller */}
        <div className="flex flex-wrap items-center gap-2">
          {serialConnected ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 font-mono text-xs font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              🟢 SENSOR CONNECTED (LIVE 115200 BAUD)
            </span>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-400 font-mono text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                SENSOR NOT CONNECTED • GRAPHS PAUSED
              </span>
              {onToggleSimStream && (
                <button
                  onClick={onToggleSimStream}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-black transition-all cursor-pointer shadow-md ${
                    isSimStreamActive
                      ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30 animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40'
                  }`}
                  title={isSimStreamActive ? 'Pause synthetic simulation data' : 'Run synthetic simulation stream for testing'}
                >
                  <span>{isSimStreamActive ? '⏸️ PAUSE SIMULATION' : '▶️ TEST WITH SIMULATION'}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* View Layout Toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Multi-Grid View</span>
          </button>
          <button
            onClick={() => setViewMode('focused')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              viewMode === 'focused'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>HD Focus View</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW MODE 1: DEDICATED MULTI-GRID VIEW (ALL 6 SEPARATED GRAPHS) */}
      {/* ========================================================================= */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* 1. SEPARATE TILT ANGLE GRAPH */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4 shadow-xl flex flex-col justify-between transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white tracking-wide">1. TILT ANGLE</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Biaxial Inclinometer</span>
                </div>
              </div>
              <div className="text-right font-mono">
                <div className={`text-base font-black ${currentTilt >= DGMS_THRESHOLDS.TILT_CRITICAL ? 'text-red-400 animate-pulse' : currentTilt >= DGMS_THRESHOLDS.TILT_ADVISORY ? 'text-amber-400' : 'text-cyan-400'}`}>
                  {currentTilt}°
                </div>
                <div className="text-[10px] text-amber-300 font-bold">Peak: {maxTiltInWindow.toFixed(2)}° | Cutoff: 3.8°</div>
              </div>
            </div>

            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tiltGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={9} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={9} tickLine={false} domain={[0, 'dataMax + 1']} />
                  <Tooltip content={<ControlRoomTooltip unit="°" />} />
                  <ReferenceLine y={DGMS_THRESHOLDS.TILT_ADVISORY} stroke="#f59e0b" strokeDasharray="3 3" />
                  <ReferenceLine y={DGMS_THRESHOLDS.TILT_CRITICAL} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={2} label={{ value: '⛔ DANGER >3.8°', fill: '#ef4444', fontSize: 9, position: 'insideTopRight' }} />
                  <Area type="monotone" dataKey="tilt" name="Tilt (°)" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#tiltGrad)" dot={false} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono border-t border-slate-800 pt-2 mt-2">
              <span className="text-slate-400">DGMS Limit: 2.5° / 3.8°</span>
              <span className={`px-2 py-0.5 rounded font-bold ${currentTilt >= DGMS_THRESHOLDS.TILT_CRITICAL ? 'bg-red-950 text-red-300 animate-pulse' : currentTilt >= DGMS_THRESHOLDS.TILT_ADVISORY ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'}`}>
                {currentTilt >= DGMS_THRESHOLDS.TILT_CRITICAL ? '🚨 DANGER EXCEEDED' : currentTilt >= DGMS_THRESHOLDS.TILT_ADVISORY ? 'ADVISORY' : 'NORMAL'}
              </span>
            </div>
          </div>

          {/* 2. SEPARATE VIBRATION / G-FORCE GRAPH */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-4 shadow-xl flex flex-col justify-between transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-950 text-purple-400 border border-purple-500/30">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white tracking-wide">2. SEISMIC VIBRATION</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Dynamic Rock Shock</span>
                </div>
              </div>
              <div className="text-right font-mono">
                <div className={`text-base font-black ${currentVib >= DGMS_THRESHOLDS.VIBRATION_CRITICAL ? 'text-red-400 animate-pulse' : currentVib >= DGMS_THRESHOLDS.VIBRATION_ADVISORY ? 'text-amber-400' : 'text-purple-400'}`}>
                  {currentVib} g
                </div>
                <div className="text-[10px] text-amber-300 font-bold">Peak: {maxVibInWindow.toFixed(2)} g | Cutoff: 0.35g</div>
              </div>
            </div>

            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="vibGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={9} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={9} tickLine={false} domain={[0, 'dataMax + 0.2']} />
                  <Tooltip content={<ControlRoomTooltip unit="g" />} />
                  <ReferenceLine y={DGMS_THRESHOLDS.VIBRATION_ADVISORY} stroke="#f59e0b" strokeDasharray="3 3" />
                  <ReferenceLine y={DGMS_THRESHOLDS.VIBRATION_CRITICAL} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={2} label={{ value: '⛔ DANGER >0.35g (ROCKBURST)', fill: '#ef4444', fontSize: 9, position: 'insideTopRight' }} />
                  <Area type="monotone" dataKey="vibration" name="Vibration (g)" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#vibGrad)" dot={false} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono border-t border-slate-800 pt-2 mt-2">
              <span className="text-slate-400">Drill: 0.22g | Danger: &gt;0.35g</span>
              <span className={`px-2 py-0.5 rounded font-bold ${currentVib >= DGMS_THRESHOLDS.VIBRATION_CRITICAL ? 'bg-red-950 text-red-300 animate-pulse' : currentVib >= DGMS_THRESHOLDS.VIBRATION_ADVISORY ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'}`}>
                {currentVib >= DGMS_THRESHOLDS.VIBRATION_CRITICAL ? '🚨 DANGER EXCEEDED' : currentVib >= DGMS_THRESHOLDS.VIBRATION_ADVISORY ? 'ADVISORY' : 'NORMAL'}
              </span>
            </div>
          </div>

          {/* 3. SEPARATE CRACK DILATION GRAPH */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 shadow-xl flex flex-col justify-between transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-950 text-amber-400 border border-amber-500/30">
                  <Ruler className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white tracking-wide">3. CRACK DILATION</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Rock Shear Gauge</span>
                </div>
              </div>
              <div className="text-right font-mono">
                <div className={`text-base font-black ${currentCrack >= DGMS_THRESHOLDS.CRACK_CRITICAL ? 'text-red-400 animate-pulse' : currentCrack >= DGMS_THRESHOLDS.CRACK_ADVISORY ? 'text-amber-400' : 'text-amber-400'}`}>
                  {currentCrack} mm
                </div>
                <div className="text-[10px] text-amber-300 font-bold">Peak: {maxCrackInWindow.toFixed(2)} mm | Cutoff: 4.0mm</div>
              </div>
            </div>

            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="crackGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={9} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={9} tickLine={false} domain={[0, 'dataMax + 0.5']} />
                  <Tooltip content={<ControlRoomTooltip unit="mm" />} />
                  <ReferenceLine y={DGMS_THRESHOLDS.CRACK_ADVISORY} stroke="#f59e0b" strokeDasharray="3 3" />
                  <ReferenceLine y={DGMS_THRESHOLDS.CRACK_CRITICAL} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={2} label={{ value: '⛔ DANGER >4.0mm', fill: '#ef4444', fontSize: 9, position: 'insideTopRight' }} />
                  <Area type="monotone" dataKey="crack" name="Crack (mm)" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#crackGrad)" dot={false} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono border-t border-slate-800 pt-2 mt-2">
              <span className="text-slate-400">DGMS Limit: 2.0 / 4.0 mm</span>
              <span className={`px-2 py-0.5 rounded font-bold ${currentCrack >= DGMS_THRESHOLDS.CRACK_CRITICAL ? 'bg-red-950 text-red-300 animate-pulse' : currentCrack >= DGMS_THRESHOLDS.CRACK_ADVISORY ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'}`}>
                {currentCrack >= DGMS_THRESHOLDS.CRACK_CRITICAL ? '🚨 DANGER EXCEEDED' : currentCrack >= DGMS_THRESHOLDS.CRACK_ADVISORY ? 'ADVISORY' : 'NORMAL'}
              </span>
            </div>
          </div>

          {/* 4. SEPARATE TEMPERATURE PROFILE GRAPH */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-rose-500/40 rounded-2xl p-4 shadow-xl flex flex-col justify-between transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-950 text-rose-400 border border-rose-500/30">
                  <Thermometer className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white tracking-wide">4. TEMPERATURE</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Geothermal & Sensor Die</span>
                </div>
              </div>
              <div className="text-right font-mono">
                <div className={`text-base font-black ${currentTemp >= 45 ? 'text-red-400 animate-pulse' : currentTemp >= 38 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {currentTemp}°C
                </div>
                <div className="text-[10px] text-amber-300 font-bold">Peak: {maxTempInWindow.toFixed(1)}°C | Cutoff: 45°C</div>
              </div>
            </div>

            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={9} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={9} tickLine={false} domain={[20, 'dataMax + 5']} />
                  <Tooltip content={<ControlRoomTooltip unit="°C" />} />
                  <ReferenceLine y={DGMS_THRESHOLDS.TEMP_ADVISORY} stroke="#f59e0b" strokeDasharray="3 3" />
                  <ReferenceLine y={45.0} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={2} label={{ value: '⛔ DANGER >45°C (FIRE)', fill: '#ef4444', fontSize: 9, position: 'insideTopRight' }} />
                  <Area type="monotone" dataKey="temp" name="Temp (°C)" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#tempGrad)" dot={false} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono border-t border-slate-800 pt-2 mt-2">
              <span className="text-slate-400">DGMS Limit: 38.0°C / 45.0°C</span>
              <span className={`px-2 py-0.5 rounded font-bold ${currentTemp >= 45 ? 'bg-red-950 text-red-300 animate-pulse' : currentTemp >= 38 ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'}`}>
                {currentTemp >= 45 ? '🚨 DANGER: FIRE RISK' : currentTemp >= 38 ? 'ELEVATED' : 'STABLE'}
              </span>
            </div>
          </div>

          {/* 5. SEPARATE MICRO-SEISMIC FREQUENCY GRAPH */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 shadow-xl flex flex-col justify-between transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white tracking-wide">5. SEISMIC FREQUENCY</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Resonance Wave Oscillation</span>
                </div>
              </div>
              <div className="text-right font-mono">
                <div className={`text-base font-black ${currentFreq >= 20.0 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                  {currentFreq} Hz
                </div>
                <div className="text-[10px] text-amber-300 font-bold">Peak: {maxFreqInWindow.toFixed(1)} Hz | Cutoff: 20Hz</div>
              </div>
            </div>

            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="freqGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={9} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={9} tickLine={false} domain={[0, 'dataMax + 10']} />
                  <Tooltip content={<ControlRoomTooltip unit="Hz" />} />
                  <ReferenceLine y={20.0} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={2} label={{ value: '⛔ DANGER >20Hz (ROCKBURST)', fill: '#ef4444', fontSize: 9, position: 'insideTopRight' }} />
                  <Area type="monotone" dataKey="freq" name="Freq (Hz)" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#freqGrad)" dot={false} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono border-t border-slate-800 pt-2 mt-2">
              <span className="text-slate-400">Cutoff: &gt;20.0 Hz</span>
              <span className={`px-2 py-0.5 rounded font-bold ${currentFreq >= 20 ? 'bg-red-950 text-red-300 animate-pulse' : 'bg-emerald-950 text-emerald-300'}`}>
                {currentFreq >= 20 ? '🚨 DANGER: BURST HARMONIC' : 'ACTIVE RESONANCE'}
              </span>
            </div>
          </div>

          {/* 6. SEPARATE MINE GAS SAFETY GRAPH (CH4 & CO) */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 rounded-2xl p-4 shadow-xl flex flex-col justify-between transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-950 text-blue-400 border border-blue-500/30">
                  <Wind className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white tracking-wide">6. MINE GAS SAFETY</h3>
                  <span className="text-[10px] text-slate-400 font-mono">CH4 (% vol) & CO (ppm)</span>
                </div>
              </div>
              <div className="text-right font-mono">
                <div className={`text-base font-black ${currentCH4 >= DGMS_THRESHOLDS.CH4_POWER_TRIP ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>
                  {currentCH4}% | {currentCO} ppm
                </div>
                <div className="text-[10px] text-amber-300 font-bold">Peak: {maxCH4InWindow.toFixed(2)}% | Cutoff: 1.25%</div>
              </div>
            </div>

            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={9} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={9} tickLine={false} domain={[0, 'dataMax + 2']} />
                  <Tooltip content={<ControlRoomTooltip />} />
                  <ReferenceLine y={DGMS_THRESHOLDS.CH4_POWER_TRIP} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={2} label={{ value: '⛔ DANGER >1.25% (POWER TRIP)', fill: '#ef4444', fontSize: 9, position: 'insideTopRight' }} />
                  <Line type="monotone" dataKey="ch4" name="CH4 (% vol)" stroke="#38bdf8" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="co" name="CO (ppm)" stroke="#818cf8" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono border-t border-slate-800 pt-2 mt-2">
              <span className="text-slate-400">Trip: 1.25% CH4</span>
              <span className={`px-2 py-0.5 rounded font-bold ${currentCH4 >= DGMS_THRESHOLDS.CH4_POWER_TRIP ? 'bg-red-950 text-red-300 animate-pulse' : 'bg-emerald-950 text-emerald-300'}`}>
                {currentCH4 >= DGMS_THRESHOLDS.CH4_POWER_TRIP ? '🚨 POWER TRIP ENGAGED' : 'INTERLOCK SAFE'}
              </span>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 2: HIGH-DEFINITION FOCUSED PARAMETER VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'focused' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5">
          
          {/* Parameter Selection Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
            {[
              { id: 'tilt', label: 'Tilt Angle (°)', icon: Compass, color: 'text-cyan-400', current: `${currentTilt}°` },
              { id: 'vibration', label: 'Vibration (g)', icon: Activity, color: 'text-purple-400', current: `${currentVib} g` },
              { id: 'crack', label: 'Crack Dilation (mm)', icon: Ruler, color: 'text-amber-400', current: `${currentCrack} mm` },
              { id: 'temp', label: 'Temperature (°C)', icon: Thermometer, color: 'text-rose-400', current: `${currentTemp}°C` },
              { id: 'freq', label: 'Frequency (Hz)', icon: Zap, color: 'text-emerald-400', current: `${currentFreq} Hz` },
              { id: 'gas', label: 'Mine Gas (CH4/CO)', icon: Wind, color: 'text-blue-400', current: `${currentCH4}%` }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = selectedMetric === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedMetric(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-white border border-cyan-500/50 shadow-lg shadow-cyan-900/30'
                      : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${tab.color}`} />
                  <span>{tab.label}</span>
                  <span className="font-mono text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-300">
                    {tab.current}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Large High-Definition Chart */}
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData} margin={{ top: 15, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip content={<ControlRoomTooltip />} />
                {selectedMetric === 'tilt' && (
                  <>
                    <ReferenceLine y={DGMS_THRESHOLDS.TILT_ADVISORY} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'DGMS Advisory (2.5°)', fill: '#f59e0b', fontSize: 10 }} />
                    <ReferenceLine y={DGMS_THRESHOLDS.TILT_CRITICAL} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'DGMS Critical Evacuation (5.0°)', fill: '#ef4444', fontSize: 10 }} />
                    <Area type="monotone" dataKey="tilt" name="Tilt Angle (°)" stroke="#38bdf8" strokeWidth={3} fill="url(#focusGrad)" dot={false} isAnimationActive={false} />
                  </>
                )}
                {selectedMetric === 'vibration' && (
                  <>
                    <ReferenceLine y={DGMS_THRESHOLDS.VIBRATION_ADVISORY} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Micro-Fracture (0.30g)', fill: '#f59e0b', fontSize: 10 }} />
                    <ReferenceLine y={DGMS_THRESHOLDS.VIBRATION_CRITICAL} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Roof Rupture Imminent (0.65g)', fill: '#ef4444', fontSize: 10 }} />
                    <Area type="monotone" dataKey="vibration" name="Seismic Shock (g)" stroke="#a855f7" strokeWidth={3} fill="url(#focusGrad)" dot={false} isAnimationActive={false} />
                  </>
                )}
                {selectedMetric === 'crack' && (
                  <>
                    <ReferenceLine y={DGMS_THRESHOLDS.CRACK_ADVISORY} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Crack Warning (2.0mm)', fill: '#f59e0b', fontSize: 10 }} />
                    <ReferenceLine y={DGMS_THRESHOLDS.CRACK_CRITICAL} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Shear Failure (4.0mm)', fill: '#ef4444', fontSize: 10 }} />
                    <Area type="monotone" dataKey="crack" name="Displacement (mm)" stroke="#f59e0b" strokeWidth={3} fill="url(#focusGrad)" dot={false} isAnimationActive={false} />
                  </>
                )}
                {selectedMetric === 'temp' && (
                  <>
                    <ReferenceLine y={DGMS_THRESHOLDS.TEMP_ADVISORY} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Elevated Heat (38.0°C)', fill: '#f59e0b', fontSize: 10 }} />
                    <Area type="monotone" dataKey="temp" name="Temperature (°C)" stroke="#f43f5e" strokeWidth={3} fill="url(#focusGrad)" dot={false} isAnimationActive={false} />
                  </>
                )}
                {selectedMetric === 'freq' && (
                  <Area type="monotone" dataKey="freq" name="Oscillation (Hz)" stroke="#10b981" strokeWidth={3} fill="url(#focusGrad)" dot={false} isAnimationActive={false} />
                )}
                {selectedMetric === 'gas' && (
                  <>
                    <ReferenceLine y={DGMS_THRESHOLDS.CH4_POWER_TRIP} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Power Trip Interlock (1.25%)', fill: '#ef4444', fontSize: 10 }} />
                    <Area type="monotone" dataKey="ch4" name="Methane (% vol)" stroke="#38bdf8" strokeWidth={3} fill="url(#focusGrad)" dot={false} isAnimationActive={false} />
                  </>
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Real-Time Geotechnical Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">CURRENT READING</span>
              <span className="text-xl font-black text-white font-mono mt-1 block">
                {selectedMetric === 'tilt' && `${currentTilt}°`}
                {selectedMetric === 'vibration' && `${currentVib} g`}
                {selectedMetric === 'crack' && `${currentCrack} mm`}
                {selectedMetric === 'temp' && `${currentTemp} °C`}
                {selectedMetric === 'freq' && `${currentFreq} Hz`}
                {selectedMetric === 'gas' && `${currentCH4} %`}
              </span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">PEAK RECORDED</span>
              <span className="text-xl font-black text-amber-400 font-mono mt-1 block">
                {selectedMetric === 'tilt' && `${maxTiltInWindow.toFixed(2)}°`}
                {selectedMetric === 'vibration' && `${maxVibInWindow.toFixed(2)} g`}
                {selectedMetric === 'crack' && `${maxCrackInWindow.toFixed(2)} mm`}
                {selectedMetric === 'temp' && `${maxTempInWindow.toFixed(1)} °C`}
                {selectedMetric === 'freq' && `${currentFreq} Hz`}
                {selectedMetric === 'gas' && `${currentCH4} %`}
              </span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">DGMS STATUS</span>
              <span className={`text-xs font-black font-mono mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded ${
                status === 'critical' ? 'bg-red-950 text-red-300' : status === 'advisory' ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'
              }`}>
                {status === 'critical' ? <AlertTriangle className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                {status.toUpperCase()}
              </span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">HARDWARE SOURCE</span>
              <span className="text-xs font-bold text-cyan-400 font-mono mt-2 block">
                NODE-01 (Active Longwall Panel)
              </span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
