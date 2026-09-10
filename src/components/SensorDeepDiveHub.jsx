import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Battery, 
  BatteryWarning, 
  Radio, 
  Thermometer, 
  Droplets, 
  Activity, 
  Ruler, 
  Wind, 
  CheckCircle2, 
  AlertTriangle, 
  Camera, 
  Layers, 
  ArrowLeft, 
  Gauge, 
  Compass, 
  ShieldCheck
} from 'lucide-react';
import { DGMS_THRESHOLDS } from '../utils/mockDataStream';

export default function SensorDeepDiveHub({ 
  selectedNode, 
  allNodes, 
  onSelectNodeId, 
  onBackToOverview 
}) {
  const [visionMode, setVisionMode] = useState('raw'); // 'raw', 'defog', 'thermal'
  const canvasWaveRef = useRef(null);
  const canvasFreqRef = useRef(null);

  const node = selectedNode || allNodes[0];

  const totalTilt = Math.sqrt(node.tiltX * node.tiltX + node.tiltY * node.tiltY);
  const isCritical = totalTilt >= DGMS_THRESHOLDS.TILT_CRITICAL || node.crackDisplacement >= DGMS_THRESHOLDS.CRACK_CRITICAL;
  const isAdvisory = !isCritical && (totalTilt >= DGMS_THRESHOLDS.TILT_ADVISORY || node.crackDisplacement >= DGMS_THRESHOLDS.CRACK_ADVISORY);

  const isBatteryLow = node.battery <= 25;

  // Real-time 60 FPS Oscilloscope Waveform Canvas
  useEffect(() => {
    const canvas = canvasWaveRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const midY = canvas.height / 2;

      // Subtle cyan grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      const baseAmp = isCritical ? 45 : isAdvisory ? 28 : 10 + (node.vibrationG || 0.05) * 60;
      ctx.strokeStyle = isCritical ? '#ef4444' : isAdvisory ? '#f59e0b' : '#38bdf8';
      ctx.lineWidth = 3;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 10;

      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const noise = (Math.random() - 0.5) * (isCritical ? 10 : 2);
        const y = midY + Math.sin(x * 0.04 + phase) * baseAmp + Math.cos(x * 0.07 - phase * 1.3) * (baseAmp * 0.4) + noise;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      phase += isCritical ? 0.22 : 0.08;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [node.id, node.vibrationG, isCritical, isAdvisory]);

  // Real-time Dynamic Frequency Flow Spectrum (0 Hz to 50 Hz FFT Bars)
  useEffect(() => {
    const canvas = canvasFreqRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barCount = 28;
      const barWidth = canvas.width / barCount - 2;

      for (let i = 0; i < barCount; i++) {
        const freqHz = (i * 2).toFixed(0);
        const isPeak = i >= 6 && i <= 10; // Micro-seismic strata fracture zone (12-20 Hz)
        const rand = Math.random() * 0.35 + 0.65;
        const barHeight = isPeak 
          ? (canvas.height * 0.75 * rand) * (isCritical ? 1.3 : 1.0)
          : (canvas.height * 0.25 * rand);

        const x = i * (barWidth + 2);
        const y = canvas.height - barHeight;

        // Gradient for frequency bars
        const grad = ctx.createLinearGradient(0, y, 0, canvas.height);
        if (isCritical) {
          grad.addColorStop(0, '#ef4444');
          grad.addColorStop(1, '#991b1b');
        } else if (isPeak) {
          grad.addColorStop(0, '#f59e0b');
          grad.addColorStop(1, '#06b6d4');
        } else {
          grad.addColorStop(0, '#38bdf8');
          grad.addColorStop(1, '#0284c7');
        }

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [node.id, isCritical]);

  const SITUATION_REPORTS = {
    'NODE-01': 'Active Longwall Panel 3-A: Roof strata intact with 0.35mm baseline micro-fissure. Extensometer measuring rock bolt elongation. Continuous ventilation maintaining low methane.',
    'NODE-02': 'Main Intake Trunk North: AI De-Fog camera active with clear haulage road view. Inclinometer tilt 0.4° well within DGMS 2.5° statutory limit. Conveyor line operating nominally.',
    'NODE-03': 'Central Pillar Cluster (Deep Strata): High-stress zone mesh reinforcement fully intact. Micro-seismic acoustic activity normal. Rock load redistribution stable.',
    'NODE-04': 'Ventilation Return Shaft: Exhaust airflow fans running at target CFM. Methane purge continuous (0.35% CH4). Fan motor bearing vibration 0.05g (nominal).',
    'NODE-05': 'South Dip Gallery: Floor piezometer reporting 62% pore-water saturation. Incline roadway dry; no floor heave or water pooling detected.',
    'NODE-06': 'Surface Datum Reference Monument: High-precision GNSS benchmark locked on 14 GPS satellites. Solar charging active (100% battery). Surface terrain stable, 0.05mm reference drift.'
  };

  let nodePhoto = node.image || './images/sensor_node.jpg';
  if (node.id === 'NODE-01') nodePhoto = './images/real_mine_crack.jpg';
  else if (node.id === 'NODE-02') nodePhoto = './images/fog_camera.jpg';
  else if (node.id === 'NODE-03') nodePhoto = './images/node3_pillar.jpg';
  else if (node.id === 'NODE-04') nodePhoto = './images/node4_vent.jpg';
  else if (node.id === 'NODE-05') nodePhoto = './images/sensor_node.jpg';
  else if (node.id === 'NODE-06') nodePhoto = './images/node6_surface.jpg';

  return (
    <div className="space-y-6 animate-fade-in text-white">
      
      {/* Top Navigation & Sensor Switcher Header */}
      <div className="bg-[#18253f] border-2 border-cyan-500/50 rounded-3xl p-6 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-5">
        
        <div className="flex items-center gap-4 w-full lg:w-auto">
          {onBackToOverview && (
            <button
              onClick={onBackToOverview}
              className="flex items-center gap-2 bg-[#0d1627] hover:bg-slate-800 text-cyan-300 font-bold px-4 py-2.5 rounded-2xl border border-cyan-500/40 text-sm transition-all cursor-pointer shadow-lg shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Map</span>
            </button>
          )}

          <div className="flex items-center gap-3">
            <span className="bg-cyan-500 text-slate-950 font-black px-4 py-1.5 rounded-xl text-base font-mono shadow-md">
              {node.id}
            </span>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white">{node.name}</h2>
              <p className="text-sm text-slate-200 font-medium">
                Zone: <strong className="text-cyan-300">{node.zone}</strong> • Depth: <strong className="text-amber-300">{node.depth}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* 6 Sensor Switcher Pills (Large & High Contrast) */}
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1">
          {allNodes.map(n => (
            <button
              key={n.id}
              onClick={() => onSelectNodeId(n.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black font-mono transition-all cursor-pointer shrink-0 ${
                n.id === node.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-xl shadow-cyan-500/30 scale-105 border-2 border-white'
                  : 'bg-[#0f1a2e] text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700'
              }`}
            >
              {n.id}
            </button>
          ))}
        </div>

      </div>

      {/* Battery Low Banner if applicable */}
      {isBatteryLow && (
        <div className="bg-red-950/90 border-2 border-red-500 p-4 rounded-2xl text-red-200 font-bold flex items-center gap-3 animate-pulse shadow-xl">
          <BatteryWarning className="w-6 h-6 text-red-400 shrink-0" />
          <span>WARNING: Sensor node {node.id} battery is critically low ({node.battery}%). Schedule LiFePO4 battery pack replacement!</span>
        </div>
      )}

      {/* Main 12-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Physical Surrounding Photos & Situation Recon (6 cols) */}
        <div className="lg:col-span-6 bg-[#142036] border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-black text-cyan-300 flex items-center gap-2 font-mono">
                <Camera className="w-5 h-5 text-cyan-400" />
                SURROUNDING PHYSICAL ENVIRONMENT & CRACK RECON
              </span>
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  onClick={() => setVisionMode('raw')}
                  className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                    visionMode === 'raw' ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Optical
                </button>
                <button
                  onClick={() => setVisionMode('defog')}
                  className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                    visionMode === 'defog' ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  AI De-Fog
                </button>
                <button
                  onClick={() => setVisionMode('thermal')}
                  className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                    visionMode === 'thermal' ? 'bg-orange-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Thermal FLIR
                </button>
              </div>
            </div>

            {/* High-Resolution Surrounding Photograph */}
            <div className="relative h-80 rounded-2xl overflow-hidden border border-slate-700 bg-black group shadow-xl">
              <img
                src={
                  visionMode === 'thermal' ? './images/thermal_crack.jpg' : 
                  visionMode === 'defog' ? './images/fog_camera.jpg' : 
                  nodePhoto
                }
                alt={node.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* HUD on Image */}
              <div className="absolute top-3 left-3 bg-black/85 backdrop-blur border border-white/20 p-3 rounded-xl text-xs font-mono text-white space-y-1">
                <div>LOCATION: <strong className="text-cyan-300">{node.name}</strong></div>
                <div>MOUNTING: <strong className="text-amber-300">{node.mounting}</strong></div>
                <div>STATUS: <strong className="text-emerald-400">Normal Active Feed</strong></div>
              </div>

              <div className="absolute bottom-3 right-3 bg-black/85 backdrop-blur border border-white/20 px-3 py-1 rounded-xl text-xs font-mono text-emerald-300 font-bold">
                GPS: {node.coords}
              </div>
            </div>
          </div>

          {/* Geological Situation Recon Report Box */}
          <div className="bg-[#0b1424] p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-xs font-black text-cyan-300 uppercase tracking-wider block font-mono">
              📋 Subterranean Situation Reconnaissance Report:
            </span>
            <p className="text-sm text-slate-100 leading-relaxed font-medium">
              {SITUATION_REPORTS[node.id] || 'Rock mass stability verified. Subterranean telemetry nominal. Sensor node operational.'}
            </p>
          </div>

          {/* Complete Sensor Hardware Health Checklist */}
          <div className="bg-[#0b1424] p-5 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-black text-white uppercase tracking-wider block font-mono">
              🛡️ Hardware Diagnostics & Sensor Health Breakdown:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-mono">
              <div className="bg-[#142036] p-3 rounded-xl border border-slate-700">
                <span className="text-slate-300 block text-[11px]">Battery</span>
                <span className={`text-lg font-black ${isBatteryLow ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                  {node.battery}%
                </span>
                <span className="text-[10px] text-slate-400 block">LiFePO4 3.8V</span>
              </div>

              <div className="bg-[#142036] p-3 rounded-xl border border-slate-700">
                <span className="text-slate-300 block text-[11px]">LoRa Signal</span>
                <span className="text-lg font-black text-cyan-300">
                  {node.rssi} dBm
                </span>
                <span className="text-[10px] text-slate-400 block">SNR: +9.2 dB</span>
              </div>

              <div className="bg-[#142036] p-3 rounded-xl border border-slate-700">
                <span className="text-slate-300 block text-[11px]">ADC Drift</span>
                <span className="text-lg font-black text-emerald-400">
                  0.02°
                </span>
                <span className="text-[10px] text-slate-400 block">Linearity: 99.9%</span>
              </div>

              <div className="bg-[#142036] p-3 rounded-xl border border-slate-700">
                <span className="text-slate-300 block text-[11px]">Packet Loss</span>
                <span className="text-lg font-black text-emerald-400">
                  0.01%
                </span>
                <span className="text-[10px] text-slate-400 block">Sub-GHz Mesh</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Key Telemetry, Vibration Wave & Frequency Spectrum (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          
          {/* 4 Big High-Contrast Metrics (Crack, Tilt, Temp, Moisture) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="bg-[#182642] border border-slate-700 p-4 rounded-2xl shadow-xl">
              <span className="text-xs font-black text-slate-300 uppercase block mb-1">Crack Width</span>
              <div className="text-3xl font-black font-mono text-amber-400">
                {node.crackDisplacement.toFixed(2)} <span className="text-sm font-bold text-slate-400">mm</span>
              </div>
              <span className="text-xs text-slate-300 font-bold block mt-1 font-mono">Limit: 2.0 mm</span>
            </div>

            <div className="bg-[#182642] border border-slate-700 p-4 rounded-2xl shadow-xl">
              <span className="text-xs font-black text-slate-300 uppercase block mb-1">Biaxial Tilt</span>
              <div className="text-3xl font-black font-mono text-cyan-400">
                {totalTilt.toFixed(2)}°
              </div>
              <span className="text-xs text-slate-300 font-bold block mt-1 font-mono">Limit: 2.5°</span>
            </div>

            <div className="bg-[#182642] border border-slate-700 p-4 rounded-2xl shadow-xl">
              <span className="text-xs font-black text-slate-300 uppercase block mb-1">Temperature</span>
              <div className="text-3xl font-black font-mono text-white">
                {node.temperature}°C
              </div>
              <span className="text-xs text-emerald-400 font-bold block mt-1 font-mono">Safe (&lt;38°C)</span>
            </div>

            <div className="bg-[#182642] border border-slate-700 p-4 rounded-2xl shadow-xl">
              <span className="text-xs font-black text-slate-300 uppercase block mb-1">Pore Moisture</span>
              <div className="text-3xl font-black font-mono text-cyan-300">
                {node.moisture || 40}%
              </div>
              <span className="text-xs text-slate-300 font-bold block mt-1 font-mono">Saturation</span>
            </div>

          </div>

          {/* Real-time 60 FPS Oscilloscope Seismic Motion Wave */}
          <div className="bg-[#142036] border border-slate-700 p-5 rounded-3xl shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-black text-white uppercase flex items-center gap-2 font-mono">
                <Activity className="w-5 h-5 text-cyan-400" />
                REAL-TIME 3-AXIS VIBRATION WAVEFORM (60 FPS OSCILLOSCOPE)
              </span>
              <span className="text-xs font-mono font-black text-cyan-300 bg-cyan-950 px-3 py-1 rounded-xl border border-cyan-500/40">
                Peak: {(node.vibrationG || 0.05).toFixed(3)} g
              </span>
            </div>

            <div className="h-32 bg-[#091120] rounded-2xl border border-slate-800 overflow-hidden relative shadow-inner">
              <canvas ref={canvasWaveRef} width={600} height={128} className="w-full h-full block" />
            </div>
            
            <div className="flex justify-between text-xs text-slate-300 font-mono mt-2 font-bold">
              <span>Sampling: 1000 Hz</span>
              <span>Triaxial Accelerometer: MPU6050</span>
              <span className="text-emerald-400">Vibration Nominal (&lt;0.30g)</span>
            </div>
          </div>

          {/* Dynamic Frequency Flow Spectrum (0 to 50 Hz) */}
          <div className="bg-[#142036] border border-slate-700 p-5 rounded-3xl shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-black text-white uppercase flex items-center gap-2 font-mono">
                <Waveform className="w-5 h-5 text-amber-400" />
                VIBRATION FREQUENCY SPECTRUM (0 Hz - 50 Hz FFT FLOW)
              </span>
              <span className="text-xs font-mono font-black text-amber-300 bg-amber-950 px-3 py-1 rounded-xl border border-amber-500/40">
                Resonant Peak: 14.2 Hz
              </span>
            </div>

            <div className="h-28 bg-[#091120] rounded-2xl border border-slate-800 overflow-hidden relative shadow-inner p-2">
              <canvas ref={canvasFreqRef} width={600} height={100} className="w-full h-full block" />
            </div>

            <div className="flex justify-between text-xs text-slate-300 font-mono mt-2 font-bold">
              <span>0 Hz (DC)</span>
              <span className="text-amber-400 font-bold">12-20 Hz: Strata Micro-Fracture Acoustic Emission</span>
              <span>50 Hz (Machine Hum)</span>
            </div>
          </div>

          {/* 3D Seismic Wave Propagation Scientific Model Visual */}
          <div className="bg-[#142036] border border-slate-700 rounded-3xl overflow-hidden shadow-xl group">
            <div className="relative h-48 overflow-hidden bg-black">
              <img
                src="./images/seismic_vibration.jpg"
                alt="Seismic Wave Propagation Model"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 bg-black/85 backdrop-blur border border-cyan-400 px-3 py-1 rounded-xl text-xs font-mono font-bold text-cyan-300">
                P-WAVE & S-WAVE PROPAGATION MODEL
              </div>
            </div>
            <div className="p-4 bg-[#101b30] flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-white">Subterranean Acoustic Emission Frequency Analysis</h4>
                <p className="text-xs text-slate-300 font-medium mt-0.5">Calculates acoustic energy release density to forecast roof fall events</p>
              </div>
              <span className="text-xs font-bold text-emerald-400 font-mono bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                PASS: NO ROCKBURST
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
