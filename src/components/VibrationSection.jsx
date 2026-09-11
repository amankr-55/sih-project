import React, { useEffect, useRef, useState } from 'react';
import { Activity, Radio, AlertTriangle, ShieldCheck, Zap, Waves as WaveIcon, Maximize2 } from 'lucide-react';
import { DGMS_THRESHOLDS } from '../utils/mockDataStream';
import { getAssetUrl } from '../utils/assetHelper';
import ImageLightboxModal from './ImageLightboxModal';

export default function VibrationSection({ nodes, onInjectTremor }) {
  const canvasRef = useRef(null);
  const [activeNodeId, setActiveNodeId] = useState('NODE-01');
  const [tremorBurst, setTremorBurst] = useState(false);
  const [lightboxData, setLightboxData] = useState(null);

  const activeNode = nodes.find(n => n.id === activeNodeId) || nodes[0];
  const peakG = activeNode.vibrationG || 0.06;

  // Real-time canvas oscilloscope animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Centerline
      const midY = canvas.height / 2;
      ctx.strokeStyle = '#334155';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(canvas.width, midY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw active waveform
      const isCritical = peakG >= DGMS_THRESHOLDS.VIBRATION_CRITICAL;
      const isAdvisory = peakG >= DGMS_THRESHOLDS.VIBRATION_ADVISORY;
      
      ctx.strokeStyle = isCritical ? '#ef4444' : isAdvisory ? '#f59e0b' : '#38bdf8';
      ctx.lineWidth = isCritical ? 3.5 : 2.5;
      ctx.shadowColor = isCritical ? 'rgba(239, 68, 68, 0.8)' : 'rgba(56, 189, 248, 0.6)';
      ctx.shadowBlur = 10;

      ctx.beginPath();
      const baseAmp = isCritical ? 65 : isAdvisory ? 38 : 12;
      const freq1 = 0.04;
      const freq2 = 0.09;

      for (let x = 0; x < canvas.width; x++) {
        // Multi-frequency seismic noise simulation
        const noise = (Math.random() - 0.5) * (isCritical ? 14 : 3);
        const y = midY + Math.sin(x * freq1 + phase) * baseAmp + Math.cos(x * freq2 - phase * 1.5) * (baseAmp * 0.4) + noise;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      phase += isCritical ? 0.18 : 0.06;
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [peakG]);

  function handleTriggerTestTremor() {
    setTremorBurst(true);
    if (onInjectTremor) {
      onInjectTremor(activeNodeId, 0.72);
    }
    setTimeout(() => {
      setTremorBurst(false);
      if (onInjectTremor) {
        onInjectTremor(activeNodeId, 0.06);
      }
    }, 4500);
  }

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
          <div className="p-4 rounded-2xl bg-cyan-500/30 text-cyan-300 border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            <Activity className="w-10 h-10 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide flex flex-wrap items-center gap-3">
              <span>SEISMIC MICRO-TREMOR & 3-AXIS VIBRATION MONITOR</span>
              <span className="text-xs bg-cyan-500 text-slate-950 font-black px-3.5 py-1 rounded-full uppercase">
                60 FPS LIVE STREAM
              </span>
            </h2>
            <p className="text-base text-slate-100 font-bold mt-1">
              Triaxial MEMS accelerometer telemetry • Detects micro-fracturing acoustic emissions prior to dynamic rock bursts
            </p>
          </div>
        </div>

        {/* Station select & inject button */}
        <div className="flex items-center gap-3 bg-[#0f192b] p-2.5 rounded-2xl border border-slate-700 shadow-lg">
          <span className="text-sm text-white font-black">Station:</span>
          <select
            value={activeNodeId}
            onChange={(e) => setActiveNodeId(e.target.value)}
            className="bg-[#16233d] text-cyan-300 font-mono text-sm font-black border border-cyan-500/50 px-4 py-2 rounded-xl outline-none cursor-pointer shadow-md"
          >
            {nodes.map(n => (
              <option key={n.id} value={n.id}>{n.id} - {n.name}</option>
            ))}
          </select>

          <button
            onClick={handleTriggerTestTremor}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs shadow-lg transition-all cursor-pointer ${
              tremorBurst
                ? 'bg-red-600 text-white animate-bounce'
                : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{tremorBurst ? 'BURST ACTIVE (0.72g)!' : 'Test Micro-Tremor'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Oscilloscope + Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 60 FPS Real-time Oscilloscope (7 cols) */}
        <div className="lg:col-span-7 bg-[#132240] border-2 border-slate-600/80 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-black text-white font-mono flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping inline-block"></span>
                LIVE SEISMIC ACCELEROMETER OSCILLOSCOPE (60 FPS)
              </span>
              <span className="text-xs text-cyan-300 font-mono font-bold bg-[#0b1424] px-3 py-1 rounded-xl border border-cyan-500/30">
                Sampling: 1000 Hz • Sub-GHz LoRa
              </span>
            </div>

            <div className="relative h-72 bg-[#091120] rounded-2xl border border-slate-700 overflow-hidden shadow-inner p-1">
              <canvas
                ref={canvasRef}
                width={720}
                height={280}
                className="w-full h-full block"
              />
              <div className="absolute top-3 left-4 font-mono text-xs text-cyan-300 font-bold bg-black/80 px-3 py-1.5 rounded-xl border border-slate-700">
                Channel: Resultant Peak Acceleration Vector
              </div>
              <div className="absolute bottom-3 right-4 font-mono text-xs text-white font-bold bg-black/80 px-3 py-1.5 rounded-xl border border-slate-700">
                Advisory: &gt;0.30g | Critical: &gt;0.65g
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 text-center text-xs font-mono">
            <div className="bg-[#0f192b] p-3.5 rounded-xl border border-slate-700">
              <span className="text-slate-300 text-xs font-bold block">X-Axis (Dip)</span>
              <span className="text-xl font-black text-cyan-300">{(peakG * 0.7).toFixed(3)} g</span>
            </div>
            <div className="bg-[#0f192b] p-3.5 rounded-xl border border-slate-700">
              <span className="text-slate-300 text-xs font-bold block">Y-Axis (Strike)</span>
              <span className="text-xl font-black text-blue-300">{(peakG * 0.5).toFixed(3)} g</span>
            </div>
            <div className="bg-[#0f192b] p-3.5 rounded-xl border border-slate-700">
              <span className="text-slate-300 text-xs font-bold block">Z-Axis (Sag)</span>
              <span className="text-xl font-black text-purple-300">{(peakG * 0.9).toFixed(3)} g</span>
            </div>
          </div>
        </div>

        {/* Right: Peak Gauge & Scientific Wave Model (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          {/* Peak Acceleration Gauge Card */}
          <div className="bg-[#132240] border-2 border-slate-600/80 rounded-3xl p-6 shadow-2xl">
            <span className="text-xs text-slate-300 font-black uppercase tracking-wider block mb-2 font-mono">
              Peak Resultant Acceleration
            </span>
            <div className="flex items-baseline gap-3">
              <span className={`text-5xl font-black font-mono ${
                peakG >= 0.65 ? 'text-red-400 animate-pulse' : peakG >= 0.30 ? 'text-amber-300' : 'text-cyan-300'
              }`}>
                {peakG.toFixed(3)}
              </span>
              <span className="text-xl font-black text-white">g-force</span>
            </div>
            
            <div className="mt-4 text-sm font-black">
              {peakG >= 0.65 ? (
                <div className="text-white bg-red-950 border-2 border-red-500 p-3.5 rounded-2xl flex items-center gap-2 shadow-lg">
                  <AlertTriangle className="w-5 h-5 text-red-300 animate-pulse shrink-0" />
                  <span>CRITICAL ALERT: Dynamic Rock Burst / Roof Rupture Hazard!</span>
                </div>
              ) : peakG >= 0.30 ? (
                <div className="text-white bg-amber-950 border-2 border-amber-500 p-3.5 rounded-2xl flex items-center gap-2 shadow-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />
                  <span>ADVISORY: Strata Micro-Fracturing Acoustic Emission Detected</span>
                </div>
              ) : (
                <div className="text-white bg-emerald-950 border-2 border-emerald-500 p-3.5 rounded-2xl flex items-center gap-2 shadow-lg">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>STATUTORY SAFE: Ambient Background Micro-Seismic Activity Normal</span>
                </div>
              )}
            </div>
          </div>

          {/* Scientific Seismic Wave Propagation Graphic - Full Visibility with Click to Enlarge */}
          <div 
            onClick={() => setLightboxData({
              image: getAssetUrl('images/seismic_vibration.jpg'),
              title: '3D Seismic Wave Propagation & Spectral Density',
              desc: 'Strata Acoustic Geophone Array tracking micro-seismic P-wave (3,850 m/s) and S-wave fracture frequency spectrogram.',
              location: 'Strata Acoustic Geophone Array',
              badge: 'MICRO-SEISMIC 3D'
            })}
            className="bg-[#132240] border-2 border-slate-600/80 rounded-3xl overflow-hidden shadow-2xl group flex-1 flex flex-col justify-between cursor-pointer"
          >
            <div className="relative h-56 overflow-hidden bg-black">
              <img
                src={getAssetUrl('images/seismic_vibration.jpg')}
                alt="Seismic Wave Propagation 3D"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103 brightness-105 contrast-105"
              />
              <div className="absolute top-3 left-3 bg-cyan-600 text-slate-950 font-mono font-black text-xs px-3 py-1 rounded-xl shadow-lg">
                P-WAVE & S-WAVE FREQUENCY SPECTRUM
              </div>
              <div className="absolute top-3 right-3 bg-black/75 backdrop-blur px-3 py-1.5 rounded-xl border border-white/30 text-xs font-mono font-bold text-white flex items-center gap-2 shadow-lg group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Click to Enlarge</span>
              </div>
            </div>
            
            <div className="p-4 bg-[#0f192b] flex items-center justify-between text-xs font-mono border-t border-slate-700">
              <div>
                <strong className="text-white text-sm block">P-Wave Velocity: 3,850 m/s</strong>
                <span className="text-slate-200 font-sans font-bold">Massive Sandstone Overburden • AE Frequency: 14.2 Hz</span>
              </div>
              <span className="text-cyan-300 font-bold bg-cyan-950 px-3 py-1.5 rounded-xl border border-cyan-500/40">
                FFT: REAL-TIME
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
