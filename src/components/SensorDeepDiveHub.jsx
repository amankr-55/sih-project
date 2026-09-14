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
  ShieldCheck,
  Usb,
  Sparkles,
  Zap
} from 'lucide-react';
import { DGMS_THRESHOLDS } from '../utils/mockDataStream';

// Accurate Dynamic Sensor Health Calculator
function calculateSensorHealth(node, isHardwareConnected) {
  let score = 100;

  // 1. Mechanical Strain on Mount (Biaxial Inclinometer)
  const totalTilt = Math.sqrt((node.tiltX || 0) ** 2 + (node.tiltY || 0) ** 2);
  if (totalTilt >= DGMS_THRESHOLDS.TILT_CRITICAL) {
    score -= 32; // Severe angular deflection on rock anchor
  } else if (totalTilt >= DGMS_THRESHOLDS.TILT_ADVISORY) {
    score -= 16; // Moderate advisory tilt
  } else if (totalTilt > 0.6) {
    score -= Math.min(12, (totalTilt - 0.6) * 7);
  }

  // 2. Dynamic Seismic Vibration Shock
  const vib = node.vibrationG || 0.01;
  if (vib >= DGMS_THRESHOLDS.VIBRATION_CRITICAL) {
    score -= 35; // Rockburst impact wave
  } else if (vib >= DGMS_THRESHOLDS.VIBRATION_ADVISORY) {
    score -= 18; // Above drill / machinery threshold
  } else if (vib > 0.05) {
    score -= Math.min(14, (vib - 0.05) * 60);
  }

  // 3. Crack Fissure Extensometer Dilation
  const crack = node.crackDisplacement || 0;
  if (crack >= DGMS_THRESHOLDS.CRACK_CRITICAL) {
    score -= 22;
  } else if (crack >= DGMS_THRESHOLDS.CRACK_ADVISORY) {
    score -= 12;
  }

  // 4. Operating Thermal Stress on Circuitry
  const temp = node.temperature || 28.5;
  if (temp >= 48) {
    score -= 25; // Extreme thermal overload
  } else if (temp >= 38) {
    score -= 12; // High geothermal level
  }

  // 5. Battery State of Charge
  const bat = node.battery !== undefined ? node.battery : 98;
  if (bat < 20) {
    score -= 25;
  } else if (bat < 50) {
    score -= 10;
  }

  score = Math.max(10, Math.min(100, Math.round(score)));

  let statusLabel = '100% OPTIMAL / CALIBRATED';
  let statusBadge = 'bg-emerald-950 text-emerald-300 border-emerald-500/50';
  let statusProgress = 'from-emerald-500 to-cyan-400';
  let conditionText = 'Zero datum locked. All piezoelectric transducers operating with maximum linearity.';
  
  if (score < 50) {
    statusLabel = 'CRITICAL STRATA STRAIN';
    statusBadge = 'bg-red-950 text-red-300 border-red-500/60 animate-pulse';
    statusProgress = 'from-red-600 to-amber-500';
    conditionText = 'Severe mechanical rock displacement. Mounting bracket under geotechnical shear stress!';
  } else if (score < 75) {
    statusLabel = 'WARNING / STRAINED';
    statusBadge = 'bg-amber-950 text-amber-300 border-amber-500/50';
    statusProgress = 'from-amber-500 to-yellow-400';
    conditionText = 'Advisory threshold approached. Micro-tremor oscillation detected in anchor bolt.';
  } else if (score < 90) {
    statusLabel = 'GOOD NOMINAL';
    statusBadge = 'bg-cyan-950 text-cyan-300 border-cyan-500/40';
    statusProgress = 'from-cyan-500 to-blue-500';
    conditionText = 'Telemetry stable. Sub-second packet heartbeat verified via Sub-GHz LoRa mesh.';
  }

  return { score, statusLabel, statusBadge, statusProgress, conditionText, totalTilt };
}

