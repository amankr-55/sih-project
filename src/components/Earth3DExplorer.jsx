import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, 
  Layers, 
  Ruler, 
  Activity, 
  TrendingDown, 
  AlertTriangle, 
  Droplets, 
  Compass, 
  Maximize2, 
  Eye, 
  Info,
  ShieldAlert,
  HardHat,
  ArrowDown,
  Sliders,
  Cpu,
  Usb,
  Zap,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { getAssetUrl } from '../utils/assetHelper';
import ImageLightboxModal from './ImageLightboxModal';

export default function Earth3DExplorer({
  nodes = [],
  selectedNodeId = 'NODE-01',
  onSelectNodeId,
  hardwareMode = 'simulation',
  serialConnected = false,
  maxTilt = 0,
  maxCrack = 0,
  maxVibration = 0,
  effect3DTheme = 'sensor-sync'
}) {
  const [faceAdvance, setFaceAdvance] = useState(185); // meters into panel
  const [voidHeight, setVoidHeight] = useState(3.2); // meters seam thickness
  const [depthOfCover, setDepthOfCover] = useState(180); // meters overburden depth
  const [viewMode, setViewMode] = useState('strata'); // 'strata', 'subsidence-curve', 'aquifer'
  const [lightboxData, setLightboxData] = useState(null);

  // 3D Motion, Manual Effects & Sensor Sync
  const [motionMode, setMotionMode] = useState('sensor'); // 'sensor' | 'manual' | 'orbit'
  const [manualPitch, setManualPitch] = useState(0); // -45 to +45 deg
  const [manualRoll, setManualRoll] = useState(0); // -45 to +45 deg
  const [verticalExaggeration, setVerticalExaggeration] = useState(1.4); // 1.0 to 2.5
  const [strataStyle, setStrataStyle] = useState('solid'); // 'solid' | 'wireframe' | 'thermal'
  const [showManualControls, setShowManualControls] = useState(false);

  const [activeNodeId, setActiveNodeId] = useState(selectedNodeId || 'NODE-01');

  useEffect(() => {
    if (selectedNodeId) setActiveNodeId(selectedNodeId);
  }, [selectedNodeId]);

  // Sync with global 3D Effect Theme
  useEffect(() => {
    if (effect3DTheme === 'wireframe') {
      setStrataStyle('wireframe');
      setVerticalExaggeration(1.6);
      setMotionMode('sensor');
    } else if (effect3DTheme === 'thermal') {
      setStrataStyle('thermal');
      setVerticalExaggeration(1.4);
      setMotionMode('sensor');
    } else if (effect3DTheme === 'exaggerated') {
      setStrataStyle('solid');
      setVerticalExaggeration(2.2);
      setMotionMode('sensor');
    } else if (effect3DTheme === 'cad') {
      setStrataStyle('wireframe');
      setVerticalExaggeration(1.0);
      setManualPitch(0);
      setManualRoll(0);
      setMotionMode('manual');
    } else {
      // sensor-sync (default)
      setStrataStyle('solid');
      setVerticalExaggeration(1.4);
      setMotionMode('sensor');
    }
  }, [effect3DTheme]);

  const activeNode = nodes.find(n => n.id === activeNodeId) || nodes[0] || {
    id: 'NODE-01',
    name: 'Extraction Face 3-A',
    zone: 'Longwall Panel 4',
    tiltX: 0,
    tiltY: 0,
    vibrationG: 0.01,
    crackDisplacement: 0,
    temperature: 28.5
  };
  
  const canvasRef = useRef(null);

  // Subsidence Calculations (NCB & DGMS Empirical Formulas)
  const subsidenceFactor = 0.72; // a = 0.72 for caving longwall in Indian coalfields
  const dynamicTiltMag = Math.sqrt((activeNode.tiltX || 0) ** 2 + (activeNode.tiltY || 0) ** 2);
  const sMax = ((subsidenceFactor * voidHeight * (faceAdvance / 250)) + (dynamicTiltMag * 0.08)).toFixed(2); // meters max sag
  const sMaxMm = (sMax * 1000).toFixed(0);
  const angleOfDraw = 28.5; // degrees
  const influenceWidth = Math.round(faceAdvance + 2 * (depthOfCover * Math.tan((angleOfDraw * Math.PI) / 180)));
  const tensileStrain = ((sMax / depthOfCover) * 1000).toFixed(1); // mm/m

  // Interactive 3D Canvas Rendering of Geological Earth Cross-Section
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let rotation = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      // Coordinate centers
      const cx = w * 0.5;
      const cy = h * 0.44;

      // Pitch and Roll calculation
      let currentPitch = 0;
      let currentRoll = 0;

      if (motionMode === 'sensor') {
        currentPitch = activeNode.tiltX || 0;
        currentRoll = activeNode.tiltY || (currentPitch * 0.5);
      } else if (motionMode === 'manual') {
        currentPitch = manualPitch;
        currentRoll = manualRoll;
      } else if (motionMode === 'orbit') {
        currentPitch = Math.sin(rotation * 0.4) * 12;
        currentRoll = Math.cos(rotation * 0.3) * 10;
        rotation += 0.01;
      }

      const pitchRad = (currentPitch * Math.PI) / 180;
      const rollRad = (currentRoll * Math.PI) / 180;

      const vibG = activeNode.vibrationG || 0.01;
      const vibJitterX = vibG > 0.05 ? (Math.random() - 0.5) * Math.min(10, vibG * 14) : 0;
      const vibJitterY = vibG > 0.05 ? (Math.random() - 0.5) * Math.min(10, vibG * 14) : 0;

      // 3D Isometric Projection with pitch, roll, zoom, and vertical exaggeration:
      const isoX = (x, y, z) => {
        const rotX = x * Math.cos(rollRad) - y * Math.sin(rollRad);
        const rotY = x * Math.sin(rollRad) + y * Math.cos(rollRad);
        return cx + (rotX - rotY) * Math.cos(0.48 + pitchRad * 0.25) + vibJitterX;
      };

      const isoY = (x, y, z) => {
        const rotX = x * Math.cos(rollRad) - y * Math.sin(rollRad);
        const rotY = x * Math.sin(rollRad) + y * Math.cos(rollRad);
        return cy + (rotX + rotY) * Math.sin(0.28 + pitchRad * 0.3) - (z * verticalExaggeration) + vibJitterY;
      };

      // Draw Strata Blocks from bottom to top
      const seamZ = 50;
      const seamHeight = 28;
      const voidX = Math.min(200, (faceAdvance / 350) * 220);

      // Subterranean Strata Layers
      const strataLayers = [
        { name: 'Lower Floor Sandstone', depth: '185m - 240m', color: strataStyle === 'thermal' ? '#1e1b4b' : '#1a2234', stroke: '#334155', h: 30, z: 20 },
        { name: 'Coal Seam #3 (Bituminous)', depth: '170m - 185m', color: strataStyle === 'thermal' ? '#030712' : '#090d16', stroke: '#06b6d4', h: seamHeight, z: seamZ, isCoal: true },
        { name: 'Immediate Sandstone Roof', depth: '120m - 170m', color: strataStyle === 'thermal' ? '#312e81' : '#243048', stroke: '#475569', h: 35, z: 80 },
        { name: 'Fractured Aquifer (Water Table)', depth: '70m - 120m', color: strataStyle === 'thermal' ? '#1e3a8a' : '#16314f', stroke: '#38bdf8', h: 30, z: 115, isWater: true },
        { name: 'Upper Sandstone & Shale', depth: '20m - 70m', color: strataStyle === 'thermal' ? '#1d4ed8' : '#283955', stroke: '#64748b', h: 35, z: 145 },
        { name: 'Alluvium & Topsoil (Surface)', depth: '0m - 20m', color: strataStyle === 'thermal' ? '#0284c7' : '#334960', stroke: '#22c55e', h: 22, z: 170, isSurface: true }
      ];

      strataLayers.forEach((layer) => {
        const baseZ = layer.z;
        const topZ = layer.z + layer.h;

        ctx.fillStyle = strataStyle === 'wireframe' ? 'rgba(15, 23, 42, 0.25)' : layer.color;
        ctx.strokeStyle = strataStyle === 'wireframe' ? '#06b6d4' : layer.stroke;
        ctx.lineWidth = strataStyle === 'wireframe' ? 1.8 : 1.5;

        // Draw isometric sliced box
        const x1 = -180, x2 = 180;
        const y1 = -90, y2 = 90;

        // Front Face
        ctx.beginPath();
        ctx.moveTo(isoX(x1, y2, baseZ), isoY(x1, y2, baseZ));
        ctx.lineTo(isoX(x2, y2, baseZ), isoY(x2, y2, baseZ));
        ctx.lineTo(isoX(x2, y2, topZ), isoY(x2, y2, topZ));
        ctx.lineTo(isoX(x1, y2, topZ), isoY(x1, y2, topZ));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Right Side Face
        ctx.beginPath();
        ctx.moveTo(isoX(x2, y2, baseZ), isoY(x2, y2, baseZ));
        ctx.lineTo(isoX(x2, y1, baseZ), isoY(x2, y1, baseZ));
        ctx.lineTo(isoX(x2, y1, topZ), isoY(x2, y1, topZ));
        ctx.lineTo(isoX(x2, y2, topZ), isoY(x2, y2, topZ));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Top Face (with dynamic subsidence sag on surface layer!)
        if (layer.isSurface) {
          ctx.beginPath();
          const dynamicCrack = activeNode.crackDisplacement || 0;
          const sagAmount = (parseFloat(sMax) * 14) + (dynamicTiltMag * 3.5) + (dynamicCrack * 2.8);
          
          for (let sx = x1; sx <= x2; sx += 15) {
            const distFromVoid = Math.abs(sx - (voidX - 100));
            const sag = Math.max(0, sagAmount * Math.exp(-(distFromVoid * distFromVoid) / 3800));
            const py = isoY(sx, y2, topZ - sag);
            const px = isoX(sx, y2, topZ - sag);
            if (sx === x1) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          for (let sx = x2; sx >= x1; sx -= 15) {
            const distFromVoid = Math.abs(sx - (voidX - 100));
            const sag = Math.max(0, sagAmount * Math.exp(-(distFromVoid * distFromVoid) / 3800));
            const py = isoY(sx, y1, topZ - sag);
            const px = isoX(sx, y1, topZ - sag);
            ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fillStyle = strataStyle === 'wireframe' ? 'rgba(34, 197, 94, 0.15)' : '#2f4356';
          ctx.fill();
          ctx.stroke();

          // Draw Surface Road and Surface Crack Lines
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          const crackX = isoX(voidX - 90, 0, topZ - sagAmount * 0.8);
          const crackY = isoY(voidX - 90, 0, topZ - sagAmount * 0.8);
          ctx.moveTo(crackX - 40, crackY - 15);
          ctx.lineTo(crackX, crackY);
          ctx.lineTo(crackX + 35, crackY + 12);
          ctx.stroke();

          // Surface Road Marking
          ctx.strokeStyle = '#f8fafc';
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 6]);
          ctx.beginPath();
          ctx.moveTo(isoX(x1, 0, topZ), isoY(x1, 0, topZ));
          ctx.lineTo(isoX(x2, 0, topZ), isoY(x2, 0, topZ));
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Highlight extraction void in coal seam
        if (layer.isCoal) {
          ctx.fillStyle = '#06b6d4';
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 12;
          const vX2 = isoX(voidX - 80, 40, baseZ + 4);
          const vY2 = isoY(voidX - 80, 40, baseZ + 4);
          ctx.beginPath();
          ctx.arc(vX2, vY2, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Groundwater Flow Indicator in Aquifer
        if (layer.isWater) {
          ctx.fillStyle = 'rgba(56, 189, 248, 0.5)';
          ctx.font = 'bold 11px monospace';
          ctx.fillText('💧 WATER TABLE (-42m) • SEEPAGE TO SUMP', isoX(x1 + 20, y2, baseZ + 12), isoY(x1 + 20, y2, baseZ + 12));
        }
      });

      // Overlay text HUD on 3D Viewport
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`STATION: ${activeNode.id} • ${activeNode.name}`, 20, 28);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`SENSOR PITCH (X): ${currentPitch.toFixed(2)}°  |  ROLL (Y): ${currentRoll.toFixed(2)}°`, 20, 48);
      ctx.fillStyle = vibG > 0.2 ? '#ef4444' : '#10b981';
      ctx.fillText(`SEISMIC SHOCK: ${vibG.toFixed(3)}g  |  MOTION: ${motionMode.toUpperCase()}`, 20, 68);
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(`MAX SURFACE SAG: ${sMax}m (${sMaxMm} mm)  |  STRAIN: ${tensileStrain} mm/m`, 20, 88);
      if (serialConnected) {
        ctx.fillStyle = '#10b981';
        ctx.fillText(`● HARDWARE MPU-6050 STREAM ACTIVE (COM6)`, 20, 108);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [faceAdvance, voidHeight, depthOfCover, sMax, tensileStrain, motionMode, manualPitch, manualRoll, verticalExaggeration, strataStyle, activeNode.tiltX, activeNode.tiltY, activeNode.vibrationG, activeNode.crackDisplacement, serialConnected]);

  return (
    <div className="space-y-6 animate-fade-in text-white">
      
      {/* Top Banner Header */}
      <div className="bg-[#18253f] border-2 border-cyan-500/50 rounded-3xl p-6 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <Globe className="w-10 h-10 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide flex flex-wrap items-center gap-3">
              <span>3D SUBTERRANEAN EARTH & SUBSIDENCE DEPTH EXPLORER</span>
              <span className="text-xs bg-emerald-500 text-slate-950 font-black px-3 py-1 rounded-full uppercase">
                DGMS CMR-111 COMPLIANT
              </span>
              {serialConnected && (
                <span className="text-xs bg-cyan-950 text-cyan-300 border border-cyan-400 px-3 py-1 rounded-full font-mono font-bold flex items-center gap-1">
                  <Usb className="w-3.5 h-3.5" /> SENSOR LINKED
                </span>
              )}
            </h2>
            <p className="text-base text-slate-200 font-medium mt-1">
              Geological strata cross-section, real-time ground depression trough, active mining face advance & aquifer tracking
            </p>
          </div>
        </div>

        {/* 3D Motion Mode & Manual Effects Toggle Buttons */}
        <div className="flex flex-wrap items-center gap-2 bg-[#0d1627] p-2 rounded-2xl border border-slate-700 shadow-xl">
          <button
            onClick={() => setMotionMode('sensor')}
            className={`px-3 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              motionMode === 'sensor' ? 'bg-cyan-500 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-300'
            }`}
            title="3D orientation moves directly with physical MPU-6050 sensor"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>3D Motion: SENSOR SYNC</span>
          </button>

          <button
            onClick={() => setShowManualControls(!showManualControls)}
            className={`px-3 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              showManualControls ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-300'
            }`}
            title="Manually adjust 3D effects, pitch, roll, zoom, and strata styles"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>3D Effect Controls</span>
          </button>

          <button
            onClick={() => setMotionMode(motionMode === 'orbit' ? 'sensor' : 'orbit')}
            className={`px-3 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
              motionMode === 'orbit' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800 text-slate-300'
            }`}
          >
            {motionMode === 'orbit' ? 'Orbit: ON' : 'Auto-Orbit'}
          </button>
        </div>
      </div>

      {/* Manual 3D Effects Toolbar (Drawer) */}
      {showManualControls && (
        <div className="bg-[#111c30] border-2 border-amber-500/50 rounded-3xl p-5 shadow-2xl animate-fade-in space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <span className="text-sm font-black text-amber-300 flex items-center gap-2 font-mono">
              <Sliders className="w-4 h-4 text-amber-400" />
              MANUAL 3D EFFECTS & STRATA PERSPECTIVE CONTROLLER
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Manual Override Enabled • Change angle, vertical scale & render style
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            {/* Manual Pitch */}
            <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-700 space-y-1.5">
              <div className="flex justify-between text-slate-300 font-bold">
                <span>3D Pitch Angle (X):</span>
                <span className="text-cyan-400 font-black">{motionMode === 'manual' ? `${manualPitch}°` : `${(activeNode.tiltX || 0).toFixed(1)}° (Sync)`}</span>
              </div>
              <input
                type="range"
                min="-45"
                max="45"
                value={manualPitch}
                onChange={(e) => {
                  setManualPitch(parseInt(e.target.value));
                  setMotionMode('manual');
                }}
                className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Manual Roll */}
            <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-700 space-y-1.5">
              <div className="flex justify-between text-slate-300 font-bold">
                <span>3D Roll Angle (Y):</span>
                <span className="text-amber-400 font-black">{motionMode === 'manual' ? `${manualRoll}°` : `${(activeNode.tiltY || 0).toFixed(1)}° (Sync)`}</span>
              </div>
              <input
                type="range"
                min="-45"
                max="45"
                value={manualRoll}
                onChange={(e) => {
                  setManualRoll(parseInt(e.target.value));
                  setMotionMode('manual');
                }}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Vertical Strata Exaggeration */}
            <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-700 space-y-1.5">
              <div className="flex justify-between text-slate-300 font-bold">
                <span>Strata Depth Exaggeration:</span>
                <span className="text-emerald-400 font-black">{verticalExaggeration.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="2.5"
                step="0.1"
                value={verticalExaggeration}
                onChange={(e) => setVerticalExaggeration(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Render Style */}
            <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-700 space-y-1.5">
              <span className="text-slate-300 font-bold block">Strata Shader Style:</span>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => setStrataStyle('solid')}
                  className={`py-1 rounded text-[10px] font-black cursor-pointer ${strataStyle === 'solid' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
                >
                  Solid
                </button>
                <button
                  onClick={() => setStrataStyle('wireframe')}
                  className={`py-1 rounded text-[10px] font-black cursor-pointer ${strataStyle === 'wireframe' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
                >
                  Wire
                </button>
                <button
                  onClick={() => setStrataStyle('thermal')}
                  className={`py-1 rounded text-[10px] font-black cursor-pointer ${strataStyle === 'thermal' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
                >
                  Thermal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6 Subterranean Sensor Switcher Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-[#10192a] p-3 rounded-2xl border border-slate-800">
        <span className="text-xs font-black text-cyan-300 font-mono flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          INSPECT 3D STRATA SEAM NODE:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto">
          {nodes.map(n => (
            <button
              key={n.id}
              onClick={() => {
                setActiveNodeId(n.id);
                if (onSelectNodeId) onSelectNodeId(n.id);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black font-mono transition-all cursor-pointer ${
                n.id === activeNode.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-md scale-105 border border-white'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              {n.id}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left 3D Viewport (7 cols) + Right Geotechnical Depth Panel (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 3D Isometric Strata Viewport */}
        <div className="lg:col-span-7 bg-[#142036] border border-slate-700 rounded-3xl p-5 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-black text-cyan-300 flex items-center gap-2 font-mono">
                <Layers className="w-5 h-5 text-cyan-400" />
                REAL-TIME 3D STRATA CROSS-SECTION & SURFACE SAG TROUGH
              </span>
              <span className="text-xs font-bold text-slate-300 bg-slate-900/90 px-3 py-1 rounded-xl border border-slate-700">
                Scale: 1:100 Metric
              </span>
            </div>

            {/* Interactive 3D Canvas */}
            <div className="relative h-[420px] rounded-2xl overflow-hidden border border-slate-700 bg-[#091120] shadow-inner">
              <canvas
                ref={canvasRef}
                width={700}
                height={420}
                className="w-full h-full block select-none"
              />
              
              <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur border border-white/20 px-3.5 py-1.5 rounded-xl text-xs font-mono text-emerald-400 font-bold">
                Dynamic 3D Strata Mesh Active
              </div>
            </div>
          </div>

          {/* Simulation Controls for Mining Advance & Void Height */}
          <div className="mt-5 bg-[#0b1424] p-4 rounded-2xl border border-slate-800 space-y-4">
            <span className="text-xs font-black text-cyan-300 uppercase tracking-wider block font-mono">
              ⚡ Live Mining Advance Simulation Sliders:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs text-white font-bold mb-1">
                  <span>Longwall Face Advance:</span>
                  <span className="text-cyan-400 font-mono font-black text-sm">{faceAdvance} meters</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="350"
                  step="5"
                  value={faceAdvance}
                  onChange={(e) => setFaceAdvance(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <span className="text-[11px] text-slate-300 block mt-1">Panel length: 450m • Advance rate: 4.5m/day</span>
              </div>

              <div>
                <div className="flex justify-between text-xs text-white font-bold mb-1">
                  <span>Coal Seam Void Height:</span>
                  <span className="text-amber-400 font-mono font-black text-sm">{voidHeight} meters</span>
                </div>
                <input
                  type="range"
                  min="1.8"
                  max="4.5"
                  step="0.1"
                  value={voidHeight}
                  onChange={(e) => setVoidHeight(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <span className="text-[11px] text-slate-300 block mt-1">Seam #3 thickness: 3.2m Bituminous</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Geotechnical Subsidence & Crack Data (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          {/* 4 Big High-Contrast Metric Cards */}
          <div className="grid grid-cols-2 gap-3">
            
            <div className="bg-[#182642] border border-slate-700 p-4 rounded-2xl shadow-xl">
              <span className="text-xs font-black text-slate-300 uppercase block mb-1">Max Ground Sag (Smax)</span>
              <div className="text-3xl font-black font-mono text-red-400">
                {sMax} <span className="text-sm font-bold text-slate-300">meters</span>
              </div>
              <span className="text-xs text-amber-300 font-bold block mt-1 font-mono">({sMaxMm} mm total sag)</span>
            </div>

            <div className="bg-[#182642] border border-slate-700 p-4 rounded-2xl shadow-xl">
              <span className="text-xs font-black text-slate-300 uppercase block mb-1">Tensile Surface Strain</span>
              <div className="text-3xl font-black font-mono text-amber-400">
                {tensileStrain} <span className="text-sm font-bold text-slate-300">mm/m</span>
              </div>
              <span className="text-xs text-red-400 font-bold block mt-1 font-mono">Crack Threshold: &gt;3.0 mm/m</span>
            </div>

            <div className="bg-[#182642] border border-slate-700 p-4 rounded-2xl shadow-xl">
              <span className="text-xs font-black text-slate-300 uppercase block mb-1">Angle of Draw</span>
              <div className="text-3xl font-black font-mono text-cyan-400">
                {angleOfDraw}°
              </div>
              <span className="text-xs text-slate-200 font-medium block mt-1">Limit of Surface Impact</span>
            </div>

            <div className="bg-[#182642] border border-slate-700 p-4 rounded-2xl shadow-xl">
              <span className="text-xs font-black text-slate-300 uppercase block mb-1">Influence Basin Width</span>
              <div className="text-3xl font-black font-mono text-emerald-400">
                {influenceWidth} <span className="text-sm font-bold text-slate-300">m</span>
              </div>
              <span className="text-xs text-slate-200 font-medium block mt-1">Surface Trough Area</span>
            </div>

          </div>

          {/* Subterranean Geological Strata Depth Breakdown Card */}
          <div className="bg-[#182642] border border-slate-700 p-5 rounded-3xl shadow-xl flex-1 space-y-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center justify-between">
              <span>Strata Cross-Section & Depth Schedule</span>
              <span className="text-xs font-mono text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-500/40">
                Total Depth: 240m
              </span>
            </h3>

            <div className="space-y-2 text-xs font-mono">
              <div className="bg-[#0e172a] p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="text-emerald-400 text-sm block">0m - 20m: Surface Topsoil & Alluvium</strong>
                  <span className="text-slate-300 font-sans">Village road, railway embankment, residential structures</span>
                </div>
                <span className="text-xs font-bold text-red-400 font-mono">HIGH CRACK RISK</span>
              </div>

              <div className="bg-[#0e172a] p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="text-blue-300 text-sm block">20m - 120m: Upper Sandstone & Aquifer</strong>
                  <span className="text-slate-300 font-sans">Groundwater table at -42m • Seepage rate: 120 L/min</span>
                </div>
                <span className="text-xs font-bold text-cyan-400 font-mono">PIEZOMETER OK</span>
              </div>

              <div className="bg-[#0e172a] p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="text-amber-300 text-sm block">120m - 170m: Massive Main Roof Sandstone</strong>
                  <span className="text-slate-300 font-sans">Caving cantilever overhang • Periodic weighting: 18.5m</span>
                </div>
                <span className="text-xs font-bold text-amber-400 font-mono">HIGH STRESS</span>
              </div>

              <div className="bg-[#0e172a] p-3 rounded-xl border border-cyan-500/50 flex items-center justify-between">
                <div>
                  <strong className="text-cyan-300 text-sm block">170m - 185m: Active Working Coal Seam #3</strong>
                  <span className="text-slate-200 font-sans">Extraction void height: {voidHeight}m • Face advance: {faceAdvance}m</span>
                </div>
                <span className="text-xs font-black text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500">ACTIVE WORKINGS</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Lightbox Modal for 100% Unobstructed Full Screen View */}
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

      {/* Realistic Real-World Photographic Evidence & Surveillance Section */}
      <div className="bg-[#132240] border-2 border-slate-600/80 rounded-3xl p-6 shadow-2xl space-y-5">
        <div>
          <h3 className="text-xl font-black text-white tracking-wide uppercase flex items-center gap-2.5">
            <HardHat className="w-6 h-6 text-amber-400" />
            <span>REAL-WORLD STRATA SUBSIDENCE EVIDENCE & PHYSICAL DAMAGE SURVEILLANCE</span>
          </h3>
          <p className="text-base text-slate-100 font-bold mt-1">
            Actual physical field photographs showing why real-time early warning subsidence monitoring is mandatory for Indian underground coalfields.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          
          {/* Card 1: Surface Road Fissure */}
          <div 
            onClick={() => setLightboxData({
              image: getAssetUrl('images/road_subsidence.jpg'),
              title: 'Surface Highway & Road Shear Fissures',
              desc: 'Surface highway collapsing due to underground roof caving. Tensile strains exceed 3.0 mm/m, causing asphalt buckling and structural severance.',
              location: 'Overburden Surface Sector-B (Chainage 14+200)',
              badge: 'SURFACE DAMAGE'
            })}
            className="bg-[#0f192b] border-2 border-slate-700 rounded-2xl overflow-hidden shadow-xl group hover:border-red-500 transition-all cursor-pointer flex flex-col"
          >
            <div className="relative h-64 overflow-hidden bg-black">
              <img
                src={getAssetUrl('images/road_subsidence.jpg')}
                alt="Surface Road Collapse from Subsidence"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 brightness-105 contrast-105"
              />
              <div className="absolute top-3 left-3 bg-red-600 text-white font-mono font-black text-xs px-3 py-1 rounded-xl shadow-lg">
                SURFACE SUBSIDENCE TROUGH
              </div>
              <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-black/85 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-xl border border-red-400 flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-red-400" /> Click to Enlarge
                </span>
              </div>
            </div>
            <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-black text-white">Surface Highway & Road Shear Fissures</h4>
                <p className="text-sm text-slate-100 leading-relaxed font-normal mt-1.5">
                  Surface highway collapsing due to underground roof caving. Tensile strains exceed 3.0 mm/m, causing complete asphalt buckling and structural severance.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-700 text-xs font-mono font-bold text-red-400">
                CRITICAL THRESHOLD: BREACHED (&gt;3.0 mm/m)
              </div>
            </div>
          </div>

          {/* Card 2: Underground Extensometer Monitoring */}
          <div 
            onClick={() => setLightboxData({
              image: getAssetUrl('images/real_mine_crack.jpg'),
              title: 'Underground Strata Crack Dilatometer',
              desc: 'Linear LVDT / Potentiometric extensometer bolted into fractured rock roof. Directly measures micro-fissure dilation in real-time before catastrophic roof falls.',
              location: 'Seam 3-A Longwall Face Rib',
              badge: 'FRACTURE GAUGING'
            })}
            className="bg-[#0f192b] border-2 border-slate-700 rounded-2xl overflow-hidden shadow-xl group hover:border-cyan-400 transition-all cursor-pointer flex flex-col"
          >
            <div className="relative h-64 overflow-hidden bg-black">
              <img
                src={getAssetUrl('images/real_mine_crack.jpg')}
                alt="Underground Crack Extensometer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 brightness-105 contrast-105"
              />
              <div className="absolute top-3 left-3 bg-cyan-600 text-slate-950 font-mono font-black text-xs px-3 py-1 rounded-xl shadow-lg">
                SUBTERRANEAN EXTENSOMETER
              </div>
              <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-black/85 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-xl border border-cyan-400 flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-cyan-400" /> Click to Enlarge
                </span>
              </div>
            </div>
            <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-black text-white">Underground Strata Crack Dilatometer</h4>
                <p className="text-sm text-slate-100 leading-relaxed font-normal mt-1.5">
                  Linear LVDT / Potentiometric extensometer bolted into fractured rock roof. Directly measures micro-fissure dilation in real-time before catastrophic roof falls.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-700 text-xs font-mono font-bold text-cyan-300">
                MICRON RESOLUTION: ±0.01 mm
              </div>
            </div>
          </div>

          {/* Card 3: Water Inrush & Drainage Sump */}
          <div 
            onClick={() => setLightboxData({
              image: getAssetUrl('images/mine_water_sump.jpg'),
              title: 'Aquifer Water Seepage & Reservoir',
              desc: 'Subterranean water retention sump with staff gauge and submersible dewatering pumps. Monitors pore pressure to prevent quicksand strata liquefaction.',
              location: 'Shaft 2 Bottom Dewatering Sump #04',
              badge: 'AQUIFER SURVEILLANCE'
            })}
            className="bg-[#0f192b] border-2 border-slate-700 rounded-2xl overflow-hidden shadow-xl group hover:border-blue-400 transition-all cursor-pointer flex flex-col"
          >
            <div className="relative h-64 overflow-hidden bg-black">
              <img
                src={getAssetUrl('images/mine_water_sump.jpg')}
                alt="Underground Mine Water Sump"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 brightness-105 contrast-105"
              />
              <div className="absolute top-3 left-3 bg-blue-600 text-white font-mono font-black text-xs px-3 py-1 rounded-xl shadow-lg">
                AQUIFER & DEWATERING SUMP
              </div>
              <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-black/85 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-xl border border-blue-400 flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-blue-400" /> Click to Enlarge
                </span>
              </div>
            </div>
            <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-black text-white">Aquifer Water Seepage & Reservoir</h4>
                <p className="text-sm text-slate-100 leading-relaxed font-normal mt-1.5">
                  Subterranean water retention sump with staff gauge and submersible dewatering pumps. Monitors pore pressure to prevent quicksand strata liquefaction.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-700 text-xs font-mono font-bold text-blue-300">
                AQUIFER PORE INGRESS: STABLE
              </div>
            </div>
          </div>

        </div>
      </div>

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

    </div>
  );
}
