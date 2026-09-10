import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  Thermometer, 
  Droplets, 
  Activity, 
  Ruler, 
  Wind, 
  Battery, 
  Radio, 
  ShieldCheck, 
  AlertTriangle, 
  Camera, 
  Eye, 
  CloudFog, 
  Layers, 
  Cpu, 
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import { DGMS_THRESHOLDS } from '../utils/mockDataStream';

export default function NodeLiveInspector({ node, allNodes, onSelectNodeId }) {
  const [visionMode, setVisionMode] = useState('raw'); // 'raw', 'defog', 'thermal'
  const canvasRef = useRef(null);

  if (!node) return null;

  const totalTilt = Math.sqrt(node.tiltX * node.tiltX + node.tiltY * node.tiltY);
  const isCritical = totalTilt >= DGMS_THRESHOLDS.TILT_CRITICAL || node.crackDisplacement >= DGMS_THRESHOLDS.CRACK_CRITICAL;
  const isAdvisory = !isCritical && (totalTilt >= DGMS_THRESHOLDS.TILT_ADVISORY || node.crackDisplacement >= DGMS_THRESHOLDS.CRACK_ADVISORY);

  // Live vibration waveform canvas for this specific node
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const midY = canvas.height / 2;

      // Draw subtle grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.1)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Sine wave motion based on node vibration
      const baseAmp = isCritical ? 45 : isAdvisory ? 25 : 8 + (node.vibrationG || 0.05) * 60;
      ctx.strokeStyle = isCritical ? '#ef4444' : isAdvisory ? '#f59e0b' : '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 8;

      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const noise = (Math.random() - 0.5) * (isCritical ? 8 : 2);
        const y = midY + Math.sin(x * 0.05 + phase) * baseAmp + Math.cos(x * 0.08 - phase * 1.2) * (baseAmp * 0.35) + noise;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      phase += isCritical ? 0.2 : 0.06;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [node.id, node.vibrationG, isCritical, isAdvisory]);

  // Dynamic per-node situation reports
  const SITUATION_REPORTS = {
    'NODE-01': 'Active Longwall Panel 3-A: Roof strata intact. Fiber-optic extensometer micro-crack dilation nominal at 0.35mm. Continuous face ventilation maintaining 20.8% breathable O2 and low methane.',
    'NODE-02': 'Main Intake Trunk North: AI De-Fog camera active with unobstructed roadway view. Inclinometer tilt 0.4° well within DGMS 2.5° statutory limit. Conveyor belt line running smoothly.',
    'NODE-03': 'Central Pillar Cluster (Deep Strata): High-stress zone mesh reinforcement fully intact. Micro-seismic acoustic activity normal. Rock load redistribution stable without spalling.',
    'NODE-04': 'Ventilation Return Shaft: Exhaust airflow fans running at target CFM. Methane purge continuous (0.35% CH4 vs 1.25% DGMS power trip limit). Fan motor bearing vibration 0.05g (nominal).',
    'NODE-05': 'South Dip Gallery: Floor piezometer reporting 62% pore-water saturation. Incline roadway dry; no floor heave or groundwater accumulation detected around sensor cradle.',
    'NODE-06': 'Surface Datum Reference Monument: High-precision GNSS benchmark locked on 14 GPS satellites. Solar charging active (100% LiFePO4 battery). Surface terrain stable, 0.05mm reference datum drift.'
  };

  // Determine node specific photo
  let nodePhoto = node.image || '/images/sensor_node.jpg';
  if (node.id === 'NODE-01') nodePhoto = '/images/thermal_crack.jpg';
  else if (node.id === 'NODE-02') nodePhoto = '/images/fog_camera.jpg';
  else if (node.id === 'NODE-03') nodePhoto = '/images/node3_pillar.jpg';
  else if (node.id === 'NODE-04') nodePhoto = '/images/node4_vent.jpg';
  else if (node.id === 'NODE-05') nodePhoto = '/images/sensor_node.jpg';
  else if (node.id === 'NODE-06') nodePhoto = '/images/node6_surface.jpg';

  return (
    <div className="bg-[#121e36]/90 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-6">
      
      {/* Top Header & Sensor Selector Pills */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-700/80 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 px-3.5 py-1 rounded-xl text-sm font-mono font-black">
              {node.id} INSPECTOR
            </span>
            <h2 className="text-2xl font-black text-white">{node.name}</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
              isCritical ? 'bg-red-500 text-white animate-pulse' :
              isAdvisory ? 'bg-amber-500 text-black' : 'bg-emerald-500 text-white'
            }`}>
              {isCritical ? 'CRITICAL DEFECT' : isAdvisory ? 'ADVISORY' : 'STATUTORY SAFE'}
            </span>
          </div>
          <p className="text-xs text-slate-300 font-medium mt-1">
            Zone: <strong className="text-white">{node.zone}</strong> • Seam: <strong className="text-cyan-300">{node.seam}</strong> • Depth: <strong className="text-amber-300">{node.depth}</strong>
          </p>
        </div>

        {/* Quick Node Switcher Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {allNodes.map(n => (
            <button
              key={n.id}
              onClick={() => onSelectNodeId(n.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black font-mono transition-all cursor-pointer ${
                n.id === node.id
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/30 scale-105'
                  : 'bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {n.id}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split: Left Area Photo + Right Telemetry Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Real Surrounding Photo & Situation Recon (7 cols) */}
        <div className="lg:col-span-7 bg-[#162544] border border-slate-700/80 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-black text-white flex items-center gap-2 font-mono">
                <Camera className="w-5 h-5 text-cyan-400" />
                SURROUNDING AREA CAMERA & PHYSICAL ENVIRONMENT
              </span>
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  onClick={() => setVisionMode('raw')}
                  className={`px-2.5 py-1 rounded-lg font-bold ${visionMode === 'raw' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
                >
                  Optical
                </button>
                <button
                  onClick={() => setVisionMode('defog')}
                  className={`px-2.5 py-1 rounded-lg font-bold ${visionMode === 'defog' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
                >
                  AI De-Fog
                </button>
                <button
                  onClick={() => setVisionMode('thermal')}
                  className={`px-2.5 py-1 rounded-lg font-bold ${visionMode === 'thermal' ? 'bg-orange-600 text-white' : 'text-slate-400'}`}
                >
                  Thermal FLIR
                </button>
              </div>
            </div>

            <div className="relative h-72 rounded-2xl overflow-hidden border border-slate-700 bg-black group">
              <img
                src={visionMode === 'thermal' ? '/images/thermal_crack.jpg' : visionMode === 'defog' ? '/images/fog_camera.jpg' : nodePhoto}
                alt={node.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* On-Image Status HUD */}
              <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-md border border-white/20 p-2.5 rounded-xl text-xs font-mono text-white space-y-0.5">
                <div>LOCATION: <strong className="text-cyan-300">{node.name}</strong></div>
                <div>SURROUNDING MOUNT: <strong className="text-amber-300">{node.mounting}</strong></div>
                <div>VISIBILITY: <strong className="text-emerald-400">Normal (Camera Clear)</strong></div>
              </div>

              <div className="absolute bottom-3 right-3 bg-black/85 backdrop-blur-md border border-white/20 px-3 py-1 rounded-xl text-xs font-mono text-emerald-400">
                GPS: {node.coords}
              </div>
            </div>
          </div>

          {/* Surrounding Situation Report Box */}
          <div className="mt-4 bg-[#0d1629] p-4 rounded-2xl border border-slate-800 text-xs space-y-1.5">
            <span className="text-cyan-400 font-bold uppercase tracking-wider block text-[11px]">
              Surrounding Strata & Environmental Situation:
            </span>
            <p className="text-slate-200 font-medium leading-relaxed">
              {SITUATION_REPORTS[node.id] || 'Rock mass stability verified. Subterranean telemetry nominal. Sensor operational.'}
            </p>
          </div>
        </div>

        {/* Right: Key Telemetry (Tilt, Crack, Vibration Wave, Temp) (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Big Crack & Tilt Indicators */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#162544] border border-slate-700/80 p-4 rounded-2xl shadow-lg">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Linear Crack Width
              </span>
              <div className="text-3xl font-black font-mono text-amber-400">
                {node.crackDisplacement.toFixed(2)} <span className="text-sm font-bold text-slate-400">mm</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">Warning: &gt; 2.0 mm</span>
            </div>

            <div className="bg-[#162544] border border-slate-700/80 p-4 rounded-2xl shadow-lg">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Biaxial Tilt Angle
              </span>
              <div className="text-3xl font-black font-mono text-cyan-400">
                {totalTilt.toFixed(2)}°
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">Warning: &gt; 2.5°</span>
            </div>
          </div>

          {/* Live Vibration Oscilloscope Wave for this node */}
          <div className="bg-[#162544] border border-slate-700/80 p-4 rounded-2xl shadow-lg flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5 font-mono">
                <Activity className="w-4 h-4 text-cyan-400" />
                Live Seismic Motion Waveform
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {(node.vibrationG || 0.05).toFixed(3)} g
              </span>
            </div>

            <div className="flex-1 bg-[#0a1220] rounded-xl border border-slate-800 overflow-hidden min-h-[110px] relative">
              <canvas ref={canvasRef} width={420} height={110} className="w-full h-full block" />
            </div>
          </div>

          {/* Temperature & Moisture Quick Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#162544] border border-slate-700/80 p-3.5 rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-orange-950/80 text-orange-400 rounded-xl">
                <Thermometer className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Temperature</span>
                <span className="text-xl font-black font-mono text-white">{node.temperature}°C</span>
              </div>
            </div>

            <div className="bg-[#162544] border border-slate-700/80 p-3.5 rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-blue-950/80 text-blue-400 rounded-xl">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Moisture</span>
                <span className="text-xl font-black font-mono text-cyan-300">{node.moisture || 40}%</span>
              </div>
            </div>
          </div>

          {/* Sensor Health Quality Bar */}
          <div className="bg-[#162544] border border-slate-700/80 p-3.5 rounded-2xl flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Hardware Quality: 99.8%</span>
            </div>
            <div className="text-slate-400 flex items-center gap-3">
              <span>Bat: <strong className="text-white">{node.battery}%</strong></span>
              <span>LoRa: <strong className="text-cyan-400">{node.rssi} dBm</strong></span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