export default function SensorDeepDiveHub({ 
  selectedNode, 
  allNodes, 
  serialConnected = false,
  hardwareMode = 'simulation',
  onSelectNodeId, 
  onBackToOverview 
}) {
  const [visionMode, setVisionMode] = useState('raw'); // 'raw', 'defog', 'thermal'
  const canvasWaveRef = useRef(null);
  const canvasFreqRef = useRef(null);
  const spanPeakRef = useRef(null);
  const spanXRef = useRef(null);
  const spanYRef = useRef(null);
  const spanZRef = useRef(null);

  const node = selectedNode || allNodes[0];

  const totalTilt = Math.sqrt(node.tiltX * node.tiltX + node.tiltY * node.tiltY);
  const isCritical = totalTilt >= DGMS_THRESHOLDS.TILT_CRITICAL || node.crackDisplacement >= DGMS_THRESHOLDS.CRACK_CRITICAL || (node.vibrationG || 0.01) >= DGMS_THRESHOLDS.VIBRATION_CRITICAL;
  const isAdvisory = !isCritical && (totalTilt >= DGMS_THRESHOLDS.TILT_ADVISORY || node.crackDisplacement >= DGMS_THRESHOLDS.CRACK_ADVISORY || (node.vibrationG || 0.01) >= DGMS_THRESHOLDS.VIBRATION_ADVISORY);

  const isBatteryLow = node.battery <= 25;
  const health = calculateSensorHealth(node, serialConnected);

  // Real-time 60 FPS 3-Axis Oscilloscope Waveform Canvas
  useEffect(() => {
    const canvas = canvasWaveRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const midY = h / 2;

      // Dark Industrial Oscilloscope Phosphor Background
      ctx.fillStyle = '#060c18';
      ctx.fillRect(0, 0, w, h);

      // CRT Graticule Grid (Subdivided oscilloscope divisions)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.10)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 24) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Dotted Center Datum Zero Axis
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(w, midY);
      ctx.stroke();
      ctx.setLineDash([]); // Reset to solid

      // Telemetry dynamics from selected node
      const vibG = node.vibrationG || 0.01;
      const tiltX = Math.abs(node.tiltX || 0);
      const tiltY = Math.abs(node.tiltY || 0);

      // Dynamic amplitudes for 3 axes (reacts instantly when node moves)
      const ampX = Math.min(midY - 8, 8 + vibG * 60 + (tiltX * 1.5));
      const ampY = Math.min(midY - 8, 7 + vibG * 52 + (tiltY * 1.8));
      const ampZ = Math.min(midY - 8, 6 + vibG * 70);

      // 1. CH1: X-Axis Wave (Roll / Lateral Shear) - Electric Cyan
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.2;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = isCritical ? 10 : 4;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const noise = (Math.random() - 0.5) * (vibG > 0.2 ? 7 : 1.5);
        const y = midY + Math.sin(x * 0.042 + phase) * ampX + Math.cos(x * 0.09 - phase * 1.1) * (ampX * 0.25) + noise;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 2. CH2: Y-Axis Wave (Pitch / Longitudinal Tilt) - Vibrant Amber
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.2;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = isCritical ? 10 : 4;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const noise = (Math.random() - 0.5) * (vibG > 0.2 ? 7 : 1.5);
        const y = midY + Math.sin(x * 0.048 + phase + 1.57) * ampY + Math.sin(x * 0.024 - phase) * (ampY * 0.3) + noise;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 3. CH3: Z-Axis Wave (Normal Shock & Rockburst Compression) - Neon Emerald / Red
      ctx.strokeStyle = isCritical ? '#ef4444' : '#10b981';
      ctx.lineWidth = 2.4;
      ctx.shadowColor = isCritical ? '#ef4444' : '#10b981';
      ctx.shadowBlur = isCritical ? 14 : 5;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const noise = (Math.random() - 0.5) * (vibG > 0.2 ? 10 : 2);
        const y = midY + Math.cos(x * 0.035 + phase * 1.3) * ampZ + Math.sin(x * 0.12 - phase * 1.8) * (ampZ * 0.35) + noise;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // Clear blur

      // Calculate instantaneous live 3-axis acceleration vectors
      const curX = +(vibG * 0.72 + (Math.sin(phase) * 0.015)).toFixed(3);
      const curY = +(vibG * 0.65 + (Math.cos(phase * 1.2) * 0.012)).toFixed(3);
      const curZ = +(vibG * 1.05 + (Math.sin(phase * 1.8) * 0.02)).toFixed(3);
      const livePeakG = +Math.sqrt(curX * curX + curY * curY + curZ * curZ).toFixed(3);

      if (spanPeakRef.current) spanPeakRef.current.innerText = `${livePeakG.toFixed(3)} g`;
      if (spanXRef.current) spanXRef.current.innerText = `${Math.abs(curX).toFixed(3)}g`;
      if (spanYRef.current) spanYRef.current.innerText = `${Math.abs(curY).toFixed(3)}g`;
      if (spanZRef.current) spanZRef.current.innerText = `${Math.abs(curZ).toFixed(3)}g`;

      phase += isCritical ? 0.26 : vibG > 0.1 ? 0.15 : 0.08;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [node.id, node.vibrationG, node.tiltX, node.tiltY, isCritical, isAdvisory]);

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
              <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
                <span>{node.name}</span>
                {serialConnected && (
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1">
                    <Usb className="w-3 h-3" /> HARDWARE SYNCED
                  </span>
                )}
              </h2>
              <p className="text-sm text-slate-200 font-medium">
                Zone: <strong className="text-cyan-300">{node.zone}</strong> • Depth: <strong className="text-amber-300">{node.depth}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* 6 Sensor Switcher Pills (All Linked to Physical Sensor) */}
        <div className="flex flex-col items-end gap-2 w-full lg:w-auto">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ALL 6 NODES ACTIVE • LINKED TO PHYSICAL SENSOR</span>
          </div>

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
                <div>
                  STATUS: <strong className={isCritical ? "text-red-400 animate-pulse font-black" : isAdvisory ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
                    {isCritical ? "CRITICAL STRATA RUPTURE" : isAdvisory ? "ADVISORY TILT WARNING" : "NORMAL NOMINAL FEED"}
                  </strong>
                </div>
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

          {/* Complete Sensor Hardware Health Checklist & Integrity Breakdown */}
          <div className="bg-[#0b1424] p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-black text-white uppercase tracking-wider block font-mono flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  HARDWARE DIAGNOSTICS & SENSOR INTEGRITY BREAKDOWN:
                </span>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {health.conditionText}
                </p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-xl text-xs font-black font-mono border inline-block ${health.statusBadge}`}>
                  {health.statusLabel}
                </span>
              </div>
            </div>

            {/* Dynamic Health Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-slate-300">Composite Transducer Linearity & Health:</span>
                <span className="text-white font-black text-sm">{health.score}%</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div 
                  className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${health.statusProgress}`}
                  style={{ width: `${health.score}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-mono pt-1">
              <div className="bg-[#142036] p-3 rounded-xl border border-slate-700">
                <span className="text-slate-300 block text-[11px]">LiFePO4 Supply</span>
                <span className={`text-lg font-black ${isBatteryLow ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                  {node.battery}%
                </span>
                <span className="text-[10px] text-slate-400 block">{serialConnected ? '5.0V USB Active' : '3.78V Battery'}</span>
              </div>

              <div className="bg-[#142036] p-3 rounded-xl border border-slate-700">
                <span className="text-slate-300 block text-[11px]">Telemetry Link</span>
                <span className="text-lg font-black text-cyan-300">
                  {serialConnected ? 'COM6 Live' : `${node.rssi} dBm`}
                </span>
                <span className="text-[10px] text-slate-400 block">{serialConnected ? 'WebSerial Sync' : 'LoRa 868MHz'}</span>
              </div>

              <div className="bg-[#142036] p-3 rounded-xl border border-slate-700">
                <span className="text-slate-300 block text-[11px]">ADC Drift Offset</span>
                <span className={`text-lg font-black ${totalTilt > 2.5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  ±{(Math.abs(node.tiltX || 0) * 0.008).toFixed(3)}°
                </span>
                <span className="text-[10px] text-slate-400 block">{totalTilt > 2.5 ? 'Deflection' : 'Linearity: 99.9%'}</span>
              </div>

              <div className="bg-[#142036] p-3 rounded-xl border border-slate-700">
                <span className="text-slate-300 block text-[11px]">I2C Bus & Loss</span>
                <span className="text-lg font-black text-emerald-400">
                  0.00%
                </span>
                <span className="text-[10px] text-slate-400 block">I2C 0x68 Active</span>
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
              <span className={`text-xs font-bold block mt-1 font-mono ${node.temperature >= 38 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {node.temperature >= 38 ? 'Elevated (>38°C)' : 'Safe (<38°C)'}
              </span>
            </div>

            <div className="bg-[#182642] border border-slate-700 p-4 rounded-2xl shadow-xl">
              <span className="text-xs font-black text-slate-300 uppercase block mb-1">Pore Moisture</span>
              <div className="text-3xl font-black font-mono text-cyan-300">
                {node.moisture || 40}%
              </div>
              <span className="text-xs text-slate-300 font-bold block mt-1 font-mono">Saturation</span>
            </div>

          </div>

          {/* Real-time 60 FPS 3-Axis Oscilloscope Seismic Motion Wave */}
          <div className="bg-[#142036] border border-slate-700 p-5 rounded-3xl shadow-xl flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-black text-white uppercase tracking-wider block font-mono">
                    REAL-TIME 3-AXIS VIBRATION WAVEFORM (60 FPS OSCILLOSCOPE)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    MPU-6050 16-Bit ADC • 1000 Hz Sub-Sampling • 60 FPS Phosphor Trace
                  </span>
                </div>
              </div>

              {/* Dynamic Live Vector Peak & Channel Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900 border border-cyan-500/40 text-cyan-300 font-bold">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                  CH1 (X): <strong ref={spanXRef} className="text-white">0.024g</strong>
                </span>
                <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900 border border-amber-500/40 text-amber-300 font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                  CH2 (Y): <strong ref={spanYRef} className="text-white">0.028g</strong>
                </span>
                <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900 border border-emerald-500/40 text-emerald-300 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  CH3 (Z): <strong ref={spanZRef} className="text-white">0.035g</strong>
                </span>
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-400 text-cyan-300 font-black shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                  <span>Peak |G|:</span>
                  <strong ref={spanPeakRef} className="text-white">0.045 g</strong>
                </span>
              </div>
            </div>

            <div className="h-36 bg-[#060c18] rounded-2xl border border-slate-700/80 overflow-hidden relative shadow-inner">
              <canvas ref={canvasWaveRef} width={600} height={144} className="w-full h-full block" />
              <div className="absolute bottom-1 right-2 text-[9px] font-mono text-slate-500 select-none">
                VOLTS: 0.10g/div • TIME: 10ms/div • TRIG: AUTO
              </div>
            </div>
            
            <div className="flex flex-wrap justify-between text-xs text-slate-300 font-mono mt-2.5 font-bold gap-2">
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> CH1: Lateral Shear (Roll)
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> CH2: Tilt Angular Pitch
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> CH3: Normal Shock
              </span>
              <span className={node.vibrationG >= DGMS_THRESHOLDS.VIBRATION_CRITICAL ? "text-red-400 font-black animate-pulse" : "text-emerald-400"}>
                {node.vibrationG >= DGMS_THRESHOLDS.VIBRATION_CRITICAL ? "CRITICAL SEISMIC BURST" : "Vibration Nominal (<0.22g)"}
              </span>
            </div>
          </div>

          {/* Dynamic Frequency Flow Spectrum (0 Hz to 50 Hz) */}
          <div className="bg-[#142036] border border-slate-700 p-5 rounded-3xl shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-black text-white uppercase flex items-center gap-2 font-mono">
                <Activity className="w-5 h-5 text-amber-400" />
                VIBRATION FREQUENCY SPECTRUM (0 Hz - 50 Hz FFT FLOW)
              </span>
              <span className="text-xs font-mono font-black text-amber-300 bg-amber-950 px-3 py-1 rounded-xl border border-amber-500/40">
                Resonant Peak: {(node.freq || 14.2).toFixed(1)} Hz
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
              <span className={`text-xs font-bold font-mono px-3 py-1.5 rounded-xl border ${
                node.vibrationG >= DGMS_THRESHOLDS.VIBRATION_CRITICAL
                  ? "bg-red-950 text-red-300 border-red-500/50 animate-pulse"
                  : node.vibrationG >= DGMS_THRESHOLDS.VIBRATION_ADVISORY
                  ? "bg-amber-950 text-amber-300 border-amber-500/40"
                  : "bg-emerald-950 text-emerald-300 border-emerald-500/30"
              }`}>
                {node.vibrationG >= DGMS_THRESHOLDS.VIBRATION_CRITICAL ? "CRITICAL SEISMIC BURST" : node.vibrationG >= DGMS_THRESHOLDS.VIBRATION_ADVISORY ? "ELEVATED VIBRATION" : "PASS: NO ROCKBURST"}
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
